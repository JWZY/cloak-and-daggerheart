import { create } from 'zustand'
import type { Advancement } from '../types/character'
import { getAdvancementCost, getAdvancementSlots } from '../core/rules/advancement'

interface LevelUpState {
  characterId: string | null
  currentStep: number
  advancements: Advancement[]
  newExperienceText: string
  selectedNewCards: string[]
  exchangeOldCard: string | null
  exchangeNewCard: string | null

  // Actions
  start: (characterId: string) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  addAdvancement: (advancement: Advancement) => void
  removeAdvancement: (index: number) => void
  clearAdvancements: () => void
  setNewExperienceText: (text: string) => void
  toggleSelectedCard: (cardName: string, maxCards: number) => void
  setExchangeOldCard: (cardName: string | null) => void
  setExchangeNewCard: (cardName: string | null) => void
  reset: () => void

  // Derived
  slotsUsed: () => number
  slotsRemaining: () => number
  canAddAdvancement: (cost: number) => boolean
}

const initialState = {
  characterId: null as string | null,
  currentStep: 0,
  advancements: [] as Advancement[],
  newExperienceText: '',
  selectedNewCards: [] as string[],
  exchangeOldCard: null as string | null,
  exchangeNewCard: null as string | null,
}

export const useLevelUpStore = create<LevelUpState>()((set, get) => ({
  ...initialState,

  start: (characterId: string) =>
    set({ ...initialState, characterId }),

  setStep: (step: number) =>
    set({ currentStep: Math.max(0, Math.min(step, 3)) }),

  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),

  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  addAdvancement: (advancement: Advancement) =>
    set((state) => ({
      advancements: [...state.advancements, advancement],
    })),

  removeAdvancement: (index: number) =>
    set((state) => ({
      advancements: state.advancements.filter((_, i) => i !== index),
    })),

  clearAdvancements: () =>
    set({ advancements: [] }),

  setNewExperienceText: (text: string) =>
    set({ newExperienceText: text }),

  toggleSelectedCard: (cardName: string, maxCards: number) =>
    set((state) => {
      const cards = state.selectedNewCards
      if (cards.includes(cardName)) {
        return { selectedNewCards: cards.filter((c) => c !== cardName) }
      }
      if (cards.length >= maxCards) return state
      return { selectedNewCards: [...cards, cardName] }
    }),

  setExchangeOldCard: (cardName: string | null) =>
    set({ exchangeOldCard: cardName }),

  setExchangeNewCard: (cardName: string | null) =>
    set({ exchangeNewCard: cardName }),

  reset: () => set(initialState),

  slotsUsed: () => {
    return get().advancements.reduce((sum, a) => sum + getAdvancementCost(a.type), 0)
  },

  slotsRemaining: () => {
    return getAdvancementSlots() - get().slotsUsed()
  },

  canAddAdvancement: (cost: number) => {
    return get().slotsRemaining() >= cost
  },
}))
