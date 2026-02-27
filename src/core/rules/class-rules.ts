// Class-specific rules
// Pure functions - no React

/**
 * Get number of domain cards a subclass can have.
 * Most subclasses get 2; School of Knowledge gets 3 (via "Prepared" foundation).
 */
const SUBCLASS_CARD_COUNT: Record<string, number> = {
  'School of Knowledge': 3,
}

export function getSubclassCardCount(subclassName: string): number {
  return SUBCLASS_CARD_COUNT[subclassName] ?? 2
}

/**
 * Get bonus HP granted by a subclass.
 * Most subclasses get 0; School of War gets +1 (via "Battlemage" foundation).
 */
const SUBCLASS_BONUS_HP: Record<string, number> = {
  'School of War': 1,
}

export function getSubclassBonusHP(subclassName: string): number {
  return SUBCLASS_BONUS_HP[subclassName] ?? 0
}
