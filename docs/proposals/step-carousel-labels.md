## User story

**As a new player midway through character creation, I'd like to see clear step labels in the carousel and a sensible desktop layout, so I can skim where I am in the wizard.**

## Reality check

[`src/deck-builder/components/StepCarousel.tsx`](../../src/deck-builder/components/StepCarousel.tsx) **already defines and renders** `STEP_NAMES`:

```ts
const STEP_NAMES = ['Class', 'Subclass', 'Domains', 'Ancestry', 'Community', 'Equipment', 'Traits', 'Experiences', 'Name']
```

Tap-to-jump and `maxReachableStep` enforcement also exist. The original draft of this proposal claimed neither. This rewrite is around the actual delta.

## What's actually missing

| Concern | Status |
|---|---|
| Step labels | **Done.** |
| Tap-to-jump | **Done.** |
| Mobile compact pill (current expanded, others compact) | **Verify** in current code; refine if needed. |
| Desktop horizontal vs vertical layout | **Open.** Currently horizontal. |
| Accessibility (`aria-current`, `<nav aria-label>`) | **Missing.** |
| 10-step layout (when PR #14 adds Connections) | **Verify viewport fit.** |

## Step labels are final

User intent: keep `Domains` (SRD term) and `Ancestry` (correct given the wizard's separate Ancestry/Community steps). No renames.

`STEP_NAMES` stays as:

```ts
['Class', 'Subclass', 'Domains', 'Ancestry', 'Community', 'Equipment', 'Traits', 'Experiences', 'Name']
```

Plus, when PR #14 lands, "Connections" inserts between Experiences and Name (10 steps total).

## Decision A: desktop layout

| Option | Layout | Tradeoffs |
|---|---|---|
| **A1. Keep horizontal** | Same as mobile, scaled up. | No structural change. May feel cramped. |
| **A2. Two-column with vertical rail** | Rail on left, step content on right. | More dashboard-like. Significant layout work; next-button placement needs decision. |
| **A3. Horizontal + persistent labels** | All step labels visible at once on desktop, no pill compaction. | Minimal change; gets 80% of the win. |

**Recommendation: A3 for this PR.** A2 is appealing but real surgery (next-button anchoring, animation regression, two render structures). A3 is shippable today.

If A2 is desired later, file a separate proposal with an ASCII sketch of the two-column layout.

## Decision B: mobile compact pill

Current behavior: needs verification. Proposed: current pill expanded with full label, others compact.

| Option | Approach |
|---|---|
| **B1. Dot-only** | All non-current steps render as a small dot. |
| **B2. Icon + dot** | Each step has an icon. Non-current renders icon-only. | Requires icon set design effort. |
| **B3. Tiny letter abbreviation** | "Cls", "Sub", "Crd" ... | Cluttered. |

**Recommendation: B1.** Icons require designed-set effort not justified for first-pass. Dots + the current label is sufficient.

If icons are wanted later, file a separate proposal with the icon set.

## Decision C: accessibility

Missing today.

**Recommendation in this PR (minimum):**

- `<nav aria-label="Wizard steps">` wraps the carousel.
- Current pill: `aria-current="step"`.
- Reachable but not current: regular `<button>`.
- Unreachable: `aria-disabled="true"`.

## Decision D: animation regression test

A3 changes the desktop render path (from compact to persistent labels). Mobile is unchanged.

**Recommendation:** explicit acceptance test on **both** desktop and mobile to confirm slide-in animations on the step content area still play correctly. Cheap to verify; expensive to discover post-merge.

## Decision E: `maxReachableStep` migration

`currentStep` is stored as a number in `deck-store`. Step layout changes don't affect stored state.

**Recommendation: no migration needed.**

## Decision F: 10-step layout (PR #14 adds Connections)

When PR #14 lands, the carousel grows to 10 steps. Math: ~244px on a 375px viewport with 9 dots + 1 expanded pill. Fits.

**Recommendation:** state explicit forward-compatibility. PR #14's spec includes a viewport check at 10 pills.

## Acceptance

- [ ] **Audit the existing `StepCarousel`** before implementation; document what's already in place vs delta.
- [ ] `STEP_NAMES` unchanged: `['Class', 'Subclass', 'Domains', 'Ancestry', 'Community', 'Equipment', 'Traits', 'Experiences', 'Name']`. (PR #14 will add "Connections" between Experiences and Name.)
- [ ] Desktop: persistent labels for all reachable steps (A3 layout).
- [ ] Mobile: current pill expanded with label, others render as dot.
- [ ] `<nav aria-label="Wizard steps">` wrapper.
- [ ] `aria-current="step"` on current pill.
- [ ] `aria-disabled` on unreachable steps.
- [ ] Slide-in animation on step content area: verified on both desktop and mobile, no regression.
- [ ] `maxReachableStep` jump-to-step behavior preserved.
- [ ] Verified at 10 steps on 375px viewport (forward-compat with PR #14).

## Out of scope

- Two-column desktop layout with vertical rail (separate proposal).
- Per-step icons (separate proposal with icon set).
- Animated step transitions on the carousel itself.
- Saving wizard progress / draft characters across sessions.
- Step renames. `Domains` and `Ancestry` are intentional.
