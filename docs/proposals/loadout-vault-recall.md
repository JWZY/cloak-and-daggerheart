## User story

**As a leveling spellcaster, I'd like to keep most of my domain cards in a Vault and bring up to 5 into my Loadout, so the SRD's loadout cap and Recall Cost actually constrain my choices.**

## Problem

[`types/character.ts`](../../src/types/character.ts) has `domainCards: DomainCard[]` — a flat array. SRD requires:

- **Loadout** (active in play): cap of 5 cards.
- **Vault** (inactive): unlimited.
- Subclass, ancestry, and community cards do **not** count toward the loadout.
- **Recall Cost** (lightning bolt, top-right of each card): mark this many Stress to swap a card from vault to loadout outside of a rest.
- At rest start, free swap.

At level 1 you have 2 cards, so the cap is invisible. From level 2 onward this is broken.

## Source

- SRD v1.0 — Loadout & Vault, Domain Cards: https://daggerheartsrd.com/rules/

## Suggestion

```ts
interface Character {
  // remove: domainCards: DomainCard[]
  loadout: DomainCard[]   // max 5
  vault: DomainCard[]     // unlimited
  // subclass/ancestry/community cards live elsewhere; not in either list
}

interface DomainCard {
  // ...
  recallCost: number   // parsed from existing card data
}
```

Store actions:
- `moveToLoadout(id, cardName, opts: { atRest: boolean })` — if `atRest`, free; else, mark `recallCost` Stress.
- `moveToVault(id, cardName)` — always free.
- Reject `moveToLoadout` if it would exceed 5.

UI:
- Hand view shows the **Loadout**.
- Add a "Vault" tab/sheet with a "Move to Loadout" action per card.
- During swap, show stress cost preview (or "Free during rest").

Migration: existing `domainCards` → all into `loadout`, trimmed to 5. Excess goes to `vault`.

## Acceptance

- [ ] `loadout` and `vault` exist; migration covers existing characters.
- [ ] Loadout enforces cap of 5.
- [ ] Outside of rest, swapping marks the card's `recallCost` in Stress.
- [ ] At rest, swapping is free (coordinate with [proposal: rest-moves](./rest-moves.md)).
- [ ] Vault UI is reachable from the hand view.
