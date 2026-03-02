/**
 * Centralized Typography Tokens
 *
 * Single source of truth for all typography styles in the app.
 * Four tiers: Title, Subtitle, Body, Micro.
 *
 * Usage:
 *   import { typeTitle, typeSubtitle, typeBody, typeMicro } from '../ui/typography'
 *   <h1 style={{ ...typeTitle, fontSize: 36 }}>Title</h1>
 *   <span style={{ ...typeSubtitle, color: '#e7ba90' }}>Label</span>
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
export const goldGradient = `linear-gradient(180deg, ${goldLight}, ${goldDark})`
