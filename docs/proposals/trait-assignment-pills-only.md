## User story

**As a new player assigning my starting traits, I'd like one obvious way to do it that matches the SRD's mental model (here are six numbers, place them in slots), so I'm not guessing what a +/- stepper does in a context where the values aren't actually free.**

## Problem

[`deck-builder/steps/AssignTraits.tsx`](../../src/deck-builder/steps/AssignTraits.tsx) ships three variants behind a dev toggle: Pills, Stepper, Cycle. They all produce legal trait values; the difference is *affordance*, not rules.

The conclusion of this PR is: keep one. The argument should not be "Pills is correct" (it isn't more rules-correct than the others). The argument should be: **Pills matches the SRD's mental model best, and the others have specific affordance costs.**

## Mental-model framing

SRD Step 3, verbatim:

> Assign the array +2, +1, +1, 0, 0, -1 to your six traits in any order.

This is a **place-six-fixed-values-into-six-slots** problem. It's not:
- "increment each trait until you've spent your budget" (Stepper)
- "choose a value per trait from the universe of legal values" (Cycle)

Pills is the only variant whose UI shape matches the SRD's verb.

## Decision A: which to ship

### Options considered

| Variant | Mental-model match | A11y posture | Discoverability | Notes |
|---|---|---|---|---|
| **Pills** | Strong (place-fixed-values) | Weak today: 2-tap interaction (pick value → pick slot) with no announced relationship. `role="button"` only. | Medium: pill row at top is unusual. | Recommended. |
| **Stepper** | Wrong: implies "increment within a budget," makes traits look freely valued. | Strong: `role="spinbutton"` is the standard pattern. | High: + and - are universal. | Rejected for creation. Could be re-used at level-up if level-up traits *were* a stepper, but they aren't (see below). |
| **Cycle** | Wrong: hides the value list behind a tap-to-cycle hidden state. | Weak. No live region announces the current value. | Low: tapping a trait row mutates it in non-obvious order. | Rejected. |

**Recommendation: Pills.** Caveat: today's Pills implementation has a real a11y deficit. Shipping pills-only without addressing it is a regression vs Stepper for screen-reader users (Stepper at least has labeled `+`/`-` buttons). **Don't merge Pills-only without addressing accessibility (Decision B).**

## Decision B: accessibility minimum bar

### Options considered

| Option | Approach | Notes |
|---|---|---|
| **B1. Ship as-is** | No a11y additions. | Regresses screen-reader UX vs Stepper. **Reject.** |
| **B2. `aria-live` announcements** | When a value lands in a slot: "Strength assigned +2. Two values remaining: +1, 0." Use a single `aria-live="polite"` region updated on assignment. | Cheap. Restores parity. |
| **B3. Drag-and-drop with full a11y** | HTML5 drag for mouse, keyboard handlers for arrow-key swap, full `role="application"` semantics. | Better long-term. ~3× the effort. Probably overkill for a 6-row form. |

**Recommendation: B2.** Cheap, restores parity, doesn't require restructuring the interaction.

```tsx
<span aria-live="polite" className="sr-only">{liveAnnouncement}</span>
```

Plus: assigned slots get a `<button aria-label="Strength: +2. Tap to remove.">` so the existing tap-to-clear behavior is announced.

## Decision C: clear-affordance discoverability

`handleSlotTap` clears a placed value. There is no visible affordance. Power users learn it; first-time wizards bounce.

### Options considered

| Option | Approach |
|---|---|
| **C1. Subtle × on hover/focus** | Desktop only. Mobile users still don't see it. |
| **C2. Always-visible × badge on assigned slots** | Adds visual clutter to a clean step. |
| **C3. Inline hint copy** | "Tap a value to assign. Tap an assigned trait to clear." Once, above the pill row. | Cheap. Solves it. |
| **C4. C2 + C3** | Belt and suspenders. |

**Recommendation: C3.** The interaction is simple enough that one line of hint text covers it. Reconsider C2 if user testing shows confusion.

## Decision D: pill-row collapse animation

When all six values are placed, the pill row has nothing to show. When a slot is cleared, a value reappears.

### Options considered

| Option | Approach |
|---|---|
| **D1. Static placeholder** | "All values assigned ✓" stays in the pill-row spot. | No motion. Keeps layout stable. |
| **D2. `AnimatePresence` collapse** | Pill row height animates to 0 when empty, springs back when a value reappears. | Polished. Costs ~10 lines. |
| **D3. No collapse, pills disappear individually** | Each pill exits as it's placed. The container stays. | Simplest. Pill row sits empty. |

**Recommendation: D2.** Matches the rest of the app's spring-physics aesthetic and gives a satisfying confirmation when the step completes.

## Decision E: kill switch vs hard delete

### Options considered

| Option | Approach |
|---|---|
| **E1. Hard delete Stepper + Cycle** | git remembers. | Cleaner code health. No way to A/B test in 6 months without re-implementing. |
| **E2. Keep behind `?traittest`** | The flag already exists at line 384. Default to Pills for everyone. | A/B-revisitable later. Costs ~80 lines of dead-ish code. |

**Recommendation: E1, but only after Decision F lands.** Once we have user-testing evidence, code-health wins. Without that evidence, leaving the flag for one release cycle costs nothing.

**Concrete plan:** ship this PR with Pills as default and the flag preserved. After one release with telemetry-or-feedback (Decision F), file a follow-up to delete.

## Decision F: evidence before deletion

A 30-min user test with one person who has never seen this app. Note where they hesitate, what they say, what they tap by mistake. One user is more data than zero.

**Recommendation:** mark this PR's acceptance as "Pills is default; Stepper/Cycle are flag-gated; deletion happens in a follow-up after one user test or one release of dogfooding."

This addresses the "junior-eng confidence ahead of evidence" pattern: the conclusion stays the same, the path to it is justifiable.

## Bonus: level-up trait advancement

PR notes claim "Stepper might be useful at level-up time." That's wrong on two counts:

1. The level-up "Increase a Trait" advancement is *select 2 of 6 unmarked traits to gain +1*. That's a select-2 picker, not a stepper.
2. Level-up lives in [`level-up/LevelUpWizard.tsx`](../../src/level-up/LevelUpWizard.tsx) (32 KB). It's a separate file with its own picker problems. Don't justify deletions in *this* file by referencing a file we aren't touching.

This argument is removed from the spec.

## Acceptance

- [ ] Pills is the default variant (no toggle UI in production).
- [ ] `?traittest` URL flag preserved for one release; defaults to Pills.
- [ ] Inline hint copy: "Tap a value to assign. Tap an assigned trait to clear."
- [ ] `aria-live="polite"` region announces assignments and remaining pool.
- [ ] Assigned-slot `<button>` includes `aria-label` describing tap-to-clear.
- [ ] Pill-row collapses with `AnimatePresence` when empty; reappears on clear.
- [ ] **New** unit tests added (none exist today): empty pool → tap pill → tap slot; tap assigned slot → returns value to pool; all-assigned → pool empty; clear assigned → pool reappears.
- [ ] Follow-up issue filed for: (a) Stepper/Cycle deletion after dogfooding, (b) one user test of Pills with a non-developer.

## Out of scope

- Drag-and-drop pill placement.
- Trait-row icons / illustrations beyond what's in the design system.
- Level-up "Increase a Trait" picker. Separate file, separate problem, separate PR.
