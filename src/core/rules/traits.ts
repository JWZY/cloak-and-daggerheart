// Trait rules for character creation
// Pure data and functions - no React

import type { TraitName, Traits } from '../../types/character'

/**
 * All trait names in standard order
 */
export const TRAIT_NAMES: TraitName[] = [
  'agility',
  'strength',
  'finesse',
  'instinct',
  'presence',
  'knowledge',
]

/**
 * Descriptions for each trait
 */
export const TRAIT_DESCRIPTIONS: Record<TraitName, string> = {
  agility: 'Moving quickly and avoiding danger',
  strength: 'Physical power and endurance',
  finesse: 'Precision and delicate manipulation',
  instinct: 'Gut feelings and awareness',
  presence: 'Social influence and charisma',
  knowledge: 'Learning, memory, and reasoning',
}

/**
 * Available trait values to assign during character creation
 * One of each: -1, 0 (x2), +1 (x2), +2
 */
export const AVAILABLE_TRAIT_VALUES = [-1, 0, 0, 1, 1, 2] as const

/**
 * Suggested trait assignments for Wizard
 */
export const SUGGESTED_WIZARD_TRAITS: Traits = {
  agility: -1,
  strength: 0,
  finesse: 0,
  instinct: 1,
  presence: 1,
  knowledge: 2,
}

/**
 * Format a trait value for display
 * @example formatTraitValue(2) → "+2"
 * @example formatTraitValue(-1) → "-1"
 * @example formatTraitValue(null) → "—"
 */
export function formatTraitValue(value: number | null): string {
  if (value === null) return '—'
  if (value > 0) return `+${value}`
  return value.toString()
}

/**
 * Calculate remaining trait values from pool after assignments
 */
export function getRemainingTraitValues(
  assignments: Partial<Record<TraitName, number | null>>
): number[] {
  const pool: number[] = [...AVAILABLE_TRAIT_VALUES]
  Object.values(assignments).forEach((v) => {
    if (v !== null && v !== undefined) {
      const idx = pool.indexOf(v)
      if (idx !== -1) pool.splice(idx, 1)
    }
  })
  return pool.sort((a, b) => a - b)
}
