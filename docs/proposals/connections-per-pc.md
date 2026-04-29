## User story

**As a player at session zero, I'd like the connections step to prompt me with class questions for each other PC at the table, so the SRD's "use these prompts at the table" workflow is on-screen.**

## Problem

`Character.connectionAnswers: string[]` is a flat array. Class connection questions are per-question, not per-PC. SRD wants one connection per other PC.

## Decision A: solo-first vs party-aware design

Original draft punted the party question. Stating it explicitly:

### Options considered

| Option | Approach |
|---|---|
| **A1. Solo-only**: free-text PC name | Player makes up names that won't match real PCs later. |
| **A2. Solo-first, optional name** | Name is metadata, not a foreign key. Empty → "(unnamed)". | Best for "I'll fill in at the table." |
| **A3. Party-aware now** | Requires a Party data model that doesn't exist. | Out of scope; duplicates Demiplane Edit-by-Others. |

**Recommendation: A2.** Treat `otherPCName` as optional metadata. No foreign key. When sync mode lands later, names can be reconciled.

## Decision B: data shape

```ts
interface ConnectionAnswer {
  question: string         // the prompt; rotates from class.connections pool
  otherPCName?: string     // optional; "" or omitted ok
  answer: string           // the player's response
}

interface Character {
  // ...
  connectionAnswers: ConnectionAnswer[]
}
```

## Decision C: migration

Existing `connectionAnswers: string[]` (flat). Each existing string is one connection.

```ts
connectionAnswers: oldAnswers.map(a => ({ question: '', otherPCName: '', answer: a }))
```

`question: ''` (empty, not `'?'`) so consumers can `if (!ca.question)` to detect un-backfilled entries and offer to refresh.

## Decision D: question rotation through pool

Each class has 3 connection questions. SRD says "at least one connection per other PC" — could be more than 3 connections at a 5-PC table.

### Options considered

| Option | Behavior |
|---|---|
| **D1. Cycle modulo 3** | Q1 → Q2 → Q3 → Q1 → Q2 ... | Matches "use these at the table" intent. |
| **D2. Exhaust at 3** | Refuse to add more than 3. | Wrong; SRD doesn't cap. |
| **D3. Pool with manual reorder** | Player picks any of the 3 each time. | Power-user; spec-fidelity to "rotating." |

**Recommendation: D1** (cycle). Player can swap questions before answering if they want.

## Decision E: layout

### Options considered

| Option | Approach |
|---|---|
| **E1. Single screen, repeat-block** | All connection cards visible, scrollable. Tall. |
| **E2. Carousel** | One connection at a time. Matches StepCarousel idiom. |
| **E3. Hybrid** | Repeat-block on desktop, carousel on mobile. |

**Recommendation: E2.** Consistent with the wizard's existing pattern. Player taps "Add another" to push a new card. Review screen at end shows all of them as a flat list.

## Decision F: review-screen grouping

Original draft proposed grouping by `otherPCName`. With optional/typo-prone names, grouping breaks.

**Recommendation: flat list ordered by entry.** Grouping is a sync-mode-only nice-to-have.

## Decision G: where it lands in the wizard

Currently 9 steps. Add Connections → 10 steps.

```
Class → Subclass → Cards → Heritage → Community → Equipment → Traits → Experiences → Connections → Name
```

Verify StepCarousel compact-mode at 10 pills on 375px (per PR #20 review math: should fit). Test on iPhone SE.

## Decision H: play-time visibility

Hidden data is bad data. Where does Connections render at play time?

### Options considered

| Option | Surface |
|---|---|
| **H1. CollapsiblePanel in HandView** | Same pattern as Notes. Always available. |
| **H2. Edit mode only** | Hidden in play. | Wrong; players reference connections at the table. |
| **H3. PDF export only** | Visible only via PR #16. | Misses the table use case. |

**Recommendation: H1.** New `ConnectionsPanel` in `hand/panels/`. Mirrors NotesPanel's collapse/expand idiom.

## Decision I: class-change reset

Player goes back to PickClass — questions change.

### Options considered

| Option | Approach |
|---|---|
| **I1. Discard all answers, surface warning** | "Changing class will reset your connection answers." | Loud. Standard for character builders. |
| **I2. Preserve answers, mark stale questions** | Answers stay; `question: ''` flag indicates stale. | Generous. Fiddly. |
| **I3. Re-prompt each answer** | "This question no longer applies — write a new connection?" | Most work. |

**Recommendation: I1.** Match TTRPG-builder convention.

## Acceptance

- [ ] `ConnectionAnswer` shape exists; `otherPCName` is optional.
- [ ] Migration: each existing `connectionAnswers: string` becomes `{ question: '', otherPCName: '', answer: oldString }`.
- [ ] Wizard adds a Connections step between Experiences and Name (10 steps total).
- [ ] Connections step uses carousel with "Add another" affordance.
- [ ] Question prompts cycle modulo 3 through the class's connection questions.
- [ ] Class change in the wizard discards connection answers with a confirm dialog.
- [ ] Review screen renders connections as a flat list.
- [ ] HandView gains a `ConnectionsPanel` (collapsible) showing all connections.
- [ ] StepCarousel verified at 10 pills on 375px viewport.
- [ ] Empty-name connections render as "(unnamed)".

## Dependency graph

- Coordinates with PR #20 (StepCarousel labels) — adds a 10th label "Connections."

## Out of scope

- Party-aware connection reconciliation (depends on a sync model that doesn't exist).
- Drag-to-reorder connections.
- Auto-importing party PC names.
