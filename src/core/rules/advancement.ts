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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAvailableAdvancementTypes(_tier: number): AdvancementType[] {
  // All basic advancements available at all tiers
  const types: AdvancementType[] = [
    'increase_traits',
    'add_hp',
    'add_stress',
    'boost_experiences',
    'add_domain_card',
    'increase_evasion',
    'upgrade_subclass',
    'increase_proficiency',
  ]
  return types
}

// Validate that a set of advancements uses exactly the right number of slots
export function validateAdvancements(advancements: Advancement[]): boolean {
  const totalCost = advancements.reduce((sum, a) => sum + getAdvancementCost(a.type), 0)
  return totalCost === getAdvancementSlots()
}
