# Feature Backlog

Prioritized list of features and improvements. Items at top are highest priority.

---

## MVP - Level 1 Wizard Experience

_Goal: A functional, well-crafted level 1 Wizard character creation and play experience._

### Onboarding Flow Redesign
**Size:** L
**Description:** Redesign character creation visuals with glass components
**Notes:**
- Apply Liquid Glass aesthetic to all onboarding steps
- Consistent visual language throughout flow
- iOS-native feel

### Card-Based Selection (Horizontal Rails)
**Size:** L
**Description:** Use actual cards in horizontal rails for subclasses, ancestry, community
**Notes:**
- Swipeable horizontal card rails
- Card components for each option
- Visual preview of what you're selecting
- Applies to: Subclass, Ancestry, Community steps

### Item Cards
**Size:** M
**Description:** Cards for items (armor, gear, weapons)
**Notes:**
- Card-based UI for equipment
- Consistent with other card selections
- Clear visual hierarchy

### Working Calculations
**Size:** M
**Description:** Make character calculations actually work
**Notes:**
- Changing armor updates damage thresholds
- Stats flow through correctly
- Real-time updates as selections change
- All derived values compute properly

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
**Notes:**
- Service worker caching
- Offline-first data sync
- Handle network errors gracefully

### Dark Mode
**Size:** M
**Description:** System dark mode support
**Notes:**
- Design tokens already support this
- Need to test all components
- Gradient backgrounds may need adjustment

### Dice History
**Size:** S
**Description:** View past dice rolls
**Notes:**
- Already tracked in rollHistory
- Need UI to view history
- Maybe show stats/trends

### Sound Effects
**Size:** S
**Description:** Dice roll sounds, UI feedback
**Notes:**
- Optional, can be toggled
- Need small audio files
- Web Audio API

### Session Notes
**Size:** M
**Description:** Per-session note taking
**Notes:**
- Already have notes field
- Could add session-based organization
- Link to specific rolls/events

---

## Post-MVP

### Level Up Flow
**Size:** L
**Description:** Allow characters to level up
**Notes:**
- Need level tracking
- HP increases
- New domain cards
- Proficiency increases
- Foundation → Specialization → Mastery progression

### Multi-class Support
**Size:** XL
**Description:** Support character classes beyond Wizard (unlocks at level 5)
**Notes:**
- Current code hardcodes 'Wizard' in many places
- Would need class selection step in character creation
- Domain cards vary by class
- HP, evasion calculations are class-specific

---

## Tech Debt

### Add Unit Test Coverage
**Size:** M
**Notes:**
- core/ functions should have 100% coverage
- Current coverage is low
- Add tests as we extract logic

### TypeScript Strict Mode
**Size:** M
**Notes:**
- Enable stricter settings
- Fix remaining `any` types
- Add missing type annotations

---

## Ideas (Unscoped)

- Campaign/party management
- Initiative tracker
- Condition tracking
- NPC quick reference
- Combat log
- Spell slot tracking (if other classes added)
