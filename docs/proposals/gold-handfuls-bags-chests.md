## User story

**As a player tracking my hoard, I'd like to use the SRD's Handfuls/Bags/Chests slot system, so my sheet matches the printable character sheet and the GM's expectations.**

## Problem

`Character.gold: number`. Single integer. The SRD uses three slot types with 10:1 rollover (10 handfuls → 1 bag, 10 bags → 1 chest, max 1 chest). There's also an optional Coins slot below handfuls (10 coins = 1 handful).

## Source

- SRD v1.0 — Gold (in the Equipment section): https://daggerheartsrd.com/rules/

## Suggestion

```ts
interface Gold {
  handfuls: number   // 0–9 (10th rolls into bags)
  bags: number       // 0–9
  chests: number     // 0 or 1
  coins?: number     // optional rule, 0–9
}
```

Store actions:

- `addHandfuls(id, n)` — increments and rolls over upward.
- `spendHandfuls(id, n)` — decrements with borrow from bags/chests; returns `false` if insufficient.
- Keep base-10 throughout; never store as a single integer.

UI: replace the GoldPanel input with three (or four) pip rows mirroring the printable sheet. Tap to fill, long-press to clear a row.

Migration: existing `gold: number` becomes `{ handfuls: gold % 10, bags: Math.floor(gold/10) % 10, chests: Math.min(1, Math.floor(gold/100)) }`.

## Acceptance

- [ ] `Gold` type replaces the integer field; migration handles existing characters.
- [ ] Adding a 10th handful rolls into a bag.
- [ ] Spending more than current rolls down (1 bag → 10 handfuls, then minus the spend).
- [ ] Chests cap at 1.
- [ ] Optional Coins row toggleable in settings (out of scope if too noisy).
