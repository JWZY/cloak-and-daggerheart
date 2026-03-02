/**
 * Shared card design tokens — single source of truth for SRDCard, DomainCard, and InfoCard.
 * SRDCard is the canonical reference. All values here match SRDCard exactly.
 *
 * Typography tokens are centralized in src/ui/typography.ts.
 * This file re-exports what card components need.
 */

import { typeSubtitle, goldLight, goldDark } from '../ui/typography'

// Re-export typography tokens for card consumers
export { typeTitle, typeSubtitle, typeBody, typeMicro, goldLight, goldDark, goldGradient } from '../ui/typography'

// Card dimensions
export const CARD_WIDTH = 360
export const CARD_HEIGHT = 508
export const CARD_BORDER_RADIUS = 12
export const CARD_BG = '#03070d'

// Gold gradient style for title elements (background-clip text)
export const goldGradientStyle = {
  background: `linear-gradient(180deg, ${goldLight} 0%, ${goldDark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: 'none', // text-shadow doesn't work with background-clip: text
} as const

// Shared subtitle style — used by class/domain name and footer
export const subtitleStyle = {
  ...typeSubtitle,
  lineHeight: 'normal' as const,
  ...goldGradientStyle,
}

// Gold drop-shadow filter for titles, subtitles, and footers
export const GOLD_DROP_SHADOW = 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))'

// Card frame overlay opacity (intentional divergence from Figma's 0.4)
export const CARD_FRAME_OPACITY = 0.6

// Content overlay gradient — multi-stop gradient used in content areas
export const CONTENT_OVERLAY_GRADIENT = 'linear-gradient(180deg, rgba(31, 58, 96, 0) 0%, rgba(3, 7, 13, 0.81) 12%, rgba(3, 7, 13, 0.81) 83%, rgba(19, 36, 60, 0.35) 97%, rgba(31, 58, 96, 0) 100%)'

// Illustration mask — bottom fade for illustration areas
export const ILLUSTRATION_MASK = 'linear-gradient(to bottom, black calc(100% - 10px), transparent 100%)'
