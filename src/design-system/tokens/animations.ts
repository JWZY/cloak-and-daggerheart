// Animation tokens for the design system
// Spring configurations and timing values

/**
 * iOS-native spring physics configurations for Framer Motion
 */
export const springs = {
  /** Fast, snappy interactions */
  snappy: { stiffness: 400, damping: 30, mass: 0.8 },
  /** Smooth, natural feel - default iOS-like spring */
  smooth: { stiffness: 300, damping: 30, mass: 0.8 },
  /** Slightly bouncy, playful */
  bouncy: { stiffness: 500, damping: 25, mass: 0.8 },
  /** Gentle, slow transitions */
  gentle: { stiffness: 200, damping: 30, mass: 1 },
} as const

/**
 * Timing curves for CSS transitions
 */
export const curves = {
  /** iOS-native bounce curve */
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  /** Smooth ease-out */
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Standard ease-in-out */
  ease: 'ease',
} as const

/**
 * Duration values in seconds
 */
export const durations = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  xslow: 0.5,
} as const

/**
 * Transition presets combining duration and curve
 */
export const transitions = {
  fast: `${durations.fast}s ease`,
  normal: `${durations.normal}s ease`,
  slow: `${durations.slow}s ease`,
} as const

/**
 * Tap feedback scale for buttons/cards
 */
export const tapFeedback = {
  /** Subtle press effect */
  subtle: { scale: 0.98 },
  /** Standard press effect */
  standard: { scale: 0.95 },
  /** Strong press effect for larger elements */
  strong: { scale: 0.9 },
} as const

/**
 * Hover lift effect
 */
export const hoverLift = {
  /** Subtle lift for cards */
  subtle: { y: -2 },
  /** Standard lift */
  standard: { y: -4 },
} as const

/**
 * Sheet/drawer drag constraints
 */
export const sheetConstraints = {
  dragElastic: 0.2,
  dragConstraints: { top: 0 },
} as const
