import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character } from '../types/character'
import { clampHP } from '../core/character/hp'
import { applyLevelUp } from '../core/character/level-up'
import type { LevelUpChoices } from '../core/character/level-up'

interface CharacterStore {
  characters: Character[]
  activeCharacterId: string | null

  // Actions
  createCharacter: (character: Character) => void
  deleteCharacter: (id: string) => void
  setActiveCharacter: (id: string | null) => void
  updateHP: (id: string, delta: number) => void
  updateArmor: (id: string, delta: number) => void
  updateHope: (id: string, delta: number) => void
  updateStress: (id: string, delta: number) => void
  updateGold: (id: string, delta: number) => void
  updateNotes: (id: string, notes: string) => void
  updateBackground: (id: string, index: number, answer: string) => void
  updateConnections: (id: string, index: number, answer: string) => void
  levelUp: (id: string, choices: LevelUpChoices) => void
  addCondition: (id: string, condition: string) => void
  removeCondition: (id: string, condition: string) => void
  toggleFeatureUsed: (id: string, featureName: string) => void
  resetFeatureUsage: (id: string) => void
  setPortrait: (id: string, dataUrl: string) => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      activeCharacterId: null,

      createCharacter: (character: Character) =>
        set((state) => ({
          characters: [...state.characters, character],
          activeCharacterId: character.id,
        })),

      deleteCharacter: (id: string) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
          activeCharacterId:
            state.activeCharacterId === id ? null : state.activeCharacterId,
        })),

      setActiveCharacter: (id: string | null) =>
        set(() => ({ activeCharacterId: id })),

      updateHP: (id: string, delta: number) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  hp: {
                    ...c.hp,
                    current: clampHP(c.hp.current + delta, c.hp.max),
                  },
                }
              : c
          ),
        })),

      updateArmor: (id: string, delta: number) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  armorSlots: {
                    ...c.armorSlots,
                    current: Math.max(
                      0,
                      Math.min(
                        c.armorSlots.current + delta,
                        c.armorSlots.max
                      )
                    ),
                  },
                }
              : c
          ),
        })),

      updateHope: (id: string, delta: number) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? { ...c, hope: Math.max(0, c.hope + delta) }
              : c
          ),
        })),

      updateStress: (id: string, delta: number) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  stress: {
                    ...c.stress,
                    current: Math.max(
                      0,
                      Math.min(c.stress.current + delta, c.stress.max)
                    ),
                  },
                }
              : c
          ),
        })),

      updateGold: (id: string, delta: number) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? { ...c, gold: Math.max(0, c.gold + delta) }
              : c
          ),
        })),

      updateNotes: (id: string, notes: string) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, notes } : c
          ),
        })),

      updateBackground: (id: string, index: number, answer: string) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const answers = [...(c.backgroundAnswers || [])]
            answers[index] = answer
            return { ...c, backgroundAnswers: answers }
          }),
        })),

      updateConnections: (id: string, index: number, answer: string) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const answers = [...(c.connectionAnswers || [])]
            answers[index] = answer
            return { ...c, connectionAnswers: answers }
          }),
        })),

      levelUp: (id: string, choices: LevelUpChoices) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? applyLevelUp(c, choices) : c
          ),
        })),

      addCondition: (id: string, condition: string) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id && !c.conditions.includes(condition)
              ? { ...c, conditions: [...c.conditions, condition] }
              : c
          ),
        })),

      removeCondition: (id: string, condition: string) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? { ...c, conditions: c.conditions.filter((cond) => cond !== condition) }
              : c
          ),
        })),

      toggleFeatureUsed: (id: string, featureName: string) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const used = c.usedFeatures.includes(featureName)
            return {
              ...c,
              usedFeatures: used
                ? c.usedFeatures.filter((f) => f !== featureName)
                : [...c.usedFeatures, featureName],
            }
          }),
        })),

      resetFeatureUsage: (id: string) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, usedFeatures: [] } : c
          ),
        })),

      setPortrait: (id: string, dataUrl: string) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, portrait: dataUrl } : c
          ),
        })),
    }),
    {
      name: 'cloak-characters-v3',
    }
  )
)
