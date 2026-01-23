import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, DiceRoll, Ancestry, Community, DomainCard, Traits, WizardSubclass, Equipment, Weapon, Armor, Item, Consumable } from '../types/character'
import { wizard, leatherArmor, quarterstaff, getArmorScore } from '../data/srd'

interface DraftCharacter {
  name?: string
  ancestry?: Ancestry
  community?: Community
  subclass?: WizardSubclass
  domainCards?: DomainCard[]
  traits?: Traits
  equipment?: Partial<Equipment>
}

interface CharacterStore {
  // State
  characters: Character[]
  currentCharacterId: string | null
  draftCharacter: DraftCharacter | null
  editingCharacterId: string | null
  rollHistory: DiceRoll[]

  // Draft actions
  startDraft: () => void
  startDraftFromCharacter: (character: Character) => void
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
  updateArmorSlots: (id: string, current: number) => void
  updateHope: (id: string, hope: number) => void
  updateStress: (id: string, current: number) => void
  toggleCardUsed: (id: string, cardName: string) => void

  // Equipment actions
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void
  setPrimaryWeapon: (id: string, weapon: Weapon | null) => void
  setSecondaryWeapon: (id: string, weapon: Weapon | null) => void
  setArmor: (id: string, armor: Armor | null) => void
  addItem: (id: string, item: Item) => void
  removeItem: (id: string, itemName: string) => void
  addConsumable: (id: string, consumable: Consumable) => void
  removeConsumable: (id: string, consumableName: string) => void
  updateGold: (id: string, gold: number) => void

  // Dice actions
  addRoll: (roll: Omit<DiceRoll, 'id' | 'timestamp'>) => void
  clearRollHistory: () => void
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Default equipment for new characters
function getDefaultEquipment(): Equipment {
  return {
    primaryWeapon: quarterstaff,
    secondaryWeapon: null,
    armor: leatherArmor,
    items: [],
    consumables: [],
  }
}

// Migrate old character data to new format
interface LegacyCharacter extends Omit<Character, 'armorSlots'> {
  armor?: { current: number; max: number }
  armorSlots?: { current: number; max: number }
}

function migrateCharacter(char: Character | LegacyCharacter): Character {
  const c = char as LegacyCharacter
  let migrated = { ...c } as Character

  // If character has old 'armor' field instead of 'armorSlots', migrate it
  if ('armor' in c && c.armor && !('armorSlots' in c)) {
    migrated = {
      ...migrated,
      armorSlots: c.armor,
    } as Character
  }

  // Ensure equipment exists
  if (!migrated.equipment) {
    migrated = {
      ...migrated,
      equipment: getDefaultEquipment(),
      gold: migrated.gold || 0,
    }
  }

  // Fix proficiency for level 1 characters (was incorrectly set to 2)
  if (migrated.proficiency === 2) {
    migrated = {
      ...migrated,
      proficiency: 1,
    }
  }

  return migrated
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
      currentCharacterId: null,
      draftCharacter: null,
      editingCharacterId: null,
      rollHistory: [],

      // Draft actions
      startDraft: () => set({ draftCharacter: { equipment: getDefaultEquipment() }, editingCharacterId: null }),

      startDraftFromCharacter: (character: Character) => set({
        draftCharacter: {
          name: character.name,
          ancestry: character.ancestry,
          community: character.community,
          subclass: character.subclass as WizardSubclass,
          domainCards: character.domainCards.map(({ name, level, domain, type, recall, text }) => ({ name, level, domain, type, recall, text })),
          traits: character.traits,
          equipment: character.equipment,
        },
        editingCharacterId: character.id,
      }),

      updateDraft: (updates) =>
        set((state) => ({
          draftCharacter: state.draftCharacter
            ? { ...state.draftCharacter, ...updates }
            : updates,
        })),

      finalizeDraft: () => {
        const { draftCharacter, editingCharacterId, characters } = get()
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

        const equipment = draftCharacter.equipment || getDefaultEquipment()

        // If editing an existing character, update it
        if (editingCharacterId) {
          const existingCharacter = characters.find(c => c.id === editingCharacterId)
          if (!existingCharacter) return null

          // Calculate max HP: Wizard base (5) + 1 if School of War (Battlemage)
          const baseHP = parseInt(wizard.hp)
          const maxHP = draftCharacter.subclass === 'School of War' ? baseHP + 1 : baseHP

          // Calculate armor slots from equipped armor
          const armorSlots = equipment.armor ? getArmorScore(equipment.armor) : 3

          const updatedCharacter: Character = {
            ...existingCharacter,
            name: draftCharacter.name,
            ancestry: draftCharacter.ancestry,
            community: draftCharacter.community,
            subclass: draftCharacter.subclass,
            traits: draftCharacter.traits,
            hp: { ...existingCharacter.hp, max: maxHP },
            armorSlots: { ...existingCharacter.armorSlots, max: armorSlots },
            equipment: equipment as Equipment,
            domainCards: draftCharacter.domainCards.map(card => {
              // Preserve used state for cards that existed before
              const existingCard = existingCharacter.domainCards.find(c => c.name === card.name)
              return { ...card, used: existingCard?.used ?? false }
            }),
          }

          set((state) => ({
            characters: state.characters.map(c => c.id === editingCharacterId ? updatedCharacter : c),
            draftCharacter: null,
            editingCharacterId: null,
          }))

          return editingCharacterId
        }

        // Creating a new character
        const id = generateId()

        // Calculate max HP: Wizard base (5) + 1 if School of War (Battlemage)
        const baseHP = parseInt(wizard.hp)
        const maxHP = draftCharacter.subclass === 'School of War' ? baseHP + 1 : baseHP

        // Calculate armor slots from equipped armor
        const armorSlots = equipment.armor ? getArmorScore(equipment.armor) : 3

        const newCharacter: Character = {
          id,
          name: draftCharacter.name,
          ancestry: draftCharacter.ancestry,
          community: draftCharacter.community,
          class: 'Wizard',
          subclass: draftCharacter.subclass,
          traits: draftCharacter.traits,
          hp: { current: 0, max: maxHP },
          armorSlots: { current: 0, max: armorSlots },
          hope: 2, // Start with 2 hope
          stress: { current: 0, max: 6 },
          evasion: parseInt(wizard.evasion),
          proficiency: 1, // Level 1 proficiency
          domainCards: draftCharacter.domainCards.map(card => ({ ...card, used: false })),
          equipment: equipment as Equipment,
          gold: 0,
          notes: '',
          backgroundAnswers: wizard.backgrounds.map(() => ''),
          connectionAnswers: wizard.connections.map(() => ''),
          createdAt: Date.now(),
        }

        set((state) => ({
          characters: [...state.characters, newCharacter],
          currentCharacterId: id,
          draftCharacter: null,
          editingCharacterId: null,
        }))

        return id
      },

      clearDraft: () => set({ draftCharacter: null, editingCharacterId: null }),

      // Character actions
      setCurrentCharacter: (id) => set({ currentCharacterId: id }),

      getCurrentCharacter: () => {
        const { characters, currentCharacterId } = get()
        const char = characters.find((c) => c.id === currentCharacterId)
        return char ? migrateCharacter(char) : null
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

      updateArmorSlots: (id, current) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            return { ...char, armorSlots: { ...char.armorSlots, current: Math.max(0, Math.min(current, char.armorSlots.max)) } }
          }),
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

      // Equipment actions
      updateEquipment: (id, equipmentUpdates) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            return {
              ...char,
              equipment: { ...char.equipment, ...equipmentUpdates },
            }
          }),
        })),

      setPrimaryWeapon: (id, weapon) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            return {
              ...char,
              equipment: { ...char.equipment, primaryWeapon: weapon },
            }
          }),
        })),

      setSecondaryWeapon: (id, weapon) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            return {
              ...char,
              equipment: { ...char.equipment, secondaryWeapon: weapon },
            }
          }),
        })),

      setArmor: (id, armor) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            const armorSlots = armor ? getArmorScore(armor) : 3
            return {
              ...char,
              equipment: { ...char.equipment, armor },
              armorSlots: { current: Math.min(char.armorSlots.current, armorSlots), max: armorSlots },
            }
          }),
        })),

      addItem: (id, item) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            return {
              ...char,
              equipment: { ...char.equipment, items: [...char.equipment.items, item] },
            }
          }),
        })),

      removeItem: (id, itemName) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            const idx = char.equipment.items.findIndex(i => i.name === itemName)
            if (idx === -1) return char
            return {
              ...char,
              equipment: { ...char.equipment, items: char.equipment.items.filter((_, i) => i !== idx) },
            }
          }),
        })),

      addConsumable: (id, consumable) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            // Check if consumable already exists, increment quantity if so
            const existing = char.equipment.consumables.find(con => con.name === consumable.name)
            if (existing) {
              return {
                ...char,
                equipment: {
                  ...char.equipment,
                  consumables: char.equipment.consumables.map(con =>
                    con.name === consumable.name ? { ...con, quantity: (con.quantity || 1) + 1 } : con
                  ),
                },
              }
            }
            return {
              ...char,
              equipment: { ...char.equipment, consumables: [...char.equipment.consumables, { ...consumable, quantity: 1 }] },
            }
          }),
        })),

      removeConsumable: (id, consumableName) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const char = migrateCharacter(c)
            const existing = char.equipment.consumables.find(con => con.name === consumableName)
            if (!existing) return char
            if ((existing.quantity || 1) > 1) {
              return {
                ...char,
                equipment: {
                  ...char.equipment,
                  consumables: char.equipment.consumables.map(con =>
                    con.name === consumableName ? { ...con, quantity: (con.quantity || 1) - 1 } : con
                  ),
                },
              }
            }
            return {
              ...char,
              equipment: { ...char.equipment, consumables: char.equipment.consumables.filter(con => con.name !== consumableName) },
            }
          }),
        })),

      updateGold: (id, gold) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, gold: Math.max(0, gold) } : c
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
