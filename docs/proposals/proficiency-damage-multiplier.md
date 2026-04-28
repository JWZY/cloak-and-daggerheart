## User story

**As a leveled-up character, I'd like my weapon attacks to roll the right number of damage dice, so I'm not under-rolling 2d8 because the app forgot to multiply.**

## Problem

SRD: damage rolls multiply **dice count** by Proficiency, not the flat modifier. A Tier 2 character with Proficiency 2 wielding a d8 weapon rolls **2d8 + flat**, not **1d8 + 2 × flat**.

`character.proficiency` is stored. I haven't traced the full path through `hand/WeaponPanel.tsx` to confirm whether the displayed damage formula and (eventually) the dice roller produce `prof × die + flat`. This proposal is "verify and lock in with a test."

## Source

- SRD v1.0 — Proficiency, Weapons: https://daggerheartsrd.com/rules/

## Suggestion

1. Trace damage computation from `Weapon.damage` (string like `"d8+3"` per [`types/character.ts`](../../src/types/character.ts)) through `WeaponPanel` and the future dice-roller path.
2. Add a pure helper:

```ts
// core/character/damage.ts
export interface DamageRoll {
  diceCount: number
  diceSize: number
  flat: number
}
export function computeDamageRoll(weaponDamage: string, proficiency: number): DamageRoll {
  // parses "d8+3" or "2d8" or "d6"; multiplies dice count by proficiency
}
```

3. Unit test for L1 (prof 1 → 1d8+3), L2 (prof 2 → 2d8+3), L5 (prof 3 → 3d8+3).
4. Make `WeaponPanel` render the post-multiplication formula for clarity, e.g. `"2d8+3 (Prof 2)"`.

## Acceptance

- [ ] `computeDamageRoll` exists and is unit-tested.
- [ ] `WeaponPanel` renders the multiplied formula.
- [ ] When the dice roller lands ([proposal: dice-roller-ui](./dice-roller-ui.md)), it consumes `computeDamageRoll`.
