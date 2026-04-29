## User story

**As a player whose last HP slot just got marked, I'd like the sheet to surface the three Death moves so I can pick one immediately, so the table doesn't pause while I look up the rules.**

## Problem

When the last HP slot is marked, the sheet should offer Blaze of Glory, Avoid Death, Risk It All. None implemented.

This is the highest-stakes UI in the app. The state machine has gaps the original draft glossed over.

## SRD-verified rules

All cited from `daggerheart-srd-main/contents/Death.md`.

**Avoid Death scar threshold** (verbatim):
> After your character falls unconscious, roll your Hope Die. If its value is **equal to or less than** your character's level, they gain a scar; permanently cross out a Hope slot...

So **`value <= level` triggers scar**. Inclusive on equality.

**Wake-up triggers** (verbatim):
> They return to consciousness when **an ally clears 1 or more of their marked Hit Points** or when **the party finishes a long rest**.

So Avoid Death has **three** wake paths, not one:

1. Player taps "Wake up" (manual; the original spec's path).
2. Ally heals — any external `updateHP(c, -k)` while `pendingAvoid`.
3. Long rest — PR #15's long-rest action transitions automatically.

## Decision A: trigger as derivation, not effect

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. `useEffect` on HP transition** | Watches prior HP. | Lost across crashes/reloads. |
| **A2. Derivation `shouldShowDeathModal(c)`** | `hp.current >= hp.max && deathState === 'alive' && !pendingDeath` | Survives reload. |

**Recommendation: A2.**

```ts
function shouldShowDeathModal(c: Character): boolean {
  return c.hp.current >= c.hp.max && c.deathState === 'alive' && !c.pendingDeath
}
```

## Decision B: modal cannot be dismissed

The modal is *modal*. The player must pick a move OR an external event must heal them below max.

| Option | Behavior |
|---|---|
| **B1. Pure derivation, dismiss reopens** | Player taps outside; modal pops back. Bad UX. |
| **B2. `pendingDeath: true` set on first show; player must pick a move; healing clears the flag** | Modal shows once per event. Heal below max → `pendingDeath` clears → modal closes. |
| **B3. Dismissible with confirm** | Lets player avoid picking. Wrong: SRD requires a death move. |

**Recommendation: B2.** When modal appears, `pendingDeath: true` is set. Player picks a move (transitions deathState) OR heals first (HP drops, `pendingDeath` clears, modal closes). **No dismiss affordance.**

## Decision C: `deathState` enum

```ts
type DeathState =
  | 'alive'
  | 'pendingBlaze'      // Blaze declared; awaiting auto-crit roll resolution
  | 'pendingAvoid'      // Avoid Death; unconscious until allies revive or long rest
  | 'pendingRiskRoll'   // Risk It All declared; awaiting roll
  | 'deceased'           // dead, period
  | 'journeyEnded'       // all Hope slots scarred out (per PR #3)
```

PR #3 introduces the substrate. This PR widens the union.

## Decision D: condition vs deathState

| Option | Where Unconscious lives |
|---|---|
| **D1. `deathState` owns death-flow lifecycle. Conditions own status. Avoid Death sets both.** | Two layers, each pulling its weight. |
| **D2. `deathState` subsumes Unconscious** | Cleaner type. Loses parallelism with Hidden/Restrained/Vulnerable. |

**Recommendation: D1.**

```ts
// Avoid Death
character.deathState = 'pendingAvoid'
character.conditions.push({ name: 'Unconscious', source: 'death', appliedAt: Date.now() })
```

## Decision E: Blaze of Glory

| Option | Implementation |
|---|---|
| **E1. `Character.forceCritOnNextRoll: boolean`** | Two-roll coupling (action then damage). Brittle. |
| **E2. UI hint to PR #9's roller** | Banner: "Blaze of Glory active — this action automatically crits." Roller's result reads as crit regardless. After resolved attack, `deathState='deceased'`. |

**Recommendation: E2.**

## Decision F: Avoid Death — three wake paths

The SRD specifies three paths. State each.

### F1. Player taps "Wake up?"

Persistent banner during `'pendingAvoid'`: "Down — Wake up?" with a button. All other affordances disabled.

### F2. Ally heals

Any external `updateHP(c, delta)` where `delta > 0` AND `c.deathState === 'pendingAvoid'` triggers wake.

### F3. Long rest

PR #15's long-rest action checks for `pendingAvoid` characters and transitions them.

## Decision G: scar roll timing — at fall, not at wake

`Death.md` reads:
> After your character falls unconscious, roll your Hope Die.

Two readings:
1. **Roll-on-fall**: scar determined when Avoid Death is picked. Player knows immediately. State stays `'pendingAvoid'` across wake; wake just clears Unconscious.
2. **Roll-on-wake**: scar determined at wake. Suspense across the unconscious period.

**Recommendation: roll-on-fall.** Less state, less in-app suspense (table tension is fine in narrative; UI lag is bad). The roll happens once when the player picks Avoid Death; the result is committed via `addScar` (PR #3) immediately.

This means F2 and F3 are pure transitions: `'pendingAvoid' → 'alive'`, remove Unconscious. No additional dice rolls at wake.

## Decision H: Risk It All split UI

| Option | Approach |
|---|---|
| **H1. Free-text "tell me how you split it"** | Original. Wrong. |
| **H2. Two steppers with sum constraint** | "You have 7 to clear. HP +X, Stress +Y where X+Y=7." Confirm. |
| **H3. Slider** | Cute. Low precision. |

**Recommendation: H2.**

## Decision I: end-of-journey UX

`deathState='journeyEnded'`: character lock-out.

| Option | Approach |
|---|---|
| **I1. Card-greyed home screen + sheet read-only** | Memorial. Persistent reminder. |
| **I2. Auto-delete after confirm** | Destructive. |
| **I3. "Start a new chapter" prompt** | Encourages restart. |

**Recommendation: I1 + I3.** Old character preserved (read-only); home-screen offers "Start a new chapter" CTA.

## Acceptance

Named tests in `core/character/death.ts`:

- [ ] `shouldShowDeathModal(c)` returns true on `hp.current >= hp.max && deathState === 'alive' && !pendingDeath`.
- [ ] False after `pendingDeath` is set.
- [ ] **Modal cannot be dismissed**: player can pick a move OR healing below max clears `pendingDeath`. No "X" or "cancel" affordance.
- [ ] **Healing-clears-pendingDeath**: `updateHP(c, -1)` while `pendingDeath=true` → `pendingDeath=false`, modal closes.
- [ ] Blaze of Glory: state → `'pendingBlaze'`. PR #9 roller shows "Auto-crit active" banner. After damage resolves, state → `'deceased'`.
- [ ] Avoid Death: state → `'pendingAvoid'`. Conditions gain `{ name: 'Unconscious', source: 'death' }`. **Hope-die scar roll fires at this transition (roll-on-fall).**
- [ ] Avoid Death scar roll `value <= level` → `addScar` invoked (PR #3 dependency). Verified: equality counts.
- [ ] Avoid Death scar roll `value > level` → no scar.
- [ ] Avoid Death + 6th scar at fall: state → `'journeyEnded'` instead of `'pendingAvoid'`.
- [ ] **Wake path 1 (player tap)**: banner button → state → `'alive'`, Unconscious removed.
- [ ] **Wake path 2 (ally heal)**: `updateHP(c, +k)` while `pendingAvoid` → state → `'alive'`, Unconscious removed.
- [ ] **Wake path 3 (long rest)**: PR #15's long-rest action transitions `pendingAvoid` → `'alive'`, removes Unconscious.
- [ ] Risk It All Hope > Fear: split steppers UI; clear amounts equal to Hope die value; sum-constraint enforced.
- [ ] Risk It All Fear > Hope: state → `'deceased'`.
- [ ] Risk It All tie: state → `'alive'`; nothing cleared.
- [ ] Modal-once-per-event: heal below full → take damage to full again → modal reopens.
- [ ] Persistent banner during `'pendingAvoid'`; sheet mutations disabled.
- [ ] End-of-journey home screen: card greyed, sheet read-only, "Start a new chapter" CTA.

## Dependency graph

- PR #3 (`addScar`, `deathState` substrate) lands first.
- PR #9 (roller with hope-die mode) lands first.
- PR #2 (typed conditions, source field, `pendingDeathMove` flag) lands first.
- PR #15 (long rest) coordinates the long-rest wake path.

## Out of scope

- Resurrection mechanics.
- Party-shared death moves.
- Edit-character flow re-enabling a deceased character.
- Long-rest interruption (deferred per PR #15).
