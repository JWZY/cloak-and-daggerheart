## User story

**As a new player finishing character creation, I'd like my starting inventory to actually contain the items the SRD says I get, so I can play session zero without re-reading the rulebook.**

## Problem

`assembleCharacter` in [`deck-builder/DeckBuilder.tsx`](../../src/deck-builder/DeckBuilder.tsx) hardcodes:

```ts
const equipment = {
  primaryWeapon: selectedPrimary,
  secondaryWeapon: selectedSecondary,
  armor: selectedArmor,
  items: [],
  consumables: [],
}
```

The SRD requires:

> A torch, 50 feet of rope, basic supplies, a handful of gold (mark 1 box in Gold > Handfuls), either a Minor Health Potion (clear 1d4 HP) or a Minor Stamina Potion (clear 1d4 Stress), one class-specific item from your class guide, and the spell-carrying item if applicable.

None of this is granted, and the user has no UI to choose between the two potions.

## Source

- SRD v1.0 — Step 5 Starting Equipment: https://daggerheartsrd.com/rules/character-creation/
- The SRD JSON (`daggerheart-srd-main/.build/json/items.json` and `consumables.json`) already has the data.

## Suggestion

1. Add a sub-step (or extend `PickEquipment`) for **Choose your starting potion**: radio between Minor Health Potion and Minor Stamina Potion.
2. Add per-class `startingItem` lookup keyed off `classes.json` (the SRD lists it per class).
3. In `assembleCharacter`:

```ts
const baseInventory = [
  { name: 'Torch', description: 'Sheds light. Burns out after a session.' },
  { name: 'Rope (50 ft)', description: 'Standard hemp rope.' },
  { name: 'Basic supplies', description: 'Travel food, waterskin, bedroll, etc.' },
]
const consumables = [store.selectedStartingPotion === 'health'
  ? MINOR_HEALTH_POTION
  : MINOR_STAMINA_POTION]
const classItem = getClassStartingItem(store.selectedClass)
const equipment = {
  primaryWeapon: selectedPrimary,
  secondaryWeapon: selectedSecondary,
  armor: selectedArmor,
  items: [...baseInventory, classItem].filter(Boolean),
  consumables,
}
```

4. Set `gold` to 1 handful (depends on [proposal: gold-handfuls-bags-chests](./gold-handfuls-bags-chests.md) — coordinate ordering).

## Acceptance

- [ ] New character has torch, 50 ft rope, basic supplies, and class-specific starting item in inventory.
- [ ] User explicitly chose between Minor Health and Minor Stamina potion during creation.
- [ ] Starting gold = 1 handful (post the gold model PR).
- [ ] Unit test on `assembleCharacter` covers all 9 classes.
