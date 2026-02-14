# GameButton Redesign — Fantasy Forged Metal Button

## Reference Analysis

The reference button ("CREATE") has a dark, forged-metal RPG aesthetic — pewter frame, engraved text, corner ornaments. Very different from our current gold-gradient button.

### Layer Breakdown (back to front)

| # | Layer | Description | Implementation |
|---|-------|-------------|----------------|
| 1 | **Drop shadow** | Soft dark elevation shadow beneath the entire button | CSS `box-shadow` |
| 2 | **Outer frame** | Metallic silver/pewter border, ~3px, with vertical gradient (lighter top edge → darker bottom) to simulate beveled metal | CSS border + `linear-gradient` on pseudo-element or nested div |
| 3 | **Inner groove** | Thin (~1px) dark recessed line inside the outer frame, creating a channel/inset effect | CSS `box-shadow: inset` or inner border |
| 4 | **Main surface** | Dark slate-blue steel background (#1a1f2e → #0f1219). Subtle texture like brushed metal or aged stone. Very slight top-to-bottom darkening gradient | CSS gradient. Texture via subtle noise pattern (CSS or tiny repeating image) |
| 5 | **Surface bevel** | The main panel appears slightly recessed — lighter hairline at bottom edge, darker shadow at top edge inside the groove | CSS `inset box-shadow` (top dark, bottom light) |
| 6 | **Inner guide lines** | Very faint horizontal engraved lines near top and bottom of the panel (like ruled lines on a plaque) | CSS pseudo-elements with thin gradients |
| 7 | **Corner ornaments** | Diamond-shaped metallic rivets/gems at the four corners (or at least left and right). Each has a bright center, darker surround, tiny highlight | **ASSET NEEDED** — or CSS diamonds with gradients (simpler) |
| 8 | **Text** | Serif small-caps, champagne/silver metallic color, engraved look with dark bottom shadow and light top highlight | CSS text with gradient fill + `text-shadow` |

### Color Palette (sampled from reference)

- **Outer frame light edge**: `#8a8d93` (top) → `#5a5d63` (bottom)
- **Outer frame mid**: `#6b6e74`
- **Inner groove**: `#1a1d22`
- **Surface dark**: `#151a24` center → `#0d1018` edges
- **Surface bevel light**: `rgba(255,255,255,0.06)` bottom hairline
- **Surface bevel dark**: `rgba(0,0,0,0.4)` top inset
- **Text face**: `#c8c0b4` → `#9e978b` (warm silver/champagne, NOT gold)
- **Text shadow (engrave)**: `rgba(0,0,0,0.7)` offset 0 1px
- **Text highlight**: `rgba(255,255,255,0.2)` offset 0 -1px
- **Corner ornament**: bright center `#b8b0a4`, surround `#4a4540`

### Key Differences from Current Button

| Aspect | Current (primary) | Reference |
|--------|------------------|-----------|
| Background | Bright gold gradient (#f9f8f3 → #e7ba90) | Dark slate steel (#151a24) |
| Border | Thin gold line (1px #C29734) | Thick pewter frame (~3px, beveled gradient) |
| Text color | Dark brown (#4d381e) on light bg | Light champagne/silver on dark bg |
| Text effect | Embossed (light top, dark bottom) | Engraved (dark shadow below, subtle highlight above) |
| Corner details | None | Diamond ornaments |
| Surface texture | Flat gradient | Subtle texture/noise |
| Overall feel | Warm, inviting, gold | Cool, forged, pewter/steel |

### Assets Needed From User

1. **Corner ornament SVG** — The diamond-shaped rivets are detailed enough that generating them purely in CSS would look cheap. A small SVG (~20x20px) of one corner ornament would be ideal. Alternatively, I can attempt CSS diamonds with gradients as a placeholder.

2. **Optional: noise texture** — A tiny (64x64) seamless noise PNG at very low opacity for the surface. Can be generated procedurally as a fallback.

### Assets We Can Generate

- All gradients (CSS)
- Bevel/groove effects (box-shadow)
- Text engraving effect (text-shadow + gradient)
- Inner guide lines (pseudo-elements)
- Simple diamond shapes for corners (CSS `transform: rotate(45deg)`)

---

## Build Plan (Incremental Steps)

### Step 1: Base Frame & Surface
Replace the current flat gold gradient with the dark steel surface + pewter frame.
- Dark gradient background
- 3px metallic border with vertical gradient
- Inner groove (inset shadow)
- Drop shadow for elevation
- Verify on `?components` page

### Step 2: Text Engraving
Switch text from dark-on-gold to light-on-dark engraved style.
- Champagne/silver gradient text fill
- Engrave effect: dark shadow below, light highlight above
- Keep EB Garamond small-caps

### Step 3: Surface Detail
Add the inner bevel and subtle guide lines.
- Inset shadows for recessed panel look
- Faint horizontal lines near top/bottom edges via pseudo-elements

### Step 4: Corner Ornaments
Add diamond ornaments at left and right edges (or all four corners).
- CSS diamond shapes as placeholder
- Position at vertical center, overlapping the frame
- Metallic gradient fill with highlight

### Step 5: Secondary & Ghost Variants
Adapt the secondary (Back button) and ghost variants to the new design language.
- Secondary: same frame but more muted, maybe thinner border
- Ghost: keep minimal, just text with subtle underline

### Step 6: Disabled State
- Reduce opacity, desaturate
- Remove hover/active effects

### Step 7: States & Interaction
- Hover: subtle inner glow or highlight shift
- Active/pressed: inset shadow deepens, slight downward shift
- Keep spring physics tap animation

---

## Variant Summary (after redesign)

| Variant | Frame | Surface | Text |
|---------|-------|---------|------|
| **Primary** | Full pewter frame, corner ornaments | Dark steel gradient | Champagne engraved |
| **Secondary** | Thinner frame, no ornaments | Same dark surface | Muted silver |
| **Ghost** | No frame | Transparent | Gold with underline |

## Files to Modify

- `src/ui/GameButton.tsx` — The only file. All changes are self-contained.
