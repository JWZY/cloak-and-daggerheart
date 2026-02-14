# Agent Handoffs

Notes passed between agents. Most recent at top.

---

## 2026-02-13 | v2 Card-Centric Rebuild — Complete

**From:** @orchestrator
**Branch:** `v2-card-centric`

### What was built (v2 rebuild)

**Deck Builder** — 7-step character creation wizard (`src/deck-builder/`)
- Steps: PickSubclass, PickDomainCards, PickAncestry, PickCommunity, AssignTraits, NameCharacter, ReviewDeck
- StepIndicator + DeckPreview components
- Spring-animated slide transitions between steps
- Desktop sidebar preview panel, hidden on mobile
- `deck-store.ts` manages draft state with `canProceed()` validation

**Hand View** — Post-creation character viewer (`src/hand/`)
- HeroCard (SRDCard of subclass), domain cards, ancestry/community InfoCards
- Mobile: CardCarousel (horizontal swipe) + StatBar + collapsible panels
- Desktop: two-column grid layout (hero card left, cards + stats right)
- CardZoom overlay for tap-to-expand on any card
- Panels: StatsPanel, EquipmentPanel, NotesPanel (all collapsible)
- Domain-accent theming (CSS custom properties from character's primary domain)

**Card Components** (`src/cards/`)
- SRDCard: subclass cards with masked banner, auto-fit title, gold typography
- DomainCard: rebuilt to match SRDCard visual language (domain-colored banner)
- InfoCard: ancestry/community cards with decorative title, feat lists
- CardFlip, CardBack, CardSelector, CardZoom + useCardZoom hook

**Design System** (`src/ui/`)
- GameButton: primary/secondary/ghost variants with forged-metal aesthetic
- GameBadge, GameInput, GlassPanel, SectionHeader

**Data Layer** (`src/data/`)
- card-mapper.ts: transforms SRD data into card component props
- srd.ts: loads classes, subclasses, ancestries, communities, equipment from JSON

**Stores**: character-store.ts (persisted, Zustand) + deck-store.ts (ephemeral draft)

**App Flow** (`src/app/App.tsx`)
- Splash screen -> DeckBuilder (if no characters) -> HandView (if character exists)
- Framer Motion transitions between states

### What works
- Full character creation flow (Wizard only, level 1)
- 14 E2E tests passing across 4 spec files
- All SRD card deltas reviewed and locked in
- Domain color system data-driven from SRD
- Responsive: mobile carousel vs desktop grid

### Pick up here
- ~~4 code bugs from SRD audit~~ **All fixed (2026-02-14)**
- ~~InfoCard scale prop~~ **Done (2026-02-14)** — matches DomainCard pattern, 7 consumer files cleaned up
- ~~Equipment selection step~~ **Done (2026-02-14)** — new PickEquipment step (8 total steps now), armor/weapon selection with tradeoff display, defaults to Wizard suggested build, armor feats modify evasion
- GameButton redesign already implemented (forged-metal aesthetic in place)
- No multi-class support yet (Wizard-only) — v3 principle captured
- **v3 naming principle:** rename SRDCard→SubclassCard, split InfoCard→AncestryCard/CommunityCard
- Card description truncation fixed: first sentence only (matches official cards)
