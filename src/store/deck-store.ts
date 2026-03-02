import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getSubclassCardCount } from '../core/rules/class-rules'
import { getSuggestedEquipment } from '../data/srd'

interface DeckDraft {
  // Step completion tracking
  currentStep: number // 0-11

  // Step 0: Class
  selectedClass: string | null

  // Step 1: Subclass
  subclass: string | null

  // Step 2: Domain Cards
  selectedDomainCards: string[] // card names, max depends on subclass

  // Step 3: Ancestry
  ancestryName: string | null

  // Step 4: Community
  communityName: string | null

  // Step 5: Equipment
  selectedArmor: string | null
  selectedPrimaryWeapon: string | null
  selectedSecondaryWeapon: string | null

  // Step 6: Traits
  traits: Record<string, number> | null

  // Step 7: Experiences
  experiences: { text: string; bonus: number }[]

  // Step 8: Background
  backgroundAnswers: string[]

  // Step 9: Connections
  connectionAnswers: string[]

  // Step 10: Character Name
  characterName: string

  // Actions
  setClass: (name: string) => void
  setSubclass: (name: string) => void
  toggleDomainCard: (name: string) => void
  setAncestry: (name: string) => void
  setCommunity: (name: string) => void
  setArmor: (name: string) => void
  setPrimaryWeapon: (name: string) => void
  setSecondaryWeapon: (name: string | null) => void
  setTraits: (traits: Record<string, number>) => void
  setBackgroundAnswer: (index: number, answer: string) => void
  setExperience: (index: number, text: string) => void
  setCharacterName: (name: string) => void
  setConnectionAnswer: (index: number, answer: string) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void

  // Derived: can proceed to next step?
  canProceed: () => boolean
}

const initialState = {
  currentStep: 0,
  selectedClass: null,
  subclass: null,
  selectedDomainCards: [],
  ancestryName: null,
  communityName: null,
  selectedArmor: null as string | null,
  selectedPrimaryWeapon: null as string | null,
  selectedSecondaryWeapon: null as string | null,
  traits: null,
  backgroundAnswers: [] as string[],
  experiences: [] as { text: string; bonus: number }[],
  characterName: '',
  connectionAnswers: [] as string[],
}

export const useDeckStore = create<DeckDraft>()(
  persist(
    (set, get) => ({
      ...initialState,

      setClass: (name: string) => {
        const suggested = getSuggestedEquipment(name)
        set({
          selectedClass: name,
          subclass: null,
          selectedDomainCards: [],
          selectedArmor: suggested.armor,
          selectedPrimaryWeapon: suggested.primary,
          selectedSecondaryWeapon: suggested.secondary,
        })
      },

      setSubclass: (name: string) =>
        set((state) => {
          const maxCards = getSubclassCardCount(name)
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
            ? getSubclassCardCount(state.subclass)
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

      setBackgroundAnswer: (index: number, answer: string) =>
        set((state) => {
          const answers = [...(state.backgroundAnswers || [])]
          answers[index] = answer
          return { backgroundAnswers: answers }
        }),

      setExperience: (index: number, text: string) =>
        set((state) => {
          const experiences = [...(state.experiences || [])]
          // Fill any gaps to prevent sparse arrays with null/undefined entries
          while (experiences.length <= index) {
            experiences.push({ text: '', bonus: 2 })
          }
          experiences[index] = { text, bonus: 2 }
          return { experiences }
        }),

      setCharacterName: (name: string) => set({ characterName: name }),

      setConnectionAnswer: (index: number, answer: string) =>
        set((state) => {
          const answers = [...(state.connectionAnswers || [])]
          answers[index] = answer
          return { connectionAnswers: answers }
        }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 11),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step: number) =>
        set({ currentStep: Math.max(0, Math.min(step, 11)) }),

      reset: () => set(initialState),

      canProceed: () => {
        const state = get()
        switch (state.currentStep) {
          case 0:
            return state.selectedClass !== null
          case 1:
            return state.subclass !== null
          case 2: {
            const requiredCards = state.subclass
              ? getSubclassCardCount(state.subclass)
              : 2
            return state.selectedDomainCards.length === requiredCards
          }
          case 3:
            return state.ancestryName !== null
          case 4:
            return state.communityName !== null
          case 5:
            return state.selectedArmor !== null && state.selectedPrimaryWeapon !== null
          case 6:
            return state.traits !== null
          case 7: // Experiences — need 2 non-empty
            return (state.experiences || []).filter((e) => e?.text?.trim()).length >= 2
          case 8: // Background — optional per SRD
            return true
          case 9: // Connections — skippable per SRD
            return true
          case 10: // Character Name
            return state.characterName.trim() !== ''
          case 11: // Review
            return true
          default:
            return false
        }
      },
    }),
    {
      name: 'cloak-deck-draft-v2',
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<DeckDraft>),
        // Ensure array fields added after initial release always have defaults
        // when hydrating from localStorage that predates these fields
        experiences:
          (persisted as Partial<DeckDraft>)?.experiences ?? initialState.experiences,
        backgroundAnswers:
          (persisted as Partial<DeckDraft>)?.backgroundAnswers ??
          initialState.backgroundAnswers,
        connectionAnswers:
          (persisted as Partial<DeckDraft>)?.connectionAnswers ??
          initialState.connectionAnswers,
      }),
    }
  )
)
