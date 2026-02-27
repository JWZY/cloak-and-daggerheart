import { describe, it, expect } from 'vitest'
import { applyLevelUp } from './level-up'
import type { Character, DomainCard } from '../../types/character'

// Helper to create a minimal level 1 character for testing
function makeTestCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'test-1',
    name: 'Test Hero',
    level: 1,
    ancestry: { name: 'Human', description: 'A human', feats: [] },
    community: { name: 'Lorehold', description: 'A community', feats: [] },
    class: 'Wizard',
    subclass: 'School of Knowledge',
    traits: { agility: -1, strength: 0, finesse: 0, instinct: 1, presence: 1, knowledge: 2 },
    hp: { current: 5, max: 5 },
    armorSlots: { current: 0, max: 3 },
    hope: 2,
    stress: { current: 0, max: 2 },
    evasion: 10,
    proficiency: 1,
    domainCards: [],
    equipment: { primaryWeapon: null, secondaryWeapon: null, armor: null, items: [], consumables: [] },
    gold: 0,
    notes: '',
    backgroundAnswers: [],
    experiences: [
      { text: 'Studied ancient tomes', bonus: 2 },
      { text: 'Survived the wilderness', bonus: 2 },
    ],
    connectionAnswers: [],
    createdAt: Date.now(),
    advancements: [],
    markedTraits: [],
    subclassTier: 'foundation',
    ...overrides,
  }
}

const testDomainCard: DomainCard = {
  name: 'Arcane Shield',
  level: '2',
  domain: 'Arcana',
  type: 'Ability',
  recall: '10',
  text: 'You conjure a magical shield.',
}

describe('applyLevelUp', () => {
  it('increments level', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.level).toBe(2)
  })

  it('updates proficiency', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.proficiency).toBe(2)
  })

  it('adds new experience at +2', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.experiences).toHaveLength(3)
    expect(result.experiences[2]).toEqual({ text: 'Defeated the lich', bonus: 2 })
  })

  it('adds mandatory domain card', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.domainCards).toContainEqual(testDomainCard)
  })

  it('applies add_hp advancement', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.hp.max).toBe(6)
    expect(result.hp.current).toBe(6)
  })

  it('applies add_stress advancement', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.stress.max).toBe(3)
  })

  it('applies increase_traits and marks them', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'increase_traits', traits: ['agility', 'strength'] },
        { level: 2, type: 'add_hp' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.traits.agility).toBe(0) // -1 + 1 = 0
    expect(result.traits.strength).toBe(1) // 0 + 1 = 1
    expect(result.markedTraits).toContain('agility')
    expect(result.markedTraits).toContain('strength')
  })

  it('applies increase_evasion advancement', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'increase_evasion' },
        { level: 2, type: 'add_hp' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.evasion).toBe(11)
  })

  it('applies upgrade_subclass (costs 2 slots)', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'upgrade_subclass' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.subclassTier).toBe('specialization')
  })

  it('applies boost_experiences advancement', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'boost_experiences', experienceIndices: [0, 1] },
        { level: 2, type: 'add_hp' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.experiences[0].bonus).toBe(3) // 2 + 1
    expect(result.experiences[1].bonus).toBe(3) // 2 + 1
  })

  it('throws if advancement slots dont total 2', () => {
    const char = makeTestCharacter()
    expect(() =>
      applyLevelUp(char, {
        advancements: [{ level: 2, type: 'add_hp' }],
        newDomainCards: [testDomainCard],
        newExperience: { text: 'Defeated the lich' },
      })
    ).toThrow()
  })

  it('stores advancements on the character', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(result.advancements).toHaveLength(2)
    expect(result.advancements[0].type).toBe('add_hp')
  })

  it('does not mutate original character', () => {
    const char = makeTestCharacter()
    const originalHP = char.hp.max
    applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Defeated the lich' },
    })
    expect(char.hp.max).toBe(originalHP)
    expect(char.level).toBe(1)
  })

  it('upgrades subclass from specialization to mastery', () => {
    const char = makeTestCharacter({ subclassTier: 'specialization' })
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'upgrade_subclass' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Achieved mastery' },
    })
    expect(result.subclassTier).toBe('mastery')
  })

  it('applies increase_proficiency advancement', () => {
    const char = makeTestCharacter()
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'increase_proficiency' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Gained proficiency' },
    })
    // Base proficiency for level 2 is 2 via getProficiency, then +1 from advancement
    expect(result.proficiency).toBe(3)
  })

  it('handles card exchange', () => {
    const existingCard: DomainCard = {
      name: 'Old Card',
      level: '1',
      domain: 'Codex',
      type: 'Spell',
      recall: '2d6',
      text: 'Old card text.',
    }
    const exchangeCard: DomainCard = {
      name: 'Replacement Card',
      level: '2',
      domain: 'Codex',
      type: 'Spell',
      recall: '2d8',
      text: 'Replacement card text.',
    }
    const char = makeTestCharacter({ domainCards: [existingCard] })
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [testDomainCard],
      newExperience: { text: 'Exchanged cards' },
      exchangeCard: { remove: 'Old Card', add: exchangeCard },
    })
    // Old card removed, testDomainCard + exchangeCard present
    expect(result.domainCards.find(c => c.name === 'Old Card')).toBeUndefined()
    expect(result.domainCards.find(c => c.name === 'Replacement Card')).toBeDefined()
    expect(result.domainCards.find(c => c.name === 'Arcane Shield')).toBeDefined()
  })

  it('adds multiple domain cards when add_domain_card advancement is chosen', () => {
    const char = makeTestCharacter()
    const extraCard: DomainCard = {
      name: 'Extra Shield',
      level: '2',
      domain: 'Arcana',
      type: 'Ability',
      recall: '10',
      text: 'An extra magical shield.',
    }
    const result = applyLevelUp(char, {
      advancements: [
        { level: 2, type: 'add_domain_card', cardName: 'Extra Shield' },
        { level: 2, type: 'add_hp' },
      ],
      newDomainCards: [testDomainCard, extraCard],
      newExperience: { text: 'Expanded repertoire' },
    })
    expect(result.domainCards).toHaveLength(2)
    expect(result.domainCards.find(c => c.name === 'Arcane Shield')).toBeDefined()
    expect(result.domainCards.find(c => c.name === 'Extra Shield')).toBeDefined()
  })
})
