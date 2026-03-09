/**
 * Unified Warm Glass Surface Tokens
 *
 * Single source of truth for glass surface treatments across the app.
 * Warm brown fills that resist cold backdrop-filter tint from the #03070d page background.
 *
 * Usage:
 *   import { warmGlass, warmGlassSelected, RADIUS_OPTION, RADIUS_CARD } from '../design-system/tokens/surfaces'
 *   <div style={{ ...warmGlass, borderRadius: RADIUS_CARD }}>…</div>
 */

import { goldDarkAlpha, goldLightAlpha } from '../../ui/typography'

// ─── Warm Glass Base ────────────────────────────────────────────────────────

/** Base warm glass surface — no borderRadius (callers set their own) */
export const warmGlass: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(45,34,22,0.55), rgba(30,22,14,0.4))',
  backdropFilter: 'blur(12px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
  border: `1px solid ${goldDarkAlpha(0.15)}`,
  boxShadow: [
    `inset 0 1px 1px ${goldLightAlpha(0.18)}`,
    'inset 0 -1px 1px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.3)',
  ].join(', '),
}

/** Border color for selected warm glass surfaces */
export const warmGlassSelectedBorder = `1px solid ${goldDarkAlpha(0.4)}`

// ─── Border Radius Scale ────────────────────────────────────────────────────

/** Options, rows, inputs */
export const RADIUS_OPTION = 12
/** Cards, panels */
export const RADIUS_CARD = 16
/** Menus, modals */
export const RADIUS_MENU = 20
/** Pills, tab bars */
export const RADIUS_PILL = 9999
