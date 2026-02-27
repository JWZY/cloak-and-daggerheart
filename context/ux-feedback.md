# UX/UI Feedback (v2 — current version)

> This file captures version-specific UX feedback. These are improvements to make,
> not permanent rules. Evergreen game mechanics go in `requirements.md`.

## Level-Up Wizard

### Domain card count must reflect advancements (bug)
- If player picks "Add Domain Card" advancement once → domain card step should let them pick **2** cards (1 mandatory + 1 from advancement)
- If picked twice → pick **3** cards
- Currently always shows 1 card to pick regardless of advancement choices

### Trait increase picker — reuse existing pattern
- The "Increase 2 Traits" sub-picker currently uses a 2x3 grid with Confirm/Cancel buttons
- Should reuse the same visual pattern as AssignTraits step: full-width rows (Strength, Agility, Finesse, etc.)
- Drop the separate Confirm/Cancel buttons — match the established interaction pattern
- Marked traits should be visually distinct (greyed out, can't be selected)

### Experience boost picker
- Current UX is okay for now

### Character editing after level-up
- There's currently no way to edit a character sheet after creation or level-up
- Need a "quick edit" or "undo" mechanism for correcting mistakes
- Could be: edit button on hand view, or undo last level-up, or inline editing of stats
- Creative solution needed — TBD

## Deck Builder

### Card sizing in selection steps (all card pickers)
- Domain cards: way too small on desktop. Must be full-size (same as subclass cards)
- Ancestry cards: way too small on desktop. Must be full-size, scrollable
- Community cards: way too small on desktop. Must be full-size, scrollable
- See `requirements.md` "Card Selection UX" section for canonical rules

### Step order
- Experiences should come BEFORE Background (currently reversed)
- Connections should come BEFORE Name
- Name should be the LAST step before Review
- Canonical order locked in `requirements.md`
