import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, DiceRoll, Ancestry, Community, DomainCard, Traits, WizardSubclass } from '../types/character'
import { wizard, leatherArmor } from '../data/srd'

interface DraftCharacter {
  name?: string
  ancestry?: Ancestry
  community?: Community
  subclass?: WizardSubclass
  domainCards?: DomainCard[]
  traits?: Traits
}

interface CharacterStore {
  // State
  characters: Character[]
  currentCharacterId: string | null
  draftCharacter: DraftCharacter | null
  rollHistory: DiceRoll[]

  // Draft actions
  startDraft: () => void
  updateDraft: (updates: Partial<DraftCharacter>) => void
  finalizeDraft: () => string | null
  clearDraft: () => void

  // Character actions
  setCurrentCharacter: (id: string | null) => void
  getCurrentCharacter: () => Character | null
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void

  // Stat actions
  updateHP: (id: string, current: number) => void
  updateArmor: (id: string, current: number) => void
  updateHope: (id: string, hope: number) => void
  updateStress: (id: string, current: number) => void
  toggleCardUsed: (id: string, cardName: string) => void

  // Dice actions
  addRoll: (roll: Omit<DiceRoll, 'id' | 'timestamp'>) => void
  clearRollHistory: () => void
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
      currentCharacterId: null,
      draftCharacter: null,
      rollHistory: [],

      // Draft actions
      startDraft: () => set({ draftCharacter: {} }),

      updateDraft: (updates) =>
        set((state) => ({
          draftCharacter: state.draftCharacter
            ? { ...state.draftCharacter, ...updates }
            : updates,
        })),

      finalizeDraft: () => {
        const { draftCharacter } = get()
        if (
          !draftCharacter?.name ||
          !draftCharacter?.ancestry ||
          !draftCharacter?.community ||
          !draftCharacter?.subclass ||
          !draftCharacter?.domainCards ||
          !draftCharacter?.traits
        ) {
          return null
        }

        const id = generateId()

        // Calculate max HP: Wizard base (5) + 1 if School of War (Battlemage)
        const baseHP = parseInt(wizard.hp)
        const maxHP = draftCharacter.subclass === 'School of War' ? baseHP + 1 : baseHP

        // Calculate armor slots from leather armor (base_score is the armor slot count)
        const armorSlots = leatherArmor ? parseInt(leatherArmor.base_score) : 3

        const newCharacter: Character = {
          id,
          name: draftCharacter.name,
          ancestry: draftCharacter.ancestry,
          community: draftCharacter.community,
          class: 'Wizard',
          subclass: draftCharacter.subclass,
          traits: draftCharacter.traits,
          hp: { current: 0, max: maxHP },
          armor: { current: 0, max: armorSlots },
          hope: 2, // Start with 2 hope
          stress: { current: 0, max: 6 },
          evasion: parseInt(wizard.evasion),
          proficiency: 2, // Level 1 proficiency
          domainCards: draftCharacter.domainCards.map(card => ({ ...card, used: false })),
          notes: '',
          createdAt: Date.now(),
        }

        set((state) => ({
          characters: [...state.characters, newCharacter],
          currentCharacterId: id,
          draftCharacter: null,
        }))

        return id
      },

      clearDraft: () => set({ draftCharacter: null }),

      // Character actions
      setCurrentCharacter: (id) => set({ currentCharacterId: id }),

      getCurrentCharacter: () => {
        const { characters, currentCharacterId } = get()
        return characters.find((c) => c.id === currentCharacterId) || null
      },

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
          currentCharacterId:
            state.currentCharacterId === id ? null : state.currentCharacterId,
        })),

      // Stat actions
      updateHP: (id, current) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, hp: { ...c.hp, current: Math.max(0, Math.min(current, c.hp.max)) } } : c
          ),
        })),

      updateArmor: (id, current) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, armor: { ...c.armor, current: Math.max(0, Math.min(current, c.armor.max)) } } : c
          ),
        })),

      updateHope: (id, hope) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, hope: Math.max(0, hope) } : c
          ),
        })),

      updateStress: (id, current) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, stress: { ...c.stress, current: Math.max(0, Math.min(current, c.stress.max)) } } : c
          ),
        })),

      toggleCardUsed: (id, cardName) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  domainCards: c.domainCards.map((card) =>
                    card.name === cardName ? { ...card, used: !card.used } : card
                  ),
                }
              : c
          ),
        })),

      // Dice actions
      addRoll: (roll) =>
        set((state) => ({
          rollHistory: [
            { ...roll, id: generateId(), timestamp: Date.now() },
            ...state.rollHistory.slice(0, 9), // Keep last 10 rolls
          ],
        })),

      clearRollHistory: () => set({ rollHistory: [] }),
    }),
    {
      name: 'daggerheart-character-storage',
    }
  )
)
