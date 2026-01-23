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
  Weapon,
  Armor,
  Item,
  Consumable
} from '../types/character'

// Type assertions for imported JSON
export const ancestries = ancestriesData as Ancestry[]
export const communities = communitiesData as Community[]
export const abilities = abilitiesData as DomainCard[]

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

// Wizard-specific data
export const wizard = (classesData as ClassData[]).find(c => c.name === 'Wizard')!

export const wizardSubclasses = (subclassesData as Subclass[]).filter(
  s => s.name === 'School of Knowledge' || s.name === 'School of War'
)

export const schoolOfKnowledge = wizardSubclasses.find(s => s.name === 'School of Knowledge')!
export const schoolOfWar = wizardSubclasses.find(s => s.name === 'School of War')!

// Domain cards filtered for Wizard (Codex + Splendor)
export const level1CodexCards = abilities.filter(
  a => a.domain === 'Codex' && a.level === '1'
)

export const level1SplendorCards = abilities.filter(
  a => a.domain === 'Splendor' && a.level === '1'
)

// Combined level 1 cards for Wizard
export const wizardLevel1Cards = [...level1CodexCards, ...level1SplendorCards]

// Default starting equipment
export const leatherArmor = armors.find(a => a.name === 'Leather Armor')!
export const quarterstaff = weapons.find(w => w.name === 'Quarterstaff')!

// Helper to get subclass by name
export function getSubclass(name: 'School of Knowledge' | 'School of War'): Subclass {
  return name === 'School of Knowledge' ? schoolOfKnowledge : schoolOfWar
}

// Get number of domain cards a wizard can have based on subclass
export function getWizardCardCount(subclass: 'School of Knowledge' | 'School of War'): number {
  // School of Knowledge gets "Prepared" foundation which grants an extra card
  return subclass === 'School of Knowledge' ? 3 : 2
}

// Parse damage thresholds from armor string (e.g., "6 / 13" -> { major: 6, severe: 13 })
export function parseThresholds(thresholdString: string): { major: number; severe: number } {
  const parts = thresholdString.split('/').map(s => parseInt(s.trim(), 10))
  return { major: parts[0], severe: parts[1] }
}

// Get armor score (max armor slots)
export function getArmorScore(armor: Armor): number {
  return parseInt(armor.base_score, 10)
}
