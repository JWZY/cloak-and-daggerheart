// Core character types for Daggerheart Character Sheet

export interface Feat {
  name: string
  text: string
}

export interface Ancestry {
  name: string
  description: string
  feats: Feat[]
}

export interface Community {
  name: string
  description: string
  note?: string
  feats: Feat[]
}

export interface DomainCard {
  name: string
  level: string
  domain: string
  type: string
  recall: string
  text: string
  used?: boolean
}

export interface SubclassFoundation {
  name: string
  text: string
}

export interface Subclass {
  name: string
  description: string
  spellcast_trait: string
  foundations: SubclassFoundation[]
  specializations: SubclassFoundation[]
  masteries: SubclassFoundation[]
}

export interface ClassData {
  name: string
  description: string
  domain_1: string
  domain_2: string
  evasion: string
  hp: string
  items: string
  hope_feat_name: string
  hope_feat_text: string
  subclass_1: string
  subclass_2: string
  suggested_traits: string
  suggested_primary: string
  suggested_secondary?: string
  suggested_armor: string
  class_feats: Feat[]
  backgrounds: { question: string }[]
  connections: { question: string }[]
}

// Equipment types
export interface Weapon {
  name: string
  primary_or_secondary: 'Primary' | 'Secondary'
  tier: string
  physical_or_magical: 'Physical' | 'Magical'
  trait: string // Agility, Strength, Finesse, Instinct, Presence, Knowledge
  range: string
  damage: string
  burden: string
  feat_name?: string
  feat_text?: string
}

export interface Armor {
  name: string
  tier: string
  base_thresholds: string // "major / severe" format
  base_score: string
  feat_name?: string
  feat_text?: string
}

export interface Consumable {
  roll: string
  name: string
  description: string
  quantity?: number
}

export interface Item {
  roll: string
  name: string
  description: string
}

export interface Equipment {
  primaryWeapon: Weapon | null
  secondaryWeapon: Weapon | null
  armor: Armor | null
  items: Item[]
  consumables: Consumable[]
}

export type TraitName = 'agility' | 'strength' | 'finesse' | 'instinct' | 'presence' | 'knowledge'

export interface Traits {
  agility: number
  strength: number
  finesse: number
  instinct: number
  presence: number
  knowledge: number
}

export interface Character {
  id: string
  name: string
  ancestry: Ancestry
  community: Community
  class: 'Wizard'
  subclass: 'School of Knowledge' | 'School of War'
  traits: Traits
  hp: { current: number; max: number }
  armorSlots: { current: number; max: number }
  hope: number
  stress: { current: number; max: number }
  evasion: number
  proficiency: number
  domainCards: DomainCard[]
  equipment: Equipment
  gold: number
  notes: string
  backgroundAnswers: string[]
  connectionAnswers: string[]
  createdAt: number
}

export interface DiceRoll {
  id: string
  hopeDie: number
  fearDie: number
  modifier: number
  total: number
  result: 'hope' | 'fear' | 'critical'
  timestamp: number
}

export type WizardSubclass = 'School of Knowledge' | 'School of War'
