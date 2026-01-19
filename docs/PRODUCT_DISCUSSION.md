# Daggerheart Character Sheet - Product Discussion

## Vision
A mobile-first character sheet app for Daggerheart TTRPG that enables quick character creation, session tracking, and (stretch) real-time party sync.

## Requirements

### Core (Must Have)
1. **Mobile & web friendly** - Works great on phones, tablets, desktop
2. **Character creation** - Fast, accurate, uses official SRD data
3. **Session tracking** - Hope, damage, armor, items, domain cards

### Stretch Goal
4. **Party sync** - DM actions (damage, etc.) reflect on player sheets in real-time

## Constraints
- No server costs (for you or players)
- Preferably GitHub Pages hosting (free static hosting)
- Open to other free hosting options

---

## Feasibility Analysis

### Requirements 1-3: Very Feasible ✅

A static site can absolutely handle character creation and session tracking:
- **Data storage**: LocalStorage / IndexedDB (persists on device)
- **Character data**: Already have SRD JSON files in the repo
- **PWA**: Already set up - can work offline, install to home screen
- **Hosting**: GitHub Pages works perfectly

### Requirement 4 (Real-time Sync): This Is The Hard Part 🤔

Real-time sync typically needs a server. But there are workarounds:

| Approach | Pros | Cons |
|----------|------|------|
| **Firebase Realtime DB** | Generous free tier, easy real-time sync, works with static hosting | Google dependency, free tier has limits (100 simultaneous connections, 1GB storage) |
| **Supabase** | Free tier, real-time subscriptions, Postgres | Smaller free tier than Firebase |
| **WebRTC (PeerJS)** | True P2P, no server for data | Need signaling server (PeerJS has free one), more complex, all players must be online |
| **PartyKit** | Made for this use case, free tier | Newer service, another dependency |
| **Manual sync (no server)** | Zero dependencies, export/import JSON | Not real-time, requires manual action |

---

## Open Questions

### Usage Patterns
1. How many players typically in your sessions? (affects free tier viability)
2. How often would you use the sync feature vs just tracking locally?
3. Do players need to access their characters between sessions from different devices?

### Sync Requirements
4. Does sync need to be instant, or is "updates every few seconds" acceptable?
5. Should the DM have special controls (view all HP, apply damage to anyone)?
6. What happens if someone goes offline mid-session?

### Data & Accounts
7. Do you want user accounts, or anonymous/device-based?
8. Should characters be shareable/exportable as files?
9. Multiple characters per player?

### Scope
10. Is the stretch goal actually a stretch, or is it core to your vision?

---

## Notes / Decisions

### 2025-01-18: Initial Discussion

**Decisions made:**
- MVP ships without real-time sync (core features first)
- Party size: max 5 players including DM
- External services are acceptable

**Google Sheets as backend?** Rejected.
- Rate limits (100 req/100 sec), no real-time push, OAuth complexity
- Would be fighting the tool constantly

**Decision: Use Firebase Realtime DB for sync feature**
- Free tier is massive overkill for 5 players (100 connections, 1GB, 10GB/month)
- Purpose-built for real-time sync
- Offline support included
- Anonymous auth = no accounts needed, just room codes
- Works with GitHub Pages static hosting

---

## Proposed Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                         │
│              (Static React PWA hosting)                 │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Client App                          │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │ Character     │  │ Session       │  │ Party Sync  │ │
│  │ Creation      │  │ Tracking      │  │ (Firebase)  │ │
│  │ (SRD data)    │  │ (LocalStorage)│  │ [Stretch]   │ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌──────────────────────┐    ┌──────────────────────────┐
│    LocalStorage      │    │   Firebase Realtime DB   │
│  (Character data,    │    │   (Party sync only)      │
│   offline-first)     │    │   [Stretch goal]         │
└──────────────────────┘    └──────────────────────────┘
```

**Data flow:**
1. Character data lives in LocalStorage (yours, on your device)
2. When you join a "session", selective data syncs to Firebase (HP, armor, hope, conditions)
3. DM sees all players, can push damage/effects
4. Players see their own sheet update in real-time

---

## Proposed MVP Scope (No Firebase Yet)

### Phase 1: Character Creation
- [ ] Ancestry selection (with traits from SRD)
- [ ] Community selection
- [ ] Class + subclass selection
- [ ] Domain card selection (2 domains)
- [ ] Starting equipment
- [ ] Character summary/review

### Phase 2: Session Tracking
- [ ] HP / Armor / Hope tracking
- [ ] Stress tracking
- [ ] Inventory management
- [ ] Domain card hand (mark used/available)
- [ ] Conditions tracking
- [ ] Notes section

### Phase 3: Party Sync (Stretch)
- [ ] Firebase integration
- [ ] Create/join session with room code
- [ ] Real-time HP/status sync
- [ ] DM view (all players)
- [ ] DM actions (apply damage, conditions)

---

## Open Questions (Remaining)

~1. Do you want dice rolling in the app, or just tracking?~ **Yes - basic collapsible dice tray with +/- modifiers**
~2. Should leveling up be supported, or just level 1 creation?~ **Level 1 only for MVP, Wizard class only**
~3. Any specific session tracking features beyond HP/armor/hope/items/domains?~ **Roll history shared across party in sync mode**

---

## Refined MVP Scope

### Constraints (intentional limitations)
- **Wizard class only** (expand to other classes post-MVP)
- **Level 1 only** (no leveling system yet)
- All ancestries and communities available (they're class-agnostic)

### Phase 1: Character Creation (Wizard Only)
- [ ] Ancestry selection (with traits from SRD)
- [ ] Community selection
- [ ] Wizard class (auto-selected for MVP)
- [ ] Wizard subclass selection
- [ ] Domain card selection (2 domains, pick starting cards)
- [ ] Starting equipment (Wizard defaults)
- [ ] Assign stats/traits
- [ ] Character summary/review
- [ ] Save to LocalStorage

### Phase 2: Session Tracking + Dice
- [ ] View/edit character sheet
- [ ] HP / Armor / Hope tracking (tap to increment/decrement)
- [ ] Stress tracking
- [ ] Inventory management
- [ ] Domain card hand (mark used/available per session)
- [ ] Conditions tracking (stunned, frightened, etc.)
- [ ] **Dice tray** (collapsible)
  - d4, d6, d8, d10, d12, d20
  - +/- modifier input
  - Roll result display
  - Local roll history
- [ ] Notes section

### Phase 3: Party Sync (Stretch)
- [ ] Firebase integration
- [ ] Create/join session with room code
- [ ] Real-time HP/armor/hope/stress/conditions sync
- [ ] **Shared roll history** (all party members see all rolls)
- [ ] DM view (see all player stats)
- [ ] DM damage roller (roll + apply to specific player)

---

## Technical Notes

### Dice Tray UX
- Collapsible from bottom of screen (like the iOS keyboard)
- Quick-tap dice buttons: d4, d6, d8, d10, d12, d20
- Modifier field: +/- number
- "Roll" button shows result with animation
- History shows last N rolls (newest first)

### Roll History in Sync Mode
- Each roll includes: player name, dice type, modifier, result, timestamp
- Stored in Firebase under session
- All players subscribe to roll history
- DM rolls tagged differently (maybe different color?)

### Why Wizard First?
- Wizard has clear domain card usage patterns
- Spellcasting is the most complex - if it works for Wizard, simpler classes are easy
- Tests the full domain card UI thoroughly
- Two subclasses: School of Knowledge (extra cards), School of War (tankier battlemage)
- Domains: Codex + Splendor

---

## Data Available in SRD

The JSON files have everything we need:
- `classes.json` - All 9 classes with HP, evasion, domains, feats, backgrounds, connections
- `subclasses.json` - All subclass features (foundations, specializations, masteries)
- `ancestries.json` - Ancestry traits and features
- `communities.json` - Community backgrounds
- `domains.json` - Domain descriptions
- `abilities.json` - Domain cards (the spells/abilities)
- `weapons.json` - Weapon stats
- `armor.json` - Armor stats
- `items.json` - Equipment
- `consumables.json` - Potions, etc.

**Data quality looks good** - structured JSON, consistent schema, ready to use.

---

## Outstanding Questions - RESOLVED

### Dice Mechanics ✅
**Decision:** Full Duality Dice with interpretation.

Display format:
- `[13 with Fear]` - Fear die was higher
- `[14 with Hope]` - Hope die was higher
- `[Critical Success]` - Doubles

Includes modifier input (+trait, +proficiency, +bonuses).

### Domain Cards in Session ✅
**Decision:** Simple for MVP. Level 1 Wizard has only 2-3 cards total.

- School of War: 2 domain cards
- School of Knowledge: 3 domain cards (has "Prepared" foundation)

No vault/recall system needed at level 1. Just show the cards, maybe a "used this session" toggle.

---

## Final MVP Scope Summary

### What We're Building (Phase 1 + 2)

**Character Creation (Wizard Only, Level 1)**
- Pick ancestry (all available)
- Pick community (all available)
- Wizard class (auto-selected)
- Pick subclass: School of Knowledge OR School of War
- Domains: Codex + Splendor (class defaults, no choice)
- Select starting domain cards (2-3 based on subclass)
- Starting equipment (Greatstaff, Leather Armor defaults)
- Assign traits (suggested: -1, 0, 0, +1, +1, +2)
- Name, background questions, connections
- Save to LocalStorage

**Session Play**
- View character sheet
- Track: HP (5 slots), Armor, Hope, Stress
- Domain cards (simple list, "used" toggle)
- Inventory
- Conditions
- Notes

**Dice Tray**
- Duality Dice roll (2d12 Hope/Fear)
- Modifier input
- Result: "[X with Hope/Fear]" or "[Critical Success]"
- Roll history (local)

### What We're NOT Building (Yet)
- Other classes (just Wizard)
- Levels 2-10
- Vault/recall system
- Party sync (Firebase)
- Shared roll history
- DM view

### Tech Stack (Starting Fresh)

**Sacred (do not modify):**
- `daggerheart-srd-main/` - SRD content, source of truth for game data

**Everything else can be rebuilt.**

**Recommended Stack:**
- **Vite + React + TypeScript** - Fast dev, great for form-heavy UI, excellent TS support
- **Tailwind CSS** - Mobile-first, utility classes, fast iteration
- **Framer Motion** - iOS-native animations, gestures (swipe, spring physics)
- **Vaul** - iOS-style bottom sheets (for dice tray, card details)
- **Zustand** - Simple state management (cleaner than Context for this)
- **LocalStorage** - Character persistence (later: IndexedDB if needed)
- **PWA** - Offline support, installable on home screen
- **GitHub Pages** - Free static hosting

**Why this stack:**
- Vite/React/TS is battle-tested for complex interactive apps
- Character creation = lots of forms and state - React handles this well
- Framer Motion + Vaul give the iOS-native feel you want
- Zustand is dead simple for app state (current character, dice history, etc.)
- All works perfectly with static hosting

**Later (Phase 3):**
- Firebase Realtime DB - Party sync
- Firebase Anonymous Auth - Room codes without accounts

