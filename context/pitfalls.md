# Pitfalls & Code Standards

Lessons learned from the prototype-to-production cleanup. Follow these rules when writing production code. The Design Lab (`?components`, `?cards`, `?pickers`) is exempt — prototyping freedom is fine there.

---

## 1. Never hardcode gold colors

**Wrong:**
```tsx
background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
```

**Right:**
```tsx
import { goldGradientStyle } from '../cards/card-tokens'
// or from '../ui/typography' for non-card contexts

<span style={{ ...goldGradientStyle }}>Gold Text</span>
```

**Available gold tokens** (all in `src/ui/typography.ts`):
- `goldLight` / `goldDark` — raw hex values
- `goldAccent` — solid gold fallback (`#d4af37`)
- `goldGradient` — CSS gradient string (vertical)
- `goldGradientH` — CSS gradient string (horizontal)
- `goldGradientStyle` — full background-clip text object (spread into style)
- `goldGradientSubtle` — low-opacity background gradient
- `goldDarkAlpha(n)` / `goldLightAlpha(n)` — gold with opacity (rgba helpers)
- `goldSeparatorLeft` / `goldSeparatorRight` — separator line gradients

## 2. Never hardcode hex colors in components

If you're reaching for a hex value like `#d4af37`, `#f9f8f3`, `#e7ba90`, or any `rgba(231,186,144,...)` — there's already a token for it.

**Exception**: Glass specular highlights (`rgba(249,248,243,0.1)` etc. in GlassPanel, SelectableOption) are part of the Liquid Glass system, not the gold color system. Those stay as-is.

**Exception**: DesignSystem.tsx (`?components`) can use hardcoded values since it documents the actual color values.

## 3. Use typography tokens, don't recreate them

**Wrong:**
```tsx
fontFamily: "'EB Garamond', serif",
fontWeight: 600,
fontVariant: 'small-caps',
letterSpacing: '0.06em',
fontSize: 13,
```

**Right:**
```tsx
import { typeSubtitle } from '../ui/typography'
<span style={{ ...typeSubtitle }}>Label</span>
```

**Typography tiers**: `typeTitle`, `typeSubtitle` (18px app), `typeSubtitleCard` (15px card), `typeBody`, `typeBodyCard`, `typeMicro` — see `src/ui/typography.ts`.

## 4. Keep components small — extract when they grow

**Rule of thumb**: If a component file exceeds ~300 LOC, look for extraction opportunities.

**Pattern to follow**: `src/deck-builder/` — orchestrator (`DeckBuilder.tsx` ~330 LOC) delegates to step files in `steps/` and shared components in `components/`.

**Anti-pattern**: `src/level-up/LevelUpWizard.tsx` at 906 LOC with all steps inline. (Backlogged for refactor — see `context/backlog.md`.)

**HandView pattern**: After refactoring, HandView.tsx is ~123 LOC and delegates to `CharacterHeader`, `LevelUpButton`, `CardZoomOverlay`, `DesktopLayout`, `MobileLayout`, `InlineSection`, `DomainCardBody` — all in `src/hand/`.

## 5. Don't duplicate layout blocks for responsive

**Wrong:** Two 70-line blocks of near-identical JSX for mobile vs desktop.

**Right:** Extract `<DesktopLayout>` and `<MobileLayout>` as separate components that share common subcomponents (like `CharacterHeader`, `InlineSection`). The parent just switches between them.

## 6. Prototype code vs production code

Prototyping is for exploring ideas fast — hardcoded values, inline styles, copy-paste are fine. But when code moves into the main app:

- Replace hardcoded values with tokens
- Extract repeated patterns into components
- Ensure imports come from centralized sources
- Run lint + build before considering it done

The Design Lab pages (`?components`, `?cards`, `?pickers`) are prototyping space. Everything under `src/app/`, `src/hand/`, `src/deck-builder/`, `src/cards/`, `src/ui/` is production.

## 7. No one-off font sizes — use the type scale

**Wrong:**
```tsx
const traitLabelStyle = { ...typeSubtitle, fontSize: 18 }
// or
<span style={{ fontSize: 15.6, fontFamily: "'EB Garamond', serif" }}>
```

**Right:** If you need a size that doesn't exist in the type scale, add it as a named token in `src/ui/typography.ts` — don't inline magic numbers. Every font size in production code should trace back to a token.

**Why:** One-off sizes compound fast. Even in prototyping, hardcoded sizes become the real thing because they rarely get cleaned up. A rogue `18px` here and a `15.6px` there and suddenly the design system has phantom tiers nobody tracks.

**Rule:** If a new size is needed, promote it to a token first, then use it. If you can't justify a token, use an existing tier.

## 8. Use `key` to force remount when identity changes — don't reset state manually

**Problem:** When a parent swaps data props on a child (e.g. different `character` passed to `HandView`), React reuses the same component instance. All `useState` and `useRef` values persist — stale tabs, open modals, zoom overlays, wizard state all leak across.

**Wrong:**
```tsx
// Whack-a-mole: manually resetting every piece of state
useEffect(() => {
  setActiveTab('cards')
  setShowGearMenu(false)
  setShowDeleteConfirm(false)
  // ...forgot showLevelUp, zoomedCard, etc.
}, [character.id])
```

**Right:**
```tsx
// In the parent, key by identity — React fully remounts, all state resets
<HandView key={character.id} character={character} />
// or for motion wrappers:
<motion.div key={`hand-${activeCharacter.id}`}>
  <HandView character={activeCharacter} />
</motion.div>
```

**Why:** Manual reset effects are fragile — every new `useState` added to the component is a potential leak if you forget to include it. A `key` change guarantees a full remount, resetting all state (useState, useRef, custom hooks) with zero maintenance burden.

**When to use `key`-based remount:**
- Component represents an **entity** (character, card, wizard) and the entity can change
- Component has significant local state (modals, tabs, overlays, form state)
- The cost of remounting is low (no expensive initializations)

**When manual reset is OK:**
- Only 1–2 values need resetting and the component is expensive to remount (e.g. heavy canvas, WebGL)
- You intentionally want to preserve some state across identity changes

## 9. Every full-page view MUST be its own scroll container

**Problem:** `body` and `#root` both have `overflow: hidden` (see `index.css` lines 112, 125). Content taller than the viewport gets clipped with no scrollbar.

**Root cause in the CSS:**
```css
body { overflow: hidden; }
#root { overflow: hidden; }
/* Comment: "Each view manages its own scroll — body never scrolls" */
```

**Wrong:**
```tsx
// Content overflows but nobody scrolls
<div style={{ minHeight: '100vh', padding: 24 }}>
  {/* Long content... */}
</div>
```

**Right:**
```tsx
// View is a fixed-height scroll container
<div style={{
  height: '100dvh',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
}}>
  {/* Long content scrolls inside this container */}
</div>
```

**Rule:** Every top-level page/view component (App views, lab pages, wizards) must set `height: 100dvh` (or `100vh`) and `overflowY: 'auto'` on its root element. Using `minHeight: 100vh` alone does nothing when the parent clips overflow.

**Checklist for new pages:**
1. Root div: `height: '100dvh'`
2. Root div: `overflowY: 'auto'`
3. Root div: `WebkitOverflowScrolling: 'touch'` (iOS momentum scroll)
4. Inner content uses padding, not fixed heights, to fill space
5. If content has a fixed bottom bar, add `paddingBottom` to the scroll container to clear it
