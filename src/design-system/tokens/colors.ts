// Color tokens for the design system
// Extracted from index.css and tailwind.config.js

/**
 * iOS-native color palette
 */
export const iosColors = {
  blue: '#007AFF',
  gray: '#8E8E93',
  gray2: '#AEAEB2',
  gray3: '#C7C7CC',
  gray4: '#D1D1D6',
  gray5: '#E5E5EA',
  gray6: '#F2F2F7',
  separator: '#C6C6C8',
} as const

/**
 * Theme colors by Wizard subclass
 */
export const themeColors = {
  'School of Knowledge': {
    primary: '#6366f1', // Indigo
    gradientStart: '#4f46e5',
    gradientMid: '#7c3aed',
    gradientEnd: '#4f46e5',
    glow: 'rgba(99, 102, 241, 0.5)',
    accent: 'text-indigo-300',
  },
  'School of War': {
    primary: '#f59e0b', // Amber
    gradientStart: '#dc2626',
    gradientMid: '#f59e0b',
    gradientEnd: '#dc2626',
    glow: 'rgba(245, 158, 11, 0.5)',
    accent: 'text-amber-300',
  },
  default: {
    primary: '#64748b', // Slate
    gradientStart: '#475569',
    gradientMid: '#64748b',
    gradientEnd: '#475569',
    glow: 'rgba(100, 116, 139, 0.5)',
    accent: 'text-slate-300',
  },
} as const

/**
 * Liquid Glass colors (as RGB for CSS var usage)
 */
export const liquidGlassColors = {
  specular: '255, 255, 255',
  shadow: '0, 0, 0',
} as const

/**
 * Text colors for glass surfaces
 */
export const glassTextColors = {
  primary: 'white',
  secondary: 'rgba(255, 255, 255, 0.7)',
  muted: 'rgba(255, 255, 255, 0.5)',
} as const

/**
 * Icon colors for glass surfaces
 */
export const glassIconColors = {
  default: 'rgba(255, 255, 255, 0.8)',
  hover: 'rgba(255, 255, 255, 1)',
  muted: 'rgba(255, 255, 255, 0.6)',
} as const
