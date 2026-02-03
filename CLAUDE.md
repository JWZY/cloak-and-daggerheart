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
├── core/              # Pure business logic (no React, no side effects)
│   ├── character/     # HP calcs, armor, migration, validation
│   ├── dice/          # Duality roll logic
│   └── rules/         # Traits, wizard-specific rules
├── content/           # All user-facing content
│   └── i18n/          # Translations (en.json + useTranslation hook)
├── design-system/     # Tokens and base components
│   ├── tokens/        # colors.ts, effects.ts, animations.ts
│   └── theme/         # ThemeContext, themeConfig
├── components/        # Feature-specific components
│   ├── ui/            # UI primitives (Button, Card, Sheet)
│   ├── dice/          # Dice rolling components
│   ├── cards/         # Domain/subclass card components
│   └── character/     # Character-specific components
├── views/             # Page compositions
│   ├── CharacterSheet/
│   └── CreateCharacter/
├── stores/            # Zustand state (thin layer)
├── contexts/          # React contexts (re-exports from design-system)
├── data/              # SRD data loaders
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

### Multi-Agent Development

Claude automatically takes the **@orchestrator** role (see Auto-Role above).

Just tell the orchestrator what you want - it spawns subagents automatically:
- `@frontend` - Code implementation (spawned via Task tool)
- `@ux` - Feature specs, user flows (spawned via Task tool)
- `@creative` - Visual design, animations (spawned via Task tool)

See `.claude/agents/README.md` for details.

### Navigation Pattern

The app uses a swipe-based navigation system in `App.tsx`:
- Three views (Home, Explore, Profile) managed via `useState`
- Framer Motion handles swipe gestures with `drag="x"` and `onDragEnd`
- `AnimatePresence` with `popLayout` mode for smooth view transitions
- iOS-native spring physics: `stiffness: 300, damping: 30, mass: 0.8`

### Component Patterns

- **Sheet.tsx**: iOS-style bottom sheets using Vaul's `Drawer` component
- **TabBar.tsx**: Tab navigation with spring-animated active states
- **Card.tsx**: Reusable card with tap feedback

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
- `?components` → ComponentsLibrary - full design system showcase (atoms, molecules, organisms, tokens)
- `?cards` or `?designlab` → CardDesignLab
- `?pickers` → PickerDesignLab

### SRD Data

The `daggerheart-srd-main/` folder contains Daggerheart game content:
- `.build/json/`: Structured data (classes, ancestries, weapons, adversaries, etc.)
- `contents/`: Markdown rules documentation
- `domains/`, `subclasses/`, `classes/`: Character option markdown files
