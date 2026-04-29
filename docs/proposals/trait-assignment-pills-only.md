## User story

**As a new player assigning my starting traits, I'd like one obvious way to do it that matches the SRD's mental model (here are six numbers, place them in slots), so I'm not guessing what a +/- stepper does in a context where the values aren't actually free.**

## Problem

[`deck-builder/steps/AssignTraits.tsx`](../../src/deck-builder/steps/AssignTraits.tsx) ships three variants behind a dev toggle: Pills, Stepper, Cycle. They all produce legal trait values; the difference is *affordance*, not rules.

The conclusion: keep one. The argument: **Pills matches the SRD's mental model best, and the others have specific affordance costs.**

## Mental-model framing

SRD Step 3, verbatim:

> Assign the array +2, +1, +1, 0, 0, -1 to your six traits in any order.

This is a **place-six-fixed-values-into-six-slots** problem. Pills is the only variant whose UI shape matches the SRD's verb.

## Decision A: which to ship

| Variant | Mental-model match | A11y posture | Discoverability | Notes |
|---|---|---|---|---|
| **Pills** | Strong (place-fixed-values) | Weak today: 2-tap interaction with no announced relationship. `role="button"` only. | Medium: pill row at top is unusual. | Recommended. |
| **Stepper** | Wrong: implies "increment within a budget." | Strong: `role="spinbutton"`. | High: + and - are universal. | Rejected for creation. |
| **Cycle** | Wrong: hides the value list behind a hidden state. | Weak. No live region announces the current value. | Low: tapping a row mutates it in non-obvious order. | Rejected. |

**Recommendation: Pills.** Caveat: today's Pills implementation has a real a11y deficit. Shipping Pills-only without addressing it is a regression vs Stepper for screen-reader users (Stepper at least has labeled `+`/`-`). **Don't merge Pills-only without addressing accessibility (Decision B).**

## Decision B: accessibility — relationship via ARIA, not just live region

Round-2 draft proposed a single `aria-live="polite"` region updated on every assignment. **That won't work the way the spec implied.** Most screen readers (VoiceOver, NVDA, JAWS) debounce live-region updates. Rapid changes (tap pill → tap slot → tap pill → tap slot, six times in 10 seconds) produce queued or stomped announcements. Middle changes get dropped.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **B1. Single `aria-live="polite"`** | Original draft. | Stomps. Fails on rapid input. |
| **B2. `aria-controls`/`aria-owns` for the relationship + reserved `aria-live` for confirmation feedback** | Pills declare `aria-controls="trait-strength trait-finesse ..."` to indicate they affect the slot list. Slot `<button>` has `aria-label="Strength: +2. Tap to remove."`. `aria-live` is reserved for terse confirmation (e.g. "All assigned" or "3 remaining: +1, 0, 0"), debounced. | Structural relationship is communicated via static ARIA. Live region only fires on meaningful state transitions. |
| **B3. `aria-live="assertive"` with `requestAnimationFrame` debounce** | Forces every announcement; debounce ensures readability. | Aggressive; can interrupt ongoing user actions. |

**Recommendation: B2.** Verify with VoiceOver before claiming acceptance.

```tsx
{/* Pills row */}
<div role="group" aria-label="Trait values to assign">
  {pillValues.map(({ value, poolIndex }) => (
    <button
      key={`${value}-${poolIndex}`}
      onClick={() => handlePillTap(value, poolIndex)}
      aria-controls="trait-list"
      aria-label={`Value ${formatTraitValue(value)}. Tap to assign to next available trait.`}
    >
      {formatTraitValue(value)}
    </button>
  ))}
</div>

{/* Confirmation feedback only — debounced, terse */}
<div aria-live="polite" className="sr-only" id="assignment-status">
  {liveAnnouncement}  {/* e.g. "All values assigned." or "" */}
</div>

{/* Slot list */}
<ol id="trait-list">
  {TRAIT_NAMES.map((name) => {
    const value = assignments[name]
    return (
      <li key={name}>
        <button
          onClick={() => handleSlotTap(name)}
          aria-label={value !== null
            ? `${name}: ${formatTraitValue(value)}. Tap to remove.`
            : `${name}: unassigned.`}
        >
          {/* ... */}
        </button>
      </li>
    )
  })}
</ol>
```

Live region updates only on `allAssigned` transition or pill-row exhaustion, not on every tap.

## Decision C: clear-affordance discoverability

`handleSlotTap` clears a placed value. There's no visible affordance.

| Option | Approach |
|---|---|
| **C1. Subtle × on hover/focus** | Desktop only. |
| **C2. Always-visible × badge on assigned slots** | Visual clutter. |
| **C3. Inline hint copy + `aria-label` on assigned slots** | "Tap a value to assign. Tap an assigned trait to clear." Once, above. + `aria-label` from B2 announces the tap-to-clear behavior. |
| **C4. C2 + C3** | Belt and suspenders. |

**Recommendation: C3.** Combined with B2's `aria-label` on assigned slots, the interaction is announced for screen readers and hinted for sighted users. Reconsider C2 if user testing surfaces confusion.

## Decision D: pill-row collapse animation

When all six values are placed, the pill row has nothing to show.

### Options considered

| Option | Approach |
|---|---|
| **D1. Static placeholder** | "All values assigned ✓" sits in the pill-row spot. | No motion. |
| **D2. `AnimatePresence` collapse** | Pill row height animates to 0 when empty, springs back when a value reappears. | Polished. |
| **D3. No collapse, pills disappear individually** | Each pill exits as it's placed. Container stays. | Simplest. |

**Pick one, not both.** Round-2 draft proposed D2 *plus* hint copy "All values assigned ✓" — that's two affordances stacked. Choose:

**Recommendation: D2 + step-complete badge near the Next button.** The pill row collapses (clean), and a small "Ready to continue" indicator appears next to the wizard's Next button. The hint copy "All values assigned ✓" is *not* duplicated in the pill-row position.

## Decision E: kill switch vs hard delete

| Option | Approach |
|---|---|
| **E1. Hard delete Stepper + Cycle** | git remembers. |
| **E2. Keep behind `?traittest`** | The flag already exists. Default to Pills for everyone. |

**Recommendation: E1, but only after Decision F lands.** Ship Pills + flag preserved; deletion in a follow-up after evidence.

## Decision F: evidence before deletion

Round-2 draft's "follow-up issue filed" passed trivially the moment a GitHub issue was created. Tighten the gate.

**Recommendation:** E1 deletion is blocked until **either**:

- **(a) one user-test session is run and notes are posted in the follow-up issue**, OR
- **(b) two release cycles pass with no negative feedback on Pills.**

The (b) clause is the passive escape hatch. "Release cycle" is defined as: a tagged version on GitHub Releases, or, until releases exist, a one-week dogfooding period after the Pills-default ships. Pin in the follow-up issue.

## Removed: level-up trait advancement justification

Round-1 draft justified the deletion by referencing a different file (`level-up/LevelUpWizard.tsx`). That argument is wrong on two counts: level-up's "Increase a Trait" advancement is a *select-2* picker (not a stepper), and the file isn't being touched. Argument removed.

## Acceptance

- [ ] Pills is the default variant (no toggle UI in production).
- [ ] `?traittest` URL flag preserved for one release; defaults to Pills.
- [ ] Inline hint copy: "Tap a value to assign. Tap an assigned trait to clear."
- [ ] `aria-controls` on pills declaring relationship to `#trait-list`.
- [ ] Assigned-slot `<button>` includes `aria-label` describing the trait, value, and tap-to-clear behavior.
- [ ] `aria-live="polite"` reserved for terse confirmation (e.g. "All values assigned"), not per-tap announcement.
- [ ] **VoiceOver verification**: assign all six traits in succession; confirm announcements aren't stomped.
- [ ] Pill-row collapses with `AnimatePresence` when empty; reappears on slot clear.
- [ ] Step-complete indicator appears next to Next button when `allAssigned`.
- [ ] No duplicate "all done" affordance in the pill-row position.
- [ ] **New** unit tests added (none exist today): empty pool → tap pill → tap slot; tap assigned slot → returns value to pool; all-assigned → pool empty; clear assigned → pool reappears; tap pill twice without assigning is a no-op.
- [ ] Follow-up issue filed for: (a) Stepper/Cycle deletion gated on user test OR two release cycles, (b) one user-test session of Pills with a non-developer.

## Out of scope

- Drag-and-drop pill placement.
- Trait-row icons / illustrations.
- Level-up "Increase a Trait" picker. Separate file, separate problem, separate PR.
