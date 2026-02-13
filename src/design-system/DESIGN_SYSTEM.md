# Cloak & Daggerheart Design System

> Extracted from the SRDCard and DomainCard components. Every value in this document
> comes directly from existing code. The goal: the entire app should feel like it
> belongs in the same world as the cards -- a fantasy RPG character sheet, not a
> modern SaaS app.

---

## 1. Color Palette

### 1.1 Card Dark Backgrounds

| Token | Value | Source | Usage |
|-------|-------|--------|-------|
| `card-bg-dark` | `#03070d` | SRDCard root bg | Primary dark surface for card-style panels |
| `card-bg-darkalt` | `rgb(30, 32, 31)` / `#1e201f` | DomainCard `darkBg` | Secondary dark surface, banner backgrounds |
| `app-bg` | `#0f172a` | `index.css` body bg | App-level background (slate-900) |

### 1.2 Gold Gradient (the signature effect)

The gold gradient is the single most important visual identity element. It appears
on every card title, subtitle, footer, separator line, diamond, and border stroke.

```css
/* Gold gradient for text (background-clip: text) */
.gold-text {
  background: linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Gold gradient for borders/strokes (SVG linearGradient) */
/* Banner outer stroke: #DBC593 at 61% -> #C29734 at 100% */
/* Banner inner stroke: #F9F8F3 at 0% -> #E7BA90 at 100% */
```

| Token | Value | Usage |
|-------|-------|-------|
| `gold-light` | `#f9f8f3` | Top of gold gradient (near-white warm) |
| `gold-mid` | `#e7ba90` | Bottom of gold gradient / solid gold accent |
| `gold-border` | `#DBC593` | Banner outer stroke start |
| `gold-border-dark` | `#C29734` | Banner outer stroke end |
| `gold-solid` | `#d4af37` | DomainCard border (`2px solid #d4af37`) |

### 1.3 Text Colors

| Token | Value | Source | Usage |
|-------|-------|--------|-------|
| `text-body` | `rgba(212, 207, 199, 0.9)` | SRDCard body | Primary body text on dark surfaces |
| `text-body-rgb` | `212, 207, 199` | -- | RGB components for opacity variants |
| `text-white` | `white` | Glass system | High-contrast headings on dark bg |
| `text-secondary` | `rgba(255, 255, 255, 0.7)` | Glass system | Secondary/supporting text |
| `text-muted` | `rgba(255, 255, 255, 0.5)` | Glass system | Captions, metadata |
| `text-domain-meta` | `text-gray-500` | DomainCard metadata | Light-theme metadata text |
| `text-domain-body` | `text-gray-800` | DomainCard content | Light-theme body text |

### 1.4 Domain Colors

The nine Daggerheart domains each have a canonical color. These are used for
banner fills, domain tags, card accents, and can tint entire UI sections.

| Domain | Hex | Character |
|--------|-----|-----------|
| Arcana | `#4e345b` | Deep purple -- mystic, arcane |
| Blade | `#A61118` | Dark crimson -- martial, aggressive |
| Bone | `#A3A9A8` | Steel gray -- death, resilience |
| Codex | `#1D3B61` | Navy blue -- knowledge, wisdom |
| Grace | `#BD0C70` | Magenta-pink -- healing, divine |
| Midnight | `#1E1E1E` | Near-black -- shadow, stealth |
| Sage | `#2d4a3e` | Forest green -- nature, balance |
| Splendor | `#BEA228` | Rich gold -- beauty, radiance |
| Valor | `#EB5B00` | Bright orange -- courage, fire |

### 1.5 Surface Colors (Glass System)

| Token | Value | Usage |
|-------|-------|-------|
| `glass-bg` | `rgba(255,255,255,0.05)` | Flat glass panel fill |
| `glass-bg-strong` | `rgba(255,255,255,0.08)` | Strong glass panel fill |
| `glass-border` | `rgba(255,255,255,0.1)` | Panel border |
| `glass-border-focus` | `rgba(255,255,255,0.2)` | Focus-state border |

### 1.6 Semantic Colors

| Token | Suggested Value | Usage |
|-------|-----------------|-------|
| `hp-red` | `#A61118` (Blade) | Hit Points, damage |
| `armor-steel` | `#A3A9A8` (Bone) | Armor rating |
| `hope-gold` | `#BEA228` (Splendor) | Hope resource |
| `stress-shadow` | `#1E1E1E` (Midnight) | Stress resource |
| `success-green` | `#22c55e` | DomainCard selected state |

### 1.7 Content Area Gradient

The SRDCard content area uses a multi-stop gradient that transitions from
transparent at top to near-opaque dark, then back to transparent at bottom:

```css
background: linear-gradient(
  180deg,
  rgba(31, 58, 96, 0)    0%,      /* transparent blue-tinted */
  rgba(3, 7, 13, 0.81)   12%,     /* near-opaque dark */
  rgba(3, 7, 13, 0.81)   83%,     /* holds steady */
  rgba(19, 36, 60, 0.35)  97%,    /* fades with blue tint */
  rgba(31, 58, 96, 0)    100%     /* transparent */
);
```

This gradient creates a "floating parchment" effect -- content appears to hover
over the illustration. Use this pattern for any overlay content panel.

---

## 2. Typography Scale

All font families are loaded via Google Fonts: **EB Garamond**, **Source Sans 3**.

### 2.1 Display -- Card Title

```css
.type-display {
  font-family: 'EB Garamond', serif;
  font-size: 36px;                /* max, auto-fits down to 12px */
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0.01em;
  font-variant: small-caps;
  text-align: center;
  white-space: nowrap;
  /* Apply .gold-text for color */
}
```

Text shadow applied via CSS filter on the *container* (because background-clip:text
disables text-shadow):

```css
/* Heavy variant (default in SRDCard) */
filter: drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5));

/* Subtle variant */
filter: drop-shadow(0px 1px 1px #4d381e);
```

### 2.2 Subtitle -- Class Name & Footer

```css
.type-subtitle {
  font-family: 'EB Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.06em;
  font-variant: small-caps;
  /* Apply .gold-text for color */
}
```

Container shadow:
```css
filter: drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5));
```

### 2.3 Body -- Card Text

```css
.type-body {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  line-height: 1.4;
  color: rgba(212, 207, 199, 0.9);
  text-shadow: 0px 1px 1px #4d381e;
}
```

Bold variant for feat names:
```css
.type-body-bold {
  font-weight: 700;
}
```

### 2.4 DomainCard Title

```css
.type-domain-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;
  letter-spacing: wide;        /* Tailwind tracking-wide = 0.025em */
  color: var(--domain-color);  /* Tinted by domain */
}
```

### 2.5 DomainCard Subtitle (Italic Flavor Text)

```css
.type-domain-subtitle {
  font-size: 14.5px;
  font-style: italic;
  letter-spacing: -0.015em;
  line-height: 17px;
  color: var(--domain-color);
}
```

### 2.6 Caption -- Metadata

```css
.type-caption {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: wider;       /* Tailwind tracking-wider = 0.05em */
  color: rgb(107, 114, 128);  /* gray-500 */
}
```

### 2.7 Micro -- Artist Credit / Legal

```css
.type-micro {
  font-size: 10px;
  font-style: italic;
  color: rgba(0, 0, 0, 0.5);  /* For light surfaces */
}
```

### 2.8 UI Label (Recommended for Buttons, Nav, Stats)

For interactive elements, blend the serif identity with readability:

```css
.type-ui-label {
  font-family: 'EB Garamond', serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-variant: small-caps;
}
```

For stat labels (HP, Armor, etc.):

```css
.type-stat-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(212, 207, 199, 0.7);
}
```

---

## 3. Effects & Textures

### 3.1 Gold Text Gradient

The primary identity effect. Apply to any heading or label that should feel "in-world":

```css
.gold-text {
  background: linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;  /* text-shadow is incompatible with background-clip */
}
```

When shadow is needed with gold text, wrap in a container and use `filter`:

```css
.gold-text-shadow {
  filter: drop-shadow(0px 1px 2px #4d381e)
          drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5));
}

.gold-text-shadow-subtle {
  filter: drop-shadow(0px 1px 1px #4d381e);
}
```

### 3.2 Text Shadows

| Name | CSS | Usage |
|------|-----|-------|
| Heavy (container filter) | `drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))` | Title, subtitle, footer |
| Subtle (container filter) | `drop-shadow(0px 1px 1px #4d381e)` | Alternative title treatment |
| Body text-shadow | `text-shadow: 0px 1px 1px #4d381e` | Body text on dark backgrounds |
| Glass text-shadow | `text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2)` | Text on glass surfaces |

The shadow color `#4d381e` is a warm dark brown -- the same tone used across all
card shadow effects. It creates a "candlelit parchment" feel.

### 3.3 Card Frame Overlay

The `frame.svg` asset is placed absolutely over the entire card at 60% opacity:

```css
.card-frame-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
  opacity: 0.6;
}
```

This gives cards their ornate border and aged-parchment edge treatment. The same
approach can be adapted for panels -- a lighter opacity (20-30%) version of a
decorative border SVG over any container.

### 3.4 Atmosphere Texture

The `atmosphere.png` texture is placed behind card content, flipped vertically:

```css
.atmosphere-texture {
  position: absolute;
  width: 100%;
  pointer-events: none;
  object-fit: cover;
  transform: scaleY(-1);
  z-index: 1;
}
```

This adds a subtle grain/cloud texture behind text. Can be reused behind any
dark panel to add depth.

### 3.5 Banner Texture

The banner uses `banners/texture.png` with `mix-blend-mode: multiply` to create
a woven/fabric texture over the colored pennant shape.

### 3.6 Illustration Mask

The top illustration area uses a gradient mask to fade the bottom edge:

```css
.illustration-fade {
  -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 10px), transparent 100%);
  mask-image: linear-gradient(to bottom, black calc(100% - 10px), transparent 100%);
}
```

### 3.7 Glass Effect (Liquid Glass System)

Already defined in `index.css`. Summary of the core recipe:

```css
.glass {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(0, 0, 0, 0.01) 100%
  );
  backdrop-filter: blur(2px) saturate(150%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.375),    /* specular top */
    inset 0 1.5px 3px rgba(255, 255, 255, 0.09),    /* specular spread */
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),            /* bottom depth */
    inset 0 -1.5px 3px rgba(0, 0, 0, 0.05),         /* bottom spread */
    0 4px 16px rgba(0, 0, 0, 0.25);                  /* drop shadow */
}
```

Variants: `.glass-strong`, `.glass-dark`, `.glass-interactive`, `.glass-flat`.

### 3.8 Engraved Effect (New -- derived from card language)

For text and borders that look pressed *into* a surface:

```css
.engraved-text {
  color: rgba(3, 7, 13, 0.6);        /* slightly darker than surface */
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.1),  /* highlight below (light catches bottom edge) */
    0 -1px 1px rgba(0, 0, 0, 0.3);      /* shadow above (depth into surface) */
}

/* On gold surfaces, reverse the colors: */
.engraved-on-gold {
  color: rgba(77, 56, 30, 0.7);        /* dark brown pressed into gold */
  text-shadow:
    0 1px 0 rgba(249, 248, 243, 0.4),   /* gold-light highlight */
    0 -1px 1px rgba(77, 56, 30, 0.5);    /* warm shadow */
}
```

---

## 4. Border Styles

### 4.1 Gold Border

```css
/* Solid gold border (DomainCard) */
border: 2px solid #d4af37;

/* Selected state */
border: 3px solid #22c55e;
box-shadow: 0 0 20px rgba(34, 197, 94, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3);
```

### 4.2 Separator -- Diamond + Line Pattern

The SRDCard uses a decorative separator with a center text element flanked by
gradient lines terminated with rotated diamond shapes:

```css
/* Line */
.separator-line {
  height: 2px;
  flex: 1;
  /* Left side: fades in from transparent */
  background: linear-gradient(90deg, transparent, #e7ba90);
  /* Right side: fades out to transparent */
  background: linear-gradient(90deg, #e7ba90, transparent);
}

/* Diamond terminator */
.separator-diamond {
  width: 4px;
  height: 4px;
  background: #e7ba90;
  transform: rotate(45deg);
  margin: 0 2px;    /* mx-0.5 */
}
```

Full pattern layout:
```
[---gradient line---][diamond] CLASS NAME [diamond][---gradient line---]
```

This can be reused as a `<SectionHeader>` component throughout the app.

### 4.3 Card Outer Border

SRDCard: `border-radius: 12px` (no explicit border -- frame.svg provides the visual border)
DomainCard: `border-radius: 20px`, `border: 2px solid #d4af37`

### 4.4 Panel Border (Glass)

```css
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;   /* --lg-card-radius */
```

---

## 5. UI Component Recipes

These recipes translate the card design language into reusable UI components.
All CSS values are exact or directly derived from existing code.

### 5.1 PrimaryButton -- Gold Gradient

```css
.btn-primary {
  /* Gold gradient background */
  background: linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%);
  border: 1px solid #C29734;
  border-radius: 8px;
  padding: 10px 24px;

  /* Typography */
  font-family: 'EB Garamond', serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-variant: small-caps;

  /* Engraved text on gold surface */
  color: #4d381e;
  text-shadow:
    0 1px 0 rgba(249, 248, 243, 0.4),
    0 -1px 1px rgba(77, 56, 30, 0.3);

  /* Card-style drop shadow */
  box-shadow:
    inset 0 1px 1px rgba(249, 248, 243, 0.6),
    0 2px 8px rgba(0, 0, 0, 0.3);

  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 1px rgba(249, 248, 243, 0.6),
    0 4px 12px rgba(0, 0, 0, 0.35);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

### 5.2 SecondaryButton -- Dark with Gold Outline

```css
.btn-secondary {
  background: rgba(3, 7, 13, 0.8);
  border: 1px solid #e7ba90;
  border-radius: 8px;
  padding: 10px 24px;

  /* Typography */
  font-family: 'EB Garamond', serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-variant: small-caps;

  /* Gold gradient text */
  background-clip: text;        /* override above for text only -- needs wrapper approach */
  /* Alternative: use solid gold color */
  color: #e7ba90;
  text-shadow: 0px 1px 1px #4d381e;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.btn-secondary:hover {
  border-color: #f9f8f3;
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: scale(0.98);
}
```

### 5.3 GhostButton -- Minimal Gold

```css
.btn-ghost {
  background: transparent;
  border: none;
  padding: 8px 16px;

  font-family: 'EB Garamond', serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-variant: small-caps;
  color: #e7ba90;

  cursor: pointer;
  transition: color 0.15s ease;
  position: relative;
}

.btn-ghost::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 16px;
  right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e7ba90, transparent);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.btn-ghost:hover::after {
  opacity: 1;
}
```

### 5.4 GlassPanel -- Semi-transparent Container

```css
.panel-glass {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(0, 0, 0, 0.01) 100%
  );
  backdrop-filter: blur(2px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.375),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.25);
}

/* Domain-tinted variant */
.panel-glass-domain {
  /* Same as above, but with a colored top border accent */
  border-top: 2px solid var(--domain-color);
}

/* Gold-accented variant */
.panel-glass-gold {
  border: 1px solid rgba(231, 186, 144, 0.2);  /* #e7ba90 at 20% */
  box-shadow:
    inset 0 1px 1px rgba(249, 248, 243, 0.15),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.25);
}
```

### 5.5 TextInput -- Dark Inset with Gold Focus

```css
.input-dark {
  width: 100%;
  padding: 12px 16px;
  background: rgba(3, 7, 13, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(212, 207, 199, 0.9);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-dark::placeholder {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  color: rgba(212, 207, 199, 0.3);
  font-variant: small-caps;
}

.input-dark:focus {
  border-color: #e7ba90;
  box-shadow: 0 0 0 2px rgba(231, 186, 144, 0.15);
}
```

### 5.6 SectionHeader -- Gold Separator with Title

Reuse of the SRDCard diamond + line separator pattern:

```css
/* Container */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;   /* gap-2 */
  width: 100%;
}

/* Left/right line containers */
.section-header__line {
  display: flex;
  align-items: center;
  flex: 1;
}

.section-header__line--left .section-header__rule {
  background: linear-gradient(90deg, transparent, #e7ba90);
}

.section-header__line--right .section-header__rule {
  background: linear-gradient(90deg, #e7ba90, transparent);
}

.section-header__rule {
  height: 2px;
  flex: 1;
}

.section-header__diamond {
  width: 4px;
  height: 4px;
  background: #e7ba90;
  transform: rotate(45deg);
  margin: 0 2px;
}

/* Title uses .type-subtitle + .gold-text */
```

### 5.7 Badge / Tag

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  background: rgba(231, 186, 144, 0.1);    /* gold at 10% */
  border: 1px solid rgba(231, 186, 144, 0.3);

  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #e7ba90;
}

/* Domain-colored variant */
.badge-domain {
  background: rgba(var(--domain-color-rgb), 0.15);
  border-color: rgba(var(--domain-color-rgb), 0.3);
  color: var(--domain-color);
}
```

### 5.8 StatPip -- HP / Armor / Hope / Stress

```css
.stat-pip {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.stat-pip--hp       { background: #A61118; border-color: rgba(166, 17, 24, 0.5); }
.stat-pip--armor    { background: #A3A9A8; border-color: rgba(163, 169, 168, 0.5); color: #1e201f; }
.stat-pip--hope     { background: #BEA228; border-color: rgba(190, 162, 40, 0.5); }
.stat-pip--stress   { background: #1E1E1E; border-color: rgba(255, 255, 255, 0.2); }
```

### 5.9 StepIndicator -- Gold Dots

```css
.step-indicator {
  display: flex;
  gap: 8px;
  align-items: center;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(231, 186, 144, 0.25);
  transition: background 0.2s ease, transform 0.2s ease;
}

.step-dot--active {
  background: #e7ba90;
  transform: scale(1.25);
  box-shadow: 0 0 6px rgba(231, 186, 144, 0.4);
}

.step-dot--completed {
  background: #e7ba90;
}
```

---

## 6. Motion Patterns

### 6.1 Spring Configurations (Framer Motion)

| Name | Config | Usage |
|------|--------|-------|
| Snappy | `{ stiffness: 400, damping: 30, mass: 0.8 }` | Button press, tab switch |
| Smooth | `{ stiffness: 300, damping: 30, mass: 0.8 }` | Page transitions, swipe nav |
| Bouncy | `{ stiffness: 500, damping: 25, mass: 0.8 }` | Playful feedback, dice roll |
| Gentle | `{ stiffness: 200, damping: 30, mass: 1 }` | Sheet open/close, long transitions |

### 6.2 Tap Feedback

From DomainCard and animation tokens:

```tsx
// Cards
whileTap={{ scale: 0.98 }}

// Buttons
whileTap={{ scale: 0.95 }}

// Large surfaces
whileTap={{ scale: 0.9 }}
```

### 6.3 Hover Lift

```tsx
// Cards
whileHover={{ y: -4 }}

// Interactive panels
whileHover={{ y: -2 }}
```

### 6.4 CSS Transitions

```css
/* Fast (buttons, toggles) */
transition: 0.15s ease;

/* Normal (panels, states) */
transition: 0.2s ease;

/* Slow (page elements) */
transition: 0.3s ease;
```

### 6.5 Timing Curves

```css
--spring-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--spring-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

### 6.6 "In-World" vs Generic

**In-world transitions** (use these for thematic elements):
- Spring physics with bounce for interactive elements
- Scale feedback on tap (0.95-0.98) -- feels like pressing a physical object
- Hover lift with shadow increase -- element "rises" from the surface
- Gold glow pulse for attention/notification

**Generic transitions** (avoid these for themed elements):
- Linear easing
- Opacity-only fades
- Slide-from-edge without spring
- Color-only hover states

---

## 7. Asset Inventory

### 7.1 Card Frame & Texture

| Asset | Path | Usage |
|-------|------|-------|
| `frame.svg` | `public/images/cards/frame.svg` | Card border overlay (60% opacity) |
| `atmosphere.png` | `public/images/cards/atmosphere.png` | Cloudy/grain texture behind card content (flipped vertically) |
| `banners/mask.svg` | `public/images/cards/banners/mask.svg` | Pennant shape mask (44x80px) |
| `banners/texture.png` | `public/images/cards/banners/texture.png` | Fabric texture for banners (multiply blend) |

### 7.2 Domain Card Assets

| Asset | Path | Usage |
|-------|------|-------|
| `subclasses/banner.webp` | `public/images/cards/subclasses/banner.webp` | DomainCard banner image |
| `domains/divider.png` | `public/images/cards/domains/divider.png` | Ornate horizontal divider between art and content |
| `subclasses/subclass-divider.png` | `public/images/cards/subclasses/subclass-divider.png` | Alternative divider |

### 7.3 Domain Icons (SVGs)

Available as both file assets and inline SVG data in `domain-icons.ts`:

| Domain | Path |
|--------|------|
| Blade | `public/images/cards/domains/icons/Blade.svg` |
| Bone | `public/images/cards/domains/icons/Bone.svg` |
| Codex | `public/images/cards/domains/icons/Codex.svg` |
| Grace | `public/images/cards/domains/icons/Grace.svg` |
| Midnight | `public/images/cards/domains/icons/Midnight.svg` |
| Splendor | `public/images/cards/domains/icons/Splendor.svg` |
| Valor | `public/images/cards/domains/icons/Valor.svg` |

Note: Arcana and Sage icons are referenced in the type system but SVG files are
not present in the icons directory.

### 7.4 Illustration Art

| Category | Format | Path Pattern |
|----------|--------|-------------|
| Subclass illustrations | `.png` | `public/images/cards/subclasses/{name}.png` |
| Domain card art | `.avif` | `public/images/cards/domains/{name}.avif` |
| Ancestry art | `.avif` | `public/images/cards/ancestries/{name}.avif` |
| Community art | `.avif` | `public/images/cards/communities/{name}.avif` |
| Official reference | `.webp` | `public/images/cards/official/{name}.webp` |

### 7.5 Inline SVG Components

The DomainCard component contains two inline SVG emblems that can be extracted:
- **DaggerEmblem** -- the Daggerheart dagger icon (default 16px)
- **SplendorEmblem** -- the crescent/splendor emblem (default 24px)

---

## 8. Design Principles (Summary)

### The Five Commandments

1. **Gold is the thread.** The `#f9f8f3 -> #e7ba90` gradient appears on every
   heading, every separator, every border accent. It is the single unifying
   visual element. If something looks "out of place," adding a gold accent
   will almost certainly fix it.

2. **Serif typography signals identity.** EB Garamond with small-caps and
   generous letter-spacing makes any text feel like it belongs on a game card.
   Reserve sans-serif (Source Sans 3) for body text and data -- the functional
   layer. Headings, labels, and navigation should be serif.

3. **Dark surfaces, warm shadows.** The card world is lit by candlelight.
   Backgrounds are near-black (`#03070d`), shadows are warm brown (`#4d381e`),
   and light comes from above (specular highlights at top edges). Never use
   cool-toned shadows on themed elements.

4. **Texture over flatness.** Use `atmosphere.png`, `frame.svg`, fabric
   textures, and gradient masks to prevent any surface from looking digitally
   flat. Even a 5% texture overlay makes a panel feel more "in-world."

5. **Physical interaction.** Elements should feel like physical objects: they
   depress when tapped (scale 0.95-0.98), rise when hovered (translateY -2 to -4px),
   and snap into position with spring physics. No linear easing, no instant
   state changes.

### Color Hierarchy on Dark Surfaces

```
Gold gradient text  -->  highest emphasis (titles, CTAs)
Warm white text     -->  high emphasis (active states, primary content)
#D4CFC7 at 90%     -->  standard body text
White at 70%        -->  secondary content
White at 50%        -->  muted / disabled
```

### When to Use Each Font

| Context | Font | Variant |
|---------|------|---------|
| Card titles, page headings | EB Garamond | 500, small-caps |
| Section headers, labels | EB Garamond | 600, small-caps |
| Button text, nav items | EB Garamond | 600, small-caps |
| Body paragraphs, descriptions | Source Sans 3 | 400, normal |
| Bold callouts in body text | Source Sans 3 | 700, normal |
| Stat numbers, data values | Source Sans 3 | 600-700, normal |
| Tiny metadata, legal | Source Sans 3 | 400, italic |
