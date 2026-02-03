// HP calculation logic for characters
// Pure functions - no React, no side effects

import type { WizardSubclass } from '../../types/character'

/**
 * Calculate max HP for a Wizard based on subclass
 * School of War (Battlemage) gets +1 HP
 */
export function calculateWizardMaxHP(baseHP: number, subclass: WizardSubclass): number {
  return subclass === 'School of War' ? baseHP + 1 : baseHP
}

/**
 * Clamp HP value between 0 and max
 */
export function clampHP(current: number, max: number): number {
  return Math.max(0, Math.min(current, max))
}
