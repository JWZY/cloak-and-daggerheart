## User story

**As a player tracking my hoard, I'd like Handfuls / Bags / Chests rolling over base-10 like the printable sheet, so my app matches the GM's expectations.**

## Reality check

[`hand/panels/GoldPanel.tsx`](../../src/hand/panels/GoldPanel.tsx) **already renders Handfuls and Bags as separate pip rows** derived from a single integer `gold: number`. Visual model is half-built. What's missing:

- Chests (3rd row, capped at 1).
- Real semantics behind taps.
- Optional Coins row.
- A semantic-range / data-model decision.

## Decision A: data model

### Options considered

| Option | Approach | Tradeoffs |
|---|---|---|
| **A1. Structured `Gold` object** | Original draft. `{ handfuls, bags, chests, coins? }` | Readable. Three set-operations per spend. Migration code. |
| **A2. Single integer with semantic range** | `gold: number` where `coins + handfuls*10 + bags*100 + chests*1000`. Display layer parses. | Trivial arithmetic. Free rollover. Migration is identity. SRD math becomes `gold + n` / `gold - n`. |
| **A3. Tagged union** | `gold: { kind: 'integer' | 'structured', ... }` | Both worlds. Worst of both. **Reject.** |

**Recommendation: A2.** The GoldPanel already derives row values from a single integer. A2 is what's effectively shipped. Change the *cap* (currently `HANDFULS_MAX + BAGS_MAX = 20` per the panel) to model the SRD scale (max 1999 with optional coins; or 1099 without). Keep mutations as `+n` / `-n`.

## Decision B: borrow semantics on spend

### Options considered

| Option | Approach |
|---|---|
| **B1. Auto-borrow** | `spend(5)` with 0 handfuls + 1 bag → cascades, sets to 5 handfuls + 0 bags, then -5. Result: 0/0. | Tactical decision lost. |
| **B2. Explicit "break a bag" tap** | UI requires the player to tap a bag to convert it to 10 handfuls. `spend` returns false if insufficient handfuls. | Matches the printable sheet's tactility. Two-step interaction for spend across rollover boundary. |
| **B3. Auto-borrow + visible animation** | Auto, but the bag pip animates to 10 handful pips first. | Best of both. Costs animation work. |

**Recommendation: B2 for v1.** Aligns with printable-sheet feel. Reconsider B3 if user testing shows two-tap is too friction-y.

`spendGold(n: number) → { ok: boolean; broke?: 'bag' | 'chest' }`. Returns `ok: false` when insufficient.

Worked examples (in spec for review):

- `current=15 (1 bag, 5 handfuls), spend 3` → `current=12`. `ok: true`.
- `current=15, spend 8` → returns `ok: false, broke: 'bag'`. UI prompts "Break a bag?" — on confirm, sets to 14 (0 bags + 14 handfuls), then `spend 8` → 6.
- `current=1500 (1 chest, 5 bags), spend 600` → cascades through chest → bag chain. v1 limits chests to 1, so anything past 1099 + 999 = invalid. Refuse.

## Decision C: chest cap and lossy migration

SRD: max 1 chest. Migration formula was `chests = Math.min(1, Math.floor(gold/100))` — silently lossy past 199.

### Options considered

| Option | Approach |
|---|---|
| **C1. Silent clamp** | Drop excess. | Bad. |
| **C2. Migrate, surface a toast** | "Your gold has been clamped to the SRD max — review your sheet." | Honest. |
| **C3. Refuse to migrate; freeze old gold** | Block the persist hydration on old characters until reviewed. | Heavy-handed. |

**Recommendation: C2.** And: SRD permits at most ~2 chests of accumulated wealth realistically; in-the-wild characters with `gold > 199` are vanishingly rare in this app today. Acceptable.

## Decision D: Coins (optional rule)

Spec originally said "toggleable in settings." Settings doesn't exist (per PR #18 review).

### Options considered

| Option | Approach |
|---|---|
| **D1. Drop coins from this PR** | Land when Settings exists. | Simplest. |
| **D2. Always-on coins** | Add the row unconditionally. | Pollutes the sheet for tables that don't use the optional rule. |
| **D3. URL-flag-gated coins** | `?coins` in dev. | OK as a stop-gap. |

**Recommendation: D1.** Coins are a future PR. Don't manufacture phantom dependencies on Settings.

## Decision E: tap-to-fill grammar

GoldPanel currently has `+`/`-` buttons.

### Options considered

| Option | Approach |
|---|---|
| **E1. Keep `+`/`-`** | No change to interaction grammar. | Familiar; ignores pip-tap idea. |
| **E2. Tap pip to set** | Tap pip 5 → set total handfuls to 5. Tap-and-clear is long-press. | Idempotent. Discoverability medium. |
| **E3. Tap pip to toggle** | Tap pip 5 → flip its state. | Non-monotonic. Confusing for "spend 1." |

**Recommendation: E2.** Worked example: existing `gold: 12` displays as `bags: 1, handfuls: 2`. Tap handful pip 5 → set handfuls to 5 (gold: 15). Long-press handful pip 3 → set handfuls to 2 (gold: 12 again).

Keep `+`/`-` buttons too; they coexist with tap-to-fill.

## Acceptance

- [ ] `gold` remains a single integer; semantic range expanded to 0..1099 (no coins) or 0..1099 (with optional rule deferred).
- [ ] GoldPanel renders Handfuls + Bags + Chests rows derived from `gold`.
- [ ] Tap-pip-to-set works on all three rows.
- [ ] `spendGold(n)` returns `{ ok, broke }` with the worked-example semantics.
- [ ] Migration test: `gold: 200` clamps to chests=1 with toast surfaced.
- [ ] Migration test: `gold: 12` → 1 bag, 2 handfuls, 0 chests, no toast.
- [ ] Spend test: insufficient handfuls returns `broke: 'bag'`; UI prompts; on confirm, breaks bag and re-spends.
- [ ] Spend test: spending across chest boundary requires breaking chest; surfaces a confirm.

## Out of scope

- Coins row (deferred until Settings lands).
- Multi-chest (SRD limit is 1).
- Currency conversion to other coin types (gp/sp/cp; not a Daggerheart concept).
