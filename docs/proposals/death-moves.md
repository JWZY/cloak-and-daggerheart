## User story

**As a player whose last HP slot just got marked, I'd like the sheet to surface the three Death moves so I can pick one immediately, so the table doesn't pause while I look up the rules.**

## Problem

When the last HP slot is marked, the sheet should offer Blaze of Glory, Avoid Death, Risk It All. None implemented.

This is the highest-stakes UI in the app. The state machine has gaps the original draft glossed over.

## Decision A: trigger as derivation, not effect

A useEffect-style trigger ("when HP fills, open modal") is fragile across reloads.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. `useEffect` on HP transition** | Watches prior HP, opens modal on transition full. | Lost across crashes, reloads. |
| **A2. Derivation `shouldShowDeathModal(c)`** | `hp.current === hp.max && deathState === 'alive' && !pendingDeath` | Survives reload. Re-renders correctly. **Right shape.** |

**Recommendation: A2.** The modal is a *view* of state, not a side effect.

```ts
function shouldShowDeathModal(c: Character): boolean {
  return c.hp.current >= c.hp.max && c.deathState === 'alive' && !c.pendingDeath
}
```

When player picks a move, set `pendingDeath` (or transition `deathState`) and the derivation goes false.

## Decision B: `deathState` vs `'unconscious'` condition

PR #2 introduces `'Vulnerable'` as a typed condition. SRD also has `'Unconscious'`. Don't model the same state in two places.

### Options considered

| Option | Where Unconscious lives |
|---|---|
| **B1. `deathState` owns the death-flow lifecycle. Conditions own status effects. Avoid Death pushes `'Unconscious'` onto conditions AND sets `deathState='pendingAvoid'`.** | Two layers, each pulling its weight. Conditions list shows the visible effect; `deathState` drives the modal logic. |
| **B2. `deathState` subsumes `Unconscious`** | Removes 'Unconscious' from the conditions enum. | Cleaner type but loses parallelism with Hidden/Restrained/Vulnerable. |

**Recommendation: B1.** Conditions are temporary stat modifiers. `deathState` is the death-flow lifecycle. Avoid Death sets both:

```ts
// Avoid Death
character.deathState = 'pendingAvoid'
character.conditions.push({ name: 'Unconscious', source: 'death', appliedAt: now })
```

## Decision C: `deathState` enum members

```ts
type DeathState =
  | 'alive'
  | 'pendingBlaze'      // Blaze declared; awaiting auto-crit roll resolution
  | 'pendingAvoid'      // Avoid Death; unconscious until allies revive
  | 'pendingRiskRoll'   // Risk It All declared; awaiting roll
  | 'deceased'           // dead, period
  | 'journeyEnded'       // all Hope slots scarred out (per PR #3)
```

PR #3's substrate already defines `deathState` (initial union). This PR extends it. State the merge order: PR #3 lands first, this PR widens the union.

## Decision D: Blaze of Glory

"Final action auto-crits with GM approval, then dies."

### Options considered

| Option | Implementation | Tradeoffs |
|---|---|---|
| **D1. Force the next roll to crit** | `Character.forceCritOnNextRoll: boolean`. | Two-roll coupling (action then damage). Brittle. |
| **D2. UI hint to the roller** | Banner: "Blaze of Glory active — this action automatically crits." Roller's result reads as crit regardless. | Cleaner. Player still rolls (for damage). After damage, `deathState='deceased'`. |

**Recommendation: D2.** Blaze is a UI hint to PR #9's roller. After the resolved attack, `deathState='deceased'`.

## Decision E: Avoid Death — wake-up trigger

"Player taps 'Wake up' after the GM allows."

### Options considered

| Option | Where the affordance lives |
|---|---|
| **E1. Persistent banner** | While `deathState='pendingAvoid'`, hand view shows a "Down — Wake up?" banner with a button. All other affordances disabled. |
| **E2. Modal stays open** | Doesn't dismiss until wake. | Blocks the sheet. Wrong for an off-screen wake event. |
| **E3. Affordance in a footer-tray** | Smaller, persistent. | Easy to miss. |

**Recommendation: E1.** Banner is unmissable. Sheet-disable enforced by the state machine.

When tapped: rolls `{ kind: 'hopeDie' }` via PR #9's roller. If `value <= character.level`, calls `addScar` (PR #3). Then transitions to `'alive'` (or `'journeyEnded'` if scars hit 6).

## Decision F: Risk It All split UI

"Hope > Fear: stay up, clear HP/Stress equal to Hope die (split as you like)."

### Options considered

| Option | Approach |
|---|---|
| **F1. Free-text "tell me how you split it"** | Original. Wrong. |
| **F2. Two steppers with sum constraint** | "You have 7 to clear. HP +X, Stress +Y where X+Y=7." Steppers. Confirm. | Right. |
| **F3. Slider** | Draggable HP/Stress slider with sum. | Cute. Low precision; steppers are clearer. |

**Recommendation: F2.**

## Decision G: end-of-journey UX

`deathState='journeyEnded'`: character lock-out.

### Options considered

| Option | Approach |
|---|---|
| **G1. Card-greyed home screen + sheet read-only** | Player can still view; can't mutate. | Honest. Persistent reminder. |
| **G2. Auto-delete after confirm** | Forces commit. | Destructive. |
| **G3. "Start a new chapter" prompt** | Encourages new character. Old one preserved as memorial. | Generous. Friction-free for restart. |

**Recommendation: G1 + G3.** Old character preserved (read-only); home-screen offers "Start a new chapter" CTA.

## Acceptance

Named tests in `core/character/death.ts`:

- [ ] `shouldShowDeathModal(c)` returns true on `hp.current === hp.max && deathState === 'alive' && !pendingDeath`.
- [ ] False after picking a move (any of the three).
- [ ] Blaze of Glory: state → `'pendingBlaze'`. PR #9 roller shows "Auto-crit active" banner. After damage resolves, state → `'deceased'`.
- [ ] Avoid Death: state → `'pendingAvoid'`. Conditions gain `'Unconscious'` with `source: 'death'`.
- [ ] Avoid Death wake roll ≤ level: `addScar` invoked; state → `'alive'`; Unconscious removed.
- [ ] Avoid Death wake roll > level: state → `'alive'`; no scar; Unconscious removed.
- [ ] Avoid Death + 6th scar: state → `'journeyEnded'` instead of `'alive'`.
- [ ] Risk It All Hope > Fear: split steppers UI; clear amounts equal to Hope die value; sum-constraint enforced.
- [ ] Risk It All Fear > Hope: state → `'deceased'`.
- [ ] Risk It All tie: state → `'alive'`; nothing cleared.
- [ ] Modal-once-per-event: heal below full → take damage to full again → modal reopens.
- [ ] Persistent banner during `'pendingAvoid'`; sheet mutations disabled.
- [ ] End-of-journey home screen: card greyed, sheet read-only, "Start a new chapter" CTA.

## Dependency graph

- PR #3 (`addScar`, `deathState` substrate) lands first.
- PR #9 (roller with hope-die mode) lands first.
- PR #2 (typed conditions, source field) lands first.

## Out of scope

- Resurrection mechanics (not in SRD core).
- Party-shared death moves.
- Edit-character flow re-enabling a deceased character.
