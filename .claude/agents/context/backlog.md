# Feature Backlog

Prioritized list of features and improvements. Items at top are highest priority.

---

## MVP - Level 1 Wizard Experience

_Goal: A functional, well-crafted level 1 Wizard character creation and play experience._

### Item Cards
**Size:** M | **Status:** Open
**Description:** Card-based UI for equipped weapons and armor in the hand view
**Notes:**
- Weapon/armor cards consistent with SRDCard/DomainCard visual language
- Could appear in the hand view carousel alongside domain cards
- Equipment data already loaded from SRD JSON

### Working Calculations — Post-Creation Editing
**Size:** S | **Status:** Open
**Description:** Allow changing equipment after character creation
**Notes:**
- All calculations work correctly at creation time (HP, armor score, evasion with armor feats, thresholds + level)
- Still needed: ability to swap armor/weapons post-creation and have stats recalculate
- Low priority — players rarely change equipment at L1

---

## Completed on v2-card-centric branch

### Full 12-Step Deck Builder Wizard -- DONE
**Completed:** 2026-02-27
**What shipped:** All 12 steps of the character creation wizard are implemented and wired into DeckBuilder end-to-end:
0. PickClass
1. PickSubclass
2. PickDomainCards
3. PickAncestry
4. PickCommunity
5. PickEquipment
6. AssignTraits
7. CreateExperiences
8. CreateBackground
9. CreateConnections
10. NameCharacter
11. ReviewDeck

### PickClass Step -- DONE
**Completed:** 2026-02-27
**What shipped:** Class selection as step 0 of the deck builder. All SRD classes available for selection.

### Create Experiences Step -- DONE
**Completed:** 2026-02-27
**What shipped:** Step 7 in the deck builder. Player creates 2 custom Experiences at +2 bonus each. Experiences are player-authored words/phrases that add bonuses to relevant action rolls.

### Create Background Step -- DONE
**Completed:** 2026-02-27
**What shipped:** Step 8 in the deck builder. Background questions from `classes.json` with free-form text answers for character identity/roleplay.

### Create Connections Step -- DONE
**Completed:** 2026-02-27
**What shipped:** Step 9 in the deck builder. Relationship prompts from `classes.json` for establishing connections with other PCs. Skippable as per SRD guidance.

### Card-Based Selection (Horizontal Rails) -- DONE
**Completed:** 2026-02-13
**What shipped:** Deck builder with 7 steps using SRDCard, DomainCard, and InfoCard components. Tap-to-select in horizontal scrollable rails. Domain card pool selection (pick 3 of available).

### Onboarding Flow Redesign -- DONE (core flow)
**Completed:** 2026-02-13
**What shipped:** Full card-centric deck builder with dark fantasy aesthetic, spring animations, step indicator, desktop preview panel. Not using Liquid Glass (pivoted to dark forged-metal RPG style).

### SRD Card Components -- DONE
**Completed:** 2026-02-09 through 2026-02-13
**What shipped:** SRDCard, DomainCard (rebuilt), InfoCard. All deltas vs Figma reviewed and locked in. Auto-fit titles, masked banners, domain color system.

---

## Medium Priority

### Character Export/Import
**Size:** M
**Description:** Export character as JSON, import from file
**Notes:**
- Backup characters
- Share between devices
- Migration considerations

### Character Portraits
**Size:** M
**Description:** Upload or generate character images
**Notes:**
- Store as base64 or URL
- Crop/resize tool
- Optional feature

---

## Low Priority

### Offline Support
**Size:** M
**Description:** Full PWA offline capabilities

### Dice History
**Size:** S
**Description:** View past dice rolls (already tracked in rollHistory, needs UI)

### Sound Effects
**Size:** S
**Description:** Dice roll sounds, UI feedback (optional, toggleable)

### Session Notes
**Size:** M
**Description:** Per-session note taking with organization

---

## Post-MVP

### Level Up Flow
**Size:** L
**Description:** Allow characters to level up (HP increases, new domain cards, proficiency, Foundation -> Specialization -> Mastery)

### Multi-class Support
**Size:** XL
**Description:** Support classes beyond Wizard. PickClass step now exists (step 0), but class-specific domain cards, HP/evasion calcs, and other logic may still have Wizard-specific assumptions.

---

## UX Debt

### Card Sizing on Desktop for Pickers
**Size:** S
**Notes:** Domain, ancestry, and community picker cards are too small on desktop viewports. Mobile-first sizing doesn't scale up well.

### Level-Up Wizard Domain Card Count
**Size:** S
**Notes:** The level-up wizard's domain card count doesn't reflect advancements. Should update pool/hand sizes based on character level.

### Post-Creation Character Editing
**Size:** M
**Notes:** No ability to edit a character after creation is complete. Players currently have to recreate from scratch to change any choices.

---

## Tech Debt

### Add Unit Test Coverage
**Size:** M
**Notes:** core/ functions should have high coverage. card-mapper.ts and srd.ts have tests. Store tests exist.

### TypeScript Strict Mode
**Size:** M
**Notes:** Enable stricter settings, fix remaining `any` types

---

## Ideas (Unscoped)

- Campaign/party management
- Initiative tracker
- Condition tracking
- NPC quick reference
- Combat log
