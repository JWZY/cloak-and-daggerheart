## User story

**As a player hitting Tier 3, I'd like to multiclass into a second class via the level-up wizard, so I can take a domain and a foundation card from another class.**

## Problem

`AdvancementType` in [`types/character.ts`](../../src/types/character.ts) is missing `'multiclass'`. SRD spec:

- Available at **level 5+** only.
- **Costs both advancement slots** (like `+1 Proficiency`).
- Choose another class; take **one of its domains** and **its class feature**.
- Take a **foundation card** from one of its subclasses.
- Crosses out this tier's **Upgraded Subclass** option and all other Multiclass options on the sheet.
- After multiclassing, "extra domain card" advancements may pull from the multiclass domain at **half your level rounded up**.
- If foundation cards specify different Spellcast traits, you choose which to apply per Spellcast roll.

## Source

- SRD v1.0 — Leveling Up, Multiclassing: https://daggerheartsrd.com/rules/

## Suggestion

```ts
export type AdvancementType =
  | 'increase_traits'
  | 'add_hp'
  | 'add_stress'
  | 'boost_experiences'
  | 'add_domain_card'
  | 'increase_evasion'
  | 'upgrade_subclass'
  | 'increase_proficiency'
  | 'multiclass'           // new

export interface MulticlassAdvancement {
  level: number
  type: 'multiclass'
  multiclassName: string                   // e.g. "Bard"
  multiclassDomain: 'domain_1' | 'domain_2'  // which of the two
  multiclassFoundationFrom: string         // subclass name
}
```

Wizard UI: when L5+, show "Multiclass" as a two-slot option; locks out "Upgraded Subclass" for the same tier; gates a follow-up screen for class/domain/subclass picks.

Domain card picker: when buying `add_domain_card` post-multiclass, allow either home-domain (level cap = current level) or multiclass-domain (level cap = ceil(level / 2)).

Spellcast trait: store both potential traits; resolve per-roll from the dice roller UI.

## Acceptance

- [ ] `'multiclass'` is a valid `AdvancementType`.
- [ ] Wizard offers it only at L5+.
- [ ] Selecting it consumes both slots and disables `upgrade_subclass` for that tier.
- [ ] Subsequent `add_domain_card` picks gate by half-level for multiclass domain.
- [ ] Unit tests cover L5 multiclass and L6 multiclass-domain card pick.
