import { describe, it, expect, beforeEach } from 'vitest'
import { useDeckStore } from './deck-store'

// Reset Zustand store state before each test to avoid pollution
beforeEach(() => {
  useDeckStore.setState({
    currentStep: 0,
    selectedClass: null,
    subclass: null,
    selectedDomainCards: [],
    ancestryName: null,
    communityName: null,
    selectedArmor: null,
    selectedPrimaryWeapon: null,
    selectedSecondaryWeapon: null,
    traits: null,
    characterName: '',
  })
})

describe('deck-store', () => {
  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('has null selections and step 0 initially', () => {
    const state = useDeckStore.getState()
    expect(state.currentStep).toBe(0)
    expect(state.selectedClass).toBeNull()
    expect(state.subclass).toBeNull()
    expect(state.selectedDomainCards).toEqual([])
    expect(state.ancestryName).toBeNull()
    expect(state.communityName).toBeNull()
    expect(state.selectedArmor).toBeNull()
    expect(state.selectedPrimaryWeapon).toBeNull()
    expect(state.selectedSecondaryWeapon).toBeNull()
    expect(state.traits).toBeNull()
    expect(state.characterName).toBe('')
  })

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  it('setClass updates selectedClass and sets suggested equipment', () => {
    useDeckStore.getState().setClass('Wizard')
    const state = useDeckStore.getState()
    expect(state.selectedClass).toBe('Wizard')
    expect(state.selectedArmor).toBe('Leather Armor')
    expect(state.selectedPrimaryWeapon).toBe('Greatstaff')
    expect(state.selectedSecondaryWeapon).toBeNull()
  })

  it('setClass resets subclass and domain cards', () => {
    useDeckStore.getState().setClass('Wizard')
    useDeckStore.getState().setSubclass('School of Knowledge')
    useDeckStore.getState().toggleDomainCard('Card A')

    // Switch class — should reset subclass and cards
    useDeckStore.getState().setClass('Seraph')
    const state = useDeckStore.getState()
    expect(state.selectedClass).toBe('Seraph')
    expect(state.subclass).toBeNull()
    expect(state.selectedDomainCards).toEqual([])
    expect(state.selectedArmor).toBe('Chainmail Armor')
    expect(state.selectedPrimaryWeapon).toBe('Hallowed Axe')
  })

  it('setSubclass updates subclass', () => {
    useDeckStore.getState().setSubclass('School of Knowledge')
    expect(useDeckStore.getState().subclass).toBe('School of Knowledge')
  })

  it('toggleDomainCard adds a card', () => {
    useDeckStore.getState().toggleDomainCard('Book of Ava')
    expect(useDeckStore.getState().selectedDomainCards).toEqual(['Book of Ava'])
  })

  it('toggleDomainCard removes a card when toggled twice', () => {
    useDeckStore.getState().toggleDomainCard('Book of Ava')
    useDeckStore.getState().toggleDomainCard('Book of Ava')
    expect(useDeckStore.getState().selectedDomainCards).toEqual([])
  })

  it('toggleDomainCard enforces max 3 cards for School of Knowledge', () => {
    useDeckStore.getState().setSubclass('School of Knowledge')
    const store = useDeckStore.getState()
    store.toggleDomainCard('Card A')
    store.toggleDomainCard('Card B')
    store.toggleDomainCard('Card C')
    store.toggleDomainCard('Card D') // should be ignored
    expect(useDeckStore.getState().selectedDomainCards).toEqual([
      'Card A',
      'Card B',
      'Card C',
    ])
  })

  it('toggleDomainCard enforces max 2 cards for School of War', () => {
    useDeckStore.getState().setSubclass('School of War')
    const store = useDeckStore.getState()
    store.toggleDomainCard('Card A')
    store.toggleDomainCard('Card B')
    store.toggleDomainCard('Card C') // should be ignored
    expect(useDeckStore.getState().selectedDomainCards).toEqual([
      'Card A',
      'Card B',
    ])
  })

  it('setSubclass trims domain cards when switching to lower max', () => {
    useDeckStore.getState().setSubclass('School of Knowledge')
    useDeckStore.getState().toggleDomainCard('Card A')
    useDeckStore.getState().toggleDomainCard('Card B')
    useDeckStore.getState().toggleDomainCard('Card C')
    expect(useDeckStore.getState().selectedDomainCards).toHaveLength(3)

    // Switch to War (max 2) — should trim to first 2
    useDeckStore.getState().setSubclass('School of War')
    expect(useDeckStore.getState().selectedDomainCards).toEqual(['Card A', 'Card B'])
  })

  it('setAncestry updates ancestryName', () => {
    useDeckStore.getState().setAncestry('Human')
    expect(useDeckStore.getState().ancestryName).toBe('Human')
  })

  it('setCommunity updates communityName', () => {
    useDeckStore.getState().setCommunity('Highborne')
    expect(useDeckStore.getState().communityName).toBe('Highborne')
  })

  it('setArmor updates selectedArmor', () => {
    useDeckStore.getState().setArmor('Chainmail Armor')
    expect(useDeckStore.getState().selectedArmor).toBe('Chainmail Armor')
  })

  it('setPrimaryWeapon updates selectedPrimaryWeapon', () => {
    useDeckStore.getState().setPrimaryWeapon('Wand')
    expect(useDeckStore.getState().selectedPrimaryWeapon).toBe('Wand')
  })

  it('setSecondaryWeapon updates selectedSecondaryWeapon', () => {
    useDeckStore.getState().setSecondaryWeapon('Round Shield')
    expect(useDeckStore.getState().selectedSecondaryWeapon).toBe('Round Shield')
  })

  it('setSecondaryWeapon can be set to null', () => {
    useDeckStore.getState().setSecondaryWeapon('Round Shield')
    useDeckStore.getState().setSecondaryWeapon(null)
    expect(useDeckStore.getState().selectedSecondaryWeapon).toBeNull()
  })

  it('setTraits updates traits', () => {
    const traits = { agility: -1, strength: 0, finesse: 0, instinct: 1, presence: 1, knowledge: 2 }
    useDeckStore.getState().setTraits(traits)
    expect(useDeckStore.getState().traits).toEqual(traits)
  })

  it('setCharacterName updates characterName', () => {
    useDeckStore.getState().setCharacterName('Gandalf')
    expect(useDeckStore.getState().characterName).toBe('Gandalf')
  })

  // -------------------------------------------------------------------------
  // Step navigation
  // -------------------------------------------------------------------------

  it('nextStep increments currentStep', () => {
    useDeckStore.getState().nextStep()
    expect(useDeckStore.getState().currentStep).toBe(1)
  })

  it('nextStep clamps at 8', () => {
    useDeckStore.setState({ currentStep: 8 })
    useDeckStore.getState().nextStep()
    expect(useDeckStore.getState().currentStep).toBe(8)
  })

  it('prevStep decrements currentStep', () => {
    useDeckStore.setState({ currentStep: 3 })
    useDeckStore.getState().prevStep()
    expect(useDeckStore.getState().currentStep).toBe(2)
  })

  it('prevStep clamps at 0', () => {
    useDeckStore.setState({ currentStep: 0 })
    useDeckStore.getState().prevStep()
    expect(useDeckStore.getState().currentStep).toBe(0)
  })

  it('goToStep navigates to specific step', () => {
    useDeckStore.getState().goToStep(4)
    expect(useDeckStore.getState().currentStep).toBe(4)
  })

  it('goToStep clamps between 0 and 8', () => {
    useDeckStore.getState().goToStep(-1)
    expect(useDeckStore.getState().currentStep).toBe(0)
    useDeckStore.getState().goToStep(15)
    expect(useDeckStore.getState().currentStep).toBe(8)
  })

  // -------------------------------------------------------------------------
  // canProceed
  // -------------------------------------------------------------------------

  it('canProceed returns false when step 0 has no class selected', () => {
    useDeckStore.setState({ currentStep: 0, selectedClass: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 0 has a class selected', () => {
    useDeckStore.setState({ currentStep: 0, selectedClass: 'Wizard' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 1 requirements are not met', () => {
    useDeckStore.setState({ currentStep: 1, subclass: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 1 requirements are met', () => {
    useDeckStore.setState({ currentStep: 1, subclass: 'School of Knowledge' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 2 has fewer cards than required', () => {
    useDeckStore.setState({
      currentStep: 2,
      subclass: 'School of Knowledge',
      selectedDomainCards: ['Card A', 'Card B'],
    })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 2 has exactly 3 cards (Knowledge)', () => {
    useDeckStore.setState({
      currentStep: 2,
      subclass: 'School of Knowledge',
      selectedDomainCards: ['Card A', 'Card B', 'Card C'],
    })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns true when step 2 has exactly 2 cards (War)', () => {
    useDeckStore.setState({
      currentStep: 2,
      subclass: 'School of War',
      selectedDomainCards: ['Card A', 'Card B'],
    })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 2 has 3 cards but War only needs 2', () => {
    useDeckStore.setState({
      currentStep: 2,
      subclass: 'School of War',
      selectedDomainCards: ['Card A', 'Card B', 'Card C'],
    })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns false when step 3 has no ancestry', () => {
    useDeckStore.setState({ currentStep: 3, ancestryName: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 3 has ancestry', () => {
    useDeckStore.setState({ currentStep: 3, ancestryName: 'Human' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 4 has no community', () => {
    useDeckStore.setState({ currentStep: 4, communityName: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 4 has community', () => {
    useDeckStore.setState({ currentStep: 4, communityName: 'Highborne' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  // Step 5: Equipment
  it('canProceed returns false when step 5 has no armor', () => {
    useDeckStore.setState({ currentStep: 5, selectedArmor: null, selectedPrimaryWeapon: 'Greatstaff' })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns false when step 5 has no primary weapon', () => {
    useDeckStore.setState({ currentStep: 5, selectedArmor: 'Leather Armor', selectedPrimaryWeapon: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 5 has armor and primary weapon', () => {
    useDeckStore.setState({
      currentStep: 5,
      selectedArmor: 'Leather Armor',
      selectedPrimaryWeapon: 'Greatstaff',
    })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  // Step 6: Traits
  it('canProceed returns false when step 6 has no traits', () => {
    useDeckStore.setState({ currentStep: 6, traits: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 6 has traits', () => {
    useDeckStore.setState({
      currentStep: 6,
      traits: { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0 },
    })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  // Step 7: Experiences
  it('canProceed returns false when step 7 has no experiences', () => {
    useDeckStore.setState({ currentStep: 7, experiences: [] })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns false when step 7 has only 1 experience', () => {
    useDeckStore.setState({
      currentStep: 7,
      experiences: [{ text: 'Arcane Scholar', bonus: 2 }],
    })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 7 has 2 experiences', () => {
    useDeckStore.setState({
      currentStep: 7,
      experiences: [
        { text: 'Arcane Scholar', bonus: 2 },
        { text: 'War Survivor', bonus: 2 },
      ],
    })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 7 experiences are whitespace-only', () => {
    useDeckStore.setState({
      currentStep: 7,
      experiences: [
        { text: '  ', bonus: 2 },
        { text: '', bonus: 2 },
      ],
    })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  // Step 8: Name
  it('canProceed returns false when step 8 has empty name', () => {
    useDeckStore.setState({ currentStep: 8, characterName: '' })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns false when step 8 has whitespace-only name', () => {
    useDeckStore.setState({ currentStep: 8, characterName: '   ' })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 8 has a name', () => {
    useDeckStore.setState({ currentStep: 8, characterName: 'Gandalf' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  it('reset clears all state back to initial', () => {
    // Populate with data
    useDeckStore.setState({
      currentStep: 5,
      selectedClass: 'Wizard',
      subclass: 'School of War',
      selectedDomainCards: ['A', 'B', 'C'],
      ancestryName: 'Elf',
      communityName: 'Highborne',
      selectedArmor: 'Chainmail Armor',
      selectedPrimaryWeapon: 'Wand',
      selectedSecondaryWeapon: 'Round Shield',
      traits: { agility: 1, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 2 },
      characterName: 'TestChar',
    })

    useDeckStore.getState().reset()

    const state = useDeckStore.getState()
    expect(state.currentStep).toBe(0)
    expect(state.selectedClass).toBeNull()
    expect(state.subclass).toBeNull()
    expect(state.selectedDomainCards).toEqual([])
    expect(state.ancestryName).toBeNull()
    expect(state.communityName).toBeNull()
    expect(state.selectedArmor).toBeNull()
    expect(state.selectedPrimaryWeapon).toBeNull()
    expect(state.selectedSecondaryWeapon).toBeNull()
    expect(state.traits).toBeNull()
    expect(state.characterName).toBe('')
  })
})
