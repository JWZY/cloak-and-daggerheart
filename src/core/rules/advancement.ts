import type { AdvancementType, Advancement } from '../../types/character'

// SRD proficiency progression: +1 at L2, L5, L8 (cumulative from base 1)
export function getProficiency(level: number): number {
  if (level >= 8) return 4
  if (level >= 5) return 3
  if (level >= 2) return 2
  return 1
}

// Tiers: 1-4 = Tier 1, 5-6 = Tier 2, 7-8 = Tier 3, 9-10 = Tier 4
export function getTier(level: number): 1 | 2 | 3 | 4 {
  if (level >= 9) return 4
  if (level >= 7) return 3
  if (level >= 5) return 2
  return 1
}

// Always 2 advancement slots per level-up
export function getAdvancementSlots(): number {
  return 2
}

// Advancement costs (most = 1, a few = 2)
export function getAdvancementCost(type: AdvancementType): number {
  switch (type) {
    case 'upgrade_subclass':
    case 'increase_proficiency':
      return 2
    default:
      return 1
  }
}

// Which types are available based on tier
export function getAvailableAdvancementTypes(tier: number): AdvancementType[] {
  // Basic advancements available at all tiers
  const types: AdvancementType[] = [
    'increase_traits',
    'add_hp',
    'add_stress',
    'boost_experiences',
    'add_domain_card',
    'increase_evasion',
  ]

  // Tier 3+ unlocks upgrade_subclass and increase_proficiency
  if (tier >= 3) {
    types.push('upgrade_subclass', 'increase_proficiency')
  }

  return types
}

// Per-tier pick limits (how many times each advancement can be picked within one tier)
export function getAdvancementPickLimit(type: AdvancementType): number {
  switch (type) {
    case 'increase_traits':
      return 3
    case 'add_hp':
      return 2
    case 'add_stress':
      return 2
    case 'boost_experiences':
      return 1
    case 'add_domain_card':
      return 1
    case 'increase_evasion':
      return 1
    case 'upgrade_subclass':
      return 1
    case 'increase_proficiency':
      return 2
  }
}

// Validate that a set of advancements uses exactly the right number of slots
export function validateAdvancements(advancements: Advancement[]): boolean {
  const totalCost = advancements.reduce((sum, a) => sum + getAdvancementCost(a.type), 0)
  return totalCost === getAdvancementSlots()
}
