# Feature Backlog

Prioritized list of features and improvements. Items at top are highest priority.

---

## MVP - Level 1 Wizard Experience

_Goal: A functional, well-crafted level 1 Wizard character creation and play experience._

### Create Background Step ⚠️ CORE MVP
**Size:** M | **Status:** Not started
**Description:** Add background questions step to deck builder (SRD Step 6)
**Notes:**
- Each class has background questions in `classes.json` — Wizard has 3 questions
- Player answers free-form text for each question
- No mechanical effect, but critical for character identity/roleplay
- `Character.backgroundAnswers: string[]` already exists in the type — just needs a UI step
- SRD says this can be "left more ambiguous for the time being" but should still be offered

### Create Experiences Step ⚠️ CORE MVP
**Size:** M | **Status:** Not started
**Description:** Add experiences step to deck builder (SRD Step 7)
**Notes:**
- Player creates 2 custom Experiences at +2 bonus each
- Experiences are player-authored words/phrases (e.g. "Arcane Scholar", "Survivor of the War")
- **Mechanically important** — Experiences add bonuses to relevant action rolls
- `Character` type needs an `experiences: { text: string; bonus: number }[]` field (currently missing)
- At creation: always 2 experiences, always +2. At level-up: gain new experiences, increase existing ones.
- SRD example experiences per class in `classes.json`

### Create Connections Step ⚠️ CORE MVP
**Size:** S | **Status:** Not started
**Description:** Add connections step to deck builder (SRD Step 9)
**Notes:**
- Establish relationships with other PCs via prompted questions
- Connection questions come from `classes.json` — Wizard has specific prompts
- SRD explicitly allows skipping: "it's okay if there isn't an established connection between every pair of PCs"
- `Character.connectionAnswers: string[]` already exists in the type — just needs a UI step
- Can be skippable/optional in the UI (Continue enabled even if empty)

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
**Description:** Support classes beyond Wizard (currently hardcoded in many places). Requires class selection step, class-specific domain cards, class-specific HP/evasion calcs.

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
