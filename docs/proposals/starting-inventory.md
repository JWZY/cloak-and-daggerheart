## User story

**As a new player finishing character creation, I'd like my starting inventory to actually contain the items the SRD says I get, so I can play session zero without re-reading the rulebook.**

## Problem

`assembleCharacter` in [`deck-builder/DeckBuilder.tsx`](../../src/deck-builder/DeckBuilder.tsx) hardcodes `items: [], consumables: []`. SRD requires torch, 50 ft rope, basic supplies, 1 handful of gold, choice of Minor Health or Minor Stamina Potion, and one class-specific item. None is granted, and there's no UI to choose between potions.

## Decision A: PR ordering with PR #6 (gold model)

This PR sets starting gold to "1 handful." `Character.gold` is currently `number`. PR #6 changes it.

### Options considered

| Option | Sequence |
|---|---|
| **A1. This PR first, #6 after** | Set `gold: 1` (interpreted as 1 handful in legacy model). PR #6 migrates. | Ships incorrect semantics. |
| **A2. PR #6 first, this PR after** | Wait for PR #6's `Gold` model (or revised semantic-range integer per #6's design). | Clean. Dependency-ordered. |
| **A3. Bundle** | Single PR. | Larger review surface. |

**Recommendation: A2.** Block this PR's *implementation* on PR #6 landing. The proposal can merge today; the implementation PR for starting inventory must land after PR #6.

## Decision B: how to source class-specific starting items

`daggerheart-srd-main/.build/json/classes.json` exposes `items` per class as a single prose string (e.g. "A book of spells, a wand, and a token..."). Not pre-structured.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **B1. Parse the prose string** | Regex/NLP extraction at runtime. | Fragile. New SRD wording breaks parsing. |
| **B2. Hand-authored per-class lookup** | `STARTING_ITEMS_BY_CLASS` map producing typed `Item` objects with names + descriptions. | Clean data. Drifts from SRD on changes. Comment links to SRD source for auditing. |
| **B3. Render verbatim prose as one item** | `{ name: 'Class Items', description: prose }`. | Loses structure. No discrete-item UI later. |

**Recommendation: B2.** Drift risk is bounded (SRD doesn't change often; we audit on each release). Clean data is worth the maintenance.

## Decision C: potion picker UX

`Minor Health` clears 1d4 HP, `Minor Stamina` clears 1d4 Stress. New players don't know which to pick.

### Options considered

| Option | Approach |
|---|---|
| **C1. Plain radio** | Two labels, no effect text. | Original draft. Hides the meaningful choice. |
| **C2. Radio + inline effect** | Each option shows "Clears 1d4 HP" / "Clears 1d4 Stress" inline. | One extra line per option. Solves it. |
| **C3. Card-style picker** | Two big cards with full descriptions. | Heavy for a binary choice. |

**Recommendation: C2.**

## Decision D: stringly-typed consumable effects

`Consumable.description: string` traps "Clear 1d4 HP" as text. PR #9's roller can't act on it.

### Options considered

| Option | Approach |
|---|---|
| **D1. Document the limitation** | "Effects remain string-only until a future PR." | Cheapest. Honest. |
| **D2. Add typed effect alongside** | `effect?: { kind: 'clearHP' | 'clearStress'; dice: { count: number; size: number } }` | Forward-compatible. ~30 lines. Two source-of-truth fields if not careful. |

**Recommendation: D2.** This PR is already touching the consumable shape; piggyback the typed field. Document in the spec that the description string remains for display, the `effect` object is the canonical source.

## Decision E: re-grant on edit

PR #18's edit flow could re-run `assembleCharacter` and double-grant inventory.

### Options considered

| Option | Approach |
|---|---|
| **E1. Document; defer** | Note in acceptance: "edit flow does not re-grant inventory." | Cheapest. |
| **E2. Mark items as 'starting'** | `item.source: 'starting' | 'looted'` | Edit can refresh starting items without nuking looted ones. |

**Recommendation: E1 for this PR.** PR #18 is descoped to layout-only; edit-flow data semantics are a separate concern.

## Acceptance

- [ ] New character has torch, 50 ft rope, basic supplies, and class-specific starting item via `STARTING_ITEMS_BY_CLASS`.
- [ ] User explicitly chose Minor Health or Minor Stamina potion. Effect text shown inline at the picker.
- [ ] Consumable shape gains a typed `effect` object alongside `description`.
- [ ] Starting gold = 1 handful, using the `Gold` shape from PR #6 (gated on #6 merging first).
- [ ] **Single table-driven test** asserts every class in `classes.json` has an entry in `STARTING_ITEMS_BY_CLASS` (not 9 hand-written tests).
- [ ] Edit flow does not re-grant inventory (no-op; documented limitation).

## Out of scope

- Re-granting on class change post-creation.
- Looted-item lifecycle.
- Roller-driven potion consumption (PR #9 will read the typed `effect`).
