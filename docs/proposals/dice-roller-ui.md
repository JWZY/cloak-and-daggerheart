## User story

**As a player at the table, I'd like to tap a trait, weapon, or feature and roll Duality Dice with my modifiers and experiences, so my phone is the table's dice tray.**

## Problem

README claims this exists. `core/dice/` has the result-determination logic. `HandView.tsx` Actions tab is `<p>Actions panel coming soon</p>`. There's no rollable interaction anywhere.

This is the most consequential PR in the batch and the spec needs to be a real design doc, not a feature list.

## Decision A: roll abstraction (typed roll requests)

Daggerheart has at least four roll shapes: Duality action, Damage, Hope-die-vs-level (PR #13), Generic die. The roller must model all of them.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Duality-only roller** | Original draft. Hardcoded 2d12. | Re-implemented for damage/Hope/generic later. |
| **A2. Typed `RollRequest → RollResult`** | Discriminated union. Roller is a thin UI over it. Caller pre-resolves modifiers, advantage, alt-die size. | One source of truth. PR #7, #13 import the same component. |

**Recommendation: A2.**

```ts
type RollRequest =
  | { kind: 'duality'; modifier: number; experience?: { name: string; bonus: number }; advantage: -1 | 0 | 1; hopeDieSize?: 12 | 20 }
  | { kind: 'damage'; dice: { count: number; size: number }; flat: number; damageType: 'physical' | 'magical'; critical?: boolean }
  | { kind: 'hopeDie' }
  | { kind: 'generic'; dice: { count: number; size: number }; flat?: number; label?: string }

type RollResult =
  | { kind: 'duality'; hopeDie: number; fearDie: number; advDie?: number; expBonus?: number; total: number; outcome: 'critical' | 'hope' | 'fear'; }
  | { kind: 'damage'; rolls: number[]; total: number; criticalApplied: boolean }
  | { kind: 'hopeDie'; value: number }
  | { kind: 'generic'; rolls: number[]; total: number }
```

## Decision B: side effects of results

Duality result has rule-driven side effects.

| Outcome | Side effect | Notes |
|---|---|---|
| Critical (doubles) | Auto-success. **+1 Hope** + **clear 1 Stress.** | SRD-derived. |
| With Hope | Player gets the choice: "Gain 1 Hope" or "Spend with hope to give an ally Hope." | Original draft auto-applied. **Wrong.** |
| With Fear | Tell GM: +1 Fear. (GM-state out of scope; copy-able note.) | |

Hope cap from PR #3 applies. Spending an experience costs **1 Hope** (not modeled in original draft).

### Options considered for the Hope-result UX

| Option | Approach |
|---|---|
| **B1. Auto-apply +1 Hope** | Original. Removes player choice. **Reject.** |
| **B2. Confirm modal: "Gain 1 Hope"** | Default-focused button. Tap to apply, dismiss to skip. | Right. |

**Recommendation: B2.**

## Decision C: advantage / disadvantage composition

SRD: Adv = +d6, Dis = -d6, they cancel.

### Options considered

| Option | Where composition happens |
|---|---|
| **C1. Roller composes** | UI has separate Adv and Dis toggles; roller resolves. | Simpler caller. Roller knows about "sources" of adv/dis. |
| **C2. Caller pre-resolves** | Roller takes a single `advantage: -1 | 0 | 1`. Caller composes from feature flags + conditions. | Pure roller. Caller has rule responsibility. |

**Recommendation: C2.** Roller is a UI; rule composition lives in the calling component (which knows the character's conditions, feature state, etc.). The roller's UI surfaces a single Adv/Dis tri-state for the player to override.

## Decision D: roll log lifecycle

### Options considered

| Option | Scope | Cap | Persists across |
|---|---|---|---|
| **D1. Per-character, last 50** | Active character's session. | 50 entries, FIFO. | Reloads. Clears when character deleted. |
| **D2. Global session log** | All characters on this device. | 100 entries. | Reloads. |
| **D3. Per-roll only (no persistence)** | None. Toast-and-forget. | n/a | n/a |

**Recommendation: D1.** Daggerheart Demiplane lacks a roll log — this is a real differentiator. Cap at 50 keeps LocalStorage bounded. Clears with character delete.

## Decision E: Actions tab fate

### Options considered

| Option | Approach |
|---|---|
| **E1. Keep tab, fill with "Rolls" + "Rests" sections** | Aligns with PR #18's recommendation to put Rests inside Actions. | Tab earns its place. |
| **E2. Drop the tab entirely; roller is global FAB / floating button** | Simpler nav. | "Actions" was bait; removing it is honest. |

**Recommendation: E1.** Coordinated with PR #18. Roller is reachable from anywhere via tap-on-trait/weapon/feature; the Actions tab houses the *log* and the *rests* surfaces. No more "coming soon."

## Decision F: alt-die sizes

Some features (Rogue Nightwalker Signature Move) call for non-d12 Hope dies. Demiplane doesn't support this.

**Recommendation: support via `hopeDieSize?: 12 | 20`** in the duality `RollRequest`. Caller passes when invoking. Real differentiator vs Demiplane.

## Decision G: dependency on PR #3 (Hope cap)

`+1 Hope` mutations must use `addHope` from PR #3 with cap-awareness. Don't re-implement clamping.

**State: PR #3 lands first.** This PR consumes `addHope`.

## Acceptance

- [ ] `RollRequest` discriminated union covers duality / damage / hope / generic.
- [ ] `<DiceRoller>` accepts a `RollRequest` and renders the appropriate UI.
- [ ] Tapping any trait, weapon, or feature opens the roller with a pre-built `RollRequest`.
- [ ] Critical (doubles): result modal applies +1 Hope and clears 1 Stress; player confirms.
- [ ] With Hope: result modal asks "Gain 1 Hope" with default-focused confirm.
- [ ] With Fear: result modal shows "Tell GM: +1 Fear" with copy button.
- [ ] Experience pick costs 1 Hope; rejected if hope=0.
- [ ] Adv/Dis tri-state in UI; defaults from caller-resolved value.
- [ ] Hope-die size override (`hopeDieSize=20`) renders a d20 for the Hope die in duality rolls.
- [ ] Per-character roll log capped at 50, FIFO. Clears on character delete.
- [ ] Actions tab houses "Rolls" log section and "Rests" section (coordinated with PR #18).
- [ ] No "Actions panel coming soon" stub remaining.
- [ ] Vaul added as dep; bundle increase ≤ 8 KB gz; verified.
- [ ] Landscape iPhone Vaul behavior tested.

## Dependency graph

- PR #3 (Hope cap) lands first.
- PR #7 (Proficiency × dice) lands first; this PR's damage `RollRequest` consumes `computeDamageRoll`.
- PR #18 (Actions tab housing) coordinates with E1 above.

## Out of scope

- Group rolls (Lift Together).
- GM dice (adversary attacks).
- Roll20-style external dice integration.
