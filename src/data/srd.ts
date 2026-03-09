// SRD Data Layer - Imports and filters Daggerheart SRD JSON data
// The SRD data in daggerheart-srd-main/ is sacred and read-only

import ancestriesData from '../../daggerheart-srd-main/.build/json/ancestries.json'
import communitiesData from '../../daggerheart-srd-main/.build/json/communities.json'
import abilitiesData from '../../daggerheart-srd-main/.build/json/abilities.json'
import classesData from '../../daggerheart-srd-main/.build/json/classes.json'
import subclassesData from '../../daggerheart-srd-main/.build/json/subclasses.json'
import armorData from '../../daggerheart-srd-main/.build/json/armor.json'
import weaponsData from '../../daggerheart-srd-main/.build/json/weapons.json'
import itemsData from '../../daggerheart-srd-main/.build/json/items.json'
import consumablesData from '../../daggerheart-srd-main/.build/json/consumables.json'

import type {
  Ancestry,
  Community,
  DomainCard,
  ClassData,
  Subclass,
  SubclassFoundation,
  Weapon,
  Armor,
  Item,
  Consumable
} from '../types/character'

// Re-export armor functions from core for backwards compatibility
export { getArmorScore, parseThresholds } from '../core/character/armor'

// Re-export class rules from core for backwards compatibility
export { getSubclassCardCount } from '../core/rules/class-rules'

// Type assertions for imported JSON
export const ancestries = ancestriesData as Ancestry[]
export const communities = communitiesData as Community[]
export const abilities = abilitiesData as DomainCard[]
export const classes = classesData as ClassData[]
export const subclasses = subclassesData as Subclass[]

// Generic lookups
export function getClassForSubclass(subclassName: string): ClassData | undefined {
  return classes.find(c => c.subclass_1 === subclassName || c.subclass_2 === subclassName)
}

// Equipment data
export const weapons = weaponsData as Weapon[]
export const armors = armorData as Armor[]
export const items = itemsData as Item[]
export const consumables = consumablesData as Consumable[]

// Filter weapons by tier
export const tier1Weapons = weapons.filter(w => w.tier === '1')
export const primaryWeapons = weapons.filter(w => w.primary_or_secondary === 'Primary')
export const secondaryWeapons = weapons.filter(w => w.primary_or_secondary === 'Secondary')
export const tier1PrimaryWeapons = weapons.filter(w => w.tier === '1' && w.primary_or_secondary === 'Primary')
export const tier1SecondaryWeapons = weapons.filter(w => w.tier === '1' && w.primary_or_secondary === 'Secondary')

// Filter armor by tier
export const tier1Armors = armors.filter(a => a.tier === '1')

// ---------------------------------------------------------------------------
// Generic class/subclass lookups
// ---------------------------------------------------------------------------

/** Look up a class by name */
export function getClassByName(name: string): ClassData {
  const cls = classes.find(c => c.name === name)
  if (!cls) throw new Error(`Unknown class: ${name}`)
  return cls
}

/** Get subclasses for a given class */
export function getSubclassesForClass(className: string): Subclass[] {
  const cls = getClassByName(className)
  return subclasses.filter(s => s.name === cls.subclass_1 || s.name === cls.subclass_2)
}

/** Get level 1 domain cards for a given class */
export function getLevel1DomainCards(className: string): DomainCard[] {
  const cls = getClassByName(className)
  return abilities.filter(
    a => (a.domain === cls.domain_1 || a.domain === cls.domain_2) && a.level === '1'
  )
}

/** Look up a subclass by name. Returns null if not found. */
export function getSubclassByName(name: string | null | undefined): Subclass | null {
  if (!name) return null
  return subclasses.find(s => s.name === name) ?? null
}

/** Get suggested starting equipment names for a class */
export function getSuggestedEquipment(className: string): { armor: string; primary: string; secondary: string | null } {
  const cls = getClassByName(className)
  return {
    armor: cls.suggested_armor,
    primary: cls.suggested_primary,
    secondary: cls.suggested_secondary ?? null,
  }
}

/** Get domain cards up to a given level for a class's domains */
export function getDomainCardsUpToLevel(className: string, maxLevel: number): DomainCard[] {
  const cls = getClassByName(className)
  return abilities.filter(
    a => (a.domain === cls.domain_1 || a.domain === cls.domain_2) && parseInt(a.level) <= maxLevel
  )
}

/** Get specialization features for a subclass */
export function getSpecializations(subclassName: string): SubclassFoundation[] {
  return getSubclassByName(subclassName)?.specializations ?? []
}

/** Get mastery features for a subclass */
export function getMasteries(subclassName: string): SubclassFoundation[] {
  return getSubclassByName(subclassName)?.masteries ?? []
}

