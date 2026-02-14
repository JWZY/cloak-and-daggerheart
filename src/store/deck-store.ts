import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getWizardCardCount } from '../core/rules/wizard'
import type { WizardSubclass } from '../types/character'

interface DeckDraft {
  // Step completion tracking
  currentStep: number // 0-7

  // Step 0: Subclass
  subclass: string | null

  // Step 1: Domain Cards
  selectedDomainCards: string[] // card names, max depends on subclass

  // Step 2: Ancestry
  ancestryName: string | null

  // Step 3: Community
  communityName: string | null

  // Step 4: Equipment
  selectedArmor: string | null
  selectedPrimaryWeapon: string | null
  selectedSecondaryWeapon: string | null

  // Step 5: Traits
  traits: Record<string, number> | null

  // Step 6: Character Name
  characterName: string

  // Actions
  setSubclass: (name: string) => void
  toggleDomainCard: (name: string) => void
  setAncestry: (name: string) => void
  setCommunity: (name: string) => void
  setArmor: (name: string) => void
  setPrimaryWeapon: (name: string) => void
  setSecondaryWeapon: (name: string | null) => void
  setTraits: (traits: Record<string, number>) => void
  setCharacterName: (name: string) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void

  // Derived: can proceed to next step?
  canProceed: () => boolean
}

const initialState = {
  currentStep: 0,
  subclass: null,
  selectedDomainCards: [],
  ancestryName: null,
  communityName: null,
  selectedArmor: 'Leather Armor',
  selectedPrimaryWeapon: 'Greatstaff',
  selectedSecondaryWeapon: null,
  traits: null,
  characterName: '',
}

export const useDeckStore = create<DeckDraft>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSubclass: (name: string) =>
        set((state) => {
          const maxCards = getWizardCardCount(name as WizardSubclass)
          const trimmed = state.selectedDomainCards.slice(0, maxCards)
          return { subclass: name, selectedDomainCards: trimmed }
        }),

      toggleDomainCard: (name: string) =>
        set((state) => {
          const cards = state.selectedDomainCards
          if (cards.includes(name)) {
            return { selectedDomainCards: cards.filter((c) => c !== name) }
          }
          const maxCards = state.subclass
            ? getWizardCardCount(state.subclass as WizardSubclass)
            : 2
          if (cards.length >= maxCards) return state
          return { selectedDomainCards: [...cards, name] }
        }),

      setAncestry: (name: string) => set({ ancestryName: name }),

      setCommunity: (name: string) => set({ communityName: name }),

      setArmor: (name: string) => set({ selectedArmor: name }),

      setPrimaryWeapon: (name: string) => set({ selectedPrimaryWeapon: name }),

      setSecondaryWeapon: (name: string | null) => set({ selectedSecondaryWeapon: name }),

      setTraits: (traits: Record<string, number>) => set({ traits }),

      setCharacterName: (name: string) => set({ characterName: name }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 7),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step: number) =>
        set({ currentStep: Math.max(0, Math.min(step, 7)) }),

      reset: () => set(initialState),

      canProceed: () => {
        const state = get()
        switch (state.currentStep) {
          case 0:
            return state.subclass !== null
          case 1: {
            const requiredCards = state.subclass
              ? getWizardCardCount(state.subclass as WizardSubclass)
              : 2
            return state.selectedDomainCards.length === requiredCards
          }
          case 2:
            return state.ancestryName !== null
          case 3:
            return state.communityName !== null
          case 4:
            return state.selectedArmor !== null && state.selectedPrimaryWeapon !== null
          case 5:
            return state.traits !== null
          case 6:
            return state.characterName.trim() !== ''
          case 7:
            return true
          default:
            return false
        }
      },
    }),
    {
      name: 'cloak-deck-draft-v1',
    }
  )
)
