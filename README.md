# Cloak & Daggerheart

A mobile-first web app built with iOS-native motion patterns and interaction design.

## Features

- 🎯 **Native iOS Feel**: Spring animations matching iOS physics
- 📱 **Swipeable Views**: Swipe left/right to navigate between tabs
- 📄 **Bottom Sheets**: iOS-style sheets with native drag behavior
- ✨ **Framer Motion**: Smooth, 60fps animations
- 🎨 **Modern Design**: Dark mode with iOS-style components
- 📲 **PWA Ready**: Install as a standalone app

## Tech Stack

- **React** + TypeScript
- **Vite** - Lightning fast dev server
- **Framer Motion** - Professional animations
- **Vaul** - Native iOS-style bottom sheets
- **Tailwind CSS** - Utility-first styling

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Test on Mobile

To test on your iOS device:

1. Start the dev server: `npm run dev`
2. Find your local IP address (e.g., 192.168.1.100)
3. On your iOS device, open Safari and go to `http://YOUR_IP:3000`
4. Add to Home Screen for the full native app experience

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── TabBar.tsx   # iOS-style tab navigation
│   ├── Sheet.tsx    # Bottom sheet component
│   └── Card.tsx     # Card component with tap effects
├── views/           # Main app views/screens
│   ├── HomeView.tsx
│   ├── ExploreView.tsx
│   └── ProfileView.tsx
├── App.tsx          # Main app with swipe navigation
└── index.css        # Global styles & iOS variables
```

## Key Features Explained

### Swipe Navigation

The app uses Framer Motion's drag gestures to enable swipe navigation between views. Users can:
- Swipe left/right to change tabs
- Tap tab bar items for instant navigation
- Experience smooth spring animations matching iOS

### Bottom Sheets

iOS-style sheets using Vaul:
- Drag down to dismiss
- Native spring physics
- Backdrop blur effect
- Respects safe areas

### iOS Design System

The app uses iOS native design tokens:
- SF Pro font stack
- iOS blue (#007AFF)
- Native spacing and sizing
- Spring animation curves

## Customization

### Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --ios-blue: #007AFF;
  --ios-background: #000000;
  --ios-surface: #1C1C1E;
}
```

### Animations

Adjust spring physics in components:

```typescript
const spring = {
  type: "spring",
  stiffness: 300,  // Higher = snappier
  damping: 30,     // Higher = less bounce
  mass: 0.8        // Higher = heavier feel
}
```

## License

MIT

