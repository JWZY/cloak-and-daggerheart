// Wizard-specific rules
// Pure functions - no React

import type { WizardSubclass } from '../../types/character'

/**
 * Get number of domain cards a Wizard can have based on subclass
 * School of Knowledge gets "Prepared" foundation which grants an extra card
 */
export function getWizardCardCount(subclass: WizardSubclass): number {
  return subclass === 'School of Knowledge' ? 3 : 2
}

/**
 * Get the spellcast trait for a Wizard subclass
 */
export function getWizardSpellcastTrait(subclass: WizardSubclass): string {
  return subclass === 'School of Knowledge' ? 'Knowledge' : 'Presence'
}

/**
 * Check if subclass grants bonus HP
 */
export function subclassGrantsBonusHP(subclass: WizardSubclass): boolean {
  return subclass === 'School of War'
}
