## User story

**As a leveling character, I'd like the "+1 to two unmarked traits" advancement to actually mark those traits and prevent me from re-picking them within the tier, so I can't accidentally cheese the same trait twice.**

## Reality check

Original draft claimed "I don't see UI to mark traits when the +1 advancement is taken." **Wrong.** [`core/character/level-up.ts`](../../src/core/character/level-up.ts) at line 56 already pushes the picked trait names to `markedTraits`:

```ts
markedTraits: [...result.markedTraits, ...advancement.traits],
```

What's actually missing:

1. The wizard's lock against re-picking a marked trait.
2. Tier-achievement clear-all at the start of new tiers (L2, L5, L8).
3. Visible "marked" indicator on the play sheet.

## Decision A: where the tier clear lives

Tier achievements clear marked traits. Original draft proposed inlining "if level === 5 || level === 8, clear" in the wizard.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Inline in wizard** | `if (newLevel === 2 || newLevel === 5 || newLevel === 8) markedTraits = []` inside `applyLevelUp`. | Couples rule to wizard. Hard to extend. |
| **A2. Pure `applyTierAchievements`** | Pure function, called from `applyLevelUp` *before* the advancement switch. Handles all tier transitions. Grows to include other tier effects (Proficiency increment, multiclass unlock per PR #12). | Auditable. Testable in isolation. **Right shape.** |

**Recommendation: A2.**

```ts
// core/character/tier-achievements.ts
export function applyTierAchievements(c: Character, newLevel: number): Character {
  const tier = getTier(newLevel)
  const prevTier = getTier(c.level)
  if (tier === prevTier) return c
  // tier crossing: L1→L2, L4→L5, L7→L8
  return {
    ...c,
    markedTraits: [],
    // future: proficiency bumps, etc.
  }
}
```

## Decision B: which levels are tier boundaries

SRD: T1=1, T2=2-4, T3=5-7, T4=8-10. **Tier transitions: L1→L2, L4→L5, L7→L8.**

Original draft said "L5 and L8" — missed L2. Fixed.

Test: leveling 1→2 clears marked traits. Leveling 2→3 does not. Leveling 4→5 clears. Leveling 7→8 clears. Leveling within a tier does not.

## Decision C: lock UX

### Options considered

| Option | Visual | Tradeoffs |
|---|---|---|
| **C1. Greyed disabled pill** | Trait pill is disabled with reduced opacity. | Familiar. No explanation. |
| **C2. Disabled + lock icon** | Lock badge on the pill. | Explicit. ~10 lines. |
| **C3. Disabled + tooltip** | "Already increased this tier; clears at L5." | Most informative. Hover/long-press. |

**Recommendation: C2 + C3 combined.** Lock icon for at-a-glance state. Tooltip for explanation on tap-and-hold.

## Decision D: edge case — all 6 traits marked

Possible by L4 (L2 marks 2, L3 marks 2, L4 marks 2 = 6 total). Wizard would have nothing to offer for "+1 traits" advancement.

### Options considered

| Option | Approach |
|---|---|
| **D1. Hide the advancement option when no eligible traits exist** | Auto-skip. | Cleanest. Player redirects to other advancements. |
| **D2. Allow over-marked** | Warn but allow re-picking. | Wrong per SRD. |

**Recommendation: D1.** Pure helper `hasEligibleTraitsForIncrease(c)` filters the wizard's available advancements.

This is a candidate for a generalized `availableAdvancements(character, level)` function (also referenced in PR #12 review). State that future extraction; in this PR, ship the targeted helper.

## Decision E: play-sheet indicator

Original draft scoped this as "bonus." Reviewer pushed back: it's part of the rule, not polish.

**Recommendation: in scope.** Small lock badge or strikethrough underline next to the trait label in `hand/panels/StatsPanel.tsx` when `markedTraits` includes the trait. Hovering / tapping shows "marked at L3 — clears at L5."

## Acceptance

- [ ] `applyTierAchievements` exists as a pure function. Called from `applyLevelUp` before the advancement switch.
- [ ] Leveling 1→2 clears `markedTraits`.
- [ ] Leveling 4→5 clears `markedTraits`.
- [ ] Leveling 7→8 clears `markedTraits`.
- [ ] Leveling within a tier (e.g. 2→3) does not clear.
- [ ] L3 wizard's "+1 traits" advancement disables traits in `markedTraits`. Lock icon + tooltip.
- [ ] When all 6 traits are marked, the "+1 traits" advancement is hidden from the wizard.
- [ ] StatsPanel renders a marked indicator next to marked trait labels.
- [ ] Test sequence: L2 picks A,B → L3 wizard disables A,B → L4 picks C,D → markedTraits=[A,B,C,D] → L5 wizard offers all 6 (cleared) → L5 picks A,E → markedTraits=[A,E].

## Out of scope

- Generalized `availableAdvancements` factoring (consumed by PR #12; defer the extraction).
- Manual unmarking via "edit character" flow.
