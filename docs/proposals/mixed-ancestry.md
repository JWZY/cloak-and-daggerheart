## User story

**As a player making a half-elf or any mixed-ancestry character, I'd like to pick the top feature of one ancestry and the bottom feature of another, so I'm using the SRD's Mixed Ancestry option as written.**

## Problem

[`deck-builder/steps/PickAncestry.tsx`](../../src/deck-builder/steps/PickAncestry.tsx) appears to support a single-ancestry pick only. SRD allows a Mixed Ancestry option: take the **first-listed** feature from one ancestry and the **second-listed** feature from another. This is not freeform; the order matters.

## Source

- SRD v1.0 — Heritage / Mixed Ancestry: https://daggerheartsrd.com/rules/character-creation/

## Suggestion

In the Ancestry step, add a "Mixed" toggle. When on:

1. Show two ancestry pickers labeled "Top feature ancestry" and "Bottom feature ancestry."
2. Each picker reveals only that ancestry's relevant feature (first or second).
3. Persist as:

```ts
type AncestrySelection =
  | { kind: 'single'; name: string }
  | { kind: 'mixed'; topFromName: string; bottomFromName: string }
```

4. `assembleCharacter` builds the resulting `Character.ancestry` with:

```ts
ancestry: {
  name: `Mixed (${top.name} / ${bottom.name})`,
  description: '...',
  feats: [top.feats[0], bottom.feats[1]],
}
```

## Acceptance

- [ ] Mixed toggle in the ancestry step.
- [ ] Two pickers; each shows only the relevant feature.
- [ ] Resulting character carries exactly two ancestry feats (top of one + bottom of another).
- [ ] Review screen labels the ancestry as "Mixed (X / Y)".
- [ ] Unit test on `assembleCharacter` for the mixed case.
