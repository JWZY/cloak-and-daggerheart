# Architecture Decisions

This log tracks significant decisions made during development.

---

## 2026-02-14: Data-Driven Architecture from SRD JSON

**Decision:** All game mechanics and character data must be driven by the SRD JSON files, not hardcoded per class.

**Context:**
- v1 and v2 hardcoded Wizard-specific values throughout (class type literal, equipment, domain pool, HP, evasion)
- SRD audit revealed mechanical misunderstandings that propagated because rules were manually transcribed instead of read from data
- The SRD JSON (`daggerheart-srd-main/.build/json/`) already has complete, structured data for all 9 classes

**Choice:** Build the data pipeline generically — deck builder reads from class data, not Wizard-specific constants. MVP ships Wizard-only, but the architecture supports any class.

**Rationale:**
- **Correctness:** SRD JSON is the single source of truth. Reading from it eliminates transcription errors.
- **Scalability:** Adding a class = adding its SRD data, not writing new code paths
- **Maintainability:** No `if (class === 'Wizard')` branches to maintain

**Trade-offs:**
- Slightly more abstraction upfront vs. hardcoding
- Need to handle class-specific foundation features generically (e.g., Wizard School of Knowledge's "Prepared" grants +1 domain card)
- MVP still focuses on Wizard — not all 9 classes tested immediately

---

## 2026-02-13: v2 Card-Centric Pivot

**Decision:** Replace tab-based character sheet with a card-centric "hand" metaphor where character creation builds a deck and the play view is a card carousel.

**Context:**
- v1 used a traditional character sheet with tabs (Stats, Inventory, Cards)
- Daggerheart's game mechanics are card-driven — the sheet abstraction obscured this
- Swipe navigation between Home/Explore/Profile felt generic, not game-flavored

**Choice:**
- Character creation becomes a 7-step **deck builder** (`src/deck-builder/`) producing a hand of cards
- Play view becomes **HandView** (`src/hand/`) — hero card + card carousel + stat bar
- Three card primitives: SRDCard (subclass), DomainCard, InfoCard (ancestry/community)
- App flow: Splash -> DeckBuilder (if no characters) -> HandView (if character exists)
- Mobile: horizontal swipe carousel; Desktop: two-column grid layout

**Rationale:**
- **Game-native:** Cards are the core Daggerheart mechanic; the UI should reflect this
- **Simpler mental model:** "Your character is a hand of cards" vs. a form with tabs
- **Touch-first:** Swipe through cards feels better on mobile than tapping between tabs
- **Unified visual language:** All character data rendered through card components with shared SRD styling

**Trade-offs:**
- Lost the tab-based layout that was more conventional for character management
- Stats and equipment are now secondary (collapsible panels below the carousel)
- Harder to scan all character info at a glance vs. a traditional sheet
- Single app flow (no multi-view navigation) — simpler but less extensible

**Affected Files:**
- `src/app/App.tsx` — Simplified to Splash -> DeckBuilder -> HandView flow
- `src/deck-builder/` — New: DeckBuilder, 7 step components, StepIndicator, DeckPreview
- `src/hand/` — New: HandView, CardCarousel, HeroCard, StatBar, collapsible panels
- `src/cards/` — SRDCard, DomainCard, InfoCard, CardZoom, useCardZoom
- `src/store/character-store.ts` — Updated character type to match deck-built structure
- Removed: CharacterSheet views, StatsTab, InventoryTab, CardsTab, swipe-based multi-view nav

---

## 2026-02-02: Investiture Architecture Pattern

**Decision:** Adopt three-layer architecture: core/, content/, design-system/

**Context:**
- characterStore.ts has grown to 460 lines mixing business logic and state
- UI strings are hardcoded, blocking i18n
- Design tokens are scattered across CSS and config files

**Choice:**
```
src/
├── core/           # Pure business logic (no React, no side effects)
├── content/        # All user-facing content (i18n, SRD, constants)
├── design-system/  # Tokens and base components
├── components/     # Feature-specific components only
├── views/          # Page compositions
├── stores/         # Thin state layer
└── types/          # TypeScript definitions
```

**Rationale:**
- **Testability:** core/ has pure functions, easy to unit test
- **Separation:** Business logic doesn't depend on UI framework
- **i18n-ready:** content/ layer makes localization straightforward
- **Design consistency:** design-system/ provides single source of truth

**Trade-offs:**
- More files and directories
- Import paths are longer
- Need to update existing imports

**Affected Files:**
- characterStore.ts → moves logic to core/character/
- srd.ts → split into data loading (stays) and business logic (moves)
- TraitsStep.tsx → moves trait rules to core/rules/
- diceLogic.ts → moves to core/dice/

---

## 2026-02-02: Multi-Agent Development System

**Decision:** Enable parallel work via agent role files in .claude/agents/

**Context:**
- Single developer workflow limits parallelism
- Complex refactors benefit from specialized focus areas

**Choice:**
- Four agents: @orchestrator (PM), @frontend (dev), @ux (design), @creative (visual)
- Coordination via markdown files in .claude/agents/context/
- Handoffs are explicit to avoid conflicts

**Rationale:**
- Can run multiple Claude Code terminals simultaneously
- Clear ownership prevents merge conflicts
- Context files preserve state across sessions

**Trade-offs:**
- Overhead of maintaining context files
- Risk of stale information if not updated
