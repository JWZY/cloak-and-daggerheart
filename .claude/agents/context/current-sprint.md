# Current Sprint

Last updated: 2026-02-14
Branch: `v2-card-centric`

## Active Tasks

### InfoCard scale prop
**Size:** S
**Description:** Add a `scale` prop to InfoCard (like DomainCard already has) for cleaner carousel rendering in HandView. Currently uses manual CSS transform wrapper.

### GameButton redesign
**Size:** M
**Description:** Redesign GameButton to forged-metal RPG aesthetic. Spec complete in `context/button-redesign.md`. Pewter frame, engraved text, corner ornaments.
**Status:** Spec done, implementation not started

---

## Blocked

_No blocked tasks_

---

## Recently Completed (v2 branch)

### v2 Card-Centric Rebuild
**Completed:** 2026-02-13
**Summary:** Full rebuild of the app around a card-centric metaphor.

Built:
- **Deck Builder** — 7-step wizard: PickSubclass, PickDomainCards, PickAncestry, PickCommunity, AssignTraits, NameCharacter, ReviewDeck
- **Hand View** — HeroCard + CardCarousel (mobile) / grid (desktop) + StatBar + collapsible panels
- **Card components** — SRDCard, DomainCard (rebuilt), InfoCard, CardFlip, CardBack, CardZoom
- **UI kit** — GameButton, GameBadge, GameInput, GlassPanel, SectionHeader
- **Data layer** — card-mapper.ts, srd.ts, deck-store.ts
- **App flow** — Splash -> DeckBuilder -> HandView with Framer Motion transitions
- **E2E tests** — 14 tests across 4 spec files, all passing

### SRD Card Delta Review
**Completed:** 2026-02-13
**Summary:** All 13 Figma deltas reviewed and locked in. Typography, layout, shadows, frame overlay all finalized. Delta comparison tool at `?cards` page.

---

## Historical (pre-v2, archived)

The following were completed on `main` before the v2 branch:
- [ARCH-001] Extract core logic to `src/core/`
- [ARCH-002] i18n content layer (`src/content/i18n/`)
- [ARCH-003] Design system extraction (`src/design-system/tokens/`)
- [ARCH-004] characterStore refactor (460 -> 411 lines)

All completed 2026-02-02. Details in git history.
