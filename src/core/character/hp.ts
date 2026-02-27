// HP calculation logic for characters
// Pure functions - no React, no side effects

import { getSubclassBonusHP } from '../rules/class-rules'

/**
 * Calculate max HP for a character based on their subclass
 */
export function calculateMaxHP(baseHP: number, subclassName: string): number {
  return baseHP + getSubclassBonusHP(subclassName)
}

/**
 * Clamp HP value between 0 and max
 */
export function clampHP(current: number, max: number): number {
  return Math.max(0, Math.min(current, max))
}
