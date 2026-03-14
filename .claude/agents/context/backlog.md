# Feature Backlog

Prioritized list of features and improvements. Items at top are highest priority.

---

## Up Next — Combat Features Sprint

_Goal: Close the functional gap with Demiplane. Ship the features a player actually needs at the table._
_Source: Demiplane competitive analysis (demiplane/CRITIQUE.md, demiplane/IMPLEMENTATION-PLAN.md)_

### 1. Trait Bar Readability (Mobile)
**Size:** S | **Status:** Open
**Description:** Switch mobile trait bar from 6-col to 3x2 grid with larger values
**Notes:**
- 6 cols at 375px = 55px/trait at 11px font — too small one-handed
- Change to `grid-cols-3` with 2 rows, increase value to 20-24px
- Keep spellcast highlight + action verbs. Desktop stays 6-col.
- MobileLayout.tsx only

### 2. Damage Threshold Reference Row
**Size:** S | **Status:** Open
**Description:** Clear Minor/Major/Severe reference in StatBar with "mark X HP" instructions
**Notes:**
- Replace existing inline Major/Severe GameBadges with a dedicated row
- `Minor = 1 HP | Major [n] = 2 HP | Severe [n] = 3 HP`
- Data already available: `parseThresholds()` + character.level
- StatBar.tsx only, no type changes

### 3. Weapon Stat Block
**Size:** M | **Status:** Open
**Description:** Structured weapon display: name, range, attack mod, damage dice, type, feat
**Notes:**
- New `WeaponPanel.tsx` component
- Attack mod = `character.traits[weapon.trait.toLowerCase()]` + proficiency
- Weapon type fully typed: `Weapon` interface has all SRD fields
- Show primary + secondary weapons above Equipment section
- No dice rolling in v1

### 4. Conditions Tracker
**Size:** M | **Status:** Open
**Description:** Chip/tag system for Hidden, Restrained, Vulnerable + custom conditions
**Notes:**
- Type change: add `conditions: string[]` to Character
- New `ConditionBar.tsx` — row of toggleable chips below StatBar
- Core constants in `src/core/rules/conditions.ts` (3 standard conditions)
- "+" for custom conditions (e.g., "Hexed" from class abilities)
- Store migration needed

### 5. Ability Usage Tracking
**Size:** M | **Status:** Open
**Description:** Toggle on FeaturePanel to mark limited-use abilities as used
**Notes:**
- Type change: add `usedFeatures: string[]` to Character
- FeaturePanel gets `used?` + `onToggleUsed?` props
- Used features dim slightly (opacity)
- "Rest" action resets all usage
- SRD doesn't tag per-rest features — let player toggle any feature manually
- Store migration needed

### 6. Character Portraits
**Size:** M | **Status:** Open
**Description:** Character portrait in header — upload or default to subclass art
**Notes:**
- Type change: add `portrait?: string` to Character (base64 data URL)
- Tap portrait → file picker → canvas resize to 200x200 → store as base64
- Default: subclass art in circular mask (art already exists)
- Mobile: 44px circle in CharacterHeader. Desktop: 56px in identity banner
- No fancy crop UI in v1

---

## MVP — Remaining Items

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
- NPC quick reference
- Combat log
- Loadout/vault mechanics for domain cards (recall cost tracking)
