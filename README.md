# Cloak & Daggerheart

A mobile-first character builder for the Daggerheart TTRPG, designed to feel native on iOS.

**[Live Preview](https://jwzy.github.io/cloak-and-daggerheart/)**

## Features

- **Character Creation**: Step-by-step wizard for building Daggerheart characters
- **Character Sheet**: View and manage your character's stats, inventory, and cards
- **Dice Rolling**: Built-in duality dice roller with Hope/Fear mechanics
- **Domain Cards**: Browse and select cards from all Daggerheart domains
- **PWA Ready**: Install as a standalone app on your device

## Tech Stack

- **React** + TypeScript
- **Vite** - Lightning fast dev server
- **Framer Motion** - Native iOS-feel animations
- **Zustand** - State management
- **Tailwind CSS** - Utility-first styling
- **Vaul** - iOS-style bottom sheets

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Commands

```bash
npm run dev          # Start dev server
npm run build        # TypeScript check + tests + production build
npm run build:quick  # Skip tests, just build
npm run lint         # ESLint with zero warnings policy
npm run test         # Run Playwright e2e tests
npm run test:unit    # Run Vitest unit tests
```

## License

MIT
