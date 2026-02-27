# CLAUDE.md

## Auto-Role: @orchestrator

**At the start of every session, read `.claude/agents/orchestrator.md` and adopt that role.**

You are the orchestrator. You do NOT write code yourself. You delegate to subagents:
- Spawn `@frontend` for code/bugs/tests (use Task tool with general-purpose subagent)
- Spawn `@ux` for feature specs and user flows
- Spawn `@creative` for visual design and animations

Start by reading `context/current-sprint.md` and `context/handoffs.md`, then greet the user with current status.

---

## Commands

```bash
npm run dev           # Start dev server at http://localhost:3000
npm run build         # TypeScript check + tests + production build
npm run lint          # ESLint with zero warnings policy
npm run test:unit:run # Run unit tests (Vitest)
npm run test          # Run E2E tests (Playwright)
npm run preview       # Preview production build
```

## Architecture

This is a mobile-first PWA for viewing Daggerheart TTRPG content, designed to feel native on iOS.

### Directory Structure

```
src/
├── app/               # App shell and dev tools
│   ├── App.tsx        # Root: splash → deck builder → hand view
│   ├── DesignSystem.tsx # Design System page (?components)
│   └── DesignLab.tsx  # Card delta tool (?cards)
├── core/              # Pure business logic (no React, no side effects)
│   ├── character/     # HP calcs, armor, migration, validation
│   ├── deck/          # Deck-building logic (WIP)
│   ├── dice/          # Duality roll logic
│   └── rules/         # Traits, wizard-specific rules
├── design-system/     # Tokens and base components
│   └── tokens/        # colors.ts, effects.ts, animations.ts
├── cards/             # Card components (SRD, Domain, Info, flip/zoom)
├── deck-builder/      # Character creation wizard
│   ├── DeckBuilder.tsx
│   ├── components/    # DeckPreview, StepIndicator
│   └── steps/         # PickClass, PickSubclass, PickDomainCards, AssignTraits, etc.
├── level-up/          # Level-up wizard (LevelUpWizard.tsx)
├── hand/              # In-play hand view
│   ├── HandView.tsx   # Main hand screen
│   ├── CardCarousel.tsx
│   ├── HeroCard.tsx
│   ├── StatBar.tsx
│   └── panels/        # Collapsible info panels (Stats, Equipment, Notes)
├── ui/                # UI primitives (GameButton, GlassPanel, GameInput, etc.)
├── store/             # Zustand state (character-store, deck-store, level-up-store)
├── data/              # SRD data loaders and card mappers
└── types/             # TypeScript definitions
```

### Core Layer (`src/core/`)

Pure functions with no React dependencies. Easy to unit test.

```ts
// Import business logic from core
import { calculateWizardMaxHP, clampHP } from '../core/character'
import { determineDualityResult } from '../core/dice'
import { TRAIT_NAMES, formatTraitValue } from '../core/rules'
```

Note: `core/deck/` exists but is currently empty (deck logic is still in components).

### Multi-Agent Development

Claude automatically takes the **@orchestrator** role (see Auto-Role above).

Just tell the orchestrator what you want - it spawns subagents automatically:
- `@frontend` - Code implementation (spawned via Task tool)
- `@ux` - Feature specs, user flows (spawned via Task tool)
- `@creative` - Visual design, animations (spawned via Task tool)

See `.claude/agents/README.md` for details.

### Navigation Pattern

The app uses a card-centric two-phase flow in `src/app/App.tsx`:
- **Splash screen**: Brief branded loading state with gold glow animation
- **Deck Builder** (`src/deck-builder/DeckBuilder.tsx`): Multi-step character creation wizard (shown when no characters exist)
- **Hand View** (`src/hand/HandView.tsx`): In-play card hand with hero card, stat bar, and info panels (shown when a character exists)
- Framer Motion `AnimatePresence` with `popLayout` mode handles transitions between phases
- Spring physics for view entrances: `stiffness: 200-260, damping: 28, mass: 0.8-1`

### Component Patterns

- **GameButton** (`src/ui/GameButton.tsx`): Primary/secondary/ghost buttons with gold gradient and engraved text
- **GlassPanel** (`src/ui/GlassPanel.tsx`): Glass-effect panels with default, gold, and domain-accent variants
- **SRDCard** (`src/cards/SRDCard.tsx`): Full SRD-style card with auto-fit title, masked illustration, textured frame
- **DomainCard** (`src/cards/DomainCard.tsx`): Domain card with color system tied to domain colors
- **CardFlip/CardZoom** (`src/cards/`): Flip animation and pinch-to-zoom interactions
- **CollapsiblePanel** (`src/hand/panels/`): Expandable info sections in the hand view

### Styling

- Tailwind CSS with iOS color tokens (`ios-blue`, `ios-gray`, etc.) in `tailwind.config.js`
- CSS variables for iOS colors and spring curves in `src/index.css`
- Design tokens in `src/design-system/tokens/`

### Liquid Glass Design System

The app uses Apple's "Liquid Glass" aesthetic (defined in `src/index.css`):
- **Specular highlights**: White gradient/inset shadow at top edge simulates light reflection
- **Bottom shadows**: Subtle dark inset for depth
- **Background**: Semi-transparent with backdrop blur and saturation boost
- **Drop shadows**: Elevation and floating appearance

Glass variants: `.glass`, `.glass-strong`, `.glass-dark`, `.glass-interactive`

### Design Lab Pages

Access via query params on localhost:
- `?components` → Design System - Full living style reference (typography, colors, components, architecture notes). Source: `src/app/DesignSystem.tsx`
- `?cards` → DesignLab - Card delta tool (placeholder in v2, see `src/app/DesignLab.tsx`)

### SRD Data

The `daggerheart-srd-main/` folder contains Daggerheart game content:
- `.build/json/`: Structured data (classes, ancestries, weapons, adversaries, etc.)
- `contents/`: Markdown rules documentation
- `domains/`, `subclasses/`, `classes/`: Character option markdown files
