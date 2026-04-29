## User story

**As a player hitting Tier 3, I'd like to multiclass into a second class via the level-up wizard, so I can take a domain and a foundation card from another class.**

## Problem

`AdvancementType` is missing `'multiclass'`. SRD spec is layered: L5+ only, costs both slots, locks out Upgraded Subclass for the same tier, locks out future multiclass picks (verify this rule), and changes how subsequent `add_domain_card` advancements are eligible.

This is the deepest wizard surgery in the batch. Treat it as a state machine, not a feature list.

## Decision A: identify domain by name, not slot index

Original draft: `multiclassDomain: 'domain_1' | 'domain_2'` referencing positions in the multiclass class data.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Slot index** | Brittle to SRD JSON re-ordering. | **Reject.** |
| **A2. Domain name** | `multiclassDomain: string` (e.g. "Codex"). | Stable across data updates. |

**Recommendation: A2.** Same pattern as PR #11's feat-by-name pin.

## Decision B: where lock-out rules live

"Crosses out this tier's Upgraded Subclass" and "all other Multiclass options" must apply at every subsequent level-up wizard.

### Options considered

| Option | Approach |
|---|---|
| **B1. Inline in wizard component** | Component reads advancement history, computes eligible types. | Logic in React. Hard to test. |
| **B2. Pure `availableAdvancements(c, level)` function** | Returns eligible `AdvancementType[]` per the rules. Wizard renders, doesn't decide. | Testable. Single-source-of-truth. **Right shape.** |

**Recommendation: B2.** Lives in `core/character/level-up.ts`. Reads:

```ts
function availableAdvancements(c: Character, newLevel: number): AdvancementType[] {
  const types: AdvancementType[] = [...]
  if (newLevel < 5) types.remove('multiclass')
  if (c.advancements.some(a => a.type === 'multiclass')) types.remove('multiclass')
  // upgrade_subclass mutually exclusive with multiclass at the same tier
  // ... etc
}
```

PR #8's tier-clear logic (`applyTierAchievements`) is in the same file; this PR formalizes the eligibility helper that PR #8 also benefits from.

## Decision C: half-level domain card cap

Post-multiclass, `add_domain_card` advancements can pull from either home (capped at level) or multiclass domain (capped at `ceil(level / 2)`).

### Options considered

| Option | Approach |
|---|---|
| **C1. `eligibleDomainCards(c, level)` pure function** | Returns the union of valid cards by domain + level cap. | Testable. Wizard renders. |
| **C2. Inline filter in wizard** | Repeats logic at each call site. | **Reject.** |

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

## Decision D: spellcast trait

`Character.spellcastTrait: string` (singular). Multiclass requires storing both potential traits and resolving per-roll.

### Options considered

| Option | Approach | Migration |
|---|---|---|
| **D1. Promote to array** | `spellcastTraits: string[]` (length 1 normally, 2 post-multiclass). | Touch every consumer. |
| **D2. Add second optional field** | `spellcastTrait: string; multiclassSpellcastTrait?: string` | Less invasive. Two fields. |

**Recommendation: D1.** This PR migrates `spellcastTrait → spellcastTraits: string[]` everywhere. PR #9's roller (which depends on this) accepts the array and prompts when length > 1.

State in dependency graph: this PR lands before PR #9.

## Decision E: cost-both-slots constraint

`getAdvancementCost(type)` already returns 2 for `'increase_proficiency'`. `'multiclass'` returns 2 also.

Test: `applyLevelUp` rejects an advancement set that combines `'multiclass'` with any other advancement at the same level.

## Decision F: existing card retention post-multiclass

A L5 character with 5 home-domain loadout cards multiclasses. Existing cards stay valid. No migration needed.

State explicitly in acceptance: "post-multiclass, all previously-acquired cards remain in their loadout/vault. The `eligibleDomainCards` function only filters *future* advancement card picks."

## Decision G: subclass foundation picker UX

"Take a foundation card from one of its subclasses" is meaningful new UI.

### Options considered

| Option | Flow |
|---|---|
| **G1. Three-screen sub-flow** | Pick class → pick domain → pick subclass-foundation. Full screen each. | Verbose. |
| **G2. Single-screen segmented** | Class radio at top, domain choice middle, subclass-foundation cards at bottom, all on one scroll. | Dense. |
| **G3. Two-screen** | Screen 1: class + domain (one segmented row each). Screen 2: subclass-foundation cards (visual). | Right balance. |

**Recommendation: G3.** Class + domain are coupled choices; pairing them on one screen reads. Foundation card picker gets its own screen with full card art.

## Decision H: multi-multiclass rule

SRD: re-read confirmation needed. **Multiclass advancement is taken once per character; the lock-out from Decision B prevents re-multiclass.**

Confirmed via SRD: multiclass is a one-time advancement. Decision B's lock-out covers it. Acceptance includes a test for re-attempt rejection.

## Acceptance

- [ ] `AdvancementType` includes `'multiclass'`.
- [ ] `MulticlassAdvancement` shape: `{ type: 'multiclass'; multiclassName: string; multiclassDomain: string; multiclassFoundationFrom: string }` (domain by name).
- [ ] `availableAdvancements(c, level)` pure function exists in `core/character/level-up.ts`.
- [ ] L4 → L5 wizard offers Multiclass for the first time.
- [ ] L5 → L6 wizard does NOT offer Multiclass when one already exists (rejected).
- [ ] Multiclass at L5 locks out Upgraded Subclass at L5 in the same wizard pass.
- [ ] `eligibleDomainCards(c, level)` pure function exists; honors home (level cap) and multiclass (half-level cap, rounded up).
- [ ] L5 multiclass + L6 add_domain_card: multiclass-domain offerings limited to levels 1, 2, 3.
- [ ] L7 multiclass + L8 add_domain_card: multiclass-domain offerings limited to levels 1, 2, 3, 4.
- [ ] `spellcastTrait` migrated to `spellcastTraits: string[]`. All existing characters get a 1-element array. PR #9 reads it.
- [ ] `applyLevelUp` rejects combining `'multiclass'` with any other advancement at the same level (cost = both slots).
- [ ] Subclass foundation picker uses two-screen sub-flow (G3).
- [ ] Existing pre-multiclass cards remain in loadout/vault unchanged.
- [ ] Half-level cap math table verified at L5, L6, L7, L8, L9, L10.

## Dependency graph

- This PR lands before PR #9 (roller consumes `spellcastTraits`).
- This PR lands after PR #10 (loadout/vault model exists for multiclass to reason about).
- Coordinates with PR #8's `applyTierAchievements` (tier-clear logic + multiclass eligibility share the level-up.ts file).

## Out of scope

- Multi-multiclass (lock-out covers it).
- Cross-class subclass advancement (Foundation → Specialization → Mastery on the multiclass subclass; complicated, not in SRD core for this PR).
- Multiclass Spellcast Trait per-card override (specific cards may lock to one trait; PR #9 handles per-roll).
