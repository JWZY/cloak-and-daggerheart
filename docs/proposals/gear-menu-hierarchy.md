## User story

**As a player mid-session, I'd like the actions I do *during* play (like rests) to be one tap away, separate from the actions I do *outside* play (like edit/delete), so the bottom bar reflects what's happening at the table.**

## Problem

The bottom-bar gear menu in [`hand/HandView.tsx`](../../src/hand/HandView.tsx) currently lists, in order:

1. Short Rest
2. Long Rest
3. Level Up
4. Edit Character
5. Delete Character (red)

These have different lifecycle frequencies and different reversibility profiles. Mixing them is a real UX problem. **But the original draft of this proposal bundled three independent design changes, two of which had blocking dependencies, and proposed a layout that won't fit on a 375px viewport.**

This rewrite splits the work and fixes the math.

## Scope: split into three PRs

The original draft conflated:

- **A. Bottom-bar layout reshuffle** (this PR)
- **B. Settings drawer** (separate)
- **C. Level-up readiness state** (separate)

Each has different prerequisites and different review surfaces. Bundling them forces the reviewer to argue with three propositions on one surface.

**This PR is now A only.** B and C are tracked as follow-up proposals (filed when this merges).

## Decision A: where do rests live?

### Hard constraint

The bottom bar must fit on iPhone SE (375px). Quick math at the existing `padding: '0 16px'` per pill in `HandView.tsx`:

| Element | Approx px |
|---|---|
| Back | 80 |
| Short Rest | 110 |
| Long Rest | 100 |
| Cards/Actions tabs | 140 |
| Menu (⋯) | 80 |
| Gaps × 4 @ 8px | 32 |
| **Total** | **~542** |

That's 167px over the budget. **The original draft layout doesn't fit.**

### Options considered

| Option | Approach | Notes |
|---|---|---|
| **A1. Original draft** | `[Back] [Short Rest] [Long Rest] [Tabs] [⋯]` | Doesn't fit on iPhone SE. **Reject.** |
| **A2. Drop Back, header arrow** | Back moves to a top-left header. Bar = `[Short Rest] [Long Rest] [Tabs] [⋯]`. | ~462px. Still tight on SE. Header arrow steals vertical space. |
| **A3. Icon-only rests** | Replace text with moon/spark icons. | Saves space but kills discoverability. Users will guess wrong. |
| **A4. Rests inside Actions tab** | Bottom bar stays `[Back] [Tabs] [⋯]`. The currently-empty Actions tab becomes a rest sheet + (eventually) the dice roller. | Fits on SE. Treats rests as actions, which they are. Solves "Actions panel coming soon" stub at the same time. |
| **A5. Rests on the gear menu, but reorder** | Keep current `[Back] [Tabs] [⋯]`. Reorder gear menu so rests are top, with a separator between play actions and admin actions. | Cheapest. No layout regression. Doesn't fix discoverability. |

**Recommendation: A4.** Three reasons:

1. It fits.
2. It uses the existing tab structure: `Cards` for the loadout, `Actions` for verbs (rests now, dice rolls later via PR #9). The taxonomy is *category*-based, not frequency-based.
3. It eliminates the "Actions panel coming soon" stub by giving it real content.

Counter-argument worth naming: the Demiplane critique cited in the original draft ("Demiplane gets dinged for hiding Level Up") doesn't apply to rests. Rests being one tap deeper than the bottom bar is fine; rests being *unfindable* is not. Inside the Actions tab, with a labeled section header, is findable.

## Decision B: implementation dependency on PR #15

`Short Rest` and `Long Rest` are stubs today (`HandView.tsx` GearMenu items: `action: () => {}`).

### Options considered

| Option | Approach |
|---|---|
| **B1. Ship reshuffle, keep stubs** | Move rests into the Actions tab. They still do nothing. Worse than today (more visible, still broken). | Reject. |
| **B2. Block this PR on PR #15** | Wait until rest implementation lands, then merge this. | Clean. Slow. |
| **B3. Bundle this PR with PR #15** | Single PR adds rest implementation + new placement. | Reviewers love smaller PRs, not larger ones. |
| **B4. Sequence**: this PR ships layout in a hidden-by-default state; PR #15 wires + reveals. | Adds a feature flag for one release. | Cheap. Lets layout review happen separately from rules review. |

**Recommendation: B2.** Block the *implementation* PR on #15 (or merge them in the same week). The proposal itself can merge now (it's a spec). The implementation PR for layout depends on the implementation PR for rest moves.

## Decision C: gear menu (the ⋯ button)

With rests promoted into Actions, what's left in `⋯`?

- Level Up
- Edit Character
- Delete Character

**Recommendation:** keep the ⋯ as the existing Framer-Motion popover (not a Vaul drawer). Three reasons:

1. The popover pattern is already the language of the app. Introducing Vaul for one menu adds a dependency surface.
2. Three items don't justify a drawer.
3. Vaul is mobile-shaped; on desktop, the popover is the right form factor.

A future Settings drawer (PR B) is a different surface for things like PWA install / theme / audio. The ⋯ menu remains a *lifecycle* menu (level-up, edit, delete).

The original draft's proposed Settings drawer is removed from this PR's scope.

## Decision D: hold-to-delete safety

Delete already has a 1.5s hold-to-confirm gate (`HandView.tsx` `HOLD_DURATION_MS = 1500`). Moving it inside any menu adds one tap before the safety gate.

**Recommendation:** keep Delete in the ⋯ menu, after a separator, in red. The "frequency hierarchy" argument doesn't need to be airtight; the *reversibility hierarchy* does, and Delete is uniquely irreversible. Keep it visually separate, behind both a menu and a hold-gate. That's enough.

## Frequency reasoning, corrected

The original draft cited a frequency table ("Edit: rare; Delete: once ever") as the basis for hierarchy. That's vibes, not data. **Reframe: the hierarchy is about *reversibility* and *lifecycle stage*, not frequency.**

| Action | Reversibility | Lifecycle stage |
|---|---|---|
| Short Rest | Manually reversible | During session |
| Long Rest | Manually reversible | During session |
| Level Up | Manually reversible (annoying) | Between sessions |
| Edit Character | Reversible | Any time |
| Delete Character | **Irreversible** | Once |

Bottom-bar Actions tab: during-session verbs.
`⋯` menu: between-session and lifecycle actions.

This holds even on session 1 when "Edit Character" gets touched constantly: Edit is manually reversible (just edit again), so its frequency doesn't change its category.

## Suggested implementation

1. Move `Short Rest` and `Long Rest` out of `GearMenu`.
2. Replace `<p>Actions panel coming soon</p>` in the Actions tab with a layout containing two sections: "Rests" (with the two rest entries) and "Rolls" (placeholder for PR #9).
3. `GearMenu` is now `[Level Up] [Edit Character] -- [Delete Character]`.
4. Bottom bar layout unchanged from today (`[Back] [Tabs] [⋯]`).

## Acceptance

- [ ] Bottom bar is unchanged: `[Back] [Cards · Actions] [⋯]`. Verified to fit at 375px width.
- [ ] Actions tab renders a "Rests" section with Short Rest and Long Rest entries.
- [ ] `GearMenu` no longer contains rest entries.
- [ ] `GearMenu` order: Level Up, Edit Character, separator, Delete Character (red, hold-to-delete preserved).
- [ ] `<p>Actions panel coming soon</p>` placeholder is gone.
- [ ] Rest entry actions blocked on PR #15 implementation; spec for that PR exists.
- [ ] No new dependencies introduced (no Vaul Settings drawer in this PR).

## Out of scope

- **Settings drawer.** Separate proposal PR will be filed (with an actual list of settings, not "PWA install, audio toggle…" hand-waving).
- **Level-up readiness banner.** Depends on a data model for "pending advancement" that doesn't exist. Separate proposal.
- **Bottom-bar redesign for desktop.** Desktop already has different layout via `DesktopLayout.tsx` (17.5 KB); this PR only addresses the mobile/tablet bar.
