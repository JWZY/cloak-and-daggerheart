import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character } from '../types/character'
import { clampHP } from '../core/character/hp'
import { applyLevelUp } from '../core/character/level-up'
import type { LevelUpChoices } from '../core/character/level-up'

interface CharacterStore {
  characters: Character[]

  // Actions
  createCharacter: (character: Character) => void
  deleteCharacter: (id: string) => void
  updateHP: (id: string, delta: number) => void
  updateArmor: (id: string, delta: number) => void
  updateHope: (id: string, delta: number) => void
  updateStress: (id: string, delta: number) => void
  updateNotes: (id: string, notes: string) => void
  levelUp: (id: string, choices: LevelUpChoices) => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],

      createCharacter: (character: Character) =>
        set((state) => ({
          characters: [...state.characters, character],
        })),

      deleteCharacter: (id: string) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
        })),

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

      updateNotes: (id: string, notes: string) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, notes } : c
          ),
        })),

      levelUp: (id: string, choices: LevelUpChoices) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? applyLevelUp(c, choices) : c
          ),
        })),
    }),
    {
      name: 'cloak-characters-v3',
    }
  )
)
