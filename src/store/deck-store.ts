import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DeckDraft {
  // Step completion tracking
  currentStep: number // 0-6

  // Step 0: Subclass
  subclass: string | null

  // Step 1: Domain Cards
  selectedDomainCards: string[] // card names, max 3

  // Step 2: Ancestry
  ancestryName: string | null

  // Step 3: Community
  communityName: string | null

  // Step 4: Traits
  traits: Record<string, number> | null

  // Step 5: Character Name
  characterName: string

  // Actions
  setSubclass: (name: string) => void
  toggleDomainCard: (name: string) => void
  setAncestry: (name: string) => void
  setCommunity: (name: string) => void
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
  traits: null,
  characterName: '',
}

export const useDeckStore = create<DeckDraft>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSubclass: (name: string) => set({ subclass: name }),

      toggleDomainCard: (name: string) =>
        set((state) => {
          const cards = state.selectedDomainCards
          if (cards.includes(name)) {
            return { selectedDomainCards: cards.filter((c) => c !== name) }
          }
          if (cards.length >= 3) return state
          return { selectedDomainCards: [...cards, name] }
        }),

      setAncestry: (name: string) => set({ ancestryName: name }),

      setCommunity: (name: string) => set({ communityName: name }),

      setTraits: (traits: Record<string, number>) => set({ traits }),

      setCharacterName: (name: string) => set({ characterName: name }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 6),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step: number) =>
        set({ currentStep: Math.max(0, Math.min(step, 6)) }),

      reset: () => set(initialState),

      canProceed: () => {
        const state = get()
        switch (state.currentStep) {
          case 0:
            return state.subclass !== null
          case 1:
            return state.selectedDomainCards.length === 3
          case 2:
            return state.ancestryName !== null
          case 3:
            return state.communityName !== null
          case 4:
            return state.traits !== null
          case 5:
            return state.characterName.trim() !== ''
          case 6:
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
