## User story

**As a leveled-up character, I'd like my weapon attacks to roll the right number of damage dice, so I'm not under-rolling 2d8 because the app forgot to multiply.**

## Confirmed bug

Traced through the code: `hand/WeaponPanel.tsx` renders `{weapon.damage}` raw with no Proficiency multiplication. SRD says Proficiency multiplies *dice count*, not flat modifier. The original draft hedged with "verify and lock in." Removed the hedge.

## Decision A: parser scope

`Weapon.damage: string` ([`types/character.ts`](../../src/types/character.ts)). SRD weapon strings include `d6`, `d8+3`, `2d6+4`, `d20+8`, with `phy`/`mag` suffixes. Some features (Hammer of Wrath: "use a d20 as your damage die") override the die size.

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Limited regex parser** | Handles `d8+3` shape only; type/suffix preserved as text. | Ships fast. Brittle. New format = new parser branch. |
| **A2. Full grammar parser** | Recognizes `NdX[+M] [type]`, multi-die, suffixes. | Robust. Overkill for 90% of weapons. |
| **A3. Migrate `Weapon.damage` to structured** | Replace string with `{ baseDice: { count, size }, flat, type }`. SRD JSON loaders normalize at import time. | One-time refactor. Eliminates the parser as a runtime concern. |

**Recommendation: A3.** A1 ships a regex graveyard. A3 is bigger but eliminates the class of bug. The parser becomes a one-shot loader function instead of runtime code. SRD weapons.json is enumerable (~30 weapons); normalization is mechanical.

```ts
// types/character.ts
interface Weapon {
  // ...
  damage: WeaponDamage
}
interface WeaponDamage {
  baseDice: { count: number; size: 4 | 6 | 8 | 10 | 12 | 20 }
  flat: number
  type: 'physical' | 'magical'
}
```

Loader (`data/srd.ts`) reads the SRD strings and produces this shape. `computeDamageRoll(weapon, proficiency)` becomes:

```ts
export function computeDamageRoll(w: Weapon, proficiency: number): DamageRoll {
  return {
    diceCount: w.damage.baseDice.count * Math.max(1, proficiency),
    diceSize: w.damage.baseDice.size,
    flat: w.damage.flat,
  }
}
```

## Decision B: pre-multiplied dice (Greatsword `2d6+1`)

SRD has weapons with `baseDice.count > 1` at base. Greatsword: `2d6+1` at Tier 1.

**SRD reading**: Proficiency multiplies dice count regardless of base count. So Greatsword + Prof 2 → `4d6+1`.

This needs an explicit acceptance test. Easy to silently get wrong.

## Decision C: WeaponPanel display

### Options considered

| Option | Display | Tradeoffs |
|---|---|---|
| **C1. Show only multiplied** | "2d8+3" big | Combat scan-friendly. Player loses visibility into base. |
| **C2. Show base, footnote multiplied** | "d8+3 — at Prof 2: 2d8+3" | Honest. Crowded line. |
| **C3. Multiplied prominent + Pill for Prof** | "2d8+3" big, small "Prof 2" pill below (matches existing range/burden Pill at `WeaponPanel.tsx`) | Combat-scan-friendly. Disclosure via the pill. |

**Recommendation: C3.** Matches existing Pill component idiom.

## Decision D: feature overrides (Hammer of Wrath, Devastating)

Some features override the die: "use a d20 as your damage die for this attack" or "make this attack use a d20 instead." These are situational.

### Options considered

| Option | Approach |
|---|---|
| **D1. Out of scope; document** | Standard formula in this PR. Feature overrides handled by PR #9 dice roller. | Honest. Doesn't ship feature handling here. |
| **D2. Pass overrides through `computeDamageRoll`** | `computeDamageRoll(w, prof, { dieOverride: 20 })`. | Forward-compatible. Caller decides when to override. |

**Recommendation: D2.** Cheap signature change; no behavior change today.

## Acceptance

Named test cases:

- [ ] `computeDamageRoll(weapon='d6', prof=1)` → `{ count: 1, size: 6, flat: 0 }`.
- [ ] `computeDamageRoll(weapon='d8+3', prof=1)` → `{ count: 1, size: 8, flat: 3 }`.
- [ ] `computeDamageRoll(weapon='d8+3', prof=2)` → `{ count: 2, size: 8, flat: 3 }`. **Flat does NOT multiply.**
- [ ] `computeDamageRoll(weapon='2d6+1', prof=2)` → `{ count: 4, size: 6, flat: 1 }`. **Pre-multiplied dice still multiply.**
- [ ] `computeDamageRoll(weapon='d8+3', prof=3)` → `{ count: 3, size: 8, flat: 3 }`.
- [ ] `computeDamageRoll(weapon='d8+3', prof=1, { dieOverride: 20 })` → `{ count: 1, size: 20, flat: 3 }`.
- [ ] SRD loader test: every weapon in `weapons.json` parses to a valid `WeaponDamage` shape.
- [ ] WeaponPanel rendering: at Prof 2, displays `"2d8+3"` with a small "Prof 2" Pill.

## Dependency graph

- This PR's `computeDamageRoll` is **consumed by PR #9** (dice roller) and **PR #13** (Blaze of Glory damage). State the order:
  - This PR lands first.
  - PR #9 imports `computeDamageRoll` for the damage-roll branch.

## Out of scope

- Adversary damage rolls (separate sheet, separate concern).
- Versatile weapons that switch primary/secondary modes.
- Weapon enchantments adding flat (not in SRD core).
