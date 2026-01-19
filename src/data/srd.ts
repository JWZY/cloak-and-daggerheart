// SRD Data Layer - Imports and filters Daggerheart SRD JSON data
// The SRD data in daggerheart-srd-main/ is sacred and read-only

import ancestriesData from '../../daggerheart-srd-main/.build/json/ancestries.json'
import communitiesData from '../../daggerheart-srd-main/.build/json/communities.json'
import abilitiesData from '../../daggerheart-srd-main/.build/json/abilities.json'
import classesData from '../../daggerheart-srd-main/.build/json/classes.json'
import subclassesData from '../../daggerheart-srd-main/.build/json/subclasses.json'
import armorData from '../../daggerheart-srd-main/.build/json/armor.json'

import type { Ancestry, Community, DomainCard, ClassData, Subclass } from '../types/character'

// Type assertions for imported JSON
export const ancestries = ancestriesData as Ancestry[]
export const communities = communitiesData as Community[]
export const abilities = abilitiesData as DomainCard[]

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

// Armor data for starting equipment
export interface ArmorItem {
  name: string
  tier: string
  base_thresholds: string
  base_score: string
  feat_name?: string
  feat_text?: string
}

export const armor = armorData as ArmorItem[]

export const leatherArmor = armor.find(a => a.name === 'Leather Armor')

// Helper to get subclass by name
export function getSubclass(name: 'School of Knowledge' | 'School of War'): Subclass {
  return name === 'School of Knowledge' ? schoolOfKnowledge : schoolOfWar
}

// Get number of domain cards a wizard can have based on subclass
export function getWizardCardCount(subclass: 'School of Knowledge' | 'School of War'): number {
  // School of Knowledge gets "Prepared" foundation which grants an extra card
  return subclass === 'School of Knowledge' ? 3 : 2
}
