## User story

**As a player at session zero, I'd like the connections step to prompt me with the class's questions for each other PC at the table, so the SRD's "use these prompts at the table" workflow is on-screen.**

## Problem

`Character.connectionAnswers: string[]` is a flat array. The class's connection questions are per-question, not per-PC. SRD asks the player to "use the connection questions in your class guide to suggest at least one connection with each other PC; any player can reject any connection."

## Source

- SRD v1.0 — Step 9 Connections: https://daggerheartsrd.com/rules/character-creation/
- Class data already carries `connections: { question: string }[]` per [`types/character.ts`](../../src/types/character.ts).

## Suggestion

Two-pass approach.

**At creation (offline mode):** keep the existing flat-string answers, but prompt one connection question at a time with a "name of other PC" free-text field. Output:

```ts
interface ConnectionAnswer {
  question: string
  otherPCName: string
  answer: string
}
type ConnectionAnswers = ConnectionAnswer[]
```

**At sync time** (out of scope here — see Demiplane Edit-by-Others — but design for it): once party identity exists, prompt per-PC instead of free-text PC name.

UI: "Suggest a connection with another character" repeat-block, with class question rotating, "Add another" button.

## Acceptance

- [ ] `connectionAnswers` is an array of `{ question, otherPCName, answer }`.
- [ ] Migration converts existing string answers into a single `{ question: '?', otherPCName: '', answer: oldString }` row.
- [ ] Step UI rotates through the class's connection questions and lets the user add an entry per other PC.
- [ ] Review screen renders connections grouped by other-PC name.
