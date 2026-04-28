## User story

**As a new player assigning my starting traits, I'd like one obvious way to do it that matches the SRD (here are the values, drop them into slots), so I'm not guessing what the +/− stepper does or memorizing what comes next on a cycle tap.**

## Problem

[`deck-builder/steps/AssignTraits.tsx`](../../src/deck-builder/steps/AssignTraits.tsx) ships three variants behind a dev toggle: Pills, Stepper, Cycle. Pills models the SRD correctly — assign these specific values to these slots. Stepper implies traits are freely valued, which they are not at creation. Cycle is the worst affordance: tapping a row mutates it in a non-obvious order.

## Source

- SRD v1.0 — Step 3 Assign Traits, fixed array +2/+1/+1/0/0/-1: https://daggerheartsrd.com/rules/character-creation/

## Suggestion

1. Delete the `variant` state, the dev toggle, and the Stepper + Cycle code paths.
2. Keep only the Pills variant.
3. Polish: when all six values are placed, the pill row collapses; tapping a slot returns its value to the pill row.
4. Bonus: at level-up time, a separate "Increase a Trait" affordance can be a stepper, because at that point the SRD does allow free +1 increments. But that's a different surface; keep creation pills-only.

## Acceptance

- [ ] `variant` state removed.
- [ ] Stepper and Cycle code removed.
- [ ] Pills works for both unassigned-pool and reassign flows.
- [ ] Dev variant toggle removed.
- [ ] No regression in the existing Pills tests.
