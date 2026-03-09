# Known Pitfalls — Read Before Every Task

This file captures hard-won lessons from past bugs. **Every @frontend agent must read this before starting work and verify none of these apply to their changes.**

---

## Horizontal Carousels & Scroll Containers

### Clipping on Hover/Scale (RECURRING — fixed 3+ times)

**The bug:** Items in a horizontal carousel get clipped at the top or sides when hovered, scaled, or lifted. This happens because `overflow: hidden` on the scroll container eats the transform.

**The fix — two-div pattern:**
- **Outer wrapper**: `overflow: hidden` — clips content to the visible area
- **Inner scroller**: `overflow-x: auto; overflow-y: visible` — scrolls horizontally, allows vertical overflow for hover effects
- Add `padding-top` to the inner scroller equal to the max lift/scale overshoot so the hover state has room

**Never do:** Put `overflow: hidden` directly on the scroll container. This kills hover lift, scale-up previews, and focus rings.

**Existing examples:**
- `CardHand.tsx` — does this correctly: no overflow-hidden wrapper, `overflowX: auto`, `overflowY: visible`, `paddingTop: liftY + 10`
- `CardCarousel.tsx` — uses Embla which requires `overflow-hidden` on viewport, but cards are scaled *down* (0.4x) so clipping isn't visible. If cards ever need to scale *up* on select, this will clip.

### Scroll Not Working on iOS

**The bug:** Horizontal scroll feels broken — no momentum, janky, or completely stuck on iOS Safari.

**The fix — always include all three:**
```css
overflow-x: auto;
-webkit-overflow-scrolling: touch;  /* iOS momentum scrolling */
scrollbar-width: none;              /* Hide scrollbar (Firefox) */
```
Plus hide WebKit scrollbar:
```css
.my-scroller::-webkit-scrollbar { display: none; }
```

**Existing pattern:** See `CardHand.tsx`, `PickSubclass.tsx` ClassFilterBar, `HandView.tsx`

### Embla Carousel Gotchas

- `ref` goes on the **viewport div** (the one with `overflow-hidden`), NOT a wrapper above it
- `containScroll: 'trimSnaps'` prevents empty space at start/end
- If adding click/tap handlers on slides, use `emblaApi.clickAllowed()` to distinguish clicks from drags

---

## Images

### Low Resolution / Blurry Images

**The bug:** Images look pixelated or blurry, especially on retina displays.

**The fix:**
- Always set explicit `width` and `height` on image containers (never rely on intrinsic sizing)
- Use `object-fit: cover` with `object-position` for cropping control
- For card artwork: canonical size is `CARD_WIDTH=360` x `CARD_HEIGHT=508` from `card-tokens.ts` — render at full size and scale the container with `transform: scale()`, don't resize the image itself
- When scaling cards down: apply `transform: scale(x)` to a wrapper, keep the card rendering at full 360x508 inside. This preserves image sharpness.

**Never do:** Set a card or image container to a small pixel size and let the image downscale to fit. Always render at full resolution and use CSS transform to visually shrink.

**Existing pattern:** `CardCarousel.tsx` renders full `DomainCard` inside a `scale(0.4)` wrapper. `CardHand.tsx` uses `scale(${scale})` with `transformOrigin: 'top left'`.

### Image Sizing in Flex Containers

- Always use `flex-shrink: 0` on image containers inside flex layouts
- Set explicit dimensions — `width: Xpx; height: Ypx` — don't rely on the image's natural size
- For artwork bleeds (like `FlatDomainCard.tsx`): use `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover`

---

## Vertical Scrolling on Standalone Pages (RECURRING — broken 4+ times)

**The bug:** Lab/prototype pages (`?cards`, `?components`, `?aura`, etc.) can't scroll vertically. Content below the fold is unreachable.

**The root cause:** `body` and `#root` both have `overflow: hidden` in `index.css` (lines 112, 125). The main app manages its own scroll per-view, so the body never scrolls. Standalone pages that render directly into `#root` inherit this and get trapped.

**The fix — EVERY standalone page must set these on its root div:**
```tsx
style={{
  height: '100dvh',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
}}
```

**Never do:** Use `minHeight: '100dvh'` without explicit `overflowY: 'auto'` — the parent's `overflow: hidden` will still clip it.

**Existing examples that get this right:** `DesignSystem.tsx`, `PickerLab.tsx`

---

## Full-Viewport Background Overlays (EmberOverlay, glow, etc.)

**The bug:** Background effects (particles, gradients) that should cover the full viewport instead only cover the content height, scroll with the content, or get clipped by scroll containers.

**The root cause:** The DeckBuilder layout chain is deeply nested:
```
DeckBuilder (100dvh, flex)
  └─ flex-1 column (overflow-hidden, relative)
      └─ motion.div (absolute inset-0)
          └─ scrollable div (overflow-y-auto, paddingTop/Bottom)
              └─ step component
                  └─ background overlay (position:absolute) ← WRONG
```
Using `position: absolute` inside this chain means the overlay inherits the step component's height (which is only as tall as its content), not the viewport. It also scrolls with the content.

**The fix — use `position: fixed` for viewport-level overlays:**
```tsx
// EmberOverlay, accent glows, etc.
style={{
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
}}
```

**Why this works:** `position: fixed` is relative to the viewport, not any parent. It ignores all scroll containers, overflow clipping, and nesting depth. The overlay always covers the full screen.

**Corollary — step components don't need wrapper divs for overlays:**
```tsx
// WRONG — adds unnecessary nesting and height problems
return (
  <div style={{ position: 'relative', minHeight: '100%' }}>
    <EmberOverlay />
    <div style={{ position: 'relative', zIndex: 1 }}>...</div>
  </div>
)

// RIGHT — EmberOverlay is fixed, just render it alongside content
return (
  <>
    <EmberOverlay />
    <div>...</div>
  </>
)
```

---

## Layout & Positioning

### Safe Area Insets (Notch / Dynamic Island)

Always use `env(safe-area-inset-*)` for top/bottom padding on full-screen views:
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

### Viewport Height on Mobile

Use `100dvh` (dynamic viewport height), NOT `100vh`. The `vh` unit doesn't account for the mobile browser address bar appearing/disappearing.

### Z-Index for Hover States

When a card lifts or scales on hover, set `z-index: 100` (or higher than siblings) instantly — no transition on z-index. See `CardHand.tsx`:
```tsx
zIndex: isHovered ? 100 : i + 1
```

### Row Cards Must Have max-width

**The bug:** Row-style cards (like `FlatDomainCard`, class selection tiles, or any horizontal card layout) stretch to full screen width, which looks off — especially on wider viewports.

**The fix:** Always constrain row cards with `max-width: 360px` (`max-w-[360px]`), matching `CARD_WIDTH` from `card-tokens.ts`. This is the single canonical width — never use `max-w-sm` (384px) as an approximation. Apply the constraint on the card's outer wrapper, not on individual inner elements.

**Never do:** Let row-format cards fill 100% of their parent without a max-width cap.

---

## Component Patterns

### New Colors / Typography / Primitives

**Never introduce new colors, font styles, or UI primitives inline.** Use what exists:
- Typography: `typeTitle`, `typeSubtitle`, `typeBody`, `typeMicro` from `src/ui/typography.ts`
- Colors: CSS variables `--text-primary`, `--gold`, `--bg-surface`, etc.
- Components: `GameButton`, `GlassPanel`, `GameInput`, `SelectableOption` from `src/ui/`

If something new is genuinely needed, **stop and flag it to @orchestrator** before adding it.

### Framer Motion Transitions

- Import spring configs from `src/design-system/tokens/animations.ts` — don't hardcode `{ stiffness: 300, damping: 30 }` inline
- View entrances: `stiffness: 200-260, damping: 28, mass: 0.8-1`
- Don't use `duration`-based easings for layout animations — springs only

### E2E Testing Scaled Cards

**The bug:** Playwright's `click()` and `click({ force: true })` miss elements inside CSS `transform: scale()` wrappers because coordinate mapping is off.

**The fix:** Use `element.dispatchEvent('click')` instead, which fires the event directly on the DOM node and bubbles correctly through React's event system.

---

## Self-Check Before Completing a Task

Run through this before reporting back:

- [ ] New standalone page? Verify it scrolls vertically (`height: 100dvh` + `overflowY: auto`)
- [ ] Any horizontal scroll containers? Verify hover/scale states aren't clipped
- [ ] Any images added or modified? Verify they render sharp on retina (full-res + scale transform)
- [ ] Any scroll containers? Test iOS momentum scrolling (`-webkit-overflow-scrolling: touch`)
- [ ] Any new colors, fonts, or UI primitives? Flag to orchestrator first
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run build` succeeds
