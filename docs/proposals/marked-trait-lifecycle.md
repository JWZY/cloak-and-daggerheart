## User story

**As a leveling character, I'd like the "+1 to two unmarked traits" advancement to actually mark those traits and prevent me from re-picking them next level, so I can't accidentally cheese the same trait twice in a tier.**

## Problem

`Character.markedTraits: TraitName[]` exists in [`types/character.ts`](../../src/types/character.ts) but I don't see:

1. UI to mark traits when the +1 advancement is taken in [`level-up/LevelUpWizard.tsx`](../../src/level-up/LevelUpWizard.tsx).
2. The lock that prevents the same trait from being +1'd again while marked.
3. The tier-2/5/8 clear-all-marks behavior (Tier Achievements at L5 and L8 explicitly say *"clear all marked traits"*).

## Source

- SRD v1.0 — Leveling Up, Tier Achievements, Advancements: https://daggerheartsrd.com/rules/

## Suggestion

1. In `applyLevelUp` ([`core/character/level-up.ts`](../../src/core/character/level-up.ts)), when an advancement of type `'increase_traits'` is applied: push the chosen trait names to `markedTraits`, increment those traits.
2. In the level-up wizard, disable trait pills whose names are already in `markedTraits`.
3. At L5 and L8 Tier Achievements, set `markedTraits = []` before applying the new level's advancements.
4. (Bonus) Render marked traits with a visible "marked" indicator on the play sheet — players want to see the lock.

## Acceptance

- [ ] Choosing +1 to two traits at level 2 puts both names in `markedTraits`.
- [ ] Level 3 wizard disables those two trait names.
- [ ] Level 5 wizard clears `markedTraits` before showing trait choices.
- [ ] Unit test in `level-up.test.ts` for the L2 → L3 → L5 sequence.
