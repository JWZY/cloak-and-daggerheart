import { describe, it, expect, beforeEach } from 'vitest'
import { useDeckStore } from './deck-store'

// Reset Zustand store state before each test to avoid pollution
beforeEach(() => {
  useDeckStore.setState({
    currentStep: 0,
    subclass: null,
    selectedDomainCards: [],
    ancestryName: null,
    communityName: null,
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
    expect(state.subclass).toBeNull()
    expect(state.selectedDomainCards).toEqual([])
    expect(state.ancestryName).toBeNull()
    expect(state.communityName).toBeNull()
    expect(state.traits).toBeNull()
    expect(state.characterName).toBe('')
  })

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

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

  it('toggleDomainCard enforces max 3 cards', () => {
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

  it('setAncestry updates ancestryName', () => {
    useDeckStore.getState().setAncestry('Human')
    expect(useDeckStore.getState().ancestryName).toBe('Human')
  })

  it('setCommunity updates communityName', () => {
    useDeckStore.getState().setCommunity('Highborne')
    expect(useDeckStore.getState().communityName).toBe('Highborne')
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

  it('nextStep clamps at 6', () => {
    useDeckStore.setState({ currentStep: 6 })
    useDeckStore.getState().nextStep()
    expect(useDeckStore.getState().currentStep).toBe(6)
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

  it('goToStep clamps between 0 and 6', () => {
    useDeckStore.getState().goToStep(-1)
    expect(useDeckStore.getState().currentStep).toBe(0)
    useDeckStore.getState().goToStep(10)
    expect(useDeckStore.getState().currentStep).toBe(6)
  })

  // -------------------------------------------------------------------------
  // canProceed
  // -------------------------------------------------------------------------

  it('canProceed returns false when step 0 requirements are not met', () => {
    useDeckStore.setState({ currentStep: 0, subclass: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 0 requirements are met', () => {
    useDeckStore.setState({ currentStep: 0, subclass: 'School of Knowledge' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 1 has fewer than 3 cards', () => {
    useDeckStore.setState({
      currentStep: 1,
      selectedDomainCards: ['Card A', 'Card B'],
    })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 1 has exactly 3 cards', () => {
    useDeckStore.setState({
      currentStep: 1,
      selectedDomainCards: ['Card A', 'Card B', 'Card C'],
    })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 2 has no ancestry', () => {
    useDeckStore.setState({ currentStep: 2, ancestryName: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 2 has ancestry', () => {
    useDeckStore.setState({ currentStep: 2, ancestryName: 'Human' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 3 has no community', () => {
    useDeckStore.setState({ currentStep: 3, communityName: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 3 has community', () => {
    useDeckStore.setState({ currentStep: 3, communityName: 'Highborne' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 4 has no traits', () => {
    useDeckStore.setState({ currentStep: 4, traits: null })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 4 has traits', () => {
    useDeckStore.setState({
      currentStep: 4,
      traits: { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0 },
    })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns false when step 5 has empty name', () => {
    useDeckStore.setState({ currentStep: 5, characterName: '' })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns false when step 5 has whitespace-only name', () => {
    useDeckStore.setState({ currentStep: 5, characterName: '   ' })
    expect(useDeckStore.getState().canProceed()).toBe(false)
  })

  it('canProceed returns true when step 5 has a name', () => {
    useDeckStore.setState({ currentStep: 5, characterName: 'Gandalf' })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  it('canProceed returns true at step 6 (review)', () => {
    useDeckStore.setState({ currentStep: 6 })
    expect(useDeckStore.getState().canProceed()).toBe(true)
  })

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  it('reset clears all state back to initial', () => {
    // Populate with data
    useDeckStore.setState({
      currentStep: 5,
      subclass: 'School of War',
      selectedDomainCards: ['A', 'B', 'C'],
      ancestryName: 'Elf',
      communityName: 'Highborne',
      traits: { agility: 1, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 2 },
      characterName: 'TestChar',
    })

    useDeckStore.getState().reset()

    const state = useDeckStore.getState()
    expect(state.currentStep).toBe(0)
    expect(state.subclass).toBeNull()
    expect(state.selectedDomainCards).toEqual([])
    expect(state.ancestryName).toBeNull()
    expect(state.communityName).toBeNull()
    expect(state.traits).toBeNull()
    expect(state.characterName).toBe('')
  })
})
