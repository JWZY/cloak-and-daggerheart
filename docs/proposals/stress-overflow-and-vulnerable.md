## User story

**As a player taking ongoing pressure during a session, I'd like Stress to behave like the SRD says, so I don't accidentally mis-track damage and feel safer than the rules intend.**

## Problem

Two related rules are unmodeled. SRD references verified directly against `daggerheart-srd-main/contents/Stress.md`:

> When a character must mark 1 or more Stress but can't, they mark 1 HP instead.

> When a character marks their last Stress, they become Vulnerable until they clear at least 1 Stress.

Today, `useCharacterStore.updateStress` clamps at `max` and silently drops the overflow. `Vulnerable` is a standard condition (rolls targeting you have advantage). `conditions: string[]` is free-form and nothing auto-applies.

## Why this PR is bigger than it looks

Two failure modes the simplest version would ship:

**A. Indistinguishable manual vs auto-applied conditions.** GM applies `Vulnerable` for a "you're tied up" narrative beat. Player drops Stress below max in the same turn. A naive `removeCondition('Vulnerable') if stress < max` silently strips the manual condition. This is a state-corruption bug that's hard to reproduce later.

**B. Stress overflow can drop a character to 0 HP.** Death moves (PR #13) are unimplemented. So this PR introduces a new state transition (HP=0 from stress overflow) with no UI to resolve it.

Both have to be answered in this spec, not deferred.

## Decision A: condition source typing

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Keep `string[]`, set-membership only** | Original draft. Auto-add when `stress >= max`, auto-remove when `stress < max`. | Simplest. Ships the manual-vs-auto bug. Will need rewriting the moment a second auto-condition trigger lands. |
| **A2. Source-typed conditions** | `conditions: AppliedCondition[]` with `{name, source, appliedAt}`. Auto-apply / auto-remove only mutates entries where `source === 'stress'`. | More upfront work (~1h). Migration is mechanical. Generalizes to future triggers (Restrained from a Bind, Hidden from a feature, etc.). Eliminates the manual-vs-auto bug by construction. |
| **A3. Two parallel arrays** | `conditions: string[]` (manual) + `autoConditions: ConditionName[]` (derived). | Avoids the typing change, but doubles the surface every condition reader has to know about. Worse than A2 for the same cost. |

**Recommendation: A2.** Cost is low, fixes the bug by construction, generalizes for the rest of the roadmap.

```ts
type ConditionSource = 'manual' | 'stress' | 'spell' | 'item' | 'feature'
interface AppliedCondition {
  name: ConditionName       // typed enum (deferred to a follow-up but introduce the field now)
  source: ConditionSource
  appliedAt: number          // ms timestamp, useful for debugging and potential UI
}
// Character
conditions: AppliedCondition[]
```

Migration: existing `string[]` → `[{name, source: 'manual', appliedAt: 0}, ...]`. `ConditionName` can stay loosely typed as `string` for this PR; tightening to a union is a separate cleanup.

## Decision B: where the auto-apply logic lives

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **B1. Inline inside `updateStress`** | Original draft. Reads/writes conditions in the same store action. | Couples a state mutation to rule derivation. Every future auto-trigger grows the same store action. |
| **B2. Pure derivation + merge** | A pure `deriveStressConditions(c) → AppliedCondition[]`. Store action mutates stress + HP, then `mergeConditions(existing, fresh)` merges keeping manual entries and replacing the source-matched ones. | Each condition trigger is one pure function. Store actions stay small. Tested without React. |

**Recommendation: B2.**

```ts
// core/character/conditions.ts
export function deriveStressConditions(c: Character): AppliedCondition[] {
  return c.stress.current >= c.stress.max
    ? [{ name: 'Vulnerable', source: 'stress', appliedAt: Date.now() }]
    : []
}
export function mergeConditions(existing: AppliedCondition[], fresh: AppliedCondition[]): AppliedCondition[] {
  // Drop any auto-applied entries whose source matches one we're refreshing
  const refreshedSources = new Set(fresh.map((c) => c.source))
  const kept = existing.filter((c) => c.source === 'manual' || !refreshedSources.has(c.source))
  // Add fresh entries that aren't already present
  const out = [...kept]
  for (const f of fresh) {
    if (!out.some((c) => c.name === f.name && c.source === f.source)) out.push(f)
  }
  return out
}
```

## Decision C: HP=0 from stress overflow

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **C1. Allow HP→0 silently** | `clampHP` lets HP hit 0; player knows to roll a death move per the rulebook. | Simplest. But hidden state transition. |
| **C2. Mark a `pendingDeathMove` flag** | When stress overflow drops HP to 0, set `pendingDeathMove: true` on the character. PR #13 reads it. | Forward-compatible with Death moves PR. Zero UI cost in this PR. |
| **C3. Refuse to write past 0** | Surface inline "Death move required" before committing. | Fights the rules: damage *did* happen. Wrong layer for the prompt. |

**Recommendation: C2.** Zero-cost for this PR, hands a clean signal to PR #13.

```ts
interface Character {
  // ...existing
  pendingDeathMove?: boolean
}
```

When the death-moves PR lands, the same flag is read by the resolver. Until then, behavior is identical to "silently allow HP→0" (C1) but the data model is ready.

## Should this be split into 2 PRs?

Considered. The HP-overflow change is mechanically tiny. The conditions-typing change is the structural piece. They can ship independently.

**Recommendation: keep as one PR.** Splitting forces `updateStress` to be touched twice and complicates ordering (the conditions refactor blocks the auto-Vulnerable behavior; the HP overflow doesn't). Reviewing one PR with three clear sections is cheaper than reviewing two PRs that depend on each other.

If review surface becomes a problem, split here:
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
    return { ...updated, conditions: mergeConditions(updated.conditions, deriveStressConditions(updated)) }
  }),
})),
```

## Acceptance

Explicit test cases. Each is a single `it()` in `character-store.test.ts`:

- [ ] **stress full → over, no manual condition**: `current=6/max=6, delta=+1` → `stress=6/6, hp -= 1, Vulnerable applied with source='stress'`.
- [ ] **stress over→under, auto Vulnerable removed**: `current=6/max=6, Vulnerable(source='stress'), delta=-1` → `stress=5/6, no Vulnerable`.
- [ ] **manual Vulnerable preserved**: `current=6/max=6, Vulnerable(source='manual'), delta=-1` → `stress=5/6, Vulnerable(source='manual') still present`. **This test fails the original draft and passes A2.**
- [ ] **exact-fill**: `current=5/max=6, delta=+1` → `stress=6/6, hp unchanged, Vulnerable(source='stress') applied`.
- [ ] **multi-stress overflow**: `current=4/max=6, hp=5/6, delta=+5` → `stress=6/6, hp=0/6, pendingDeathMove=true, Vulnerable(source='stress') applied`.
- [ ] **migration**: legacy `conditions: ['Hidden']` → `[{name:'Hidden', source:'manual', appliedAt:0}]`.

## Out of scope

- `ConditionName` as a typed union (deferred to a cleanup PR; using `string` keeps this PR focused).
- Distinguishing `source: 'stress'` from future `source: 'spell'` in the UI (this PR adds the field; visual differentiation is a UX follow-up).
- Death-move resolution UI (PR #13 consumes `pendingDeathMove`).
