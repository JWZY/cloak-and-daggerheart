## User story

**As a player whose character has just narrowly avoided death, I'd like to mark a Scar that permanently reduces my Hope max, so the cost of survival is visible on my sheet between sessions.**

## Problem

1. `character.hope` is a single number. Nothing enforces the SRD-mandated **maximum of 6**. `StatBar` passes `showMax={false}` to the Hope row, and `updateHope` clamps only at 0. ([`hand/StatBar.tsx`](../../src/hand/StatBar.tsx), [`store/character-store.ts`](../../src/store/character-store.ts))
2. **Scars** (per Avoid Death) permanently cross out a Hope slot, lowering max Hope until it hits 0 and the character's journey ends. There is no `maxHope` or `scars` field in [`types/character.ts`](../../src/types/character.ts).

## Decision A: how to model Hope cap

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Two-field (`scars` + `maxHope`)** | Original draft. Both stored. | Two fields can drift. `maxHope` is fully derivable from `scars` so it's dead state. |
| **A2. Derive `maxHope` from `scars`** | Store `scars: number` only. `maxHope = 6 - scars` everywhere. Helper: `getMaxHope(c)`. | One source of truth. Trivial migration. No drift risk. |
| **A3. Slot array (`hopeSlots: { crossed: boolean[] }`)** | Length-6 array. Maps directly to printable sheet. | Models the printed sheet exactly. Future-proofs against features that target *specific* slots (none today). Slightly heavier serialization. |

**Recommendation: A2.** A3 is appealing for its print-sheet fidelity but adds shape complexity for zero current benefit. A2 is the simplest correct model. If a feature ever needs to target individual slots, migrate to A3 then.

```ts
interface Character {
  // ...
  hope: number     // current; 0 ≤ hope ≤ getMaxHope(c)
  scars: number    // 0..6
}

// core/character/hope.ts
export const HOPE_BASE_MAX = 6
export const getMaxHope = (c: Character) => Math.max(0, HOPE_BASE_MAX - c.scars)
```

Migration: existing character → `scars: 0`. `hope` already exists, clamp to `HOPE_BASE_MAX` defensively.

## Decision B: contract for `maxHope === 0` (end of journey)

### Options considered

| Option | Approach |
|---|---|
| **B1. `console.warn` placeholder** | Original draft. | UX cliff. Player-facing state with no UI. **Reject.** |
| **B2. Emit a flag, PR #13 owns the UI** | Add `Character.deathState?: 'alive' | 'journeyEnded' | 'deceased'` here. `addScar` sets `'journeyEnded'` when scars reach 6. PR #13 reads it. | Substrate is here; UI lands when death-moves does. `deathState` overlaps with PR #13 — coordinate the type. |
| **B3. Refuse `addScar` past 6** | Throw / no-op. | Loses the rule (the journey *did* end). Wrong layer. |

**Recommendation: B2.** Forward-compatible with PR #13. We define `deathState` here as the single owner of death-flow state. PR #13 extends the union (e.g. `'pendingAvoid'`, `'pendingBlaze'`); they don't redefine.

## Decision C: where `addScar` is called from

`addScar` is the substrate; the trigger lives in PR #13's Avoid Death flow.

### Options considered

| Option | Approach |
|---|---|
| **C1. Ship orphan, no UI to call it** | Spec'd as "substrate for PR #13." | Dead code until #13 lands. Not testable end-to-end. |
| **C2. Add a debug "Add scar" button** | Hidden behind `?devtools`. | Helps manual QA. ~5 lines of code. |

**Recommendation: C2.** Cheap. Lets us QA the data path before #13. State explicitly in acceptance: "this is the substrate for PR #13; only the dev-mode trigger ships now."

## Acceptance

Named test cases (`character-store.test.ts` / `hope.test.ts`):

- [ ] `addScar` reduces `getMaxHope(c)` by 1 and increments `scars`.
- [ ] `addScar` clamps `hope` to the new max.
- [ ] `addScar` at `scars=5` sets `deathState='journeyEnded'` and `scars=6`.
- [ ] `addScar` at `scars=6` is a no-op (rule's already triggered; idempotent).
- [ ] `updateHope` clamps at `getMaxHope(c)`, not infinity. (Existing bug.)
- [ ] Migration: legacy character (no `scars`, no `deathState`) gets `scars: 0`, `deathState: 'alive'`.
- [ ] `StatBar` Hope row renders crossed-out pip slots for each scar.
- [ ] Dev-mode "Add scar" button (behind `?devtools`) calls `addScar` and updates the UI.

## Out of scope (explicit)

- Avoid Death trigger UI (PR #13).
- Risk It All / Blaze of Glory state (PR #13).
- Targeting specific Hope slots for narrative cross-out (would require A3 migration; defer).
