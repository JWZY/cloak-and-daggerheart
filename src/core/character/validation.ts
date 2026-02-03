// Character validation logic
// Pure functions for validating character data

import type { Ancestry, Community, DomainCard, Traits, WizardSubclass, Equipment } from '../../types/character'

/**
 * Draft character during creation
 */
export interface DraftCharacter {
  name?: string
  ancestry?: Ancestry
  community?: Community
  subclass?: WizardSubclass
  domainCards?: DomainCard[]
  traits?: Traits
  equipment?: Partial<Equipment>
}

/**
 * Check if a draft character has all required fields for finalization
 */
export function isDraftComplete(draft: DraftCharacter | null): draft is Required<Omit<DraftCharacter, 'equipment'>> & DraftCharacter {
  if (!draft) return false

  return !!(
    draft.name &&
    draft.ancestry &&
    draft.community &&
    draft.subclass &&
    draft.domainCards &&
    draft.traits
  )
}

/**
 * Validate that traits are properly assigned
 * Each value from [-1, 0, 0, 1, 1, 2] must be used exactly once
 */
export function areTraitsValid(traits: Traits): boolean {
  const values = Object.values(traits).sort((a, b) => a - b)
  const expected = [-1, 0, 0, 1, 1, 2]
  return values.length === expected.length &&
    values.every((v, i) => v === expected[i])
}
