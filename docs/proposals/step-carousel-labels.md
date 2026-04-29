## User story

**As a new player midway through character creation, I'd like to see clear step labels in the carousel and a sensible desktop layout, so I can skim where I am in the wizard.**

## Reality check

[`src/deck-builder/components/StepCarousel.tsx`](../../src/deck-builder/components/StepCarousel.tsx) **already defines and renders** `STEP_NAMES`:

```ts
const STEP_NAMES = ['Class', 'Subclass', 'Domains', 'Ancestry', 'Community', 'Equipment', 'Traits', 'Experiences', 'Name']
```

Tap-to-jump and `maxReachableStep` enforcement also exist. Original draft claimed neither. Rewriting the spec around the actual delta.

## What's actually missing

| Concern | Status |
|---|---|
| Step labels | **Done.** |
| Tap-to-jump | **Done.** |
| Mobile compact pill (current expanded, others compact) | **Verify** — possibly already done in present code; review needed. |
| Desktop horizontal vs vertical layout | **Open.** Currently horizontal. |
| Renames (Domains → Cards? Ancestry → Heritage?) | **Open. Needs user input.** |
| Accessibility (`aria-current`, `<nav aria-label>`) | **Missing.** |
| Step icons | **Missing or partial — verify.** |
| 10-step layout (when PR #14 adds Connections) | **Verify viewport fit.** |

## Decision A: which renames

### Options considered

| Step | Current label | Proposed | Argument |
|---|---|---|---|
| 3 | Domains | Cards | "Cards" is more user-facing. Loses SRD-fidelity word "Domain." |
| 4 | Ancestry | Heritage | SRD uses "Ancestry"; "Heritage" is the broader concept (Ancestry + Community + Heritage Bonus). Since Ancestry and Community are *separate* steps in this wizard, "Heritage" is misleading. Keep "Ancestry." |

**Recommendation:**

- Domains → **Cards.** Player-friendly; the step picks domain *cards*, not domains.
- Ancestry → **Keep "Ancestry."** Misleading otherwise.

This is a UX-vocabulary call; **flag for user confirmation before merge.**

## Decision B: desktop layout

### Options considered

| Option | Layout | Tradeoffs |
|---|---|---|
| **B1. Keep horizontal** | Same as mobile, scaled up. | No structural change. May feel cramped. |
| **B2. Two-column with vertical rail** | Rail on left, step content on right. | More dashboard-like. Significant layout work; next-button placement needs decision. |
| **B3. Horizontal + persistent labels (no compact)** | All step labels visible at once on desktop, no pill compaction. | Minimal change; may be enough. |

**Recommendation: B3 for this PR.** B2 is appealing but real layout surgery (next-button anchoring, animation regression, two render structures). B3 gets 80% of the win for 20% of the cost.

If B2 is desired later, file a separate proposal with an ASCII sketch of the two-column layout.

## Decision C: mobile compact pill

Current behavior: needs verification. Proposed: current pill expanded with full label, others compact.

### Options considered for "compact"

| Option | Approach |
|---|---|
| **C1. Dot-only** | All non-current steps render as a small dot. |
| **C2. Icon + dot** | Each step has an icon. Non-current renders icon-only. | Requires icon set. |
| **C3. Tiny letter abbreviation** | "Cls", "Sub", "Crd" ... | Cluttered. |

**Recommendation: C1.** Icons would need a designed set per step (Class → ⚔, Cards → 🃏, etc.); design effort not justified for first-pass. Dots + the current label is sufficient.

If icons are wanted later, file a separate proposal with the icon set.

## Decision D: accessibility

Missing today.

**Recommendation in this PR (minimum):**

- `<nav aria-label="Wizard steps">` wraps the carousel.
- Current pill: `aria-current="step"`.
- Reachable but not current: regular `<button>`.
- Unreachable: `aria-disabled="true"`.

## Decision E: animation regression

Existing slide animation runs in the step content area. Layout changes may break it.

**Recommendation: keep slide animations in main content area.** B3 doesn't change structure, so no regression risk. State explicitly in acceptance.

## Decision F: `maxReachableStep` migration

`currentStep` is stored as a number in deck-store. Renaming a label has no effect on stored state.

**Recommendation: no migration needed.** State that explicitly.

## Decision G: 10-step layout (PR #14 adds Connections)

When PR #14 lands, the carousel grows to 10 steps. Reviewer math: ~244px on a 375px viewport with 9 dots + 1 expanded pill. Fits.

State explicitly: this PR is forward-compatible with PR #14's added step. PR #14's spec includes a viewport check at 10 pills.

## Acceptance

- [ ] **Audit the existing StepCarousel** before implementation; document what's already in place vs delta.
- [ ] Step rename: Domains → Cards. Confirmed with user.
- [ ] Step rename: Ancestry stays Ancestry. Confirmed with user.
- [ ] Desktop: persistent labels for all reachable steps (B3).
- [ ] Mobile: current pill expanded with label, others render as dot.
- [ ] `<nav aria-label="Wizard steps">` wrapper.
- [ ] `aria-current="step"` on current pill.
- [ ] `aria-disabled` on unreachable steps.
- [ ] Slide-in animation preserved in step content area (no regression).
- [ ] `maxReachableStep` jump-to-step behavior preserved.
- [ ] Verified at 10 steps on 375px viewport (forward-compat with PR #14).

## Out of scope

- Two-column desktop layout with vertical rail (separate proposal).
- Per-step icons (separate proposal with icon set).
- Animated step transitions on the carousel itself.
- Saving wizard progress / draft characters across sessions.

## Unknown — flag for user

Confirm the rename direction before merge: **Domains → Cards (yes), Ancestry → Heritage (no).** If user disagrees, update the spec.
