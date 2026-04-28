## User story

**As a player whose last HP slot just got marked, I'd like the sheet to surface the three Death moves so I can pick one immediately, so the table doesn't pause while I look up the rules.**

## Problem

When `hp.current === hp.max` (last HP marked, since HP is tracked as marked count), the sheet should offer:

- **Blaze of Glory** — final action auto-crits with GM approval, then dies.
- **Avoid Death** — drops unconscious; on regaining consciousness, roll Hope Die: if ≤ character level, gain a Scar (cross out a Hope slot permanently). If all Hope slots are crossed out, character's journey ends.
- **Risk It All** — roll Duality Dice. Hope > Fear: stay up, clear HP/Stress equal to the Hope die (split as you like). Fear > Hope: die. Tied: stay up, clear nothing.

Currently nothing happens.

## Source

- SRD v1.0 — Death (all three moves verbatim in the SRD): https://daggerheartsrd.com/rules/

## Suggestion

When HP fills (after applying damage), surface a modal with three large cards. Each integrates with existing systems:

- **Blaze of Glory** → flag character as `pendingDeath: 'blaze'`; the next roll is forced to crit; on resolve, mark character deceased.
- **Avoid Death** → `pendingDeath: 'avoid'`; on regaining consciousness (player taps "Wake up" after the GM allows), roll a Hope die against character level. ≤ level → invoke `addScar` from [proposal: hope-cap-and-scars](./hope-cap-and-scars.md). If `maxHope` hits 0, end-of-journey.
- **Risk It All** → roll Duality Dice (use the dice roller from [proposal: dice-roller-ui](./dice-roller-ui.md)). Resolve per SRD.

Add `Character.deathState: 'alive' | 'unconscious' | 'deceased' | 'journeyEnded'` and migrate.

## Acceptance

- [ ] Filling the last HP slot opens the Death modal exactly once per "death event."
- [ ] Each move resolves correctly per SRD (verified in unit tests on `core/character/death.ts`).
- [ ] Avoid Death integrates with `addScar`.
- [ ] Risk It All integrates with the Duality Dice roller.
- [ ] `deathState` blocks normal stat-bar interactions when not `'alive'`.
