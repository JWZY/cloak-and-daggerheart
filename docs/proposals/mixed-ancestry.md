## User story

**As a player making a half-elf or any mixed-ancestry character, I'd like to pick the top feature of one ancestry and the bottom feature of another, with the picks preserved across edits, so the SRD's Mixed Ancestry option is fully supported.**

## Problem

[`deck-builder/steps/PickAncestry.tsx`](../../src/deck-builder/steps/PickAncestry.tsx) supports a single-ancestry pick only. SRD allows Mixed Ancestry: take the **first-listed** feature from one ancestry and the **second-listed** feature from another. Order matters.

## Decision A: keep the selection as data on `Character`

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Synthesize `ancestry: Ancestry` and discard the picks** | Original. `{ name: 'Mixed (Elf / Human)', feats: [elfFirst, humanSecond] }`. | Lossy. Edit-flow can't reproduce picks. |
| **A2. Persist `ancestrySelection: AncestrySelection` on `Character`** | Discriminated union. `ancestry: Ancestry` becomes a derived view from the selection. | Round-trip preserved. Edit flow re-loads. |

**Recommendation: A2.**

```ts
type AncestrySelection =
  | { kind: 'single'; name: string }
  | { kind: 'mixed'; topFromName: string; topFeatName: string; bottomFromName: string; bottomFeatName: string }

interface Character {
  // ...
  ancestrySelection: AncestrySelection
  ancestry: Ancestry  // derived; could be removed if every consumer goes through selection
}
```

## Decision B: pin feats by name, not array index

SRD ancestry data lists 2 features in order. Indexing by position breaks if the JSON ever re-sorts.

**Recommendation: pin by feat name** (`topFeatName`, `bottomFeatName`). Validate at assemble time: the named feat must exist on the named ancestry, in the expected slot.

## Decision C: description text for mixed

Original draft used `description: '...'` literal placeholder.

### Options considered

| Option | Content |
|---|---|
| **C1. Empty string** | Leaves the field unhelpful. |
| **C2. Static blurb** | "Mixed ancestry — combining {top} and {bottom}." |
| **C3. Concatenation of both** | Long. |
| **C4. SRD's mixed-ancestry guidance** | "Your character has a heritage drawn from two ancestries. Consult both for narrative inspiration." | Most useful for new players. |

**Recommendation: C4.** One-line static copy; references both names.

## Decision D: same-ancestry rejection

Player picks Elf top + Elf bottom. That's just being Elf with extra steps.

### Options considered

| Option | Approach |
|---|---|
| **D1. Reject in validation** | Step's "Next" disabled with a hint: "Pick two different ancestries." |
| **D2. Coerce to single** | Auto-flip kind to 'single'. | Surprising. |
| **D3. Allow** | Just collapses to single Elf. | Wastes a step. |

**Recommendation: D1.**

## Decision E: ancestry feature interactions (Faerie / Galapa style)

Some ancestries have features that reference each other. Mixing breaks those.

### Options considered

| Option | Approach |
|---|---|
| **E1. Document; surface a small inline warning when applicable** | "Mixing breaks Faerie's wing-related synergies — proceed?" | Honest. Per-ancestry knowledge required. |
| **E2. Block specific combos** | Curated reject list. | Overreach; SRD permits any mix. |

**Recommendation: E1.** Warning is per-feature; tag features in the SRD data with `requiresPair: boolean` (or similar) and surface a one-liner on the picker. ~30 minutes of tagging.

## Decision F: layout — two pickers in one step or sub-steps

On 375px viewport, two stacked ancestry pickers is a lot of scroll.

### Options considered

| Option | Approach |
|---|---|
| **F1. Both pickers stacked on one screen** | Single step. Long scroll on mobile. |
| **F2. Two sub-screens** | When Mixed toggled, the step splits into two carousel screens: "Mixed: top feature" and "Mixed: bottom feature." Reuses StepCarousel idiom. |
| **F3. Modal expansion** | Mixed toggle opens a separate modal. | Breaks step flow. |

**Recommendation: F2.** Matches existing wizard idiom.

## Acceptance

- [ ] `AncestrySelection` discriminated union exists; persisted on `Character`.
- [ ] `assembleCharacter` derives `ancestry: Ancestry` from `ancestrySelection`.
- [ ] Single-ancestry path produces both feats (regression test).
- [ ] Mixed path produces exactly two feats: top of A, bottom of B, pinned by name.
- [ ] Same-ancestry mixed: validation rejects with "Pick two different ancestries."
- [ ] Mixed description renders C4 copy with both names interpolated.
- [ ] Mixed step splits into two carousel sub-screens on mobile.
- [ ] Pair-warning surfaces on ancestries flagged `requiresPair`.
- [ ] Edit flow (PR #18 — current scope: layout-only; future edit semantics) re-loads the original picks from `ancestrySelection`.
- [ ] Migration: existing single-ancestry characters get `ancestrySelection: { kind: 'single', name: c.ancestry.name }`.

## Out of scope

- Multi-mix (3+ ancestries). SRD permits two only.
- Custom ancestry creation.
