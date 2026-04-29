## User story

**As a party finishing an encounter, I'd like to take a short rest and pick two downtime moves (Tend to Wounds, Clear Stress, Repair Armor, Prepare), so the rest mechanic actually heals my character.**

## Problem

`GearMenu` lists Short Rest and Long Rest with stub handlers. SRD has rich downtime mechanics that span at least 5 other PRs.

This is the most coupled PR in the batch. Predecessors must land first.

## Decision A: dependency graph

State the predecessor PRs explicitly.

| Predecessor | Why |
|---|---|
| **PR #2** (stress overflow + typed conditions) | Clear Stress uses `updateStress`. Typed conditions help with Vulnerable removal. |
| **PR #3** (Hope cap) | Prepare's "gain 1 Hope (2 if shared)" must respect cap. |
| **PR #4** (damage threshold + armor model) | Repair Armor uses `updateArmor`. (Note: PR #4 covers damage flow, not directly armor; check the scope; armor slots already exist. Confirm before merge.) |
| **PR #9** (dice roller with generic mode) | "1d4 + Tier" rolls for Tend/Clear/Repair. |
| **PR #10** (loadout/vault) | "Free swap during rest" calls `swapDuringRest`. |

This PR lands **last** in this group.

## Decision B: rest-tracking state

"Three short rests in a row → next must be long" needs persistent state.

```ts
interface Character {
  // ...
  shortRestsSinceLongRest: number  // 0..3
}
```

Increment on short rest. Reset on long rest. At 3, disable Short Rest in the rest sheet (or surface a warning).

Migration: existing characters get `shortRestsSinceLongRest: 0`.

## Decision C: surface — Vaul vs full-screen

### Options considered

| Surface | Short Rest | Long Rest |
|---|---|---|
| **C1. Vaul bottom sheet for both** | Two-pick flow. | Same. | Consistent. May feel cramped for long rest with project tracking. |
| **C2. Vaul for short, full-screen for long** | Quick. | Roomy. | Reflects rest gravitas. Two surface idioms. |
| **C3. Full-screen for both** | Heavy. | Heavy. | Overkill for short rest. |

**Recommendation: C2.** Short rest is a lightweight in-session interaction. Long rest is a between-session ceremony. Different surfaces fit.

## Decision D: move-pick UI

"Pick 2 downtime moves; can be the same one twice."

### Options considered

| Option | UI |
|---|---|
| **D1. Two-step picker** | Tap move 1, tap move 2. Stateful flow. |
| **D2. Stepper per move (0/1/2)** | All four moves visible; +/- to allocate. Cap at 2 total. | One screen. Disable +others when sum hits 2. **Right.** |
| **D3. Drag-and-drop tokens** | Two tokens to place on moves. | Cute. Touch-fiddly. |

**Recommendation: D2.**

## Decision E: GM-state coupling

"GM gains 1d4 Fear on short rest, 1d4 + #PCs on long rest."

### Options considered

| Option | Approach |
|---|---|
| **E1. Player counts party size** | Friction. **Reject.** |
| **E2. "Tell GM: +1d4 Fear + 1 per PC"** | Static copy; GM computes. | Honest. Solo-friendly. |
| **E3. Centralized `<GMNote>` component** | Reused across PR #9 (roll fear notification) and this PR. Standard "Tell GM: X" copy-able pattern. | Coordinates with PR #9. |

**Recommendation: E3.** Single component. Reused.

## Decision F: "Work on a Project" scope

"Long-term countdown" is a whole feature.

### Options considered

| Option | Scope |
|---|---|
| **F1. Out of scope for this PR; defer** | Project tracking is its own proposal. |
| **F2. Minimal in this PR** | `projects: { name; notes; ticks }[]` field on Character; long rest can increment. Renders in NotesPanel. |
| **F3. Full project lifecycle** | Start, abandon, complete states; rendering UI. | Too much. |

**Recommendation: F1.** "Work on a Project" appears as a long-rest move option, but its effect is a free-text "describe progress" prompt that appends to Notes. No persistent project entity. File a separate proposal for project tracking.

## Decision G: Hope cap on Prepare

"Gain 1 Hope (2 if shared with party)" via PR #3's `addHope`. Caps at `maxHope`. Test: at maxHope, Prepare is a no-op visually but the player still gets credit (no overflow concept for Hope).

## Decision H: tier helper

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

Used here ("1d4 + Tier") and by PR #8 (`applyTierAchievements`). Shared module.

## Decision I: condition interaction during rest

Restrained or Vulnerable: doesn't block rest. Unconscious / pendingAvoid (PR #13): blocks (PR #13's banner already disables affordances).

State no special checks needed in this PR; PR #13's lock handles it.

## Acceptance

- [ ] Short Rest opens as Vaul bottom sheet; Long Rest opens as full-screen modal.
- [ ] Move-pick uses stepper-per-move (D2); cap at 2 total picks; disable + when sum=2.
- [ ] Tend to Wounds (short) clears 1d4 + Tier HP via `updateHP` (and PR #9 generic roller).
- [ ] Clear Stress (short) clears 1d4 + Tier Stress.
- [ ] Repair Armor (short) clears 1d4 + Tier Armor Slots via `updateArmor`.
- [ ] Prepare (short) gains 1 Hope (2 with checkbox) via PR #3's `addHope`; respects cap.
- [ ] Long Rest "Tend to All Wounds" / "Clear All Stress" / "Repair All Armor" zero out current values.
- [ ] Long Rest "Prepare" (1 or 2 Hope, capped).
- [ ] Long Rest "Work on a Project" appends a free-text entry to Notes; no separate entity.
- [ ] `shortRestsSinceLongRest` increments on short rest, resets on long rest.
- [ ] At `shortRestsSinceLongRest === 3`, Short Rest is disabled with a warning.
- [ ] Free loadout/vault swap during rest via PR #10's `swapDuringRest`.
- [ ] `<GMNote>` component renders "Tell your GM: +1d4 Fear" (short) or "+1d4 + 1 per PC Fear" (long), with copy button.
- [ ] `getTier(level)` lives in `core/character/tier.ts`; consumed by this PR and PR #8.
- [ ] Migration: existing characters get `shortRestsSinceLongRest: 0`.

## Dependency graph

- Lands after PRs #2, #3, #4, #9, #10. State that.

## Out of scope

- Project tracking as a persistent entity (separate proposal).
- GM rest moves / GM-shared rest sheet.
- Custom rest moves (homebrew).
- Rest-blocked-by-condition rules (deferred unless SRD specifies).
