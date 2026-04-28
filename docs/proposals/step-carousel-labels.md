## User story

**As a new player midway through character creation, I'd like to see the names of each step in the carousel (Class, Subclass, Cards, Heritage, Community, Equipment, Traits, Experiences, Name), so I can skim where I am without tapping each dot.**

## Problem

Per the structure in [`deck-builder/DeckBuilder.tsx`](../../src/deck-builder/DeckBuilder.tsx) and the `StepCarousel` component, the wizard currently shows position only. Players coming from D&D Beyond or Demiplane expect named steps. The button label logic ("3 / 6", "Begin Adventure") is good, but the carousel itself is opaque.

## Source

- Alphastream's Demiplane walkthrough showing named left-rail steps: https://www.youtube.com/watch?v=iqV4lIF4Ir0

## Suggestion

Two layouts depending on viewport:

**Mobile (compact):**
- Named pills, scrollable horizontally, current pill expanded with full label, others abbreviated to icon + dot.
- E.g.: `[icon]` `[icon]` `[CLASS · 3/6]` `[icon]` `[icon]`.

**Desktop:**
- Vertical left-rail with full step names, completed ones gold-checked, current one highlighted.

Keep the existing tap-to-navigate behavior. Existing `maxReachableStep` logic stays.

## Acceptance

- [ ] Each step pill shows its name when current.
- [ ] Step names: Class, Subclass, Cards, Heritage, Community, Equipment, Traits, Experiences, Name.
- [ ] Desktop layout uses vertical rail.
- [ ] Tapping any reachable step still jumps there.
- [ ] No regression in the existing step-direction animation.
