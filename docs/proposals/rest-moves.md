## User story

**As a party finishing an encounter, I'd like to take a short rest and pick two downtime moves (Tend to Wounds, Clear Stress, Repair Armor, Prepare), so the rest mechanic actually heals my character.**

## Problem

`GearMenu` lists Short Rest and Long Rest with stub handlers. SRD has rich downtime mechanics that span several other PRs.

This is the most coupled PR in the batch. Predecessors must land first.

## SRD-verified rules

All cited from `daggerheart-srd-main/contents/Downtime.md`.

**Three-shorts hard rule** (verbatim):
> If a party takes three short rests in a row, their next rest must be a long rest.

Unambiguous. Hard disable, not confirm-override.

**Long-rest interruption** (verbatim):
> If a long rest is interrupted, the characters only gain the benefits of a short rest.

Deferred from this PR (one-line note in acceptance).

## Decision A: dependency graph

State the predecessor PRs explicitly. **Updated from round-2 draft based on Claude's verification of `updateArmor`.**

| Predecessor | Why |
|---|---|
| **PR #2** (stress overflow + typed conditions) | Clear Stress uses `updateStress`. Typed conditions help with Vulnerable removal. |
| **PR #3** (Hope cap) | Prepare's "gain 1 Hope (2 if shared)" must respect cap. |
| ~~PR #4~~ | **Removed.** `updateArmor(id, delta)` already exists in `src/store/character-store.ts`, used in `StatBar.tsx` and `ArmorEvasionBlock.tsx`, tested in `character-store.test.ts`. Repair Armor calls it directly on `main` today. |
| **PR #9** (dice roller with generic mode) | "1d4 + Tier" rolls for Tend/Clear/Repair. |
| **PR #10** (loadout/vault) | "Free swap during rest" calls `swapDuringRest`. |
| **PR #13** (death moves) | Long rest must auto-wake `pendingAvoid` characters. |

## Decision B: rest-tracking state

```ts
interface Character {
  // ...
  shortRestsSinceLongRest: number  // 0..3
}
```

Increment on short rest. Reset on long rest. At 3, **disable Short Rest** (greyed button + tooltip "Take a long rest first.").

Migration: existing characters get `shortRestsSinceLongRest: 0`.

## Decision C: surface — Vaul vs full-screen

| Surface | Short Rest | Long Rest |
|---|---|---|
| **C1. Vaul both** | Quick; cramped for project tracking. |
| **C2. Vaul short, full-screen long** | Reflects SRD gravitas difference. |
| **C3. Full-screen both** | Overkill for short. |

**Recommendation: C2.**

## Decision D: move-pick UI

| Option | UI |
|---|---|
| **D1. Two-step picker** | Tap move 1, tap move 2. Stateful. |
| **D2. Stepper per move (0/1/2)** | All four moves visible; +/- to allocate. Cap at 2 total. Disable + when sum hits 2. |
| **D3. Drag-and-drop tokens** | Cute. Touch-fiddly. |

**Recommendation: D2.**

## Decision E: GM-state coupling

"GM gains 1d4 Fear on short rest, 1d4 + #PCs on long rest."

| Option | Approach |
|---|---|
| **E1. Player counts party size** | Friction. |
| **E2. "Tell GM: +1d4 Fear + 1 per PC"** | Static copy; GM computes. |
| **E3. `<GMNote>` shared component** | Reused across PR #9 + this PR. |

**Recommendation: E3.**

## Decision F: "Work on a Project" scope

| Option | Scope |
|---|---|
| **F1. Out of scope; defer** | Project tracking is its own proposal. |
| **F2. Minimal in this PR** | `projects: { name; notes; ticks }[]` field. |
| **F3. Full lifecycle** | Too much. |

**Recommendation: F1.** "Work on a Project" appears as a long-rest move, but its effect is a free-text "describe progress" prompt that appends to Notes. No persistent project entity.

## Decision G: long-rest auto-wake (per PR #13)

PR #13's `pendingAvoid` state can be cleared by long rest (SRD-verified third wake path).

**Recommendation:** long-rest action checks the active character's `deathState`. If `'pendingAvoid'`, transitions to `'alive'` and removes the Unconscious condition (source: 'death'). State this in acceptance.

## Decision H: long-rest interruption

`Downtime.md`: "If a long rest is interrupted, the characters only gain the benefits of a short rest."

**Recommendation:** out of scope for v1. Interruption is GM-controlled with no dedicated UI affordance. One-line note in acceptance: "interruption handling deferred — players manually pick a short rest's benefits if their long rest is interrupted."

## Decision I: Hope cap on Prepare

"Gain 1 Hope (2 if shared)" via PR #3's `addHope`. Caps at `maxHope`. At maxHope, Prepare is a no-op visually (no overflow concept for Hope).

## Decision J: tier helper

```ts
// core/character/tier.ts
export type Tier = 1 | 2 | 3 | 4
export function getTier(level: number): Tier {
  if (level === 1) return 1
  if (level <= 4) return 2
  if (level <= 7) return 3
  return 4
}
```

Shared with PR #4 (`tierThresholdBonus`) and PR #8 (`applyTierAchievements`).

## Decision K: condition interaction during rest

Restrained or Vulnerable: doesn't block rest. Unconscious / `pendingAvoid`: PR #13's banner already disables affordances; rest sheet not openable via the disabled GearMenu.

## Acceptance

- [ ] Short Rest opens as Vaul bottom sheet; Long Rest opens as full-screen modal.
- [ ] Move-pick uses stepper-per-move (D2); cap at 2 total picks; disable + when sum=2.
- [ ] Tend to Wounds (short) clears 1d4 + Tier HP via `updateHP` (and PR #9 generic roller).
- [ ] Clear Stress (short) clears 1d4 + Tier Stress.
- [ ] **Repair Armor (short) clears 1d4 + Tier Armor Slots via `updateArmor`** (already exists on `main`).
- [ ] Prepare (short) gains 1 Hope (2 with checkbox) via PR #3's `addHope`; respects cap.
- [ ] Long Rest "Tend to All Wounds" / "Clear All Stress" / "Repair All Armor" zero out current values.
- [ ] Long Rest "Prepare" (1 or 2 Hope, capped).
- [ ] Long Rest "Work on a Project" appends a free-text entry to Notes; no separate entity.
- [ ] **Long-rest auto-wake**: when a character with `deathState === 'pendingAvoid'` long-rests, state → `'alive'`; Unconscious condition removed.
- [ ] `shortRestsSinceLongRest` increments on short rest, resets on long rest.
- [ ] **Three-shorts hard rule**: at `shortRestsSinceLongRest === 3`, Short Rest button is greyed with tooltip "Take a long rest first." Hard disable, not confirm-override (verified SRD).
- [ ] Free loadout/vault swap during rest via PR #10's `swapDuringRest`.
- [ ] `<GMNote>` component renders "Tell your GM: +1d4 Fear" (short) or "+1d4 + 1 per PC Fear" (long), with copy button. Shared with PR #9.
- [ ] `getTier(level)` lives in `core/character/tier.ts`; consumed by this PR, PR #4, PR #8.
- [ ] Migration: existing characters get `shortRestsSinceLongRest: 0`.
- [ ] **Long-rest interruption**: deferred. One-line note in spec; players manually pick short-rest benefits if interrupted.

## Out of scope

- Project tracking as a persistent entity.
- GM rest moves / GM-shared rest sheet.
- Custom homebrew rest moves.
- Long-rest interruption UI.
