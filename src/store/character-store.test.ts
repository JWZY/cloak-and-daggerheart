import { describe, it, expect, beforeEach } from 'vitest'
import { useCharacterStore } from './character-store'
import type { Character } from '../types/character'
import type { LevelUpChoices } from '../core/character/level-up'

// ---------------------------------------------------------------------------
// Helper: build a minimal valid Character for testing
// ---------------------------------------------------------------------------

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'test-id-1',
    name: 'Test Wizard',
    level: 1,
    ancestry: {
      name: 'Human',
      description: 'A versatile people.',
      feats: [{ name: 'Adaptable', text: 'Gain a feat of your choice.' }],
    },
    community: {
      name: 'Highborne',
      description: 'Nobility.',
      feats: [{ name: 'Highborne Feat', text: 'Some feat text.' }],
    },
    class: 'Wizard',
    subclass: 'School of Knowledge',
    traits: {
      agility: -1,
      strength: 0,
      finesse: 0,
      instinct: 1,
      presence: 1,
      knowledge: 2,
    },
    hp: { current: 5, max: 5 },
    armorSlots: { current: 3, max: 3 },
    hope: 2,
    stress: { current: 0, max: 6 },
    evasion: 10,
    proficiency: 1,
    domainCards: [
      {
        name: 'Book of Ava',
        level: '1',
        domain: 'Codex',
        type: 'Spell',
        recall: '2d6',
        text: 'Some ability text.',
      },
      {
        name: 'Bolt Beacon',
        level: '1',
        domain: 'Splendor',
        type: 'Spell',
        recall: '2d8',
        text: 'Another ability text.',
      },
    ],
    equipment: {
      primaryWeapon: null,
      secondaryWeapon: null,
      armor: null,
      items: [],
      consumables: [],
    },
    gold: 10,
    notes: '',
    advancements: [],
    markedTraits: [],
    subclassTier: 'foundation',
    backgroundAnswers: [],
    experiences: [],
    connectionAnswers: [],
    createdAt: Date.now(),
    ...overrides,
  }
}

// Reset store before each test
beforeEach(() => {
  useCharacterStore.setState({ characters: [] })
})

describe('character-store', () => {
  // -------------------------------------------------------------------------
  // createCharacter / deleteCharacter
  // -------------------------------------------------------------------------

  it('createCharacter adds a character', () => {
    const char = makeCharacter()
    useCharacterStore.getState().createCharacter(char)
    expect(useCharacterStore.getState().characters).toHaveLength(1)
    expect(useCharacterStore.getState().characters[0].name).toBe('Test Wizard')
  })

  it('deleteCharacter removes a character', () => {
    const char = makeCharacter()
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().deleteCharacter('test-id-1')
    expect(useCharacterStore.getState().characters).toHaveLength(0)
  })

  it('deleteCharacter with wrong id does nothing', () => {
    const char = makeCharacter()
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().deleteCharacter('nonexistent')
    expect(useCharacterStore.getState().characters).toHaveLength(1)
  })

  // -------------------------------------------------------------------------
  // updateHP
  // -------------------------------------------------------------------------

  it('updateHP increases HP', () => {
    const char = makeCharacter({ hp: { current: 3, max: 5 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateHP('test-id-1', 1)
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(4)
  })

  it('updateHP decreases HP', () => {
    const char = makeCharacter({ hp: { current: 3, max: 5 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateHP('test-id-1', -1)
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(2)
  })

  it('updateHP does not go below 0', () => {
    const char = makeCharacter({ hp: { current: 1, max: 5 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateHP('test-id-1', -5)
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(0)
  })

  it('updateHP does not go above max', () => {
    const char = makeCharacter({ hp: { current: 4, max: 5 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateHP('test-id-1', 10)
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(5)
  })

  // -------------------------------------------------------------------------
  // updateArmor
  // -------------------------------------------------------------------------

  it('updateArmor increases armor', () => {
    const char = makeCharacter({ armorSlots: { current: 1, max: 3 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateArmor('test-id-1', 1)
    expect(useCharacterStore.getState().characters[0].armorSlots.current).toBe(2)
  })

  it('updateArmor does not go below 0', () => {
    const char = makeCharacter({ armorSlots: { current: 0, max: 3 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateArmor('test-id-1', -1)
    expect(useCharacterStore.getState().characters[0].armorSlots.current).toBe(0)
  })

  it('updateArmor does not go above max', () => {
    const char = makeCharacter({ armorSlots: { current: 3, max: 3 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateArmor('test-id-1', 1)
    expect(useCharacterStore.getState().characters[0].armorSlots.current).toBe(3)
  })

  // -------------------------------------------------------------------------
  // updateHope
  // -------------------------------------------------------------------------

  it('updateHope increases hope', () => {
    const char = makeCharacter({ hope: 2 })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateHope('test-id-1', 1)
    expect(useCharacterStore.getState().characters[0].hope).toBe(3)
  })

  it('updateHope does not go below 0', () => {
    const char = makeCharacter({ hope: 0 })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateHope('test-id-1', -1)
    expect(useCharacterStore.getState().characters[0].hope).toBe(0)
  })

  it('updateHope can increase without upper bound', () => {
    const char = makeCharacter({ hope: 10 })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateHope('test-id-1', 5)
    expect(useCharacterStore.getState().characters[0].hope).toBe(15)
  })

  // -------------------------------------------------------------------------
  // updateStress
  // -------------------------------------------------------------------------

  it('updateStress increases stress', () => {
    const char = makeCharacter({ stress: { current: 2, max: 6 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateStress('test-id-1', 1)
    expect(useCharacterStore.getState().characters[0].stress.current).toBe(3)
  })

  it('updateStress does not go below 0', () => {
    const char = makeCharacter({ stress: { current: 0, max: 6 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateStress('test-id-1', -1)
    expect(useCharacterStore.getState().characters[0].stress.current).toBe(0)
  })

  it('updateStress does not go above max', () => {
    const char = makeCharacter({ stress: { current: 5, max: 6 } })
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateStress('test-id-1', 5)
    expect(useCharacterStore.getState().characters[0].stress.current).toBe(6)
  })

  // -------------------------------------------------------------------------
  // updateNotes
  // -------------------------------------------------------------------------

  it('updateNotes updates character notes', () => {
    const char = makeCharacter()
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateNotes('test-id-1', 'Session 1: Defeated the goblin.')

    expect(useCharacterStore.getState().characters[0].notes).toBe(
      'Session 1: Defeated the goblin.'
    )
  })

  it('updateNotes can set notes to empty string', () => {
    const char = makeCharacter({ notes: 'Some notes' } as Partial<Character>)
    useCharacterStore.getState().createCharacter(char)
    useCharacterStore.getState().updateNotes('test-id-1', '')

    expect(useCharacterStore.getState().characters[0].notes).toBe('')
  })

  // -------------------------------------------------------------------------
  // levelUp
  // -------------------------------------------------------------------------

  it('levelUp applies level up to the correct character', () => {
    const char = makeCharacter({
      id: 'char-1',
      name: 'Hero',
      experiences: [
        { text: 'Studied magic', bonus: 2 },
        { text: 'Fought monsters', bonus: 2 },
      ],
    })
    useCharacterStore.getState().createCharacter(char)

    const choices: LevelUpChoices = {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [{
        name: 'Test Card',
        level: '2',
        domain: 'Arcana',
        type: 'Ability',
        recall: '10',
        text: 'Test text',
      }],
      newExperience: { text: 'New adventure' },
    }

    useCharacterStore.getState().levelUp('char-1', choices)

    const updated = useCharacterStore.getState().characters[0]
    expect(updated.level).toBe(2)
    expect(updated.hp.max).toBe(6) // 5 + 1 from add_hp
    expect(updated.stress.max).toBe(7) // 6 + 1 from add_stress
    expect(updated.experiences).toHaveLength(3)
    expect(updated.domainCards).toHaveLength(3) // 2 existing + 1 new
  })

  it('levelUp does not affect other characters', () => {
    const char1 = makeCharacter({ id: 'char-1', name: 'Hero One' })
    const char2 = makeCharacter({
      id: 'char-2',
      name: 'Hero Two',
      hp: { current: 8, max: 8 },
    })
    useCharacterStore.getState().createCharacter(char1)
    useCharacterStore.getState().createCharacter(char2)

    const choices: LevelUpChoices = {
      advancements: [
        { level: 2, type: 'add_hp' },
        { level: 2, type: 'add_stress' },
      ],
      newDomainCards: [{
        name: 'Test Card',
        level: '2',
        domain: 'Arcana',
        type: 'Ability',
        recall: '10',
        text: 'Test text',
      }],
      newExperience: { text: 'New adventure' },
    }

    useCharacterStore.getState().levelUp('char-1', choices)

    const hero2 = useCharacterStore.getState().characters[1]
    expect(hero2.level).toBe(1)
    expect(hero2.hp.max).toBe(8) // unchanged
  })
})
