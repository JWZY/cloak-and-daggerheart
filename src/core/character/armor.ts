// Armor calculation logic
// Pure functions - no React, no side effects

import type { Armor } from '../../types/character'

export interface DamageThresholds {
  major: number
  severe: number
}

/**
 * Parse damage thresholds from armor string
 * @param thresholdString Format: "6 / 13"
 * @returns Object with major and severe thresholds
 */
export function parseThresholds(thresholdString: string): DamageThresholds {
  const parts = thresholdString.split('/').map(s => parseInt(s.trim(), 10))
  return { major: parts[0], severe: parts[1] }
}

/**
 * Get armor score (max armor slots) from armor
 */
export function getArmorScore(armor: Armor): number {
  return parseInt(armor.base_score, 10)
}

/**
 * Clamp armor slots between 0 and max
 */
export function clampArmorSlots(current: number, max: number): number {
  return Math.max(0, Math.min(current, max))
}
