/**
 * DEAD CODE — Nothing in src/ imports from this file.
 *
 * The canonical color tokens live in:
 *   - CSS custom properties: src/index.css (:root)
 *   - Gold values: src/ui/typography.ts (goldLight, goldDark, goldGradient)
 *   - Domain colors: src/cards/domain-colors.ts
 *   - Card tokens: src/cards/card-tokens.ts
 *
 * This file is kept for reference only. If you need to use these values,
 * prefer the CSS custom properties or the canonical JS sources above.
 */

// Liquid Glass colors (as RGB for CSS var usage) — reference only
export const liquidGlassColors = {
  specular: '255, 255, 255',
  shadow: '0, 0, 0',
} as const

// Glass text colors — reference only
// In practice, components use CSS vars (--text-primary, --text-secondary, --text-muted)
// or inline rgba values. These are not imported anywhere.
export const glassTextColors = {
  primary: 'white',
  secondary: 'rgba(255, 255, 255, 0.7)',
  muted: 'rgba(255, 255, 255, 0.5)',
} as const

// Glass icon colors — reference only
// Components use CSS vars directly: --lg-icon-default, --lg-icon-hover, --lg-icon-muted
export const glassIconColors = {
  default: 'var(--lg-icon-default)',
  hover: 'var(--lg-icon-hover)',
  muted: 'var(--lg-icon-muted)',
} as const
