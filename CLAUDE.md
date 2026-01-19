# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # TypeScript check + production build
npm run lint     # ESLint with zero warnings policy
npm run preview  # Preview production build
```

## Architecture

This is a mobile-first PWA for viewing Daggerheart TTRPG content, designed to feel native on iOS.

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
- Component-specific CSS files colocated with components (e.g., `TabBar.css`)

### SRD Data

The `daggerheart-srd-main/` folder contains Daggerheart game content:
- `.build/json/`: Structured data (classes, ancestries, weapons, adversaries, etc.)
- `contents/`: Markdown rules documentation
- `domains/`, `subclasses/`, `classes/`: Character option markdown files
