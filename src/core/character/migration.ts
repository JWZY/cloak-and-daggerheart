// Character data migration logic
// Handles upgrading old data formats to current schema

import type { Character, Equipment, Weapon, Armor, Item, Consumable } from '../../types/character'

/**
 * Legacy character format before Equipment refactor
 */
interface LegacyCharacter extends Omit<Character, 'armorSlots'> {
  armor?: { current: number; max: number }
  armorSlots?: { current: number; max: number }
}

/**
 * Default equipment for new or migrated characters
 */
export function getDefaultEquipment(
  defaultArmor: Armor | null = null,
  defaultWeapon: Weapon | null = null
): Equipment {
  return {
    primaryWeapon: defaultWeapon,
    secondaryWeapon: null,
    armor: defaultArmor,
    items: [] as Item[],
    consumables: [] as Consumable[],
  }
}

/**
 * Migrate character data from legacy formats to current schema
 * Handles:
 * - armor → armorSlots rename
 * - Adding equipment object
 * - Fixing proficiency for level 1 characters
 */
export function migrateCharacter(
  char: Character | LegacyCharacter,
  defaultEquipment: Equipment
): Character {
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
      equipment: defaultEquipment,
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
