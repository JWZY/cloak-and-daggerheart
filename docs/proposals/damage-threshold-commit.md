## User story

**As a player taking damage, I'd like to drag the damage indicator to the value the GM called out and have it actually mark the right number of HP, so I'm not doing the threshold math twice.**

## Problem

`DamageThresholdRow` in [`hand/StatBar.tsx`](../../src/hand/StatBar.tsx) is a beautiful interaction: drag a slider over the threshold zones, see "Mark 2 HP" or "Mark 3 HP" preview. But the value is purely local state. `onPointerUp` clears `isActive`. **Nothing ever calls `updateHP`.** The control is a calculator, not a control.

## Source

- SRD v1.0 — Hit Points & Damage Thresholds: https://daggerheartsrd.com/rules/

## Suggestion

On `pointerup`, commit the computed HP cost from the current zone:

```ts
const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
  if (isActive && damage > 0) {
    const zone = getThresholdZone(damage)
    const hpCost = hpCostMap[zone]  // 1 | 2 | 3
    updateHP(character.id, -hpCost)
  }
  setIsActive(false)
  setDamage(0)
}, [isActive, damage, character.id, updateHP])
```

Touch caveat: `onPointerLeave` currently clears `isActive` when buttons are 0, which on touch can fire on finger-lift before `pointerup`. Move the commit logic to a single `pointerup`/`pointercancel` path.

Optional but recommended: also support **Massive Damage** (≥ 2× Severe → 4 HP) as an opt-in checkbox in the tooltip. SRD calls it an optional rule.

## Acceptance

- [ ] Releasing the drag commits HP marks via `updateHP`.
- [ ] Tap (down + immediate up at the same x) commits.
- [ ] Pointer leaving the bar mid-drag does **not** commit.
- [ ] Damage > 2× Severe shows a Massive Damage badge and (if enabled) marks 4 HP.
- [ ] Playwright test: drag to severe zone, release, assert HP delta = 3.
