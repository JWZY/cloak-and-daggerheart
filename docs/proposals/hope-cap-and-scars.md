## User story

**As a player whose character has just narrowly avoided death, I'd like to mark a Scar that permanently reduces my Hope max, so the cost of survival is visible on my sheet between sessions.**

## Problem

1. `character.hope` is a single number. Nothing enforces the SRD-mandated **maximum of 6**. `StatBar` even passes `showMax={false}` to the Hope row, and `updateHope` clamps only at 0. ([`hand/StatBar.tsx`](../../src/hand/StatBar.tsx), [`store/character-store.ts`](../../src/store/character-store.ts))
2. **Scars** (per the Avoid Death move) permanently cross out a Hope slot, lowering max Hope until it hits 0 and the character's journey ends. There is no `maxHope` or `scars` field in [`types/character.ts`](../../src/types/character.ts).

## Source

- SRD v1.0 — Hope, Death (Avoid Death): https://daggerheartsrd.com/rules/
- Demiplane forum confirming Hope drawer crosses out a slot per Scar: https://forums.demiplane.com/t/daggerheart-feedback-permanently-remove-slots-to-reflect-character-sheet/4104

## Suggestion

Type:

```ts
interface Character {
  // ...
  hope: number          // current
  maxHope: number       // starts at 6, reduced by 1 per scar
  scars: number         // count of crossed-out hope slots
}
```

Store:

```ts
updateHope: (id, delta) => set((state) => ({
  characters: state.characters.map((c) =>
    c.id === id ? { ...c, hope: Math.max(0, Math.min(c.hope + delta, c.maxHope)) } : c
  ),
})),

addScar: (id) => set((state) => ({
  characters: state.characters.map((c) => {
    if (c.id !== id) return c
    const newMax = Math.max(0, c.maxHope - 1)
    return { ...c, maxHope: newMax, scars: c.scars + 1, hope: Math.min(c.hope, newMax) }
  }),
})),
```

UI: render Hope pips up to `maxHope`; render scars as crossed-out pip placeholders (small X overlay) so the original 6-slot footprint is still visible. Migration: existing characters get `maxHope: 6, scars: 0`.

## Acceptance

- [ ] `maxHope` and `scars` exist on `Character`; migration sets defaults.
- [ ] `updateHope` clamps at `maxHope` not infinity.
- [ ] `addScar` reduces `maxHope` by 1, increments `scars`, clamps current Hope.
- [ ] `StatBar` Hope row renders crossed-out pip slots for each scar.
- [ ] Scar at `maxHope === 0` triggers an end-of-journey UI prompt (can be a `console.warn` placeholder; full UI is part of [proposal: death-moves](./death-moves.md)).
- [ ] Unit tests cover all four cases.
