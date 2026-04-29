## User story

**As a player taking ongoing pressure during a session, I'd like Stress to behave like the SRD says, so I don't accidentally mis-track damage and feel safer than the rules intend.**

## Problem

Two related rules are unmodeled. SRD references verified directly against `daggerheart-srd-main/contents/Stress.md`:

> When a character must mark 1 or more Stress but can't, they mark 1 HP instead.

> When a character marks their last Stress, they become Vulnerable until they clear at least 1 Stress.

Today, `useCharacterStore.updateStress` clamps at `max` and silently drops the overflow. `Vulnerable` is a standard condition. `conditions: string[]` is free-form and nothing auto-applies.

## Why this PR is bigger than it looks

Two failure modes the simplest version would ship:

**A. Indistinguishable manual vs auto-applied conditions.** GM applies `Vulnerable` for a "you're tied up" narrative beat. Player drops Stress below max in the same turn. A naive `removeCondition('Vulnerable') if stress < max` silently strips the manual condition.

**B. Stress overflow can drop a character to 0 HP.** Death moves (PR #13) are unimplemented. So this PR introduces a new state transition (HP=0 from stress overflow) with no UI to resolve it.

Both have to be answered in this spec.

## Decision A: condition source typing

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Keep `string[]`, set-membership only** | Original draft. Auto-add when `stress >= max`, auto-remove when `stress < max`. | Ships the manual-vs-auto bug. |
| **A2. Source-typed conditions** | `conditions: AppliedCondition[]` with `{name, source, appliedAt}`. Auto-apply / auto-remove only mutates entries where `source` is owned by the caller. | More upfront work (~1h). Migration is mechanical. Generalizes to future triggers (Restrained from a Bind, Hidden from a feature). Eliminates the manual-vs-auto bug by construction. |
| **A3. Two parallel arrays** | `conditions: string[]` + `autoConditions: ConditionName[]` | Avoids the typing change, but doubles the surface every reader has to know. |

**Recommendation: A2.** Cost is low, fixes the bug by construction.

```ts
type ConditionSource = 'manual' | 'stress' | 'spell' | 'item' | 'feature' | 'death'
interface AppliedCondition {
  name: ConditionName       // typed enum (deferred to follow-up; keep `string` for now)
  source: ConditionSource
  appliedAt?: number         // ms timestamp; undefined = unknown (migration sentinel)
}
// Character
conditions: AppliedCondition[]
```

Migration: existing `string[]` → `[{name, source: 'manual', appliedAt: undefined}, ...]`. Use `appliedAt: undefined` (not `0`) so UI doesn't render "Applied 1970."

## Decision B: where the auto-apply logic lives

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **B1. Inline inside `updateStress`** | Original draft. | Couples a state mutation to rule derivation. Every future auto-trigger grows the same store action. |
| **B2. Pure derivation + merge with explicit ownership** | A pure `deriveStressConditions(c) → AppliedCondition[]`. Store action mutates stress + HP, then `mergeConditions(existing, fresh, ownedSources)` merges. | Each condition trigger is one pure function. Store actions stay small. Ownership is explicit, not derived from `fresh.length`. |

**Recommendation: B2.** Note: Claude correctly caught a bug in the round-2 draft of `mergeConditions` where deriving "owned sources" from `fresh.map(c => c.source)` produced an empty set when `fresh = []`, leaving stale auto-applied conditions in place. The fix is to pass `ownedSources` as an explicit third parameter:

```ts
// core/character/conditions.ts

export function deriveStressConditions(c: Character): AppliedCondition[] {
  return c.stress.current >= c.stress.max
    ? [{ name: 'Vulnerable', source: 'stress', appliedAt: Date.now() }]
    : []
}

/**
 * Merges fresh auto-applied conditions into existing ones.
 *
 * `ownedSources` declares which sources this call owns: any existing entries
 * with those sources are dropped, then `fresh` is added. Manual entries
 * (and entries from other sources) are preserved.
 */
export function mergeConditions(
  existing: AppliedCondition[],
  fresh: AppliedCondition[],
  ownedSources: ConditionSource[],
): AppliedCondition[] {
  const owned = new Set(ownedSources)
  const kept = existing.filter((c) => !owned.has(c.source))
  const out = [...kept]
  for (const f of fresh) {
    if (!out.some((c) => c.name === f.name && c.source === f.source)) out.push(f)
  }
  return out
}

// Caller:
const merged = mergeConditions(c.conditions, deriveStressConditions(c), ['stress'])
```

This pattern generalizes: every future auto-trigger declares its owned source(s) at the call site, regardless of whether the trigger is currently producing entries.

## Decision C: HP=0 from stress overflow

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **C1. Allow HP→0 silently** | `clampHP` lets HP hit 0; player knows the rule. | Hidden state transition. |
| **C2. Mark a `pendingDeathMove` flag** | When stress overflow drops HP to 0, set `pendingDeathMove: true`. PR #13 reads it. Cleared when HP drops below max again. | Forward-compatible. Zero UI cost in this PR. |
| **C3. Refuse to write past 0** | Surface inline "Death move required" before committing. | Fights the rules: damage *did* happen. |

**Recommendation: C2.** Forward-compatible with PR #13.

```ts
interface Character {
  // ...existing
  pendingDeathMove?: boolean
}
```

**Lifecycle**: `pendingDeathMove` is set when HP hits max via stress overflow. It is cleared when HP drops below max via any path (heal, rest, edit). State this in acceptance so PR #13 doesn't have to guess.

## Should this be split?

Considered. Recommendation: keep as one PR. Splitting forces `updateStress` to be touched twice and complicates ordering.

If review surface grows, split here:
- **2a:** condition source typing + migration + `mergeConditions` infra. No behavior change.
- **2b:** `updateStress` rewrite (HP overflow + auto-Vulnerable derivation + `pendingDeathMove` flag).

## Suggested implementation

```ts
// store/character-store.ts
updateStress: (id, delta) => set((state) => ({
  characters: state.characters.map((c) => {
    if (c.id !== id) return c
    const nextRaw = c.stress.current + delta
    let nextStress = Math.max(0, Math.min(nextRaw, c.stress.max))
    let nextHP = c.hp.current
    let pendingDeathMove = c.pendingDeathMove ?? false
    if (delta > 0 && nextRaw > c.stress.max) {
      const overflow = nextRaw - c.stress.max
      nextHP = clampHP(c.hp.current + overflow, c.hp.max)
      if (nextHP >= c.hp.max) pendingDeathMove = true
    }
    const updated: Character = {
      ...c,
      stress: { ...c.stress, current: nextStress },
      hp: { ...c.hp, current: nextHP },
      pendingDeathMove,
    }
    return {
      ...updated,
      conditions: mergeConditions(updated.conditions, deriveStressConditions(updated), ['stress']),
    }
  }),
})),

updateHP: (id, delta) => set((state) => ({
  characters: state.characters.map((c) => {
    if (c.id !== id) return c
    const nextHP = clampHP(c.hp.current + delta, c.hp.max)
    // If HP dropped below max, clear pendingDeathMove
    const pendingDeathMove = nextHP < c.hp.max ? false : (c.pendingDeathMove ?? false)
    return { ...c, hp: { ...c.hp, current: nextHP }, pendingDeathMove }
  }),
})),
```

## Acceptance

Explicit test cases. Each is a single `it()` in `character-store.test.ts`:

- [ ] **stress full → over, no manual condition**: `current=6/max=6, delta=+1` → `stress=6/6, hp -= 1, Vulnerable applied with source='stress'`.
- [ ] **stress over→under, auto Vulnerable removed**: `current=6/max=6, Vulnerable(source='stress'), delta=-1` → `stress=5/6, no Vulnerable`.
- [ ] **manual Vulnerable preserved**: `current=6/max=6, Vulnerable(source='manual'), delta=-1` → `stress=5/6, Vulnerable(source='manual') still present`. **This test fails the round-2 draft's `mergeConditions` and passes the corrected version.**
- [ ] **fresh=[] doesn't strip stress conditions when stress is still full**: `current=6/max=6, Vulnerable(source='stress'), call mergeConditions(existing, [], ['stress'])` → empty (since stress is full, derive returns Vulnerable, but if a caller passed empty fresh by mistake the test verifies the API contract).
- [ ] **exact-fill**: `current=5/max=6, delta=+1` → `stress=6/6, hp unchanged, Vulnerable(source='stress') applied`.
- [ ] **multi-stress overflow**: `current=4/max=6, hp=5/6, delta=+5` → `stress=6/6, hp=0/6, pendingDeathMove=true, Vulnerable(source='stress') applied`.
- [ ] **pendingDeathMove cleared on heal**: HP at max with `pendingDeathMove=true`; `updateHP(c, -1)` → `pendingDeathMove=false`.
- [ ] **migration**: legacy `conditions: ['Hidden']` → `[{name:'Hidden', source:'manual', appliedAt: undefined}]`.

## Out of scope

- `ConditionName` as a typed union (deferred to a cleanup PR).
- Distinguishing `source: 'stress'` from future `source: 'spell'` in the UI (future visual differentiation).
- Death-move resolution UI (PR #13 consumes `pendingDeathMove`).
