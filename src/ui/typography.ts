/**
 * Centralized Typography Tokens
 *
 * Single source of truth for all typography styles in the app.
 * Four tiers: Title, Subtitle, Body, Micro.
 *
 * Usage:
 *   import { typeTitle, typeSubtitle, typeBody, typeMicro } from '../ui/typography'
 *   <h1 style={{ ...typeTitle, fontSize: 36 }}>Title</h1>
 *   <span style={{ ...typeSubtitle, color: goldDark }}>Label</span>
 */

// ─── Typography Tiers ────────────────────────────────────────────────────────

/**
 * TITLE — Display tier for card titles, hero names, page headings.
 * Does NOT include fontSize because it varies (AutoFit, 24-72px contextual).
 * Components apply their own size.
 */
export const typeTitle = {
  fontFamily: "'EB Garamond', serif",
  fontWeight: 500 as const,
  fontVariant: 'small-caps' as const,
  letterSpacing: '0.01em',
}

/**
 * SUBTITLE — Labels, buttons, section headers, card subtitles, panel titles.
 * EB Garamond 600, small-caps, 0.06em tracking, 13px.
 */
export const typeSubtitle = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 13,
  fontWeight: 600 as const,
  fontVariant: 'small-caps' as const,
  letterSpacing: '0.06em',
}

/**
 * BODY — Card descriptions, form inputs, step instructions, body copy.
 * Source Sans 3 400, 13.5px, line-height 1.4.
 */
export const typeBody = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 13.5,
  fontWeight: 400 as const,
  lineHeight: 1.4,
}

/**
 * MICRO — Badges, stat labels, domain tags, pip indicators.
 * EB Garamond 600, 11px, small-caps, 0.06em tracking.
 */
export const typeMicro = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 11,
  fontWeight: 600 as const,
  fontVariant: 'small-caps' as const,
  letterSpacing: '0.06em',
}

// ─── Gold Colors ─────────────────────────────────────────────────────────────

export const goldLight = '#f9f8f3'
export const goldDark = '#e7ba90'
export const goldAccent = '#d4af37'
export const goldGradient = `linear-gradient(180deg, ${goldLight}, ${goldDark})`
/** Horizontal gold gradient (left to right) — used for step indicators, progress bars */
export const goldGradientH = `linear-gradient(90deg, ${goldLight}, ${goldDark})`

// ─── Gold with Opacity Helpers ──────────────────────────────────────────────
// goldDark (#e7ba90) = rgb(231, 186, 144)

/** Gold-dark at given opacity — returns rgba string */
export function goldDarkAlpha(alpha: number): string {
  return `rgba(231,186,144,${alpha})`
}

/** Gold-light at given opacity — returns rgba string */
export function goldLightAlpha(alpha: number): string {
  return `rgba(249,248,243,${alpha})`
}

/** Subtle gold background gradient at low opacity — used for buttons, overlays */
export const goldGradientSubtle = `linear-gradient(180deg, ${goldLightAlpha(0.12)} 0%, ${goldDarkAlpha(0.12)} 100%)`

/** Separator line: left-to-right fade from transparent to gold */
export const goldSeparatorLeft = `linear-gradient(90deg, transparent, ${goldDarkAlpha(0.4)})`
/** Separator line: right-to-left fade from transparent to gold */
export const goldSeparatorRight = `linear-gradient(270deg, transparent, ${goldDarkAlpha(0.4)})`

/** Gold gradient text style — background-clip text pattern for shiny gold text */
export const goldGradientStyle = {
  background: `linear-gradient(180deg, ${goldLight} 0%, ${goldDark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: 'none',
} as const
