## User story

**As a player taking damage, I'd like to drag the damage indicator to the value the GM called out, choose whether to spend an Armor Slot to soften the blow, and have the right number of HP marked, so the most interesting rules choice in combat actually happens on my sheet.**

## Problem

`DamageThresholdRow` in [`hand/StatBar.tsx`](../../src/hand/StatBar.tsx):

1. `onPointerUp` clears `isActive`. Nothing ever calls `updateHP`. **The control is a calculator, not a control.**
2. The Armor Slot decision is missing entirely. From `daggerheart-srd-main/contents/Armor.md`: *"When you take damage, you can mark one Armor Slot to reduce the number of Hit Points you would mark by one."*
3. Component is gated behind `character.equipment?.armor &&`. Unarmored characters get no threshold UI.
4. Massive Damage rule (4 HP at 2× Severe) is missing.
5. Tier-achievement +1 to all thresholds is missing.

## SRD-verified formulas

Verified against the SRD content checked into this repo. **Do not refactor these away.**

**Unarmored thresholds** (`Armor.md` line 9, verbatim):

> While unarmored, your character's base Armor Score is 0, their Major threshold is equal to their level, and their Severe threshold is equal to twice their level.

**Armored thresholds** (`Combat.md` line 21):

> A PC's damage thresholds are calculated by adding their level to the listed damage thresholds of their equipped armor.

**Damage-to-HP marking** (`Combat.md` thresholds + line 31 Massive Damage):

| Damage | HP marked |
|---|---|
| `damage < major` | 1 |
| `major ≤ damage < severe` | 2 |
| `severe ≤ damage < 2 × severe` | 3 |
| `2 × severe ≤ damage` | **4 (Massive Damage)** |

**Tier-achievement threshold bump** (`Leveling Up.md` line 38):

> Increase all damage thresholds by 1.

Per-tier-crossing (T1→T2 at L2, T2→T3 at L5, T3→T4 at L8). Cumulative +3 by L8.

## Decision A: data model for damage resolution

| Option | Approach |
|---|---|
| **A1. Inline in component** | `hpCostMap` stays in `StatBar.tsx`, `updateHP` called on pointerup. | Locks armor decision out. Future armor features tear it apart. |
| **A2. Pure `resolveDamage()`** | `(character, input) → DamageResolution`. Slider renders the result. Unit-testable. |

**Recommendation: A2.**

```ts
// core/character/damage.ts
interface DamageInput {
  damage: number
}

interface DamageResolution {
  zone: 'minor' | 'major' | 'severe' | 'massive'
  hpBeforeArmor: 1 | 2 | 3 | 4
  hpAfterArmor: number
  armorAvailable: number
  armorSpendSuggested: number
  features: { name: string; effect: string }[]  // Resilient, Reinforced, Full Fortified
}

export function resolveDamage(c: Character, input: DamageInput): DamageResolution
```

This shape lets the slider tooltip show "Mark 2 HP, or spend 1 Armor Slot to mark 1." It also lets future PRs add Resilient ("Roll d6 to skip") without slider changes.

## Decision B: tier-threshold bonus

`Leveling Up.md` line 38 mandates +1 to all damage thresholds at each tier crossing. PR #8's `applyTierAchievements` handles trait clearing and now must handle this too. Two storage options:

| Option | Approach |
|---|---|
| **B1. `tierThresholdBonus: number` field** | Increments by 1 at each tier crossing. `applyTierAchievements` mutates. Damage formula reads it. | Explicit. Auditable. |
| **B2. Derive from level** | At L1: +0. L2-4: +1. L5-7: +2. L8-10: +3. Pure function. | No state. Mechanical: `max(0, getTier(level) - 1)`. |

**Recommendation: B2.** No new field; tier bonus is a pure function of level. Coordinates with PR #8's `getTier` helper.

```ts
function tierThresholdBonus(level: number): number {
  return Math.max(0, getTier(level) - 1)  // L1→0, L2-4→1, L5-7→2, L8-10→3
}
```

This means PR #8's `applyTierAchievements` doesn't need to mutate a field; the threshold formula reads from level directly.

## Decision C: full threshold formula

```ts
export function getThresholds(c: Character): { major: number; severe: number } {
  const tierBonus = tierThresholdBonus(c.level)
  if (c.equipment?.armor) {
    const t = parseThresholds(c.equipment.armor.base_thresholds)
    return {
      major: t.major + c.level + tierBonus,
      severe: t.severe + c.level + tierBonus,
    }
  }
  // Unarmored (Armor.md L9)
  return {
    major: c.level + tierBonus,
    severe: c.level * 2 + tierBonus,
  }
}
```

## Decision D: armor-spend UI

| Option | Approach |
|---|---|
| **D1. None — just commit HP** | Skips the rule. **Reject.** |
| **D2. Tooltip with two buttons** | "Mark 2 HP" *and* "Spend 1 Armor → Mark 1." | Discoverable. |
| **D3. Pinch-to-step-down** | Cute. Nondiscoverable. |
| **D4. Two-stage commit** | Drag → release → confirm sheet. | Slower. |
| **D5. Button row in tooltip + tap-to-commit** | Drag positions; release shows action row anchored above slider with two pill buttons. Click elsewhere dismisses. | One extra tap, but the tap *is* the rules choice. |

**Recommendation: D5.** Edge cases:
- 0 armor slots → only "Mark X HP" renders. Visually identical to D1 in the common case.
- HP cost is 1 → "Spend 1 Armor → no HP marked."
- `Full Fortified` reduces by **two** thresholds → "Spend 1 Armor → mark X-2 HP" (floored at 0).
- Massive Damage zone → "Mark 4 HP" with prominent Massive badge.

## Decision E: Massive Damage placement

`Combat.md` calls Massive Damage a baseline rule, not optional (despite the round-2 draft framing). Verify against the SRD content directly: `Combat.md` line 31 reads as a normal threshold rule, not flagged as optional.

**Recommendation:** ship Massive Damage as the 4-HP branch unconditionally. No toggle. If a future SRD errata changes its status to optional, add a flag then.

## Decision F: undo and direct numeric entry

### F1. Undo

Drag-to-commit where the GM said "8" and the player heard "18" is a 3-HP commit with no escape.

**Recommendation:** "Last damage: -3 HP. Undo" toast for ~5s, anchored to the threshold bar. `updateHP` returns a transaction id; toast holds it; tap → `undoTransaction(id)`.

`undoTransaction` lives in `useCharacterStore` as a transient log of last-N=20 transactions. State explicitly: 5s window; transactions older than 5s are discarded.

### F2. Direct numeric entry

Round-2 draft proposed long-press → numeric pad. **That conflicts with drag.** Touch sequence:

- Player drags from 0 to 8. Holds at 8 for 600ms while reading. Long-press fires. Numeric pad opens. Player loses drag value.
- Or: player wants the numeric pad. Taps and holds without dragging. Drag handler reads pointermove with no `delta`; ambiguous.

**Recommendation:** drop long-press. Add a separate **🔢 affordance** next to the slider (or tap on the threshold-zone label "Major: 8" to type it). Slider for drag, icon for direct entry. No gesture overload.

Numeric entry deferred to a follow-up labeled "damage entry: numeric pad."

## Decision G: touch race in existing component

`onPointerLeave` (StatBar.tsx) currently clears `isActive` when buttons are 0. `setPointerCapture` is already called on `pointerdown`. **The leave handler is dead code from a desktop hover affordance** that conflicts with the touch path.

**Recommendation:**
- Remove `onPointerLeave` and `onPointerEnter` from the bar.
- Keep only `pointerdown` / `pointermove` / `pointerup` / `pointercancel`.
- Hover preview (desktop only) becomes a separate `onMouseMove` handler **gated by `(hover: hover)` media query** so synthetic mouse events on touch devices don't fire it.

```ts
const isHoverDevice = window.matchMedia('(hover: hover)').matches
// Only attach onMouseMove if isHoverDevice
```

## Decision H: tap-without-drag

"Tap (down + immediate up at the same x)" — define "same x." 

**Recommendation:** within ±5 px of `pointerdown` x. Pointerdown registers the start position; pointerup within 5 px is treated as a tap (opens action row at that position). Larger movement is a drag.

## Suggested implementation, end-to-end

1. **`core/character/damage.ts`**: `resolveDamage()`, `getThresholds()`, `tierThresholdBonus()`. Pure. Unit-tested.
2. **Replace `DamageThresholdRow`**:
   - Drag positions an indicator.
   - Pointer-up opens an action row, doesn't commit.
   - Action row: "Mark X HP" / "Spend 1 Armor → mark X-1 HP" (when armor available).
   - Tap a button → commit via `updateHP` and/or `updateArmor`. Show undo toast.
3. **Render the bar for unarmored characters** with derived thresholds from `getThresholds`.
4. **🔢 icon affordance** next to the slider opens a small numeric input.

## Acceptance

- [ ] `tierThresholdBonus(level)` returns 0/1/1/1/2/2/2/3/3/3 for L1-L10. Pure function.
- [ ] `getThresholds(c)` for unarmored L1: `{ major: 1, severe: 2 }`.
- [ ] `getThresholds(c)` for unarmored L5: `{ major: 7, severe: 12 }` (5 + 2 tier bonus, 10 + 2).
- [ ] `getThresholds(c)` for armored L5 with armor base `major=8/severe=15`: `{ major: 15, severe: 22 }`.
- [ ] `resolveDamage()` boundary tests: `damage = major - 1` → minor zone, 1 HP. `damage = major` → major zone, 2 HP.
- [ ] `damage = 2 * severe` → massive zone, 4 HP. **Easy to silently miss.**
- [ ] Tap (down + immediate up within ±5 px) opens the action row.
- [ ] Pointer leaving the bar mid-drag does NOT commit.
- [ ] Action row commit calls `updateHP` / `updateArmor` correctly.
- [ ] Damage resolved while armor available offers the spend-armor option; commit reduces HP by the right amount and decrements armor.
- [ ] Undo toast restores HP/Armor on tap within 5s; auto-dismisses after.
- [ ] Unarmored character renders the threshold bar.
- [ ] Damage = 0 (drag back to start) is a no-op.
- [ ] Hover preview only fires on devices matching `(hover: hover)`.
- [ ] 🔢 icon opens numeric entry; deferred to follow-up if scope grows.
- [ ] Playwright: drag → release → tap "Mark 3 HP" → assert HP delta. Repeat with armor button.

## Out of scope (explicit)

- Numeric entry full implementation (follow-up).
- Special armor feature mechanics beyond data-driven `features` field. Resilient (d6 skip), Reinforced (post-armor threshold boost) ship as feature follow-ups; data shape supports them.
- Campaign-level rules toggles. (Massive Damage is unconditional per SRD.)
