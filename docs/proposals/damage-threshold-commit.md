## User story

**As a player taking damage, I'd like to drag the damage indicator to the value the GM called out, choose whether to spend an Armor Slot to soften the blow, and have the right number of HP marked, so the most interesting rules choice in combat actually happens on my sheet.**

## Problem

`DamageThresholdRow` in [`hand/StatBar.tsx`](../../src/hand/StatBar.tsx) is a beautiful interaction: drag a slider over the threshold zones, see "Mark 2 HP" preview. But:

1. `onPointerUp` clears `isActive`. Nothing ever calls `updateHP`. **The control is a calculator, not a control.**
2. The Armor Slot decision is missing entirely. From `daggerheart-srd-main/contents/Armor.md`:

   > When you take damage, you can mark one Armor Slot to reduce the number of Hit Points you would mark by one.

   The slider takes the player from "GM called damage" straight to "HP marked" with no decision surface. That skipped step is *the* combat decision in Daggerheart.

3. The component is gated behind `character.equipment?.armor &&` ([StatBar.tsx](../../src/hand/StatBar.tsx)). Unarmored characters get no threshold UI even though SRD gives them thresholds (Major = level, Severe = 2 × level).

4. Special armor features (`Resilient`, `Reinforced`, `Full Fortified`) change the math. None are handled.

This proposal reframes the work: define a damage-resolution model, then ship the slider as a UI on top of it.

## Decision A: data model for damage resolution

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Inline in component** | Original draft. `hpCostMap` stays in `StatBar.tsx`, `updateHP` called on pointerup. | Cheapest. Locks armor decision out. Any new armor feature requires touching the slider. |
| **A2. Pure `resolveDamage()`** | `(damage, character, options) → { hpToMark, armorPrompts, modifiers, badges }`. Slider renders the result. Unit-testable. | One pure function. Slider becomes a thin renderer. Generalizes for special armor features. ~1.5× the work of A1. |

**Recommendation: A2.** Anything else means tearing out the slider when special armor features land in a follow-up.

```ts
// core/character/damage.ts
interface DamageInput {
  damage: number
  optionalRules?: { massiveDamage?: boolean }  // campaign-level toggle
}
interface DamageResolution {
  zone: 'minor' | 'major' | 'severe' | 'massive'
  hpBeforeArmor: 1 | 2 | 3 | 4
  hpAfterArmor: number          // == hpBeforeArmor minus armor spend
  armorAvailable: number         // current armor slots
  armorSpendSuggested: number    // 0..1 typically; depends on features
  features: { name: string; effect: string }[]  // 'Resilient', 'Full Fortified', etc., for badges
}
export function resolveDamage(c: Character, input: DamageInput): DamageResolution
```

This shape lets the slider tooltip show "Mark 2 HP, or spend 1 Armor Slot to mark 1." It also lets future PRs add Resilient (display "Roll d6 to skip") without slider changes.

## Decision B: where the armor-spend decision lives in the UI

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **B1. None — just commit HP** | Original draft. Player tracks armor manually. | Trivial. Skips the rule. **Reject.** |
| **B2. Tooltip with two buttons** | Tooltip shows "Mark 2 HP" *and* "Spend 1 Armor → Mark 1." Tap to commit either. | Discoverable. Two-tap interaction. Touch ergonomics: tooltip moves with the slider, buttons need to stay reachable. |
| **B3. Pinch-to-step-down** | One slider. Pinch (or second-finger drop) reduces HP by 1 per Armor Slot. | Cute. Nondiscoverable. Bad on desktop. |
| **B4. Two-stage commit** | First `pointerup` shows a confirm sheet with HP cost + armor toggle + commit button. | Discoverable. Three-step interaction: drag → release → confirm. Slower for the common case. |
| **B5. Button row in tooltip + tap-to-commit shortcut** | Drag positions. Release shows a small action row anchored above the slider with two pill buttons: "Mark X HP" / "Mark X-1 HP, spend 1 Armor (Y left)." Click anywhere else dismisses. | Discoverable. One extra tap vs B1, but the tap *is* the rules choice. Anchored row is touch-friendly. |

**Recommendation: B5.** It surfaces the decision exactly when it matters and matches the existing tooltip pattern.

Edge cases:
- 0 armor slots → only the "Mark X HP" button renders. Visually identical to B1 in the common case.
- HP cost is 1 → "spend 1 Armor" button reads "Spend 1 Armor → no HP marked."
- Armor feature `Full Fortified` reduces by **two** thresholds → button reads "Spend 1 Armor → mark X-2 HP" (X-2 floored at 0).

## Decision C: unarmored characters

`DamageThresholdRow` is currently gated behind `character.equipment?.armor`. SRD gives unarmored characters thresholds anyway. Two options:

- **C1. Compute thresholds for unarmored too**: Major = `level`, Severe = `2 × level`. Render the bar.
- **C2. Defer**: continue showing nothing for unarmored, document the limitation.

**Recommendation: C1.** A naked-fighter build is legal at every tier. The bar is the entire damage UI. Skipping it for unarmored is a silent failure.

The threshold derivation moves into `resolveDamage()` and a tiny helper:

```ts
function getThresholds(c: Character): { major: number; severe: number } {
  if (c.equipment?.armor) {
    const t = parseThresholds(c.equipment.armor.base_thresholds)
    return { major: t.major + c.level, severe: t.severe + c.level }
  }
  return { major: c.level, severe: 2 * c.level }
}
```

## Decision D: Massive Damage placement

Spec originally proposed an "opt-in checkbox in the tooltip." Combat.md confirms this is an *Optional Rule*. **Per-drag toggle is the wrong surface for a per-table house rule.**

**Recommendation:** campaign-level (or character-level) flag in settings:

```ts
// stored on Character or in a future Campaign object
optionalRules: { massiveDamage: boolean }
```

`resolveDamage()` reads it. UI renders a "Massive" badge in the tooltip when triggered, no toggle in the heat of combat.

If campaign-level state doesn't exist yet (it doesn't), per-character is fine for v1; promote to campaign-level when other rules toggles need it.

## Decision E: undo and direct numeric entry

### E1. Undo

A drag-to-commit interaction where the GM said "8" and the player heard "18" is a 3-HP commit with no escape hatch.

**Recommendation:** "Last damage: -3 HP. Undo" toast for ~5s, anchored to the threshold bar. Toasts are a tiny addition; the alternative (an undo button somewhere persistent) clutters the bar.

Implementation: `updateHP` returns a transaction id; the toast holds it; tap → `undoTransaction(id)`.

### E2. Direct numeric entry

When GM says "12," typing 12 is faster than dragging.

**Recommendation:** long-press on the bar (mobile) / right-click (desktop) → numeric pad bottom sheet. Small affordance, big payoff for the "exact number" case.

Both can be deferred from this PR but are worth designing in. **Concrete decision: ship Undo with this PR; defer numeric entry to a follow-up labeled "damage entry: numeric pad".**

## Decision F: touch race in the existing component

`onPointerLeave` (StatBar.tsx) currently clears `isActive` when buttons are 0. But `setPointerCapture` is already called on `pointerdown`. **The leave handler is dead code from a desktop hover affordance** that conflicts with the touch path.

**Recommendation:** remove `onPointerLeave` and `onPointerEnter`. Keep only `pointerdown`/`pointermove`/`pointerup`/`pointercancel`. Hover preview becomes a separate `onMouseMove` for desktop only, no commit, no `isActive`.

## Suggested implementation, end-to-end

1. **`core/character/damage.ts`**: `resolveDamage()`, `getThresholds()`. Pure. Unit-tested.
2. **Replace `DamageThresholdRow`**:
   - Drag positions an indicator.
   - Pointer-up *opens an action row*, doesn't commit.
   - Action row: "Mark X HP" / "Spend 1 Armor → mark X-1 HP" (when armor available).
   - Tap a button → commit via `updateHP` and/or `updateArmor`. Show undo toast.
3. **Settings flag**: `optionalRules.massiveDamage` on Character. UI in Settings drawer when that lands; default `false`.
4. **Render the bar for unarmored characters** with derived thresholds.

## Acceptance

- [ ] `resolveDamage()` and `getThresholds()` exist; unit tests cover armored/unarmored, Major/Severe boundaries (`damage = major - 1` is minor, `damage = major` is major), Massive Damage on/off, and special armor features as data-driven cases.
- [ ] Boundary unit tests specifically: `getThresholdZone(major-1)='minor'`, `getThresholdZone(major)='major'`, `getThresholdZone(severe-1)='major'`, `getThresholdZone(severe)='severe'`.
- [ ] Tap (down + immediate up at the same x) opens the action row.
- [ ] Pointer leaving the bar mid-drag does not commit.
- [ ] Action row commit calls `updateHP` / `updateArmor` correctly.
- [ ] Damage resolved while armor available offers the spend-armor option.
- [ ] Undo toast restores HP/Armor on tap within 5s; auto-dismisses.
- [ ] Unarmored character renders the threshold bar with `major=level`, `severe=2*level`.
- [ ] Damage = 0 (drag back to start) is a no-op.
- [ ] Playwright: drag → release → tap "Mark 3 HP" → assert HP delta. Repeat with armor button.

## Out of scope (explicit)

- Numeric entry (long-press → number pad). Tracked in a follow-up.
- Special armor feature mechanics beyond reading them through `resolveDamage()` features field. Resilient (d6 skip) and Reinforced (post-armor threshold boost) ship as feature-flag follow-ups, but the data shape supports them.
- Campaign-level rules toggles. Character-level for v1.
