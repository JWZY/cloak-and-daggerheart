## User story

**As a player taking ongoing pressure during a session, I'd like Stress to behave like the SRD says, so I don't accidentally mis-track damage and feel safer than the rules intend.**

## Problem

Two related rules are not modeled.

1. **Stress → HP overflow.** SRD: *"If you're forced to mark Stress while you have no Stress slots available, mark 1 HP instead."* Today, `useCharacterStore.updateStress` clamps at `max` and silently drops the overflow. ([store/character-store.ts](../../src/store/character-store.ts))
2. **Vulnerable on full stress.** SRD: when the last Stress slot is marked, the character becomes Vulnerable until at least one Stress is cleared. `Vulnerable` is a standard condition (rolls targeting you have advantage). Today, `conditions: string[]` is free-form and nothing auto-applies.

## Source

- SRD v1.0 — Stress, Conditions sections: https://daggerheartsrd.com/rules/

## Suggestion

In `store/character-store.ts`:

```ts
updateStress: (id, delta) => set((state) => ({
  characters: state.characters.map((c) => {
    if (c.id !== id) return c
    const next = c.stress.current + delta
    if (delta > 0 && next > c.stress.max) {
      const overflow = next - c.stress.max
      // Mark stress to max, push overflow to HP
      return {
        ...c,
        stress: { ...c.stress, current: c.stress.max },
        hp: { ...c.hp, current: clampHP(c.hp.current + overflow, c.hp.max) },
        conditions: c.conditions.includes('Vulnerable')
          ? c.conditions
          : [...c.conditions, 'Vulnerable'],
      }
    }
    const clamped = Math.max(0, Math.min(next, c.stress.max))
    return {
      ...c,
      stress: { ...c.stress, current: clamped },
      conditions: clamped >= c.stress.max
        ? (c.conditions.includes('Vulnerable') ? c.conditions : [...c.conditions, 'Vulnerable'])
        : c.conditions.filter((cond) => cond !== 'Vulnerable'),
    }
  }),
})),
```

The HP-mark count uses your existing `clampHP` helper. The condition flag uses the existing `conditions: string[]`; a future PR can promote conditions into a typed enum.

## Acceptance

- [ ] Marking stress while `current === max` writes 1 HP instead of dropping the increment.
- [ ] When `stress.current === stress.max`, `Vulnerable` is in `conditions`.
- [ ] When stress drops below max, `Vulnerable` is removed (only if it was applied by stress, not manually — open question, see below).
- [ ] Unit test: `character-store.test.ts` covers both transitions.

## Open questions

- Should manual addition of Vulnerable be distinguishable from auto-Vulnerable? Probably yes; consider a typed condition source. Out of scope for this PR — call it out, defer.
