## User story

**As a player at the table, I'd like to tap a trait, weapon, or feature and roll Duality Dice with my modifiers and experience picks, so my phone is the table's dice tray.**

## Problem

The README claims this exists. `core/dice/` has the result-determination logic. `HandView.tsx` Actions tab is `<p>Actions panel coming soon</p>`. There's no rollable interaction anywhere.

This is **the** feature that turns the app from "character creator" into "session companion."

## Source

- Demiplane on X confirming click-to-roll on traits, weapons, features: https://x.com/DemiplaneRPG/status/1768039189579530360
- Reddit r/daggerheart describing the popup UX (advantage / experience toggles, "Roll Dice" button, no log): https://www.reddit.com/r/daggerheart/comments/1d38tj6/demiplanes_duality_dice/
- SRD v1.0 — Duality Dice, Hope/Fear: https://daggerheartsrd.com/rules/

## Suggestion

**Affordances:**
- Tap any trait → opens roller with that trait pre-baked as modifier.
- Tap weapon name → opens damage roller (uses `computeDamageRoll` from [proposal: proficiency-damage-multiplier](./proficiency-damage-multiplier.md)).
- Tap a feature with a `(Roll …)` callout → opens roller with the feature's modifier.

**Roller UI** (Vaul bottom sheet to match the iOS aesthetic):
- Hope die (d12 default; class features can override — e.g., Rogue Nightwalker's d20 Signature Move).
- Fear die (d12 default).
- Modifier numeric stepper.
- Experience checkboxes: each active experience shows its name and bonus; pick at most one (SRD: spending Hope to use one Experience).
- Advantage / Disadvantage toggle (adds +d6 / −d6).
- "Roll" primary button.

**Result UI:**
- Big Hope die / Fear die display, color-coded.
- Total: `hope + fear + mod (+ adv) (+ exp)`.
- Outcome label: "with Hope" / "with Fear" / "Critical Success" (doubles).
- Side effect: gain 1 Hope on a "with Hope" result; GM gains 1 Fear on a "with Fear" result (auto-increment Hope, prompt to notify GM about Fear).

**Roll log:** keep a session-local list (last N rolls). This is something Demiplane lacks and players want.

## Acceptance

- [ ] Tapping any trait, weapon, or feature opens the roller with sensible defaults.
- [ ] Roller supports modifier, experience pick, advantage/disadvantage, and alt-die size.
- [ ] Result correctly identifies Hope/Fear/Critical.
- [ ] On Hope outcome, character gains 1 Hope automatically.
- [ ] Roll log persists to LocalStorage scoped to the active character.
- [ ] Replace the "Actions panel coming soon" stub OR collapse the tab if the only content is rolls (TBD in review).
