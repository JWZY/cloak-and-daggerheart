## User story

**As a party finishing an encounter, I'd like to take a short rest and pick two downtime moves (Tend to Wounds, Clear Stress, Repair Armor, Prepare), so the rest mechanic actually heals my character.**

## Problem

`GearMenu` in [`hand/HandView.tsx`](../../src/hand/HandView.tsx) lists "Short Rest" and "Long Rest" as menu items, but their handlers are stubbed:

```ts
{ label: 'Short Rest', action: () => {} },
{ label: 'Long Rest', action: () => {} },
```

## Source

- SRD v1.0 — Downtime / Rests: https://daggerheartsrd.com/rules/

## Suggestion

**Short rest** sheet:
- Free loadout/vault swap (links into [proposal: loadout-vault-recall](./loadout-vault-recall.md)).
- Pick **2 downtime moves** (can be the same one twice):
  - Tend to Wounds: clear 1d4 + Tier HP for self/ally.
  - Clear Stress: clear 1d4 + Tier Stress.
  - Repair Armor: clear 1d4 + Tier Armor Slots.
  - Prepare: gain 1 Hope (2 if shared with party).
- Track "3 short rests in a row → next must be long."

**Long rest** sheet:
- Free loadout/vault swap.
- Pick **2 downtime moves**, but each is "all":
  - Tend to All Wounds: clear all HP.
  - Clear All Stress: clear all Stress.
  - Repair All Armor: clear all Armor Slots.
  - Prepare: 1 Hope (2 if shared).
  - Work on a Project: long-term countdown (basic UI: name + progress notes).

Side-effect: GM gains 1d4 Fear on short rest, 1d4 + #PCs on long rest. Show this as a copy-able note ("Tell your GM: +1d4 Fear") — actual GM-state is out of scope.

Tier helper:

```ts
function tier(level: number): 1|2|3|4 {
  if (level === 1) return 1
  if (level <= 4) return 2
  if (level <= 7) return 3
  return 4
}
```

## Acceptance

- [ ] Short Rest sheet picks 2 moves, applies them.
- [ ] Long Rest sheet picks 2 moves, applies them.
- [ ] Tier-aware dice math is correct.
- [ ] Three-short-rests warning surfaces.
- [ ] Loadout/vault swap honors free during rest, recall-cost otherwise.
