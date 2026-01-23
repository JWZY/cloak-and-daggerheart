import { describe, it, expect, beforeEach } from 'vitest'
import { useCharacterStore } from './characterStore'
import type { Ancestry, Community, DomainCard, Traits } from '../types/character'

// Mock data for testing
const mockAncestry: Ancestry = {
  name: 'Test Ancestry',
  description: 'A test ancestry',
  feats: [{ name: 'Test Feat', text: 'Test text' }],
}

const mockCommunity: Community = {
  name: 'Test Community',
  description: 'A test community',
  feats: [{ name: 'Test Feat', text: 'Test text' }],
}

const mockDomainCards: DomainCard[] = [
  {
    name: 'Test Card',
    level: '1',
    domain: 'Codex',
    type: 'ability',
    recall: '1 Hope',
    text: 'Test text',
  },
]

const mockTraits: Traits = {
  agility: 0,
  strength: -1,
  finesse: 1,
  instinct: 2,
  presence: 1,
  knowledge: 3,
}

// Reset the store before each test
beforeEach(() => {
  useCharacterStore.setState({
    characters: [],
    currentCharacterId: null,
    draftCharacter: null,
    rollHistory: [],
  })
})

describe('finalizeDraft', () => {
  it('returns null when draft is missing required fields', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({ name: 'Test Character' }) // Missing other fields

    const result = store.finalizeDraft()
    expect(result).toBeNull()
  })

  it('returns null when name is missing', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })

    const result = store.finalizeDraft()
    expect(result).toBeNull()
  })

  it('creates character with correct HP for School of Knowledge (base HP)', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Knowledge Wizard',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })

    const id = store.finalizeDraft()
    expect(id).not.toBeNull()

    const character = useCharacterStore.getState().characters.find(c => c.id === id)
    expect(character).toBeDefined()
    // School of Knowledge gets base Wizard HP (5)
    expect(character!.hp.max).toBe(5)
  })

  it('creates character with correct HP for School of War (base HP + 1)', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'War Wizard',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of War',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })

    const id = store.finalizeDraft()
    expect(id).not.toBeNull()

    const character = useCharacterStore.getState().characters.find(c => c.id === id)
    expect(character).toBeDefined()
    // School of War gets base Wizard HP (5) + 1 = 6
    expect(character!.hp.max).toBe(6)
  })
})

describe('updateHP', () => {
  it('clamps HP at 0 minimum', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateHP(id, -5)

    const character = store.getCurrentCharacter()
    expect(character!.hp.current).toBe(0)
  })

  it('clamps HP at max', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateHP(id, 100)

    const character = store.getCurrentCharacter()
    expect(character!.hp.current).toBe(character!.hp.max)
  })
})

describe('updateArmorSlots', () => {
  it('clamps armor slots at 0 minimum', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateArmorSlots(id, -10)

    const character = store.getCurrentCharacter()
    expect(character!.armorSlots.current).toBe(0)
  })

  it('clamps armor slots at max', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateArmorSlots(id, 100)

    const character = store.getCurrentCharacter()
    expect(character!.armorSlots.current).toBe(character!.armorSlots.max)
  })
})

describe('updateHope', () => {
  it('clamps hope at 0 minimum', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateHope(id, -10)

    const character = store.getCurrentCharacter()
    expect(character!.hope).toBe(0)
  })

  it('allows hope to increase without upper bound', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateHope(id, 100)

    const character = store.getCurrentCharacter()
    expect(character!.hope).toBe(100)
  })
})

describe('updateStress', () => {
  it('clamps stress at 0 minimum', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateStress(id, -5)

    const character = store.getCurrentCharacter()
    expect(character!.stress.current).toBe(0)
  })

  it('clamps stress at max (6)', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    store.updateStress(id, 100)

    const character = store.getCurrentCharacter()
    expect(character!.stress.current).toBe(6)
  })
})

describe('addRoll', () => {
  it('maintains 10-item limit in roll history', () => {
    // Add 12 rolls
    for (let i = 0; i < 12; i++) {
      useCharacterStore.getState().addRoll({
        hopeDie: i + 1,
        fearDie: 6,
        modifier: 0,
        total: i + 7,
        result: 'hope',
      })
    }

    const rollHistory = useCharacterStore.getState().rollHistory
    expect(rollHistory.length).toBe(10)
    // Most recent roll should be first (hopeDie = 12)
    expect(rollHistory[0].hopeDie).toBe(12)
    // Oldest kept roll should have hopeDie = 3 (rolls 1 and 2 were pushed out)
    expect(rollHistory[9].hopeDie).toBe(3)
  })

  it('adds id and timestamp to rolls', () => {
    useCharacterStore.getState().addRoll({
      hopeDie: 6,
      fearDie: 4,
      modifier: 2,
      total: 12,
      result: 'hope',
    })

    const rollHistory = useCharacterStore.getState().rollHistory
    expect(rollHistory[0].id).toBeTruthy()
    expect(rollHistory[0].timestamp).toBeGreaterThan(0)
  })
})

describe('deleteCharacter', () => {
  it('clears currentCharacterId when deleting current character', () => {
    const store = useCharacterStore.getState()
    store.startDraft()
    store.updateDraft({
      name: 'Test',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const id = store.finalizeDraft()!

    // Verify the character is current
    expect(useCharacterStore.getState().currentCharacterId).toBe(id)

    store.deleteCharacter(id)

    expect(useCharacterStore.getState().currentCharacterId).toBeNull()
    expect(useCharacterStore.getState().characters.length).toBe(0)
  })

  it('does not clear currentCharacterId when deleting a different character', () => {
    const store = useCharacterStore.getState()

    // Create first character
    store.startDraft()
    store.updateDraft({
      name: 'First',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of Knowledge',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const firstId = store.finalizeDraft()!

    // Create second character (which becomes current)
    store.startDraft()
    store.updateDraft({
      name: 'Second',
      ancestry: mockAncestry,
      community: mockCommunity,
      subclass: 'School of War',
      domainCards: mockDomainCards,
      traits: mockTraits,
    })
    const secondId = store.finalizeDraft()!

    // Delete first character
    store.deleteCharacter(firstId)

    // Current character should still be second
    expect(useCharacterStore.getState().currentCharacterId).toBe(secondId)
    expect(useCharacterStore.getState().characters.length).toBe(1)
  })
})
