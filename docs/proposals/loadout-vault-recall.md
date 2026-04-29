## User story

**As a leveling spellcaster, I'd like to keep most of my domain cards in a Vault and bring up to 5 into my Loadout, so the SRD's loadout cap and Recall Cost actually constrain my choices.**

## Problem

[`types/character.ts`](../../src/types/character.ts) has `domainCards: DomainCard[]` — a flat array. SRD requires:

- Loadout cap: 5 active cards.
- Vault: rest of earned cards.
- Subclass / ancestry / community cards do **not** count toward loadout (they live in other fields already).
- Recall Cost: marking Stress to swap a vault card into loadout outside of rest.
- At rest: free swap.

## Decision A: invariant — vault is bounded

Vault isn't unlimited. Total cards ≤ `earnedCardCount(character)` = `2 + (level - 1) + advancements_with_add_domain_card`.

```ts
loadout.length + vault.length === earnedCardCount(c)
```

Encode this as a runtime invariant in dev builds. Violations indicate state corruption.

## Decision B: `recallCost` data shape

`DomainCard.recall: string` today; test data uses `"2d6"`, `"10"`. SRD's actual Recall Cost is always an integer.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **B1. Replace `recall: string` with `recallCost: number`** | Lossy for the dice-string test data. Real SRD is integer. | Clean. Verify SRD source: integer-only? |
| **B2. Add `recallCost: number` alongside** | Keep `recall` as display string; add typed field. | Two-source-of-truth risk. |
| **B3. Audit the SRD JSON, then decide** | Read `abilities.json` to confirm shape. | Right first step. |

**Recommendation: B3 → B1.** Audit `daggerheart-srd-main/.build/json/abilities.json` (or wherever cards live) to confirm Recall Costs are integers. If yes, B1. If no, surface to the user before merging.

This PR's acceptance includes the audit confirmation as a required step.

## Decision C: `atRest` parameter shape

Original: `moveToLoadout(id, cardName, opts: { atRest: boolean })`. The "is the character resting" state doesn't exist; `atRest` is a caller-honesty parameter.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **C1. Boolean parameter** | Original. | Action correctness = caller honesty. |
| **C2. Two distinct actions** | `moveToLoadout(id, cardName)` always charges Recall Cost. `swapDuringRest(id, fromVault, toLoadout)` is rest-only and free. | Each action is intent-pinned. Rest sheet calls one; everywhere else calls the other. |
| **C3. `restingMode` state** | `Character.restingMode: 'short' | 'long' | null`. Set on rest sheet open, cleared on close. Action behavior derives. | Models the transient mode. Heavier. |

**Recommendation: C2.** No new state. Two actions encode intent. Rest sheet (PR #15) calls `swapDuringRest`. Anywhere else calls `moveToLoadout` and pays the cost.

## Decision D: card identity

Cards key by name today. `DomainCard` has no `id` field.

### Options considered

| Option | Approach |
|---|---|
| **D1. Key by name** | Original. Breaks if a character ever has duplicate-named cards. SRD doesn't allow this; type doesn't enforce. |
| **D2. Add stable `id` to cards** | Generate at acquisition. | Future-proofs; cheap. |

**Recommendation: D2.** `{ id: string; name: string; ... }`. `moveToLoadout(id, cardId)`.

## Decision E: migration UX

Existing characters at L8+ have 9+ cards in `domainCards`. Migrating to loadout-cap-5 silently drops 4 cards into Vault.

### Options considered

| Option | Approach |
|---|---|
| **E1. Silent migration** | All cards → loadout (trim to 5), excess → vault. No notice. | Bad first impression. |
| **E2. First-run banner** | "We moved X cards to your Vault — review them?" Tap → opens Vault. | Honest. ~30 lines. |
| **E3. Migration toast** | One-time toast with same copy. Dismissible. | Lighter than banner. |

**Recommendation: E2.** Banner persists until acknowledged. Tap opens Vault for review.

## Decision F: Vault UI surface

### Options considered

| Option | Approach |
|---|---|
| **F1. Vault tab** | Third tab on the bottom bar (Cards / Actions / Vault). | Bottom bar already tight; Vault only matters during rest/level-up. |
| **F2. Vault sheet from a button** | Button in CharacterHeader or in the rest sheet opens Vault. | Discoverability lower. Surface is right-sized. |
| **F3. Vault inside Cards tab** | Tab toggles between Loadout and Vault. | Familiar. |

**Recommendation: F3.** Cards tab gets a sub-segmented control: `[Loadout] [Vault]`. Loadout default. Vault accessible without leaving Cards.

## Decision G: Stress overflow coupling with PR #2

Marking Stress for Recall Cost can fill stress. PR #2 introduces stress→HP overflow + auto-Vulnerable.

**State the order:** PR #2 lands first. This PR's `moveToLoadout` calls `updateStress` and inherits the overflow behavior. Test: `moveToLoadout` with Recall Cost 3 on a character at 4/6 stress → stress 6/6, hp -=1, Vulnerable applied.

## Acceptance

- [ ] SRD audit confirmed: Recall Costs are integers; `recall: string` replaced with `recallCost: number`.
- [ ] `Character` type: `loadout: DomainCard[]`, `vault: DomainCard[]` replace `domainCards`.
- [ ] `DomainCard` gains stable `id: string`.
- [ ] Loadout enforces cap of 5 (rejects `moveToLoadout` over).
- [ ] Subclass, ancestry, community cards remain in their existing fields; not moved.
- [ ] `moveToLoadout(id, cardId)` always charges `recallCost` Stress (consumes PR #2's `updateStress` + overflow).
- [ ] `swapDuringRest(id, vaultCardId, loadoutCardId)` exists and is free.
- [ ] Migration: existing `domainCards` → first 5 to loadout, rest to vault. First-run banner.
- [ ] Cards tab gains `[Loadout] [Vault]` sub-segments.
- [ ] Invariant test: `loadout.length + vault.length === earnedCardCount(c)` after every level up.
- [ ] Stress-overflow integration test (depends on PR #2).

## Dependency graph

- PR #2 (stress overflow + conditions) lands first.
- This PR lands before PR #15 (rest moves consume `swapDuringRest`).
- PR #12 (multiclass) extends `earnedCardCount` for half-level-cap multiclass cards.

## Out of scope

- "Pinned" cards in vault (always-recommended for loadout).
- Loadout templates / saved presets.
- Deck-building UI for vault sorting beyond a list.
