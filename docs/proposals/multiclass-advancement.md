## User story

**As a player hitting Tier 3, I'd like to multiclass into a second class via the level-up wizard, so I can take a domain and a foundation card from another class.**

## Problem

`AdvancementType` is missing `'multiclass'`. SRD spec is layered: L5+ only, costs both slots, locks out Upgraded Subclass, locks out future multiclass picks **for the rest of the character's life**, and changes how subsequent `add_domain_card` advancements are eligible.

This is the deepest wizard surgery in the batch. State machine, not feature list.

## SRD-verified rules

All cited from `daggerheart-srd-main/contents/`. Direct quotes:

**Per-roll spellcast choice** (`Multiclassing.md`):
> If your foundation cards specify different Spellcast traits, you can choose **which one to apply when making a Spellcast roll**.

This is mandated, not a UI preference. Roller branches at roll-time on `spellcastTraits.length`.

**Permanent multiclass lock-out** (`Leveling Up.md`):
> Then cross out the "upgraded subclass" advancement option in this tier and **all other "multiclass" advancement options on your character sheet**.

The lock-out is permanent across the entire character's leveling history, not just same-tier.

**Half-level cap** (`Multiclassing.md`):
> ...cards at or below **half your current level (rounded up)** from the domain you chose...

Spec's `Math.ceil(level / 2)` is correct.

**Costs both slots** (`Leveling Up.md`):
> *The black box around this advancement's slots indicates you must spend two advancements and mark both level-up slots in order to take it as an option.*

## Decision A: identify domain by name

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Slot index** | Brittle. **Reject.** |
| **A2. Domain name** | `multiclassDomain: string` (e.g. "Codex"). Stable across data updates. |

**Recommendation: A2.** Same pattern as PR #11.

## Decision B: where lock-out rules live

| Option | Approach |
|---|---|
| **B1. Inline in wizard component** | Logic in React. Hard to test. |
| **B2. Pure `availableAdvancements(c, level)` function** | Returns eligible `AdvancementType[]` per the rules. Wizard renders, doesn't decide. |

**Recommendation: B2.**

```ts
function availableAdvancements(c: Character, newLevel: number): AdvancementType[] {
  const types: AdvancementType[] = [...defaultTypes]
  if (newLevel < 5) types.remove('multiclass')
  // Permanent lock-out: any prior multiclass anywhere in advancement history
  if (c.advancements.some(a => a.type === 'multiclass')) {
    types.remove('multiclass')
  }
  // Multiclass and upgrade_subclass at the same level are mutually exclusive
  // (resolved per-level when picks are made)
  return types
}
```

## Decision C: half-level domain card cap

| Option | Approach |
|---|---|
| **C1. `eligibleDomainCards(c, level)` pure function** | Returns the union of valid cards by domain + level cap. |
| **C2. Inline filter in wizard** | **Reject.** |

**Recommendation: C1.**

```ts
function eligibleDomainCards(c: Character, level: number): DomainCard[] {
  const homeMax = level
  const mcMax = c.multiclass ? Math.ceil(level / 2) : 0
  return allCards.filter(card =>
    (homeDomainsOf(c).includes(card.domain) && card.level <= homeMax) ||
    (mcDomainsOf(c).includes(card.domain) && card.level <= mcMax)
  )
}
```

Half-level table for review:

| Char level | `ceil(level/2)` | Multiclass card cap |
|---|---|---|
| 5 | 3 | 1, 2, 3 |
| 6 | 3 | 1, 2, 3 |
| 7 | 4 | 1, 2, 3, 4 |
| 8 | 4 | 1, 2, 3, 4 |
| 9 | 5 | 1..5 |
| 10 | 5 | 1..5 |

## Decision D: spellcast trait migration

`Character.spellcastTrait: string` → `spellcastTraits: string[]` everywhere.

**Hydration test** for v1-shaped characters (mandatory):

```ts
// Migration: v1 → v2
if (!c.spellcastTraits && c.spellcastTrait) {
  c.spellcastTraits = [c.spellcastTrait]
  delete c.spellcastTrait
}
```

**Dedup case**: a multiclass character whose home class spellcast = "Knowledge" and multiclass spellcast also = "Knowledge" produces `spellcastTraits = ['Knowledge']` (length 1). PR #9's roller branches on `spellcastTraits.length > 1`, **not** on `c.multiclass !== undefined`. State this in acceptance.

## Decision E: cost-both-slots constraint

`getAdvancementCost('multiclass') === 2` (same as `'increase_proficiency'`).

`applyLevelUp` rejects an advancement set that combines `'multiclass'` with any other advancement at the same level.

## Decision F: existing card retention post-multiclass

A L5 character with 5 home-domain loadout cards multiclasses. Existing cards stay valid. `eligibleDomainCards` only filters *future* picks.

## Decision G: subclass foundation picker UX

| Option | Flow |
|---|---|
| **G1. Three-screen sub-flow** | Pick class → pick domain → pick subclass-foundation. | Verbose. |
| **G2. Single-screen segmented** | Class radio + domain choice + subclass-foundation cards on one scroll. | Dense. |
| **G3. Two-screen** | Screen 1: class + domain. Screen 2: subclass-foundation cards (visual). | Right balance. |

**Recommendation: G3.**

## Decision H: re-multiclass lock-out is visible

Round-2 draft said "L5 → L6 wizard does NOT offer Multiclass when one already exists (rejected)" — but didn't say what the player sees.

| Option | Approach |
|---|---|
| **H1. Silent absence** | Multiclass option simply doesn't appear. | Bad UX; player wonders if they missed something. |
| **H2. Greyed + tooltip** | Appears greyed with tooltip "You've already multiclassed." | Mirrors PR #8's marked-trait lock pattern. |
| **H3. Lock badge** | Visual lock icon. | OK; lighter than tooltip. |

**Recommendation: H2.** Consistency with PR #8's lock+tooltip pattern.

## Decision I: SRD reading on multi-multiclass

`Leveling Up.md` confirms one-time multiclass via "all other multiclass advancement options" lock-out. Decision B's permanent filter covers it.

## Acceptance

- [ ] `AdvancementType` includes `'multiclass'`.
- [ ] `MulticlassAdvancement` shape: `{ type: 'multiclass'; multiclassName: string; multiclassDomain: string; multiclassFoundationFrom: string }` (domain by name).
- [ ] `availableAdvancements(c, level)` pure function exists in `core/character/level-up.ts`.
- [ ] L4 → L5 wizard offers Multiclass for the first time.
- [ ] L5 → L6 wizard renders Multiclass **greyed with tooltip** "You've already multiclassed."
- [ ] L7 → L8 wizard same: lock-out persists across tiers.
- [ ] Multiclass at L5 locks out Upgraded Subclass at L5 in the same wizard pass.
- [ ] `eligibleDomainCards(c, level)` pure function exists.
- [ ] L5 multiclass + L6 `add_domain_card`: multiclass-domain offerings limited to levels 1, 2, 3.
- [ ] L7 multiclass + L8 `add_domain_card`: multiclass-domain offerings limited to levels 1, 2, 3, 4.
- [ ] `spellcastTrait` migrated to `spellcastTraits: string[]` everywhere.
- [ ] **Hydration test**: load a v1-shaped character (`spellcastTrait: 'Spellcast (Knowledge)'`) and verify migration to `spellcastTraits: ['Spellcast (Knowledge)']`.
- [ ] **Dedup test**: multiclass character with home + multiclass spellcast both = "Knowledge" → `spellcastTraits: ['Knowledge']` (length 1).
- [ ] **Roller branching**: PR #9's roller prompts when `spellcastTraits.length > 1`, NOT when `c.multiclass !== undefined`.
- [ ] `applyLevelUp` rejects combining `'multiclass'` with any other advancement at the same level.
- [ ] Subclass foundation picker uses two-screen sub-flow (G3).
- [ ] Existing pre-multiclass cards remain in loadout/vault unchanged.
- [ ] Half-level cap math table verified at L5, L6, L7, L8, L9, L10.

## Dependency graph

- This PR lands before PR #9 (roller consumes `spellcastTraits`).
- This PR lands after PR #10 (loadout/vault model exists).
- Coordinates with PR #8's `applyTierAchievements` (shared file).

## Out of scope

- Multi-multiclass (lock-out covers it).
- Cross-class subclass progression on multiclass subclass.
- Per-card spellcast trait override.
