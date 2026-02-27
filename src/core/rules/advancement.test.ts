import { describe, it, expect } from 'vitest'
import {
  getProficiency,
  getTier,
  getAdvancementSlots,
  getAdvancementCost,
  getAvailableAdvancementTypes,
  getAdvancementPickLimit,
  validateAdvancements,
} from './advancement'

describe('getProficiency', () => {
  it('returns 1 for level 1', () => {
    expect(getProficiency(1)).toBe(1)
  })
  it('returns 2 for levels 2-4', () => {
    expect(getProficiency(2)).toBe(2)
    expect(getProficiency(3)).toBe(2)
    expect(getProficiency(4)).toBe(2)
  })
  it('returns 3 for levels 5-7', () => {
    expect(getProficiency(5)).toBe(3)
    expect(getProficiency(7)).toBe(3)
  })
  it('returns 4 for levels 8-10', () => {
    expect(getProficiency(8)).toBe(4)
    expect(getProficiency(10)).toBe(4)
  })
})

describe('getTier', () => {
  it('returns tier 1 for levels 1-4', () => {
    expect(getTier(1)).toBe(1)
    expect(getTier(4)).toBe(1)
  })
  it('returns tier 2 for levels 5-6', () => {
    expect(getTier(5)).toBe(2)
    expect(getTier(6)).toBe(2)
  })
  it('returns tier 3 for levels 7-8', () => {
    expect(getTier(7)).toBe(3)
    expect(getTier(8)).toBe(3)
  })
  it('returns tier 4 for levels 9-10', () => {
    expect(getTier(9)).toBe(4)
    expect(getTier(10)).toBe(4)
  })
})

describe('getAdvancementSlots', () => {
  it('always returns 2', () => {
    expect(getAdvancementSlots()).toBe(2)
  })
})

describe('getAdvancementCost', () => {
  it('costs 1 slot for basic advancements', () => {
    expect(getAdvancementCost('increase_traits')).toBe(1)
    expect(getAdvancementCost('add_hp')).toBe(1)
    expect(getAdvancementCost('add_stress')).toBe(1)
    expect(getAdvancementCost('boost_experiences')).toBe(1)
    expect(getAdvancementCost('add_domain_card')).toBe(1)
    expect(getAdvancementCost('increase_evasion')).toBe(1)
  })
  it('costs 2 slots for upgrade_subclass', () => {
    expect(getAdvancementCost('upgrade_subclass')).toBe(2)
  })
  it('costs 2 slots for increase_proficiency', () => {
    expect(getAdvancementCost('increase_proficiency')).toBe(2)
  })
})

describe('getAvailableAdvancementTypes', () => {
  it('returns only 6 basic types for tier 1', () => {
    const types = getAvailableAdvancementTypes(1)
    expect(types).toContain('increase_traits')
    expect(types).toContain('add_hp')
    expect(types).toContain('add_stress')
    expect(types).toContain('boost_experiences')
    expect(types).toContain('add_domain_card')
    expect(types).toContain('increase_evasion')
    expect(types).not.toContain('upgrade_subclass')
    expect(types).not.toContain('increase_proficiency')
    expect(types).toHaveLength(6)
  })

  it('returns only 6 basic types for tier 2', () => {
    const types = getAvailableAdvancementTypes(2)
    expect(types).toHaveLength(6)
    expect(types).not.toContain('upgrade_subclass')
    expect(types).not.toContain('increase_proficiency')
  })

  it('returns all 8 types for tier 3', () => {
    const types = getAvailableAdvancementTypes(3)
    expect(types).toContain('increase_traits')
    expect(types).toContain('add_hp')
    expect(types).toContain('add_stress')
    expect(types).toContain('boost_experiences')
    expect(types).toContain('add_domain_card')
    expect(types).toContain('increase_evasion')
    expect(types).toContain('upgrade_subclass')
    expect(types).toContain('increase_proficiency')
    expect(types).toHaveLength(8)
  })

  it('returns all 8 types for tier 4', () => {
    const types = getAvailableAdvancementTypes(4)
    expect(types).toHaveLength(8)
    expect(types).toContain('upgrade_subclass')
    expect(types).toContain('increase_proficiency')
  })
})

describe('getAdvancementPickLimit', () => {
  it('returns 3 for increase_traits', () => {
    expect(getAdvancementPickLimit('increase_traits')).toBe(3)
  })
  it('returns 2 for add_hp', () => {
    expect(getAdvancementPickLimit('add_hp')).toBe(2)
  })
  it('returns 2 for add_stress', () => {
    expect(getAdvancementPickLimit('add_stress')).toBe(2)
  })
  it('returns 1 for boost_experiences', () => {
    expect(getAdvancementPickLimit('boost_experiences')).toBe(1)
  })
  it('returns 1 for add_domain_card', () => {
    expect(getAdvancementPickLimit('add_domain_card')).toBe(1)
  })
  it('returns 1 for increase_evasion', () => {
    expect(getAdvancementPickLimit('increase_evasion')).toBe(1)
  })
  it('returns 1 for upgrade_subclass', () => {
    expect(getAdvancementPickLimit('upgrade_subclass')).toBe(1)
  })
  it('returns 2 for increase_proficiency', () => {
    expect(getAdvancementPickLimit('increase_proficiency')).toBe(2)
  })
})

describe('validateAdvancements', () => {
  it('accepts two 1-slot advancements', () => {
    expect(validateAdvancements([
      { level: 2, type: 'add_hp' },
      { level: 2, type: 'add_stress' },
    ])).toBe(true)
  })
  it('accepts one 2-slot advancement', () => {
    expect(validateAdvancements([
      { level: 2, type: 'upgrade_subclass' },
    ])).toBe(true)
  })
  it('rejects over 2 slots', () => {
    expect(validateAdvancements([
      { level: 2, type: 'add_hp' },
      { level: 2, type: 'add_stress' },
      { level: 2, type: 'increase_evasion' },
    ])).toBe(false)
  })
  it('rejects under 2 slots', () => {
    expect(validateAdvancements([
      { level: 2, type: 'add_hp' },
    ])).toBe(false)
  })
})
