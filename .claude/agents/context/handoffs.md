# Agent Handoffs

Notes passed between agents. Most recent at top.

---

## 2026-02-09 | SRD Subclass Card Design Lab — Day 1 Complete

**From:** @orchestrator
**Status:** In progress — typography and layout locked in, card frame and banner finalized

### What was built
- **`SRDCard` component** (`src/components/cards/SRDCard.tsx`) — reusable card for Daggerheart SRD subclass data
- **`SRDCardPage` design lab** (`src/views/SRDCardPage.tsx`) — WYSIWYG tweaker panel at `?srdcard`
- **5 sample cards**: Syndicate (Rogue), School of War (Wizard), School of Knowledge (Wizard), Call of the Slayer (Warrior), Divine Wielder (Seraph)

### Design decisions locked in
- **Typography**: EB Garamond for titles/footer/class name, Crimson Text for body
- **Title**: 36px, weight 400, small-caps, gold gradient text, heavy drop-shadow filter
- **Class name + Footer**: 13px, weight 500, small-caps, gold gradient text, heavy drop-shadow filter (all three share the same visual style)
- **Shadow approach**: `drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))` — other variants (text-shadow, light drop-shadow, solid gold) were tested and removed
- **Card border**: Textured SVG frame overlay (`public/images/card-frame.svg`) at 40% opacity, replacing CSS gradient border
- **Banner**: CSS `mask-image` approach (Figma-native) — all layers clipped to a single pennant mask SVG. Replaced the old SVG-shapes + clipPath polygon approach after side-by-side comparison showed cleaner edges
- **Card dimensions**: 360x508 (matches Figma frame)

### Key files
- `src/components/cards/SRDCard.tsx` — main card component with `MaskedBanner`, `DomainIconSvg`
- `src/components/cards/domain-icons.ts` — SVG path data for 6 domain icons (midnight, grace, codex, splendor, blade, bone)
- `src/views/SRDCardPage.tsx` — design lab with slider/toggle/select controls
- `public/images/card-frame.svg` — textured border frame (brushstroke style)
- `public/images/cards/banners/banner-mask.svg` — pennant mask shape for CSS masking
- `public/images/cards/banners/banner-texture.png` — texture overlay for banner
- `public/images/cards/subclass/*.png` — 5 character illustration PNGs

### What's next
- Fine-tune body text layout and spacing
- Add more subclass cards with different classes
- Consider making banner color/icons data-driven from SRD content
- Card back design
- Integration with main app navigation (currently only accessible via `?srdcard` query param)

---

## 2026-02-06 | @ux: Equipment Step Multi-Selection UX Spec

**From:** @ux
**To:** @frontend / @orchestrator

### Problem Statement

The Equipment/Gear selection step in character creation requires users to make 3 separate selections (Primary Weapon, Secondary Weapon, Armor), but the current horizontal card rail layout makes it unclear that:
1. There are exactly 3 categories to choose from
2. Which categories have been completed
3. What the overall progress is

Users may scroll through one section and miss the others entirely.

---

### Recommended Pattern: Accordion Checklist with Summary Cards

A hybrid pattern combining:
- **Accordion sections** that expand/collapse (one active at a time)
- **Progress indicator** showing completion state (0/3, 1/3, etc.)
- **Summary cards** for completed selections (tap to re-edit)

This pattern is inspired by:
- iOS Wallet card stacking
- E-commerce checkout flows (shipping -> payment -> review)
- Form wizards with collapsible completed sections

---

### Visual Layout (ASCII)

**Initial State (nothing selected):**
```
┌─────────────────────────────────────────┐
│  Choose Your Equipment                  │
│  Select weapons and armor    ○ ○ ○ 0/3  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚔️  Primary Weapon              [OPEN]  │
├─────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │Longbow │ │Rapier  │ │Staff   │  ...  │
│  │2d8 dmg │ │2d6 dmg │ │1d8 dmg │       │
│  └────────┘ └────────┘ └────────┘       │
│        << horizontal scroll >>          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚔️  Secondary Weapon (optional)    [ ]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🛡️  Armor                          [ ]  │
└─────────────────────────────────────────┘
```

**After selecting Primary Weapon:**
```
┌─────────────────────────────────────────┐
│  Choose Your Equipment                  │
│  Select weapons and armor    ● ○ ○ 1/3  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓ Primary Weapon                        │
│   Quarterstaff · 1d8 dmg · Melee  [tap] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚔️  Secondary Weapon (optional)  [OPEN] │
├─────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ None   │ │Dagger  │ │Sling   │  ...  │
│  │        │ │1d4 dmg │ │1d6 dmg │       │
│  └────────┘ └────────┘ └────────┘       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🛡️  Armor                          [ ]  │
└─────────────────────────────────────────┘
```

**All complete:**
```
┌─────────────────────────────────────────┐
│  Choose Your Equipment                  │
│  All selected!           ● ● ● 3/3  ✓   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓ Primary Weapon                        │
│   Quarterstaff · 1d8 dmg · Melee  [tap] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓ Secondary Weapon                      │
│   None                            [tap] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓ Armor                                 │
│   Leather Armor · Score 4         [tap] │
└─────────────────────────────────────────┘
```

---

### Interaction Flow

1. **On mount**: First incomplete section auto-expands (Primary Weapon by default)

2. **On selection**:
   - Current section collapses to summary card
   - Next section auto-expands
   - Progress indicator updates (dots + count)
   - Spring animation for collapse/expand

3. **Tapping collapsed section**:
   - Closes any open section
   - Opens tapped section for re-editing

4. **Auto-advance logic**:
   - Primary -> Secondary -> Armor (sequential)
   - Skip already-complete sections when advancing
   - Final section stays open until user explicitly continues

5. **Continue button**:
   - Enabled when Primary Weapon + Armor are selected (Secondary is optional)
   - Show "All selected!" confirmation state

---

### Progress Indicator Specs

**Visual:**
- 3 dots (○ empty, ● filled) with spacing
- Counter text: "1/3", "2/3", "3/3"
- Final checkmark when complete

**Colors (Liquid Glass):**
- Empty: `text-white/30`
- Filled: `text-emerald-300`
- Complete state: Full row gets emerald glow

---

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Secondary = "None" | Counts as complete (valid choice), shows "None" in summary |
| Armor = "Unarmored" | Counts as complete, shows "Unarmored · Score 3" |
| User skips sections | Allowed - can tap ahead, but progress tracks actual selections |
| Return to Equipment step | Restore previous selections, show collapsed summaries |
| Default selections on mount | Quarterstaff + Leather Armor pre-selected (current behavior preserved) |

---

### Animation Specs (Framer Motion)

**Collapse/Expand:**
```ts
const accordionVariants = {
  collapsed: { height: 'auto', opacity: 1 },
  expanded: { height: 'auto', opacity: 1 }
}

// Use AnimatePresence for enter/exit of card rail content
// Animate height with layout prop for smooth accordion
```

**Summary card entrance:**
```ts
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ type: 'spring', stiffness: 300, damping: 25 }}
```

**Progress dot fill:**
```ts
// Scale pulse on fill
initial={{ scale: 0.8 }}
animate={{ scale: 1 }}
transition={{ type: 'spring', stiffness: 400 }}
```

---

### Component Structure

```
EquipmentStep
├── Header (title + progress indicator)
├── EquipmentAccordion
│   ├── AccordionSection (Primary)
│   │   ├── CollapsedSummary (when collapsed)
│   │   └── ExpandedContent (horizontal card rail)
│   ├── AccordionSection (Secondary)
│   └── AccordionSection (Armor)
└── CompletionBanner (when 3/3)
```

**Suggested new components:**
- `AccordionSection` - reusable collapsible section with header, summary, content
- `EquipmentSummaryCard` - compact display of selected item
- `ProgressDots` - reusable 3-dot progress indicator

---

### Accessibility

- Accordion sections should be keyboard navigable (Enter/Space to toggle)
- Progress announced to screen readers ("1 of 3 selections complete")
- Clear focus indicators on expanded section
- ARIA: `aria-expanded`, `aria-controls` on accordion headers

---

### Implementation Priority

1. **P0**: Progress indicator (immediate value, simple)
2. **P1**: Collapse/expand accordion behavior
3. **P2**: Summary cards for completed selections
4. **P3**: Auto-advance between sections
5. **P4**: Polish animations

---

### References

- Current implementation: `src/views/CreateCharacter/EquipmentStep.tsx`
- Similar pattern in codebase: TraitsStep (uses completion tracking)
- Design tokens: Liquid Glass system in `src/index.css`

---

## 2026-02-06 | @creative: Card Game UI Visual Analysis

**From:** @creative
**To:** @frontend / @orchestrator

### Visual Design Analysis: Dark Atmospheric Card Game UI

A reference analysis of rich, atmospheric card game interfaces featuring teal/cyan accents, depth layering, and frosted glass tooltip panels. These techniques can enhance our Liquid Glass design system.

---

### 1. Color Palette

#### Primary Colors (Dark Foundation)

| Role | Color | Hex (Approx) | Usage |
|------|-------|--------------|-------|
| Deep Background | Near-black blue | `#0a0d14` | Base layer, creates depth |
| Mid Background | Dark slate | `#12161f` | Secondary surfaces |
| Surface | Muted charcoal | `#1a1f2a` | Card backgrounds, panels |

#### Accent Colors (Light & Focus)

| Role | Color | Hex (Approx) | Usage |
|------|-------|--------------|-------|
| Primary Accent | Teal/Cyan | `#4fd1c5` / `#38b2ac` | Glows, highlights, interactive elements |
| Secondary Accent | Ice Blue | `#63b3ed` | Secondary highlights, hover states |
| Warm Accent | Gold/Bronze | `#d69e2e` / `#b7791f` | Card frames, premium indicators |
| Warning/Energy | Amber | `#f6ad55` | Resource indicators, alerts |

#### Atmospheric Colors

| Role | Color | Hex (Approx) | Usage |
|------|-------|--------------|-------|
| Fog/Mist | Cool gray | `#718096` at 20-40% | Depth-of-field blur overlays |
| Shadow | Deep purple-black | `#1a0a1f` | Soft shadows, vignettes |
| Highlight | White | `#ffffff` at 5-15% | Edge highlights, specular |

#### CSS Token Suggestions

```css
:root {
  /* Card Game Dark Palette */
  --cg-bg-deep: #0a0d14;
  --cg-bg-mid: #12161f;
  --cg-bg-surface: #1a1f2a;

  --cg-accent-teal: #4fd1c5;
  --cg-accent-teal-glow: rgba(79, 209, 197, 0.4);
  --cg-accent-ice: #63b3ed;
  --cg-accent-gold: #d69e2e;
  --cg-accent-bronze: #b7791f;

  --cg-fog: rgba(113, 128, 150, 0.25);
  --cg-vignette: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
}
```

---

### 2. Depth and Layering System

#### Layer Stack (Back to Front)

```
┌─────────────────────────────────────────────────┐
│ Layer 0: Deep Background (blurred, atmospheric) │
├─────────────────────────────────────────────────┤
│ Layer 1: Fog/Depth-of-Field Overlay             │
├─────────────────────────────────────────────────┤
│ Layer 2: Secondary UI Panels (muted, recessed)  │
├─────────────────────────────────────────────────┤
│ Layer 3: Primary Cards (elevated, focused)      │
├─────────────────────────────────────────────────┤
│ Layer 4: Tooltips/Popovers (highest elevation)  │
├─────────────────────────────────────────────────┤
│ Layer 5: Glow Effects (additive blend)          │
└─────────────────────────────────────────────────┘
```

#### Elevation Techniques

**Featured Card (Layer 3):**
- Transform: `translateY(-8px)` or `scale(1.05)` for "lifted" appearance
- Shadow: Multi-layer drop shadow with color tint
- Glow: Subtle outer glow in accent color (teal/cyan)

```css
.card-featured {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    /* Inner depth */
    0 2px 4px rgba(0, 0, 0, 0.3),
    /* Mid shadow */
    0 8px 16px rgba(0, 0, 0, 0.4),
    /* Outer shadow */
    0 16px 32px rgba(0, 0, 0, 0.3),
    /* Accent glow */
    0 0 40px var(--cg-accent-teal-glow);
}
```

**Recessed Elements (Layer 2):**
- Inset shadows to appear "pushed in"
- Lower contrast, muted colors
- No outer glow

```css
.panel-recessed {
  background: rgba(255, 255, 255, 0.02);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

---

### 3. Glass/Frosted Tooltip Panels

#### Anatomy of a Tooltip Panel

```
┌──────────────────────────────────────────┐
│ ▌ Colored left border (accent indicator) │
│ ▌                                        │
│ ▌  HEADER TEXT (uppercase, small)        │
│ ▌  Body content with softer opacity      │
│ ▌                                        │
│ ▌  • Bullet points or stats              │
│ ▌  • Additional details                  │
│ ▌                                        │
└──────────────────────────────────────────┘
```

#### Key Visual Elements

1. **Left Border Accent**
   - Width: 3-4px solid
   - Color: Matches content type (teal for abilities, gold for items, etc.)
   - Creates visual categorization

2. **Frosted Glass Background**
   - Background: `rgba(20, 25, 35, 0.85)` - nearly opaque dark
   - Backdrop-filter: `blur(8px) saturate(120%)`
   - Subtle gradient overlay for depth

3. **Border Treatment**
   - Border: `1px solid rgba(255, 255, 255, 0.08)`
   - Subtle, almost invisible but adds definition
   - Top edge may have brighter highlight line

4. **Inner Glow**
   - Very subtle inner shadow at top: `inset 0 1px 0 rgba(255, 255, 255, 0.05)`
   - Creates "glass edge" effect

#### CSS Implementation

```css
.tooltip-glass {
  /* Nearly opaque dark base */
  background: linear-gradient(
    180deg,
    rgba(26, 31, 42, 0.92) 0%,
    rgba(18, 22, 31, 0.95) 100%
  );

  /* Frosted effect */
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);

  /* Subtle border */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;

  /* Left accent border */
  border-left: 3px solid var(--cg-accent-teal);

  /* Depth shadows */
  box-shadow:
    /* Top highlight */
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    /* Outer shadow */
    0 8px 32px rgba(0, 0, 0, 0.5),
    /* Subtle glow from accent */
    -4px 0 16px rgba(79, 209, 197, 0.1);
}
```

#### Color Variants for Left Border

| Content Type | Border Color | Semantic Meaning |
|--------------|--------------|------------------|
| Ability/Skill | Teal `#4fd1c5` | Active actions |
| Item/Equipment | Gold `#d69e2e` | Loot, gear |
| Status Effect | Purple `#9f7aea` | Buffs/debuffs |
| Damage/Combat | Red `#fc8181` | Hostile actions |
| Healing/Support | Green `#68d391` | Beneficial effects |
| Information | Ice Blue `#63b3ed` | Neutral info |

---

### 4. Lighting and Glow Effects

#### Principles

1. **Single Light Source Convention**
   - Light appears to come from above and slightly in front
   - Top edges catch light (specular highlights)
   - Bottom edges fall into shadow
   - Consistent across all elements

2. **Glow as Focus Indicator**
   - Glow draws attention to interactive/important elements
   - Never use glow on background elements
   - Glow color indicates element type (teal = ability, gold = item)

3. **Glow Implementation Layers**

```css
/* Outer glow - soft, wide spread */
box-shadow: 0 0 40px rgba(79, 209, 197, 0.3);

/* Inner highlight - concentrated */
box-shadow: inset 0 0 20px rgba(79, 209, 197, 0.1);

/* Edge highlight - crisp top edge */
box-shadow: inset 0 1px 0 rgba(79, 209, 197, 0.4);
```

#### Glow Animation (Subtle Pulse)

```css
@keyframes glow-pulse {
  0%, 100% {
    box-shadow:
      0 0 30px rgba(79, 209, 197, 0.25),
      0 0 60px rgba(79, 209, 197, 0.1);
  }
  50% {
    box-shadow:
      0 0 40px rgba(79, 209, 197, 0.35),
      0 0 80px rgba(79, 209, 197, 0.15);
  }
}

.card-selected {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

#### Depth-of-Field Blur (Background Atmosphere)

- Background cards/elements: `filter: blur(2-4px)`
- Creates cinematic focus effect
- Foreground elements remain sharp
- Use sparingly - only for distant/inactive elements

```css
.card-background {
  filter: blur(3px);
  opacity: 0.7;
}

.card-foreground {
  filter: none;
  opacity: 1;
}
```

---

### 5. Typography Hierarchy

#### Text Scale

| Level | Size | Weight | Color | Use Case |
|-------|------|--------|-------|----------|
| Display | 24-32px | Bold (700) | White | Card names, headers |
| Title | 18-20px | Semibold (600) | White 90% | Section titles |
| Body | 14-16px | Regular (400) | White 70% | Descriptions, rules |
| Caption | 11-13px | Medium (500) | White 50% | Labels, metadata |
| Micro | 10px | Bold (700) | Accent color | Tags, badges |

#### Typography Treatments

**Card Title (Display)**
```css
.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: -0.02em;
}
```

**Tooltip Header (Caption, Uppercase)**
```css
.tooltip-header {
  font-size: 0.6875rem; /* 11px */
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

**Body Text (Readable)**
```css
.body-text {
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}
```

**Stat/Number (Emphasis)**
```css
.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cg-accent-teal);
  font-variant-numeric: tabular-nums;
}
```

#### Color Usage in Typography

- **White (100%)**: Most important text, card names
- **White (70-80%)**: Secondary text, descriptions
- **White (50%)**: Muted labels, metadata
- **Accent Teal**: Interactive text, links, stats
- **Accent Gold**: Rewards, bonuses, premium content
- **Muted Gray**: Disabled, unavailable options

---

### 6. Application to Liquid Glass System

#### Recommended Enhancements

**1. Add Teal Accent to Design Tokens**

```css
:root {
  /* New accent colors */
  --lg-accent-teal: #4fd1c5;
  --lg-accent-teal-glow: rgba(79, 209, 197, 0.3);
  --lg-accent-gold: #d69e2e;
}
```

**2. New Glass Variant: `.glass-tooltip`**

For info panels and tooltips with left-border accent:

```css
.glass-tooltip {
  background: linear-gradient(
    180deg,
    rgba(26, 31, 42, 0.9) 0%,
    rgba(18, 22, 31, 0.95) 100%
  );
  backdrop-filter: blur(8px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid var(--lg-accent-teal);
  border-radius: 8px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.4);
}
```

**3. New Glass Variant: `.glass-elevated`**

For featured cards with glow effect:

```css
.glass-elevated {
  /* Extend base .glass */
  transform: translateY(-4px);
  box-shadow:
    /* Glass base shadows */
    inset 0 1px 1px rgba(var(--lg-spec-color), var(--lg-spec-primary)),
    inset 0 1.5px 3px rgba(var(--lg-spec-color), var(--lg-spec-secondary)),
    inset 0 -1px 1px rgba(var(--lg-shadow-color), var(--lg-shadow-primary)),
    /* Enhanced drop shadow */
    0 8px 24px rgba(0, 0, 0, 0.4),
    /* Accent glow */
    0 0 32px var(--lg-accent-teal-glow);
}
```

**4. Glow Selection States**

```css
.glass-selected-teal {
  @apply ring-2 ring-teal-400/40;
  box-shadow:
    inset 0 1px 1px rgba(var(--lg-spec-color), var(--lg-spec-primary)),
    inset 0 1.5px 3px rgba(var(--lg-spec-color), var(--lg-spec-secondary)),
    inset 0 -1px 1px rgba(var(--lg-shadow-color), var(--lg-shadow-primary)),
    0 0 24px rgba(79, 209, 197, 0.25),
    0 4px 16px rgba(var(--lg-shadow-color), var(--lg-drop-shadow));
}

.glass-selected-gold {
  @apply ring-2 ring-amber-400/40;
  box-shadow:
    inset 0 1px 1px rgba(var(--lg-spec-color), var(--lg-spec-primary)),
    inset 0 1.5px 3px rgba(var(--lg-spec-color), var(--lg-spec-secondary)),
    inset 0 -1px 1px rgba(var(--lg-shadow-color), var(--lg-shadow-primary)),
    0 0 24px rgba(214, 158, 46, 0.25),
    0 4px 16px rgba(var(--lg-shadow-color), var(--lg-drop-shadow));
}
```

**5. Typography Classes**

```css
.text-glass-accent-teal {
  color: var(--lg-accent-teal);
  text-shadow: 0 0 8px var(--lg-accent-teal-glow);
}

.text-glass-accent-gold {
  color: var(--lg-accent-gold);
}

.text-glass-display {
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
```

---

### 7. Summary: Key Takeaways

1. **Rich, layered depth** - Use multiple shadow layers and subtle transforms to create Z-axis hierarchy

2. **Colored accent borders** - Left-border accents on panels provide instant visual categorization

3. **Controlled glow** - Use glow sparingly for focus/selection, with colors that match semantic meaning

4. **Near-opaque tooltip glass** - Tooltip panels are MORE opaque than our current glass for better readability

5. **Atmospheric backgrounds** - Depth-of-field blur on inactive elements creates cinematic focus

6. **Typography contrast** - Large contrast between display text (white, bold) and body text (muted, regular)

7. **Consistent light source** - Always light from above; top edges bright, bottom edges shadow

---

### 8. Files to Modify

To implement these enhancements:

1. **`src/index.css`**
   - Add new CSS variables for accent colors
   - Add `.glass-tooltip`, `.glass-elevated`, `.glass-selected-teal`, `.glass-selected-gold`
   - Add typography utilities

2. **`src/design-system/tokens/colors.ts`** (if exists)
   - Export new color tokens for TypeScript usage

3. **`src/components/cards/PhysicalCard.tsx`**
   - Could benefit from `.glass-elevated` for selected state
   - Add accent glow on selection

4. **Future: `src/components/ui/Tooltip.tsx`**
   - New component using `.glass-tooltip` pattern
   - Left-border color prop for semantic variants

---

## 2026-02-06 | @frontend: Card Detail View Implementation Patterns

**From:** @frontend
**To:** @orchestrator / @ux / next @frontend session

### Technical Analysis: Card Game UI Patterns for Daggerheart

Implementation-focused analysis of card detail view patterns that could enhance domain cards, subclass cards, and equipment browsing. Complements @creative's visual analysis above.

---

### Pattern 1: Contextual Keyword Tooltips

**What it is:** Keywords within card text (e.g., "Recall", "Action", "Hope") become tappable, showing inline definitions.

**Implementation Approach:**

```tsx
// 1. Define keyword registry in src/core/rules/keywords.ts
export const KEYWORDS: Record<string, { term: string; definition: string }> = {
  recall: { term: 'Recall', definition: 'Spend Hope to activate this ability again.' },
  action: { term: 'Action', definition: 'Requires your action for the turn.' },
  hope: { term: 'Hope', definition: 'A resource spent to power abilities.' },
  // ... more keywords from SRD
}

// 2. Create a KeywordText component that parses and wraps keywords
interface KeywordTextProps {
  text: string
  onKeywordTap?: (keyword: string) => void
}

function KeywordText({ text, onKeywordTap }: KeywordTextProps) {
  const parsed = useMemo(() => parseKeywords(text, KEYWORDS), [text])

  return (
    <span>
      {parsed.map((segment, i) =>
        segment.isKeyword ? (
          <KeywordChip
            key={i}
            keyword={segment.keyword}
            onTap={() => onKeywordTap?.(segment.keyword)}
          />
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </span>
  )
}

// 3. KeywordChip with dotted underline styling
function KeywordChip({ keyword, onTap }: { keyword: string; onTap: () => void }) {
  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      className="text-amber-300 underline decoration-dotted decoration-amber-300/50
                 underline-offset-2 cursor-help"
    >
      {KEYWORDS[keyword].term}
    </motion.button>
  )
}
```

**Tooltip Display Recommendation:**

Use our existing `Sheet` component for mobile (long definitions) and a simple floating tooltip for quick terms. This avoids adding new dependencies.

```tsx
// Tooltip using existing patterns
function KeywordTooltip({ keyword, anchor }: { keyword: string; anchor: DOMRect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-tooltip absolute z-50 p-3 max-w-[280px]"
      style={{
        left: anchor.left,
        top: anchor.bottom + 8,
      }}
    >
      <h4 className="text-sm font-semibold text-white">{KEYWORDS[keyword].term}</h4>
      <p className="text-xs text-white/70 mt-1">{KEYWORDS[keyword].definition}</p>
    </motion.div>
  )
}
```

**Files to create:**
- `src/core/rules/keywords.ts` - Keyword definitions from SRD
- `src/components/ui/KeywordText.tsx` - Parser + renderer
- `src/components/ui/KeywordTooltip.tsx` - Floating tooltip

---

### Pattern 2: Card Focus / Detail View

**What it is:** Tapping a card in a list enlarges it to show full detail with context.

**Implementation with existing components:**

```tsx
// Using Sheet for mobile detail overlay
function CardDetailSheet({ card, open, onClose }: CardDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose} variant="glass" size="full">
      <div className="flex flex-col gap-4">
        {/* Full-size card rendering */}
        <DomainCard {...card} scale={0.9} />

        {/* Additional context */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Card Text</h3>
          <KeywordText text={card.description} />
        </div>

        {/* Related cards */}
        {card.relatedCards && (
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Related</h3>
            <div className="flex gap-2 overflow-x-auto">
              {card.relatedCards.map(c => (
                <CompactDomainCard key={c.id} {...c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  )
}
```

**Shared Layout Animation (Framer Motion):**

```tsx
// Card "morphs" from compact to full using layoutId
<motion.div layoutId={`card-${card.id}`}>
  {isExpanded ? <FullCard card={card} /> : <CompactCard card={card} />}
</motion.div>
```

**Responsive Behavior:**

| Screen | Behavior |
|--------|----------|
| Mobile (<768px) | Card detail as bottom Sheet overlay |
| Tablet (768-1024px) | Card detail slides in from right |
| Desktop (>1024px) | True split view, list + detail side-by-side |

---

### Pattern 3: Split View Layout (Card Browser)

**What it is:** Master-detail pattern with card list on one side, selected card detail on the other.

```tsx
// src/components/cards/CardBrowser.tsx
interface CardBrowserProps {
  cards: DomainCardData[]
  initialSelectedId?: string
}

function CardBrowser({ cards, initialSelectedId }: CardBrowserProps) {
  const [selectedId, setSelectedId] = useState(initialSelectedId)
  const selectedCard = cards.find(c => c.id === selectedId)

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Card list panel */}
      <div className="lg:w-80 lg:border-r border-white/10 overflow-y-auto">
        <CardList
          cards={cards}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Detail panel */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedCard ? (
            <motion.div
              key={selectedCard.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CardDetail card={selectedCard} />
            </motion.div>
          ) : (
            <EmptyState message="Select a card to view details" />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
```

**List item with domain color accent:**

```tsx
function CardListItem({ card, selected, onSelect }: CardListItemProps) {
  const domainColor = DOMAIN_COLORS[card.domain]

  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full text-left p-3 flex items-center gap-3",
        "border-l-4 transition-colors",
        selected
          ? "bg-white/10"
          : "bg-transparent hover:bg-white/5"
      )}
      style={{ borderLeftColor: selected ? domainColor : 'transparent' }}
    >
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: domainColor }}
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{card.title}</h4>
        <p className="text-xs text-white/50">{card.domain} * Level {card.level}</p>
      </div>
    </motion.button>
  )
}
```

---

### Pattern 4: Card Component Reuse (Size Variants)

**Current state:** We have `DomainCard` (full, 360x504) and `CompactDomainCard` (thumbnail, 140x196) as separate components.

**Improved approach - Single component with size prop:**

```tsx
type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'full'

const SIZE_CONFIG: Record<CardSize, {
  width: number
  showContent: boolean
  showArtwork: boolean
  titleLines: number
}> = {
  xs: { width: 80, showContent: false, showArtwork: false, titleLines: 1 },
  sm: { width: 120, showContent: false, showArtwork: true, titleLines: 2 },
  md: { width: 160, showContent: true, showArtwork: true, titleLines: 2 },
  lg: { width: 240, showContent: true, showArtwork: true, titleLines: 3 },
  full: { width: 360, showContent: true, showArtwork: true, titleLines: -1 },
}

interface UnifiedDomainCardProps {
  card: DomainCardData
  size?: CardSize
  selected?: boolean
  onClick?: () => void
}

function UnifiedDomainCard({ card, size = 'md', selected, onClick }: Props) {
  const config = SIZE_CONFIG[size]
  // Single component adapts based on size config
}
```

**Benefits:**
- Consistent styling across all sizes
- Single source of truth for domain colors, badges, borders
- Easier to maintain

---

### Pattern 5: Selection State Management

**Zustand store for browser state:**

```tsx
// src/stores/cardBrowserStore.ts
interface CardBrowserState {
  focusedCardId: string | null
  viewMode: 'grid' | 'list' | 'detail'
  filters: { domain?: string; level?: number; type?: string }

  setFocusedCard: (id: string | null) => void
  setViewMode: (mode: 'grid' | 'list' | 'detail') => void
  setFilter: (key: string, value: string | number | undefined) => void
  clearFilters: () => void
}

export const useCardBrowserStore = create<CardBrowserState>((set) => ({
  focusedCardId: null,
  viewMode: 'grid',
  filters: {},

  setFocusedCard: (id) => set({ focusedCardId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFilter: (key, value) => set((s) => ({
    filters: { ...s.filters, [key]: value }
  })),
  clearFilters: () => set({ filters: {} }),
}))
```

---

### Recommended Implementation Order

1. **Phase 1: Keyword System** (Foundation)
   - `src/core/rules/keywords.ts` - Daggerheart keyword definitions
   - `KeywordText` component - Parser + renderer
   - Tooltip using `.glass-tooltip` from @creative's spec

2. **Phase 2: Card Size Variants** (Refactor)
   - Unify `DomainCard` and `CompactDomainCard`
   - Add size prop with predefined configs
   - Update existing usages

3. **Phase 3: Card Browser View** (New Feature)
   - `CardBrowser` component with split view
   - Responsive behavior (sheet on mobile)
   - Zustand store for state

4. **Phase 4: Detail View Transitions** (Polish)
   - `layoutId` for smooth card morphing
   - Selection animations
   - Keyboard navigation

---

### Files to Create/Modify

**New files:**
- `src/core/rules/keywords.ts` - Keyword definitions
- `src/components/ui/KeywordText.tsx` - Keyword parser/renderer
- `src/components/ui/KeywordTooltip.tsx` - Tooltip display
- `src/components/cards/CardBrowser.tsx` - Split view browser
- `src/components/cards/CardListItem.tsx` - List item
- `src/stores/cardBrowserStore.ts` - Browser state

**Modified files:**
- `src/components/cards/DomainCard.tsx` - Add size variants
- `src/views/CharacterSheet/CardsTab.tsx` - Integrate browser pattern

---

### Dependencies

All required packages are already installed:
- `framer-motion` - Animations, layoutId
- `vaul` - Bottom sheets (Sheet component)
- `zustand` - State management

No new dependencies needed.

---

### Design Lab Testing

Add to `?cards` design lab:

```tsx
<section>
  <h2>Keyword Tooltips</h2>
  <KeywordText text="Spend 2 Hope to use this Action. On success, Recall this card." />
</section>

<section>
  <h2>Card Sizes</h2>
  <div className="flex gap-4 items-end">
    <UnifiedDomainCard card={testCard} size="xs" />
    <UnifiedDomainCard card={testCard} size="sm" />
    <UnifiedDomainCard card={testCard} size="md" />
    <UnifiedDomainCard card={testCard} size="lg" />
  </div>
</section>

<section>
  <h2>Split View Browser</h2>
  <CardBrowser cards={domainCards} />
</section>
```

---

### References

- Existing cards: `src/components/cards/DomainCard.tsx`, `PhysicalCard.tsx`
- Domain colors: `DOMAIN_COLORS` constant
- Glass styling: `src/index.css` (`.glass`, `.glass-tooltip` from @creative)
- Sheet component: `src/components/ui/Sheet.tsx`

---

## 2026-02-05 | @ux: DrumPicker Redesign Spec

**From:** @ux
**To:** @frontend

### Feature Spec: DrumPicker Horizontal Number Picker Redesign

#### User Story

As a player adjusting stats during gameplay, I want a faster way to navigate through numbers so that I can quickly set my HP, Stress, or other values without excessive scrolling through tick marks.

---

### Overview

Redesign the DrumPicker component from a vertical tick-mark ruler to a **horizontal row of centered numbers** where the selected value is prominently displayed under the indicator triangle.

**Current Design:**
- Large static number at top
- Scrollable tick marks below (like a ruler)
- Triangle indicator pointing down

**New Design:**
- Label with icon at top (e.g., "⚡ Stress")
- Triangle indicator below label
- Horizontal scrolling ROW OF NUMBERS as the picker itself
- Selected number centered, larger, and highlighted
- Adjacent numbers visible but faded

---

### Visual Layout

```
        ⚡ Stress            ← Label with icon
           ▼                 ← Triangle indicator pointing down
    2   3  [4]  5   6        ← Scrollable number row, 4 selected/centered
```

---

### Part 1: Header Section

#### Label + Icon
- Position: Top of sheet content
- Format: Icon (optional) + Label text (e.g., "⚡ Stress")
- Styling: `text-glass-primary` (white), `text-xs uppercase tracking-wide`
- Icon: Small inline, colored to match stat (red for HP, purple for Stress, etc.)

#### Triangle Indicator
- Position: Below label, centered
- Style: Downward-pointing triangle (border trick or SVG)
- Color: Matches stat color (red, purple, gold, blue)
- Size: ~16px width, ~12px height
- Animation: Subtle pulse when value changes (optional)

---

### Part 2: Number Row (The Picker)

#### Scrollable Container
- Overflow: `overflow-x-auto scrollbar-hide`
- Snap behavior: `snap-x snap-mandatory` with `snap-center`
- Padding: `px-4` for side breathing room
- Height: ~60px minimum to accommodate larger selected number

#### Number Styling

**Selected Number (Under Triangle):**
- Size: `text-4xl` or `text-5xl` (significantly larger than adjacent)
- Weight: `font-bold`
- Color: Stat color (red, purple, gold, blue)
- Background: Optional subtle highlight with `.glass-flat` or shadow

**Adjacent Numbers (±1, ±2 away):**
- Size: `text-lg` (noticeably smaller)
- Weight: `font-semibold`
- Color: `text-white/40` (faded)
- Opacity: Gradual fade as distance increases
- Interactivity: Tappable to select

**Far Numbers (±3+ away):**
- Size: `text-base`
- Color: `text-white/20` (heavily faded)
- May be hidden on very small screens

#### Number Items
- Spacing: `gap-3` between numbers
- Flex: `flex-none` to prevent compression
- Width: `w-8` for number containers (or more for touch targets)
- Center alignment: All numbers vertically centered with selected number

---

### Part 3: Interaction & Animation

#### Scrolling
- User scrolls horizontally through numbers
- Numbers rearrange continuously as scroll position changes
- No snapping mid-scroll (only on release)

#### Snap Behavior
- On release: Carousel snaps selected number to center under triangle
- Animation: Spring physics (embla-carousel default or Framer Motion)
- Duration: ~300ms with natural deceleration

#### Tap to Select
- Tapping any visible number scrolls it to center (select position)
- Small animation: `scale: 1.1` on tap for feedback
- Haptic feedback: `navigator.vibrate(10)` on snap (if supported)

#### Number Scaling
- Numbers that are farther from center should appear progressively smaller
- Create gradient from `text-5xl` (selected) → `text-lg` → `text-base`
- Opacity fades similarly: `text-white` → `text-white/40` → `text-white/20`

---

### Part 4: Edge Cases & Bounds

#### Minimum/Maximum Values
- Carousel should not scroll beyond min/max values
- At min (e.g., 0): number 0 is centered, no negative numbers visible
- At max (e.g., 6): number 6 is centered, no overflow visible

#### Small Screens (<360px width)
- Reduce number item spacing to `gap-2`
- Reduce text sizes slightly: `text-3xl` for selected instead of `text-5xl`
- May hide numbers beyond ±2 distance

#### Wide Screens (>=375px)
- Full spacing and sizing as specified above
- Show numbers up to ±3 distance

---

### Part 5: Color Tokens

Use stat-appropriate colors for the triangle and selected number text:

| Stat | Color Class | Hex |
|------|------------|-----|
| HP | `text-red-400` | #f87171 |
| Hope | `text-amber-400` | #fbbf24 |
| Stress | `text-purple-400` | #c084fc |
| Armor | `text-blue-400` | #60a5fa |

---

### Part 6: Component Props

```tsx
interface DrumPickerProps {
  // ... existing props (value, onChange, min, max, label, color, etc.)

  // New for horizontal design:
  // - All existing functionality remains
  // - Carousel now shows numbers as items instead of tick marks
  // - Selected number is centered and scaled up
}
```

No API changes needed—internal implementation changes only.

---

### Integration Notes

- Existing props: `value`, `onChange`, `min`, `max`, `label`, `color`, `icon`, `presets`, `maxValue`
- Keep Sheet trigger design unchanged
- Keep preset buttons below the number row (if implemented)
- All other functionality (validation, haptics, states) remains the same

---

### Acceptance Criteria

- [ ] Header shows label with icon at top
- [ ] Triangle indicator positioned below label, centered
- [ ] Horizontal scrollable row of numbers displayed
- [ ] Selected number (centered under triangle) is large and bold
- [ ] Adjacent numbers visible but progressively smaller/faded
- [ ] Scrolling updates which number is centered
- [ ] Snap behavior centers selected number on release
- [ ] Tapping a number scrolls it to center
- [ ] Min/max bounds enforced (no scroll overflow)
- [ ] Selected number color matches stat color
- [ ] Works on small screens with adjusted sizing
- [ ] Haptic feedback on snap (if navigator.vibrate available)
- [ ] Touch targets remain 44px+ minimum
- [ ] Sheet dismisses correctly (unchanged)
- [ ] Presets still appear below number row if specified (unchanged)

---

### Files to Modify

- `src/components/ui/DrumPicker.tsx` - Main redesign (carousel display, scaling, colors)
- `src/views/PickerDesignLab.tsx` - Update demo to show new visual

---



## 2026-02-05 | @tester: DrumPicker QA Report

**From:** @tester
**To:** @orchestrator / @frontend

### Test Report: DrumPicker Component

**Date:** 2026-02-05
**Tester:** @tester
**Test URL:** http://localhost:3000/cloak-and-daggerheart/?pickers

---

### Summary

The DrumPicker component has a **working foundation** but is **incomplete relative to the spec**. Core scroll mechanics work well, but several key features from the spec are missing. The edge fade implementation uses a different (and better) approach than spec suggested. Priority fixes needed for spec compliance.

---

### Behaviors Tested

| Behavior | Expected | Actual | Status |
|----------|----------|--------|--------|
| Scroll with momentum | iOS-like momentum scroll | Works via embla-carousel | PASS |
| Live display updates | Large number updates while scrolling | Updates via `onScroll` event | PASS |
| Bounds enforcement | Stays within min/max | `containScroll: 'keepSnaps'` handles this | PASS |
| Snap to discrete values | Snaps on release | Works via `settle` event | PASS |
| Edge fade | Gradient fade (no black boxes) | Uses CSS `mask-image` - works correctly | PASS |
| Triangle indicator | Points down, in stat color | Correctly positioned with border trick | PASS |

---

### Bugs Found

#### BUG-001: Embla Configuration Differs from Spec (LOW)

**Severity:** Low
**Location:** `src/components/ui/DrumPicker.tsx` line 114

**Expected (from spec):**
```tsx
containScroll: false
```

**Actual:**
```tsx
containScroll: 'keepSnaps'
```

**Impact:** Minimal - `keepSnaps` may actually be better for bounds enforcement. The scroll behavior still feels correct. **Consider this a design decision rather than a bug.**

---

#### BUG-002: Tick Spacing Too Narrow (MEDIUM)

**Severity:** Medium
**Location:** `src/components/ui/DrumPicker.tsx` line 197

**Expected (from spec):**
- Tick spacing: 48px between each tick

**Actual:**
- Uses `w-4` (16px) per tick container

**Impact:** The drum feels cramped on wider ranges (0-100). For small ranges (0-6), it's fine. For HP (0-20) it works but is a bit dense.

**Suggested Fix:**
```tsx
// Change line 197 from:
className="flex-none w-4 flex flex-col items-center justify-end"
// To:
className="flex-none w-12 flex flex-col items-center justify-end"
```

---

### Missing Features (Not Implemented)

#### MISSING-001: Quick-Select Presets (HIGH)

**Severity:** High - Core spec feature
**Spec Reference:** Part 3: Quick-Select Presets

**Expected:** Below the drum, preset buttons like:
- HP: "Empty", "Half", "-1", "Full"
- Stress: 0, 2, 4, 6
- Armor: "Empty", "Full"

**Actual:** No presets implemented at all.

**Impact:** Users must scroll to common values instead of one-tap selection. This defeats the "quick adjustment during gameplay" user story.

**Suggested Implementation:**
```tsx
interface DrumPickerProps {
  // ... existing props
  presets?: Array<number | { value: number; label: string }>
}

// Add below the HorizontalDrum:
{presets && (
  <div className="flex justify-center gap-2 mt-4">
    {presets.map((preset) => {
      const val = typeof preset === 'number' ? preset : preset.value
      const label = typeof preset === 'number' ? preset.toString() : preset.label
      return (
        <motion.button
          key={val}
          whileTap={{ scale: 0.95 }}
          onClick={() => { onChange(val); triggerHaptic() }}
          className="glass-flat-sm rounded-xl px-4 py-2 min-w-[48px] text-sm font-semibold text-white/70"
        >
          {label}
        </motion.button>
      )
    })}
  </div>
)}
```

---

#### MISSING-002: Max Value Display in Trigger (MEDIUM)

**Severity:** Medium - Spec explicitly requires this
**Spec Reference:** Part 1: Compact Trigger Design, lines 36-39

**Expected:** Trigger shows "3/6" format for stats with max (HP, Stress, Armor)

**Actual:** Trigger only shows current value (e.g., "12")

**Impact:** Users can't see their max at a glance. For HP, this means they don't know if 8 is nearly full or nearly empty.

**Suggested Fix:**
Add `maxValue` and `showMaxInTrigger` props:
```tsx
interface DrumPickerProps {
  // ... existing props
  maxValue?: number
  showMaxInTrigger?: boolean  // Default: true if maxValue provided
}

// In trigger display:
<span className="text-3xl font-bold text-white">
  {value}
  {maxValue && showMaxInTrigger !== false && (
    <span className="text-lg text-white/40">/{maxValue}</span>
  )}
</span>
```

---

#### MISSING-003: Haptic Feedback (LOW)

**Severity:** Low - Nice to have, not critical
**Spec Reference:** Part 5: Interactions

**Expected:** `navigator.vibrate(10)` on value snap and preset tap

**Actual:** No haptic feedback

**Suggested Fix:**
```tsx
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

// Call in onSettle and preset button clicks
```

---

#### MISSING-004: Warning States (LOW)

**Severity:** Low - Polish feature
**Spec Reference:** Part 6: Warning States

**Expected:**
- HP at 0: Pulsing red border on trigger
- Stress at max: Pulsing purple border on trigger

**Actual:** No warning states

---

#### MISSING-005: Trigger Value Color (LOW)

**Severity:** Low - Visual polish
**Spec Reference:** Part 1, Color Tokens table

**Expected:** Value text uses stat color (red for HP, amber for Hope, etc.)

**Actual:** Trigger value is always white. Only the triangle indicator uses the color prop.

**Location:** `src/components/ui/DrumPicker.tsx` line 56

**Suggested Fix:**
```tsx
// Change line 56 from:
<span className="text-3xl font-bold text-white">
// To:
<span className="text-3xl font-bold" style={{ color }}>
```

---

### Edge Cases Checked

| Case | Expected | Actual | Status |
|------|----------|--------|--------|
| Min value (0) | Stops at 0 | Works | PASS |
| Max value | Stops at max | Works | PASS |
| Wide range (0-100) | Scrollable | Works but cramped | PARTIAL |
| Rapid scrolling | Smooth | Smooth | PASS |
| Sheet dismiss | Closes on swipe/overlay tap | Works via Vaul | PASS |
| External value change | Syncs carousel position | Works via useEffect | PASS |
| Re-open sheet | Shows current value centered | Works | PASS |

---

### What's Working Well

1. **Core scroll mechanics** - Embla provides smooth momentum scrolling
2. **Live value updates** - Large display updates in real-time during scroll
3. **Snap behavior** - Values snap cleanly to discrete integers
4. **Edge fade** - CSS `mask-image` approach is cleaner than overlay divs (actually better than spec)
5. **Triangle indicator** - Positioned correctly, animates with color
6. **Tick mark animations** - Selected tick grows/highlights with spring animation
7. **Sheet integration** - Vaul drawer works correctly
8. **Glass styling** - Trigger and sheet use glass classes consistently

---

### What Needs Work

**Priority 1 - High (Spec Compliance):**
1. Add Quick-Select Presets (MISSING-001) - This is core to the UX spec
2. Add max value display in trigger (MISSING-002) - Spec explicitly requires "3/6" format

**Priority 2 - Medium (Polish):**
3. Increase tick spacing for better touch targets (BUG-002)
4. Add haptic feedback (MISSING-003)
5. Color the trigger value text (MISSING-005)

**Priority 3 - Low (Nice to Have):**
6. Add warning states for HP=0 and Stress=max (MISSING-004)

---

### Acceptance Criteria Status (from spec)

- [x] Compact trigger displays value with stat-appropriate color (PARTIAL - only triangle uses color)
- [ ] Trigger shows "X/Y" format for HP, Stress, Armor
- [x] Trigger shows just value for Hope (default behavior works)
- [x] Tapping trigger opens Vaul bottom sheet
- [x] Sheet displays large current value at top
- [x] Drum picker shows horizontal tick marks
- [x] Center indicator (triangle) shows selected position
- [x] Dragging drum scrolls through values
- [x] Drum snaps to nearest value on release
- [ ] Tapping tick mark selects that value (NOT IMPLEMENTED)
- [ ] Quick-select presets appear below drum (NOT IMPLEMENTED)
- [ ] Tapping preset jumps to that value (NOT IMPLEMENTED)
- [x] Sheet dismisses on swipe down or overlay tap
- [ ] Haptic feedback on value change (NOT IMPLEMENTED)
- [ ] Warning state for HP=0 (NOT IMPLEMENTED)
- [ ] Warning state for Stress=max (NOT IMPLEMENTED)
- [x] Touch targets meet 44pt minimum (trigger: 80px min-width)
- [x] Works with reduced motion preference (Framer Motion handles this)

**Checklist: 10/17 complete (59%)**

---

### Files Reviewed

- `src/components/ui/DrumPicker.tsx` - Main implementation (229 lines)
- `src/components/ui/Sheet.tsx` - Bottom sheet wrapper
- `src/views/PickerDesignLab.tsx` - Demo page with 3 DrumPicker instances
- `src/index.css` - Glass styling classes

---

### Recommendations for @frontend

1. **First**: Add the presets feature - this is the biggest gap from spec
2. **Second**: Add `maxValue` prop and "X/Y" display in trigger
3. **Third**: Apply color to trigger value text
4. **Fourth**: Add tap-to-select on tick marks (currently only drag works)
5. **Optional**: Add haptic feedback and warning states

The component is 60% complete. Core mechanics are solid. Missing features are well-defined and straightforward to add.

---

## 2026-02-03 | @ux: Drum Picker Component Spec (Spotify-Inspired)

**From:** @ux
**To:** @frontend

### Feature Spec: Drum Picker Component

#### User Story

As a player managing my character during a session, I want a quick and tactile way to adjust numeric values like HP, Hope, Stress, and Armor Slots so that I can track resources without interrupting gameplay.

---

### Overview

Create a "Drum Picker" component inspired by Spotify's playback speed control. The pattern consists of:

1. **Compact Trigger**: Inline display of current value that invites tapping
2. **Bottom Sheet Picker**: Full picker interface with visual drum/tick marks
3. **Quick-Select Buttons**: Preset value buttons for common adjustments

**Reference Inspiration:** Spotify's speed control shows current value (e.g., "1.5x" in green), opens a bottom sheet with a visual scale, tick marks, and preset buttons.

---

### Answers to @frontend's Open Questions

| Question | Answer |
|----------|--------|
| Slot display in compact mode? | Show text "3/6" format, not filled circles. Simpler and cleaner. |
| Preset button labels? | Use text labels: "Empty", "Half", "Full", "-1" for HP. Plain numbers for Hope/Stress. |
| Haptic feedback? | Yes, use `navigator.vibrate(10)` on value change where supported. |
| Max value display? | Show "X/Y" for HP, Stress, Armor. Show just "X" for Hope. |

---

### Component Architecture

```
<DrumPicker>
  ├── <DrumPickerTrigger>     // Compact inline display
  └── <DrumPickerSheet>       // Bottom sheet picker (via Vaul)
        ├── <DrumPickerHeader>   // Label + current value (large)
        ├── <DrumPickerDrum>     // Horizontal tick mark picker
        └── <DrumPickerPresets>  // Quick-select buttons
```

---

### Part 1: Compact Trigger Design

#### Visual Layout

**For stats WITH max (HP, Stress, Armor):**
```
┌───────────┐
│    3      │  <- Current value, large, colored
│   / 6     │  <- Max value, smaller, muted
│    HP     │  <- Label at bottom
└───────────┘
```

**For stats WITHOUT max (Hope):**
```
┌───────────┐
│    4      │  <- Current value only
│   Hope    │  <- Label at bottom
└───────────┘
```

#### Styling

```tsx
interface DrumPickerTriggerProps {
  value: number
  maxValue?: number           // Optional - shows "X/Y" format
  label: string
  color: 'red' | 'gold' | 'purple' | 'blue' | 'default'
  icon?: React.ReactNode
  disabled?: boolean
  onTap: () => void
}
```

**CSS:**
- Container: `.glass-flat-sm rounded-xl p-3 min-w-[72px] min-h-[72px]`
- Current value: `text-2xl font-bold` with color
- Max value: `text-sm text-white/40`
- Label: `text-xs uppercase tracking-wide text-white/50 mt-1`

**Color Tokens:**
| Stat | Color | Hex |
|------|-------|-----|
| HP | `text-red-400` | #f87171 |
| Hope | `text-amber-400` | #fbbf24 |
| Stress | `text-purple-400` | #c084fc |
| Armor | `text-blue-400` | #60a5fa |

**Touch Target:** Minimum 72x72px (exceeds 44pt iOS guideline)

**Tap Feedback:** `whileTap={{ scale: 0.95 }}`

---

### Part 2: Bottom Sheet Picker

#### Layout

```
┌──────────────────────────────────────┐
│            ═══════════              │  <- Drag handle
│                                      │
│              HOPE                    │  <- Label (small)
│                4                     │  <- Current value (5xl, colored)
│               / 6                    │  <- Max if applicable
│                                      │
│  ╔════════════════════════════════╗  │
│  ║         Center indicator       ║  │
│  ║              ▼                 ║  │  <- Fixed triangle
│  ║    |  |  |  |  |  |  |  |     ║  │  <- Scrollable ticks
│  ║    0  1  2  3  4  5  6        ║  │
│  ╚════════════════════════════════╝  │
│                                      │
│  ┌──────┐ ┌────┐ ┌────┐ ┌──────┐    │
│  │Empty │ │Half│ │ -1 │ │ Full │    │  <- Presets
│  └──────┘ └────┘ └────┘ └──────┘    │
│                                      │
└──────────────────────────────────────┘
```

#### Header Section

```tsx
<div className="text-center mb-6">
  <span className="text-xs uppercase tracking-wider text-white/50 block mb-2">
    {label}
  </span>
  <span className="text-5xl font-bold" style={{ color: statColor }}>
    {currentValue}
  </span>
  {maxValue && (
    <span className="text-xl text-white/40 ml-1">/ {maxValue}</span>
  )}
</div>
```

#### Drum Picker (Tick Mark Visualization)

**Design: Horizontal scale with fixed center indicator**

```
         ┌────────────────────────────┐
  Faded  │              ▼             │  Faded
  edge   │  │  │  │  │  │  │  │  │    │  edge
         │  0  1  2  3  4  5  6       │
         └────────────────────────────┘
              ← drag to scroll →
```

**Implementation:**
- Use `embla-carousel` with `align: 'center'`, `containScroll: false`
- Tick spacing: 48px between each tick
- Tick height: 24px (small), 36px (selected)
- Tick color: `bg-white/30` normal, `bg-white` selected
- Center indicator: `▼` triangle in stat color, fixed position
- Gradient fade edges: `from-black/80 to-transparent`

**Scroll Behavior:**
- Snap to nearest value on release (`dragFree: false`)
- Momentum with deceleration
- Haptic on snap: `navigator.vibrate(10)`

**Tap to Select:**
- Tapping a tick scrolls to center that value

---

### Part 3: Quick-Select Presets

**Preset Configurations by Stat:**

**HP (with dynamic max):**
```tsx
presets={[
  { value: 0, label: 'Empty' },
  { value: Math.floor(max / 2), label: 'Half' },
  { value: max - 1, label: '-1' },
  { value: max, label: 'Full' }
]}
```

**Hope (0-unlimited, but typically 0-6):**
```tsx
presets={[0, 2, 3, 5, 6]}  // Common Hope values
```

**Stress (0-6):**
```tsx
presets={[0, 2, 4, 6]}
```

**Armor Slots (with dynamic max):**
```tsx
presets={[
  { value: 0, label: 'Empty' },
  { value: max, label: 'Full' }
]}
```

**Preset Button Styling:**
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  className={cn(
    "glass-flat-sm rounded-xl px-4 py-2 min-w-[48px] min-h-[44px]",
    "text-sm font-semibold",
    isSelected && "ring-2 ring-white/40 bg-white/15"
  )}
  style={{ color: isSelected ? statColor : 'rgba(255,255,255,0.7)' }}
>
  {preset.label ?? preset.value}
</motion.button>
```

---

### Part 4: Full Component API

```tsx
interface DrumPickerProps {
  // Value control
  value: number
  onChange: (value: number) => void
  min?: number              // Default: 0
  max: number               // Required

  // Display
  label: string             // "HP", "Hope", "Stress", "Armor"
  color: 'red' | 'gold' | 'purple' | 'blue' | 'default'
  icon?: React.ReactNode    // Optional icon next to label
  showMaxInTrigger?: boolean  // Show "X/Y" in trigger (default: true if max provided)

  // Presets (optional)
  presets?: Array<number | { value: number; label: string }>
}
```

#### Usage Examples

```tsx
// HP with presets
<DrumPicker
  value={character.hp.current}
  max={character.hp.max}
  onChange={onHPChange}
  label="HP"
  color="red"
  presets={[
    { value: 0, label: 'Empty' },
    { value: Math.floor(character.hp.max / 2), label: 'Half' },
    { value: character.hp.max - 1, label: '-1' },
    { value: character.hp.max, label: 'Full' }
  ]}
/>

// Hope (no max display)
<DrumPicker
  value={character.hope}
  max={20}
  onChange={onHopeChange}
  label="Hope"
  color="gold"
  showMaxInTrigger={false}
  presets={[0, 2, 3, 5, 6]}
/>

// Stress
<DrumPicker
  value={character.stress.current}
  max={character.stress.max}
  onChange={onStressChange}
  label="Stress"
  color="purple"
  presets={[0, 2, 4, 6]}
/>

// Armor Slots
<DrumPicker
  value={character.armorSlots.current}
  max={character.armorSlots.max}
  onChange={onArmorChange}
  label="Armor"
  color="blue"
  presets={[
    { value: 0, label: 'Empty' },
    { value: character.armorSlots.max, label: 'Full' }
  ]}
/>
```

---

### Part 5: Interactions

| Interaction | Behavior |
|-------------|----------|
| Tap trigger | Opens bottom sheet |
| Drag drum | Scrolls through values |
| Release drum | Snaps to nearest value |
| Tap tick mark | Scrolls to that value |
| Tap preset | Jumps to preset value |
| Swipe down handle | Closes sheet |
| Tap overlay | Closes sheet |

**Haptic Feedback:**
```tsx
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

// Call on: value snap, preset tap
```

**Animation Specs:**
- Sheet open: `type: "spring", stiffness: 300, damping: 30`
- Scroll snap: Embla default with momentum
- Value counter: `type: "spring", stiffness: 500, damping: 30`

---

### Part 6: Warning States

**HP at 0:**
- Trigger has pulsing red border
- Use `@keyframes pulse-warning` animation

**Stress at max (6):**
- Trigger has pulsing purple border
- Text shows "BROKEN" indicator?

```css
@keyframes pulse-warning {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color), 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(var(--color), 0); }
}
```

---

### Part 7: Integration with StatsTab

**Current Pattern (slot circles):**
```tsx
<SlotDisplay current={hp.current} max={hp.max} onChange={onHPChange} label="HP" />
```

**New Pattern (drum pickers in grid):**
```tsx
<Card variant="glass" padding="md">
  <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Resources</h3>
  <div className="grid grid-cols-2 gap-3">
    <DrumPicker value={hp.current} max={hp.max} onChange={onHPChange} label="HP" color="red" ... />
    <DrumPicker value={stress.current} max={stress.max} onChange={onStressChange} label="Stress" color="purple" ... />
    <DrumPicker value={hope} max={20} onChange={onHopeChange} label="Hope" color="gold" showMaxInTrigger={false} />
    <DrumPicker value={armor.current} max={armor.max} onChange={onArmorChange} label="Armor" color="blue" ... />
  </div>
</Card>
```

---

### Acceptance Criteria

- [ ] Compact trigger displays value with stat-appropriate color
- [ ] Trigger shows "X/Y" format for HP, Stress, Armor
- [ ] Trigger shows just value for Hope
- [ ] Tapping trigger opens Vaul bottom sheet
- [ ] Sheet displays large current value at top
- [ ] Drum picker shows horizontal tick marks
- [ ] Center indicator (triangle) shows selected position
- [ ] Dragging drum scrolls through values
- [ ] Drum snaps to nearest value on release
- [ ] Tapping tick mark selects that value
- [ ] Quick-select presets appear below drum
- [ ] Tapping preset jumps to that value
- [ ] Sheet dismisses on swipe down or overlay tap
- [ ] Haptic feedback on value change (where supported)
- [ ] Warning state for HP=0 (pulsing red border)
- [ ] Warning state for Stress=max (pulsing purple border)
- [ ] Touch targets meet 44pt minimum
- [ ] Works with reduced motion preference

---

### Files to Create/Modify

1. **NEW: `src/components/ui/DrumPicker/index.tsx`**
   - Main component with trigger + sheet

2. **NEW: `src/components/ui/DrumPicker/DrumPickerDrum.tsx`**
   - Horizontal tick mark picker using embla-carousel

3. **NEW: `src/components/ui/DrumPicker/DrumPickerPresets.tsx`**
   - Quick-select button row

4. **MODIFY: `src/views/CharacterSheet/StatsTab.tsx`**
   - Replace SlotDisplay with DrumPicker triggers

5. **MODIFY: `src/views/PickerDesignLab.tsx`**
   - Add "Approach 6: Drum Picker (Spotify-style)" demo

6. **MODIFY: `src/index.css`**
   - Add `@keyframes pulse-warning` if needed

---

### Design Rationale

**Why this pattern?**

1. **Familiar**: Spotify's speed control is widely understood
2. **Visual**: Tick marks give spatial context for the value
3. **Fast**: Presets enable one-tap common adjustments
4. **Tactile**: Swipe + snap feels satisfying
5. **Compact**: Triggers fit in a grid without clutter

**Why NOT other patterns?**

- **Slot circles** (current): Tedious for frequent HP changes during combat
- **+/- steppers**: Too many taps for large adjustments
- **Direct input**: Keyboard disrupts gameplay flow
- **iOS wheel picker**: Less visual, harder to see range at a glance

---

### Dependencies

All libraries already installed:
- `vaul` - Bottom sheet
- `embla-carousel-react` - Horizontal scroll with snap
- `framer-motion` - Animations
- `lucide-react` - Icons

No new dependencies required.

---

## 2026-02-03 | @frontend: Drum Picker Research & Recommendation

**From:** @frontend
**To:** @orchestrator / @ux / next @frontend session

### Research: iOS-Style Drum Picker Component

#### Task
Research implementation approaches for a Spotify-style value picker that:
1. Shows as a compact value display inline
2. Opens a bottom sheet when tapped
3. Has a visual "drum" with tick marks showing the range
4. Allows swiping/dragging to change value
5. Has quick-select buttons for preset values

---

### Current State Analysis

#### What We Already Have

**Libraries installed:**
- `react-mobile-picker@1.2.0` - iOS-style vertical wheel picker
- `embla-carousel-react@8.6.0` - Carousel with momentum scrolling
- `framer-motion@11.0.3` - Animation and gesture handling
- `vaul@0.9.0` - Bottom sheet (Drawer component)

**Existing implementations in `src/views/PickerDesignLab.tsx`:**
1. **WheelPicker** - Vertical iOS wheel using react-mobile-picker
2. **HorizontalPicker** - Horizontal scroll with snap (embla-carousel)
3. **RulerPicker** - Scale/ruler with tick marks (embla-carousel, dragFree)
4. **NeumorphicSlots** - Tactile push-button slots
5. **CompactPicker** - Tap to open modal wheel picker

**Current stat display in `StatsTab.tsx`:**
- `SlotDisplay` component - tappable filled/empty circles
- `Counter` component in `src/components/ui/Counter.tsx` - +/- buttons
- Hope uses +/- buttons inline (lines 149-168)

---

### Library Options Evaluated

| Library | Pros | Cons |
|---------|------|------|
| **react-mobile-picker** (installed) | iOS-native feel, wheelMode support, already working in PickerDesignLab | Vertical only, styling requires CSS overrides |
| **react-wheel-picker** (ncdai) | Vercel-backed, inertia scrolling, infinite loop | Not installed, may duplicate functionality |
| **Embla Carousel** (installed) | Horizontal scrolling, snap, momentum, highly customizable | Not a "picker" - requires building selection UI |
| **Framer Motion** (installed) | Full gesture control, spring physics, animation | Requires building everything from scratch |
| **Custom scroll-snap CSS** | Zero dependencies | No momentum, less iOS-native feel |

---

### Recommendation: Hybrid Approach

**Use the existing CompactPicker pattern from PickerDesignLab as the foundation**, enhanced with:

1. **Display Layer**: Glass-styled tap target using existing `.lg-card` or `Card variant="glass"`
2. **Sheet Layer**: Our existing `Sheet` component (Vaul) for bottom sheet
3. **Picker Layer**: `react-mobile-picker` for the wheel (already proven working)
4. **Quick-Select**: Add preset buttons below the wheel

#### Why This Approach?

- **No new dependencies** - Uses only installed libraries
- **Proven patterns** - CompactPicker in PickerDesignLab already demonstrates the tap-to-open-wheel flow
- **Design system consistent** - Can use existing glass classes
- **iOS-native feel** - react-mobile-picker provides authentic wheel behavior

---

### Proposed Component API

```tsx
interface DrumPickerProps {
  // Value
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number

  // Display
  label: string
  icon?: React.ReactNode
  color?: string // For value text color accent

  // Optional presets (quick-select buttons)
  presets?: number[]

  // Slot display mode (for HP/Stress/Armor with visual slots)
  showSlots?: boolean
  slotMax?: number
}
```

#### Usage Examples

```tsx
// HP with slot display and presets
<DrumPicker
  value={hp}
  onChange={setHp}
  min={0}
  max={12}
  label="HP"
  icon={<Heart />}
  color="#ef4444"
  showSlots
  slotMax={12}
  presets={[0, 6, 12]} // Full, Half, Empty
/>

// Hope (no max, no slots)
<DrumPicker
  value={hope}
  onChange={setHope}
  min={0}
  max={20}
  label="Hope"
  icon={<Star />}
  color="#3b82f6"
  presets={[0, 2, 5]}
/>
```

---

### Implementation Plan

#### Phase 1: Core Component
1. Create `src/components/ui/DrumPicker.tsx`
2. Compact display (glass card with icon + label + value)
3. Tap opens Sheet with react-mobile-picker wheel
4. "Done" button closes sheet

#### Phase 2: Enhanced Features
1. Add preset quick-select buttons below wheel
2. Optional slot visualization in display mode
3. Color theming for different stat types

#### Phase 3: Integration
1. Replace Hope +/- buttons in StatsTab with DrumPicker
2. Add DrumPicker option to SlotDisplay (tap value to open picker)
3. Update CharacterSheet to use new picker pattern

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/ui/DrumPicker.tsx` | CREATE - Main component |
| `src/views/CharacterSheet/StatsTab.tsx` | MODIFY - Integrate DrumPicker |
| `src/views/PickerDesignLab.tsx` | MODIFY - Add DrumPicker demo section |

---

### Open Questions for @ux

1. **Slot display in compact mode?** Should HP show filled slots inline, or just "5/12" text?
2. **Preset button labels?** Icons, text, or values? (e.g., "Full", "Half" vs icons vs "12", "6")
3. **Haptic feedback?** Should we investigate navigator.vibrate() for value changes?
4. **Max value display?** Should the picker show "HP: 5" or "HP: 5/12" when max is relevant?

---

### References

- [react-mobile-picker GitHub](https://github.com/adcentury/react-mobile-picker)
- [react-wheel-picker (alternative)](https://github.com/ncdai/react-wheel-picker)
- Existing implementation: `src/views/PickerDesignLab.tsx` (Approach 5: CompactPicker)
- Current stat display: `src/views/CharacterSheet/StatsTab.tsx`

---

## 2026-02-03 | @ux: Breadcrumb Navigation for Character Creation

**From:** @ux
**To:** @frontend

### Feature Spec: Breadcrumb Navigation with Context-Aware Editing

#### User Story

As a player editing my character, I want to jump directly to the step I need to change so that I can make quick edits without stepping through the entire creation flow.

---

### Overview

Replace the current linear progress bar with clickable breadcrumbs and add context-aware entry points when editing from the character sheet.

**Current Pain Point:** Clicking Edit on the character sheet always starts at Step 1 (Ancestry), forcing users to tap "Continue" repeatedly just to change their domain cards or equipment.

**Solution:**
1. Breadcrumb navigation lets users jump to any completed step
2. Context-aware entry starts at the most relevant step based on which tab was active

---

### Breadcrumb UI Design

#### Visual Design

```
+------------------------------------------+
| Cancel              Edit Character       |
+------------------------------------------+
| [Ancestry] > [Community] > [School] > ... |  <- Breadcrumb bar
+------------------------------------------+
```

#### Component: `<Breadcrumbs />`

```tsx
interface BreadcrumbsProps {
  steps: Step[]
  currentStep: Step
  completedSteps: Set<Step>
  onStepClick: (step: Step) => void
}
```

#### Step Labels (Short Names)

| Step ID    | Label      | Icon    |
|------------|------------|---------|
| ancestry   | Ancestry   | User    |
| community  | Community  | Users   |
| subclass   | School     | BookOpen|
| cards      | Cards      | Layers  |
| traits     | Traits     | BarChart|
| equipment  | Gear       | Sword   |
| summary    | Review     | Check   |

#### Breadcrumb States

1. **Completed** (can navigate)
   - `text-glass-primary` with underline on hover
   - Checkmark icon indicator (subtle)
   - Tappable

2. **Current** (active)
   - `text-white font-semibold`
   - Subtle glow/highlight background
   - Not tappable (already here)

3. **Upcoming** (not yet reached)
   - `text-glass-muted opacity-50`
   - Not tappable in strict mode
   - Tappable in edit mode (see Navigation Logic)

#### Layout

- **Position:** Replace the gradient progress bar with breadcrumbs
- **Container:** `.glass-dark` header, same position
- **Scrollable:** Horizontal scroll for small screens with current step auto-scrolled into view
- **Touch targets:** Each breadcrumb is 44px minimum height
- **Separators:** Chevron (`>`) between steps, `text-glass-muted`

#### CSS Sketch

```css
.breadcrumb {
  @apply px-3 py-2 rounded-lg text-sm font-medium transition-all;
  min-width: 44px;
  min-height: 44px;
}

.breadcrumb-completed {
  @apply text-glass-primary cursor-pointer;
}
.breadcrumb-completed:hover {
  @apply bg-white/10 underline;
}

.breadcrumb-current {
  @apply text-white bg-white/15 font-semibold;
}

.breadcrumb-upcoming {
  @apply text-glass-muted opacity-50 cursor-not-allowed;
}

.breadcrumb-upcoming.editable {
  @apply cursor-pointer opacity-70;
}
```

---

### Navigation Logic

#### Rule 1: Can Always Go Back

Users can tap any completed step to return to it. State is preserved.

#### Rule 2: Forward Navigation in Edit Mode

When `isEditing === true`:
- Users CAN skip ahead to any step (even incomplete ones)
- This allows "I just want to change my equipment" without filling in traits first

When `isEditing === false` (new character):
- Users CANNOT skip ahead past the first incomplete step
- This ensures data is filled in order for new characters

#### Rule 3: State Preservation on Jump

When jumping backwards:
- All state is preserved (nothing is reset)
- User can make changes and continue forward again

When jumping forwards (edit mode only):
- Navigate directly to the target step
- If required data is missing (e.g., no subclass selected but jumping to cards), show inline warning but allow navigation

#### Rule 4: Validation at Review Step

The Summary/Review step validates ALL data before allowing "Save Changes":
- If any required field is missing, show which steps need attention
- Breadcrumb for incomplete steps shows warning indicator (yellow dot)

---

### Context-Aware Entry Points

#### Tab-to-Step Mapping

When user clicks Edit from CharacterSheet, start at a contextually relevant step:

| Active Tab   | Entry Step  | Rationale                              |
|--------------|-------------|----------------------------------------|
| Stats        | ancestry    | Stats come from ancestry/community     |
| Cards        | cards       | User wants to change domain cards      |
| Gear         | equipment   | User wants to change weapons/armor     |
| Notes        | summary     | Notes are adjacent to name/review      |

#### Implementation

1. **CharacterSheet passes context to App:**

```tsx
// CharacterSheet/index.tsx
interface CharacterSheetProps {
  character: Character
  onEdit: (context?: { activeTab: Tab }) => void
}

// In component:
<motion.button onClick={() => onEdit({ activeTab })}>
```

2. **App stores and passes entry step:**

```tsx
// App.tsx
const [editEntryStep, setEditEntryStep] = useState<Step | null>(null)

const handleEdit = (context?: { activeTab: Tab }) => {
  const entryStep = context?.activeTab
    ? TAB_TO_STEP_MAP[context.activeTab]
    : 'ancestry'

  startDraftFromCharacter(currentCharacter)
  setEditEntryStep(entryStep)
  setIsEditing(true)
}

// Pass to CreateCharacter:
<CreateCharacter
  entryStep={editEntryStep}
  isEditing={isEditing}
  ...
/>
```

3. **CreateCharacter initializes to entry step:**

```tsx
// CreateCharacter/index.tsx
const [currentStep, setCurrentStep] = useState<Step>(
  isEditing && entryStep ? entryStep : 'ancestry'
)
```

#### URL State (Optional Enhancement)

For deep linking support:
```
/edit?step=cards    // Opens edit mode directly to cards step
```

This can be implemented later if needed.

---

### Edge Cases

#### Edge Case 1: Invalid Data at Skipped Step

**Scenario:** User jumps to Equipment step, but never selected a subclass.

**Behavior:**
- Allow navigation (in edit mode)
- Show inline warning at the target step if dependencies are missing
- At Summary step, highlight which steps are incomplete
- "Save Changes" button disabled until all required data present

**Example Warning:**
```
+---------------------------------------+
| ⚠️ Missing subclass selection         |
| Some cards require a school. Go back  |
| to the School step to choose one.     |
| [Go to School Step]                   |
+---------------------------------------+
```

#### Edge Case 2: Saving from Any Step

**Question:** Can users save from any step or only at Summary?

**Answer:** Only at Summary step.

**Rationale:**
- Ensures user reviews all changes before committing
- Validates complete character data
- Prevents partial/broken characters

**Implementation:**
- "Save Changes" button only appears on Summary step
- Breadcrumbs show a subtle arrow to Summary: "Review your changes here"

#### Edge Case 3: Cancel Behavior

**From any step:** Cancel returns to CharacterSheet without saving.
- Show confirmation dialog if changes were made
- "You have unsaved changes. Discard and return to character sheet?"

#### Edge Case 4: Character with Legacy Data

If editing an old character missing new fields:
- Treat missing fields as incomplete steps
- Show warning on first edit: "Your character needs updating. Please review the highlighted steps."

---

### States

#### Empty State (N/A)
Not applicable - only shown for existing characters.

#### Loading State
If character data takes time to load into draft:
- Breadcrumbs show skeleton/pulse animation
- Content area shows "Loading character data..."

#### Error State
If draft initialization fails:
- Show error in glass container
- "Failed to load character. Try again."
- [Retry] [Cancel] buttons

#### Success State
After saving:
- Brief success toast: "Character updated"
- Transition back to CharacterSheet

---

### Interactions

#### Tap (Breadcrumb)
- Completed/Current: Navigate to that step
- Upcoming (edit mode): Navigate to that step
- Upcoming (create mode): No action (visual feedback only)

#### Swipe (Header)
- Left/right swipe on breadcrumb bar scrolls through steps
- Natural momentum scrolling

#### Long Press
- No special behavior on breadcrumbs

---

### Acceptance Criteria

- [ ] Progress bar replaced with horizontal scrollable breadcrumb bar
- [ ] Each breadcrumb shows step label with appropriate state styling
- [ ] Completed steps are tappable and navigate correctly
- [ ] Current step is visually highlighted
- [ ] In edit mode, all steps are tappable (forward navigation allowed)
- [ ] In create mode, only completed steps are tappable
- [ ] Breadcrumb bar uses `.glass-dark` styling consistent with header
- [ ] Touch targets meet 44px minimum
- [ ] Edit from Stats tab starts at Ancestry step
- [ ] Edit from Cards tab starts at Cards step
- [ ] Edit from Gear tab starts at Equipment step
- [ ] Edit from Notes tab starts at Summary step
- [ ] State is preserved when jumping between steps
- [ ] Summary step shows validation errors for incomplete steps
- [ ] Cancel shows confirmation if changes were made
- [ ] Works correctly on mobile Safari with safe areas

---

### Files to Modify

1. `src/views/CreateCharacter/index.tsx`
   - Replace progress bar with `<Breadcrumbs />` component
   - Add `entryStep` prop and initialize `currentStep` from it
   - Track completed steps state
   - Handle step jumping logic

2. `src/views/CharacterSheet/index.tsx`
   - Update `onEdit` to accept context with `activeTab`
   - Pass active tab when edit button clicked

3. `src/App.tsx`
   - Update `handleEdit` to accept and use tab context
   - Map tabs to entry steps
   - Pass `entryStep` to CreateCharacter

4. `src/components/ui/Breadcrumbs.tsx` (NEW)
   - Breadcrumb bar component
   - Step state rendering
   - Navigation callbacks

5. `src/views/CreateCharacter/SummaryStep.tsx`
   - Add validation warnings for incomplete steps
   - Highlight which steps need attention

---

### Design Notes

The breadcrumb approach was chosen over alternatives:
- **vs. Step pills:** Pills would clutter the header; breadcrumbs scale better
- **vs. Dropdown:** Dropdown requires extra tap; breadcrumbs are direct
- **vs. Bottom tabs:** Conflicts with existing bottom navigation bar

The glass aesthetic is maintained by using `glass-dark` for the header bar and subtle white/opacity variations for state changes.

---

### Dependencies

This spec assumes the duplicate navigation bug (BUG-001 in previous handoff) is fixed first. The breadcrumb system will use the unified bottom navigation pattern established by that fix.

---

## 2026-02-03 | @tester: Pre-Glass Redesign QA Report

**From:** @tester
**To:** @orchestrator / @frontend

### Test Report: Character Creation & Character Sheet

**Date:** 2026-02-03
**Tester:** @tester

---

### Summary

The app is in a **broken state** due to a partial glass redesign migration. E2E tests are failing because step components have inconsistent prop interfaces and duplicate navigation bars. Additionally, there are 404 errors for missing image assets. Unit tests pass but E2E coverage is insufficient.

---

### Test Results

| Test Suite | Status |
|------------|--------|
| Unit Tests (Vitest) | **PASS** - 33/33 tests |
| E2E Tests (Playwright) | **FAIL** - 2/2 tests failing |
| Build | **FAIL** - Blocked by E2E failures |

---

### Bugs Found

#### BUG-001: Step Components Have Duplicate Navigation (CRITICAL)

**Severity:** Critical
**Steps to Reproduce:**
1. Start character creation
2. Select an ancestry and click Continue
3. Select a community and click Continue
4. Observe the Subclass step

**Expected:** Single bottom navigation bar from parent CreateCharacter component
**Actual:** SubclassStep, DomainCardsStep, TraitsStep, EquipmentStep, and SummaryStep all render their OWN fixed bottom navigation bars that call `onNext`/`onBack` props which are no longer passed

**Root Cause:**
- The `CreateCharacter/index.tsx` was refactored to handle all navigation in a shared glass bottom bar
- `AncestryStep` and `CommunityStep` were updated to remove `onNext`/`onBack` props
- BUT `SubclassStep`, `DomainCardsStep`, `TraitsStep`, `EquipmentStep`, and `SummaryStep` still have their own bottom navs expecting these props
- These props are no longer passed from index.tsx, causing the buttons to be non-functional

**Files Affected:**
- `src/views/CreateCharacter/SubclassStep.tsx` - lines 75-82 (bottom nav)
- `src/views/CreateCharacter/DomainCardsStep.tsx` - lines 107-118 (bottom nav)
- `src/views/CreateCharacter/TraitsStep.tsx` - lines 184-191 (bottom nav)
- `src/views/CreateCharacter/EquipmentStep.tsx` - lines 201-208 (bottom nav)
- `src/views/CreateCharacter/SummaryStep.tsx` - lines 200-211 (bottom nav)

**Fix Required:** Remove the `onNext`, `onBack`, and bottom nav from these 5 components to match AncestryStep/CommunityStep pattern.

---

#### BUG-002: Missing Image Assets Causing 404 Errors (HIGH)

**Severity:** High
**Steps to Reproduce:**
1. Open the app
2. View character sheet with CardsTab
3. Check browser console

**Expected:** All images load successfully
**Actual:** 6x "Failed to load resource: 404 (Not Found)" errors

**Root Cause:**
PhysicalCard.tsx references incorrect image paths:
- `/images/cards/school-of-knowledge.avif` (WRONG)
- `/images/cards/school-of-war.avif` (WRONG)

But actual files are at:
- `/images/cards/domains/school-of-knowledge.avif` (CORRECT)
- `/images/cards/domains/school-of-war.avif` (CORRECT)

**File Affected:** `src/components/cards/PhysicalCard.tsx` - lines 180, 184

**Fix Required:** Update paths to include `/domains/` subdirectory.

---

#### BUG-003: E2E Test Click Interception (HIGH)

**Severity:** High
**Steps to Reproduce:**
1. Run `npm run test`
2. Observe the School of War test

**Expected:** Button clicks work
**Actual:** Playwright reports "subtree intercepts pointer events" - the fixed glass bottom bar overlaps the content area

**Root Cause:** The glass bottom nav bar with `fixed` positioning may be overlapping interactive elements, or there's a z-index conflict.

**File Affected:** `src/views/CreateCharacter/index.tsx` - line 213 (glass bottom nav)

---

### Edge Cases Checked

| Case | Expected | Actual | Status |
|------|----------|--------|--------|
| Empty name in Summary | Cannot create | Not tested (flow broken) | - |
| Very long name | Accepted | Not tested (flow broken) | - |
| Back navigation | State preserved | Works for Ancestry/Community steps | Partial |
| Selection deselection | Can change selection | Works in Ancestry/Community | Partial |
| Data persistence | Survives refresh | Unit tests pass | OK |
| HP calculation (School of War) | 6 HP | Unit tests confirm | OK |
| HP calculation (School of Knowledge) | 5 HP | Unit tests confirm | OK |
| Armor slot clamping | Clamps to max | Unit tests confirm | OK |
| Hope/Stress updates | Proper bounds | Unit tests confirm | OK |

---

### Test Coverage Gaps

#### Missing E2E Tests:
1. **Back navigation at each step** - No test for going backwards
2. **Empty/invalid name validation** - No edge case testing
3. **Very long character names** - No boundary testing
4. **Special characters in names** - Emojis, unicode, etc.
5. **Page refresh during creation** - Draft persistence
6. **Editing existing character** - Only creation is tested
7. **Multiple character management** - Switching between characters
8. **Tab switching on character sheet** - Only basic coverage
9. **Dice rolling** - Not tested at all
10. **Armor changes updating thresholds** - Not tested
11. **Equipment selection persistence** - Not tested

#### Missing Unit Tests:
1. `src/core/character/armor.ts` - No dedicated test file for `parseThresholds()`, `getArmorScore()`, `clampArmorSlots()`
2. `src/core/character/validation.ts` - No tests for `isDraftComplete()`
3. `src/core/character/migration.ts` - No tests for migration logic
4. Component rendering tests - No React component tests

---

### Recommendations

#### Priority 1 - CRITICAL (Fix Before Glass Redesign Lands)

1. **Fix duplicate navigation in step components**
   - Remove `onNext`, `onBack` props and bottom nav from: SubclassStep, DomainCardsStep, TraitsStep, EquipmentStep, SummaryStep
   - Match the pattern used in AncestryStep and CommunityStep
   - Update interfaces to remove these props

2. **Fix image paths in PhysicalCard.tsx**
   - Change lines 180, 184 to use `/images/cards/domains/` prefix

#### Priority 2 - HIGH (Before Production)

3. **Fix z-index/overlap issues**
   - Ensure glass bottom nav doesn't intercept clicks
   - Add `pb-24` or similar to content areas if not already present

4. **Add E2E test for complete happy path**
   - Update test selectors if UI changed
   - Ensure test waits for animations

#### Priority 3 - MEDIUM (Quality Improvements)

5. **Add unit tests for core/ functions**
   - `src/core/character/armor.test.ts`
   - `src/core/character/validation.test.ts`

6. **Add E2E tests for edge cases**
   - Back navigation flow
   - Input validation
   - Character editing

---

### Files Modified in Glass Redesign (For Reference)

These files have been partially updated with glass styling:
- `src/views/CreateCharacter/index.tsx` - Glass header, background, nav bar
- `src/views/CreateCharacter/AncestryStep.tsx` - HorizontalCardRail, glass panels
- `src/views/CreateCharacter/CommunityStep.tsx` - HorizontalCardRail, glass panels
- `src/components/ui/HorizontalCardRail.tsx` - New component
- `src/components/ui/Button.tsx` - Glass variants (likely)
- `src/components/ui/Sheet.tsx` - Glass variant (likely)

These files still have OLD styling and OLD navigation:
- `src/views/CreateCharacter/SubclassStep.tsx`
- `src/views/CreateCharacter/DomainCardsStep.tsx`
- `src/views/CreateCharacter/TraitsStep.tsx`
- `src/views/CreateCharacter/EquipmentStep.tsx`
- `src/views/CreateCharacter/SummaryStep.tsx`

---

### Conclusion

**The app cannot be used for character creation in its current state.** The partial migration has left the navigation system broken. The @frontend agent needs to complete the migration by:

1. Removing bottom navs from the 5 remaining step components
2. Fixing the image paths
3. Re-running E2E tests to verify

Once these critical issues are fixed, the glass redesign can continue on the remaining steps.

---

## 2026-02-03 | @ux → @frontend: Character Creation Glass Redesign

**From:** @ux
**To:** @frontend

### Feature Spec: Character Creation Flow Redesign with Liquid Glass

#### User Story

As a player creating a new Daggerheart character, I want a visually immersive onboarding experience with the Liquid Glass aesthetic so that character creation feels magical and premium on my mobile device.

---

### Overview

Transform the character creation wizard from its current iOS-native white/gray look to a full Liquid Glass experience with dark gradient backgrounds, glass containers, and horizontal card rails for visual options.

**Current state:** White backgrounds, solid cards, vertical lists
**Target state:** Dark gradient background, glass containers, horizontal card carousels

---

### Global Changes (All Steps)

#### Background
- Replace `bg-ios-gray-light` with animated gradient background
- Use `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient`
- Background should be consistent across all steps (no flash during transitions)

#### Header
- Convert header from `bg-white border-b` to `.glass-dark`
- Change text to `text-glass-primary` (white with shadow)
- Progress bar: Keep spring animation, change track to `bg-white/10` and fill to gradient `from-purple-500 to-indigo-500`
- Cancel button: `text-white/70` with hover `text-white`

#### Bottom Navigation Bar
- Convert from `bg-white border-t` to `.glass`
- Position fixed with safe area padding
- Buttons: Use `variant="glass"` for Back, `variant="glass-primary"` for Continue
- Add subtle top shadow for depth

#### Step Transitions
- Keep existing slide animation with spring physics
- Add subtle fade on background content during transition
- Content should slide over fixed background

#### Typography
- Headings: `text-glass-primary` (white with text shadow)
- Body text: `text-glass-secondary` (white/70)
- Muted text: `text-glass-muted` (white/50)

---

### Step 1: Ancestry Selection

#### Layout
```
+----------------------------------+
|  [Glass Header + Progress Bar]   |
+----------------------------------+
|                                  |
|  "Choose Your Ancestry"          |  <- text-glass-primary
|  Description text                |  <- text-glass-secondary
|                                  |
|  +----------------------------+  |
|  | Horizontal Card Rail      |  |  <- overflow-x-auto
|  | [Card] [Card] [Card] ...  |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Selected Ancestry Detail  |  |  <- .glass-strong, shown when selected
|  | Name, description, feats  |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
|  [Glass Bottom Bar: Continue]   |
+----------------------------------+
```

#### Horizontal Card Rail
- Container: `overflow-x-auto scrollbar-hide snap-x snap-mandatory`
- Cards: `snap-center flex-shrink-0 w-[140px]`
- Use `Card variant="glass"` with selected state `ring-2 ring-white/30`
- Gap between cards: `gap-3`
- Horizontal padding: `px-4` with first/last card peek

#### Selection Detail Panel
- Appears below rail when ancestry selected
- Container: `.glass-strong rounded-2xl p-4`
- Ancestry name: large, bold, `text-glass-primary`
- Description: `text-glass-secondary`
- Feats: List in `.glass rounded-xl p-3` sub-containers

#### Info Button
- Replace `bg-ios-gray-light` circle with `.lg-button` (glass circle)
- Tap opens Sheet with `variant="glass"`

---

### Step 2: Community Selection

#### Layout
Same as Ancestry with horizontal card rail.

#### Differences
- Cards show community names
- Detail panel shows community description and feats
- "Community Feat" section header

---

### Step 3: Subclass Selection

#### Layout
```
+----------------------------------+
|  [Glass Header + Progress Bar]   |
+----------------------------------+
|                                  |
|  "Choose Your School"            |
|  Description text                |
|                                  |
|  +----------------------------+  |
|  | Class Info Banner         |  |  <- .glass with purple tint
|  | Wizard: Codex + Splendor  |  |
|  +----------------------------+  |
|                                  |
|  [SubclassCard] [SubclassCard]   |  <- Full SubclassCard components
|                                  |     Horizontal scroll, centered
|                                  |
+----------------------------------+
|  [Glass Bottom Bar]             |
+----------------------------------+
```

#### Subclass Cards
- Use existing `SubclassCard` component at `scale={0.7}` for mobile
- Horizontal scroll container with `snap-x snap-mandatory`
- Cards: `snap-center`
- Selected state: Add glass glow ring effect
- School of Knowledge: purple-tinted glow
- School of War: red-tinted glow

#### Class Info Banner
- Container: `.glass rounded-xl p-3`
- Add subtle purple gradient overlay: `bg-gradient-to-r from-indigo-500/10 to-transparent`
- Text: `text-glass-primary` for class name, `text-glass-secondary` for stats

---

### Step 4: Domain Cards Selection

#### Layout
```
+----------------------------------+
|  [Glass Header + Progress Bar]   |
+----------------------------------+
|                                  |
|  "Choose Domain Cards"           |
|  "Select N level 1 cards"        |
|                                  |
|  +----------------------------+  |
|  | Selection Counter         |  |  <- .glass pill
|  | "2 / 3 selected"          |  |
|  +----------------------------+  |
|                                  |
|  [Vertical list of domain cards] |  <- .glass cards
|                                  |
+----------------------------------+
|  [Glass Bottom Bar]             |
+----------------------------------+
```

#### Domain Cards List
- Cards: `Card variant="glass"`
- Selected cards: `variant="glass-strong"` with `ring-2 ring-white/30`
- Disabled cards (max reached): `opacity-40`
- Domain badge colors maintained but with glass-compatible styling:
  - Codex: `bg-indigo-500/30 text-indigo-200 border-indigo-400/30`
  - Splendor: `bg-amber-500/30 text-amber-200 border-amber-400/30`

#### Selection Counter
- Use `.lg-pill` style inline element
- Counter text with color change: green when complete

---

### Step 5: Traits Assignment

#### Layout
```
+----------------------------------+
|  [Glass Header + Progress Bar]   |
+----------------------------------+
|                                  |
|  "Assign Your Traits"            |
|  Description text                |
|                                  |
|  +----------------------------+  |
|  | Available Pool            |  |  <- .glass rounded-xl
|  | [+2] [+1] [+1] [0] [0] [-1] | <- glass chips
|  | "Use Suggested" button    |  |
|  +----------------------------+  |
|                                  |
|  [Trait Card]                    |  <- .glass card per trait
|  [Trait Card]                    |
|  [Trait Card]                    |
|  ...                             |
|                                  |
+----------------------------------+
|  [Glass Bottom Bar]             |
+----------------------------------+
```

#### Available Pool
- Container: `.glass rounded-xl p-4`
- Value chips: `.glass rounded-lg px-3 py-1`
- "Use Suggested" button: `text-purple-300 hover:text-purple-200`

#### Trait Cards
- Container: `.glass rounded-xl p-4`
- Trait name: `text-glass-primary capitalize`
- Description: `text-glass-muted text-xs`
- Assigned value: Large, bold, colored (positive=green, negative=red, zero=neutral)
- Value buttons: `.lg-button` style, smaller `w-10 h-10`
- Clear button: Small red-tinted glass button

---

### Step 6: Equipment Selection

#### Layout
```
+----------------------------------+
|  [Glass Header + Progress Bar]   |
+----------------------------------+
|                                  |
|  "Choose Your Equipment"         |
|  Description text                |
|                                  |
|  +----------------------------+  |
|  | Primary Weapon            |  |  <- Section header with icon
|  +----------------------------+  |
|  [Weapon Card] [Weapon Card]     |  <- Horizontal rail
|                                  |
|  +----------------------------+  |
|  | Secondary Weapon (opt)    |  |
|  +----------------------------+  |
|  [None] [Weapon] [Weapon]        |  <- Horizontal rail
|                                  |
|  +----------------------------+  |
|  | Armor                     |  |
|  +----------------------------+  |
|  [Unarmored] [Armor] [Armor]     |  <- Horizontal rail
|                                  |
+----------------------------------+
|  [Glass Bottom Bar]             |
+----------------------------------+
```

#### Equipment Rails
- Each category gets a horizontal scroll rail
- Cards: `Card variant="glass"` with selection state
- Selected: `variant="glass-strong"` with check icon overlay
- Weapon/armor stats: `text-glass-muted text-xs`
- Feat text: Amber/gold tinted text `text-amber-300/80`

#### Section Headers
- Icon + text inline
- Icon in small `.lg-button` style circle
- Text: `text-glass-primary font-semibold`

---

### Step 7: Summary & Name

#### Layout
```
+----------------------------------+
|  [Glass Header + Progress Bar]   |
+----------------------------------+
|                                  |
|  "Review Your Character"         |
|  Description text                |
|                                  |
|  +----------------------------+  |
|  | Name Input                |  |  <- .lg-input full width
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Basic Info                |  |  <- .glass-strong
|  | Ancestry | Community      |  |
|  | Class    | Subclass       |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Stats (HP, Evasion, Hope) |  |  <- .glass
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Traits Grid               |  |  <- .glass
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Domain Cards List         |  |  <- .glass
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Feats Summary             |  |  <- .glass
|  +----------------------------+  |
|                                  |
+----------------------------------+
|  [Glass: Back | Create]         |
+----------------------------------+
```

#### Name Input
- Use `.lg-input` class for full glass styling
- Placeholder: `text-white/40`
- Focus state with enhanced glow

#### Summary Cards
- Basic Info: `.glass-strong` - most prominent
- Other sections: `.glass`
- Stat badges with subtle colored backgrounds:
  - HP: `bg-red-500/20 text-red-300`
  - Evasion: `bg-slate-500/20 text-slate-300`
  - Hope: `bg-blue-500/20 text-blue-300`
- Traits: Color-coded by value (green positive, red negative)

#### Final Button
- "Create Character" button: `.glass-primary` with larger size
- Add subtle pulse animation when enabled

---

### New Patterns Needed

#### 1. Glass Chip Component
```css
.glass-chip {
  @apply glass rounded-lg px-3 py-1 text-sm text-white;
}
```

#### 2. Horizontal Card Rail
```tsx
<div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
  <div className="flex gap-3">
    {items.map(item => (
      <div key={item.id} className="snap-center flex-shrink-0 w-[140px]">
        <Card variant="glass" .../>
      </div>
    ))}
  </div>
</div>
```

#### 3. Selection Glow Ring
```css
.glass-selected {
  @apply ring-2 ring-white/30;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
}
```

#### 4. Glass Section Header
```tsx
<div className="flex items-center gap-2 mb-3">
  <div className="lg-button w-8 h-8">
    <Icon size={16} />
  </div>
  <h3 className="text-glass-primary font-semibold">{title}</h3>
</div>
```

---

### Interactions

#### Tap
- Cards: `whileTap={{ scale: 0.98 }}` (existing)
- Buttons: `whileTap={{ scale: 0.95 }}` for glass buttons

#### Long Press
- On ancestry/community cards: Open detail sheet
- On domain cards: Open full card detail

#### Swipe
- Horizontal rails: Natural momentum scroll with snap
- Steps: Maintain existing slide transitions

---

### States

#### Empty
- Rails show placeholder glass cards with subtle pulse animation
- "Loading..." in `text-glass-muted`

#### Loading
- Skeleton cards with `animate-pulse` on glass background
- Progress bar animated

#### Error
- Error message in `.glass` container with red tint
- `bg-red-500/10 border border-red-500/30`

#### Success
- Summary step: Green-tinted "Create Character" button when valid
- Checkmark animations on completed selections

---

### Edge Cases

1. **No selection made**: Continue button disabled with `opacity-30`
2. **Editing existing character**: Show "Save Changes" instead of "Create"
3. **Landscape orientation**: Rails should show more cards
4. **Small screens (<375px)**: Reduce card rail card width to 120px
5. **Very long ancestry/community names**: Truncate with ellipsis in cards

---

### Acceptance Criteria

- [ ] All steps use dark gradient background (consistent, no flash)
- [ ] Header uses `.glass-dark` with white text
- [ ] Bottom bar uses `.glass` with glass buttons
- [ ] Ancestry step has horizontal card rail
- [ ] Community step has horizontal card rail
- [ ] Subclass step uses `SubclassCard` components in horizontal scroll
- [ ] Equipment step has three horizontal rails (primary, secondary, armor)
- [ ] All cards use `variant="glass"` or `variant="glass-strong"`
- [ ] Selection states show ring glow effect
- [ ] Name input uses `.lg-input` styling
- [ ] Summary cards use glass variants
- [ ] Transitions remain smooth with spring physics
- [ ] Touch targets maintain 44pt minimum
- [ ] Works on iOS Safari (backdrop-filter support)

---

### Files to Modify

1. `src/views/CreateCharacter/index.tsx` - Background, header, nav bar
2. `src/views/CreateCharacter/AncestryStep.tsx` - Horizontal rail, glass cards
3. `src/views/CreateCharacter/CommunityStep.tsx` - Horizontal rail, glass cards
4. `src/views/CreateCharacter/SubclassStep.tsx` - SubclassCard rail, glass banner
5. `src/views/CreateCharacter/DomainCardsStep.tsx` - Glass cards, selection state
6. `src/views/CreateCharacter/TraitsStep.tsx` - Glass containers, chips
7. `src/views/CreateCharacter/EquipmentStep.tsx` - Three horizontal rails
8. `src/views/CreateCharacter/SummaryStep.tsx` - Glass sections, lg-input
9. `src/components/ui/Card.tsx` - May need `.glass-selected` variant
10. `src/index.css` - New utility classes if needed

---

## 2026-02-03 | @frontend Character Calculations Audit

**From:** @frontend
**To:** @orchestrator / next @frontend session

### AUDIT SUMMARY: Character Calculations

#### What's Working

1. **HP Calculation** - WORKING
   - `src/core/character/hp.ts:10-12` - `calculateWizardMaxHP()` correctly adds +1 for School of War
   - `src/stores/characterStore.ts:117-118, 152-154` - Draft finalization correctly uses this
   - `src/stores/characterStore.ts:218-222` - `updateHP()` correctly clamps values
   - Unit tests pass in `src/stores/characterStore.test.ts:73-113`

2. **Armor Slots (Max)** - WORKING
   - `src/core/character/armor.ts:24-26` - `getArmorScore()` parses armor's base_score
   - `src/stores/characterStore.ts:299-311` - `setArmor()` correctly updates `armorSlots.max` when armor changes
   - Also clamps `current` value to new max

3. **Armor Slots (Current)** - WORKING
   - `src/stores/characterStore.ts:225-232` - `updateArmorSlots()` clamps correctly
   - `src/core/character/armor.ts:31-33` - `clampArmorSlots()` helper works

4. **Damage Thresholds Display** - WORKING
   - `src/views/CharacterSheet/StatsTab.tsx:74-79` - Reads thresholds from `character.equipment.armor.base_thresholds`
   - `src/core/character/armor.ts:16-19` - `parseThresholds()` parses "6 / 13" format
   - When armor changes, StatsTab re-renders with new thresholds from the updated character

5. **Hope/Stress** - WORKING
   - `src/stores/characterStore.ts:234-246` - Both clamp correctly

6. **Trait Display** - WORKING
   - `src/views/CharacterSheet/StatsTab.tsx:69-72, 200-216` - Displays trait values correctly
   - `src/core/rules/traits.ts:54-58` - `formatTraitValue()` handles +/- formatting

#### What's NOT Broken (Contrary to Suspicion)

**Armor → Damage Thresholds Connection**: This DOES work correctly.

The flow:
1. User selects armor in `InventoryTab` → calls `onSetArmor(armor)`
2. `CharacterSheet/index.tsx:131` calls `setArmor(character.id, armor)`
3. `characterStore.ts:299-311` `setArmor()` updates:
   - `equipment.armor` → new armor object
   - `armorSlots.max` → new armor's base_score
   - `armorSlots.current` → clamped to new max
4. Character state updates, component re-renders
5. `StatsTab.tsx:75-77` reads `character.equipment.armor.base_thresholds` → thresholds update

**The key insight**: Damage thresholds are stored ON the armor object, not as a derived character stat. So when armor changes, the thresholds automatically update because we're reading from the new armor's `base_thresholds` property.

#### Potential Improvements (Not Bugs)

1. **Missing "No Armor" Default Thresholds**
   - `StatsTab.tsx:77` defaults to `{ major: 6, severe: 13 }` when no armor equipped
   - This hardcoded default should probably come from a constant in `src/core/character/armor.ts`
   - File: `src/core/character/armor.ts` - add `DEFAULT_UNARMORED_THRESHOLDS`
   - File: `src/views/CharacterSheet/StatsTab.tsx:77` - import and use constant

2. **Evasion is Static**
   - `src/stores/characterStore.ts:171` - Sets evasion from `wizard.evasion` (hardcoded "10")
   - No mechanism to update evasion if it should change (e.g., from abilities/items)
   - Currently not a bug since base rules don't modify evasion, but may need future work

3. **Proficiency is Static**
   - `src/stores/characterStore.ts:172` - Always 1 for level 1 characters
   - No level-up mechanism exists yet

4. **No Unit Tests for Core Functions**
   - `src/core/character/*.ts` has no dedicated test files
   - `parseThresholds()`, `getArmorScore()`, `clampArmorSlots()` untested in isolation
   - Recommended: Add `src/core/character/armor.test.ts`

#### Conclusion

**The character calculation system is working correctly.** The architecture properly separates:
- Pure calculation logic in `src/core/character/`
- State management in `src/stores/characterStore.ts`
- Display logic in view components

The damage threshold concern is a non-issue - the thresholds ARE updating when armor changes because they're read directly from the equipped armor object.

**No immediate fixes required.** Optional enhancements listed above.

---

## 2026-02-02 | System Setup → @frontend

**From:** Initial setup
**To:** @frontend

The multi-agent system and architecture refactor plan are ready.

**Key context for Phase 1 (Extract Core Logic):**

1. **HP calculation** in characterStore.ts:166-167, 202-203
   ```ts
   const baseHP = parseInt(wizard.hp)
   const maxHP = draftCharacter.subclass === 'School of War' ? baseHP + 1 : baseHP
   ```
   → Move to `src/core/character/hp.ts`

2. **Armor functions** in data/srd.ts:84-93
   - `parseThresholds()` - parses "6 / 13" format
   - `getArmorScore()` - gets max armor slots from armor
   → Move to `src/core/character/armor.ts`

3. **Migration logic** in characterStore.ts:76-111
   - Migrates old character data format
   - Handles armor → armorSlots rename
   - Fixes proficiency bug
   → Move to `src/core/character/migration.ts`

4. **Draft validation** in characterStore.ts:147-156
   - Checks if draft has all required fields
   → Move to `src/core/character/validation.ts`

5. **Dice logic** in components/dice/diceLogic.ts (entire file)
   - `determineDualityResult()` function
   → Move to `src/core/dice/duality.ts`

6. **Trait rules** in TraitsStep.tsx:13-42
   - `TRAIT_NAMES`, `TRAIT_DESCRIPTIONS`, `AVAILABLE_VALUES`, `SUGGESTED_TRAITS`
   → Move to `src/core/rules/traits.ts`

7. **Wizard rules** in data/srd.ts:78-82
   - `getWizardCardCount()` function
   → Move to `src/core/rules/wizard.ts`

**Verification after each change:**
```bash
npm run lint && npm run test:unit:run && npm run build
```

---

_Previous handoffs will appear above this line_
