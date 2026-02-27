import type { Character, DomainCard, Advancement } from '../../types/character'
import { getProficiency, getAdvancementCost, getAdvancementSlots } from '../rules/advancement'

export interface LevelUpChoices {
  advancements: Advancement[]
  newDomainCards: DomainCard[]
  newExperience: { text: string }
  exchangeCard?: { remove: string; add: DomainCard }
}

export function applyLevelUp(character: Character, choices: LevelUpChoices): Character {
  const newLevel = character.level + 1

  // Validate advancement slot costs
  const totalCost = choices.advancements.reduce((sum, a) => sum + getAdvancementCost(a.type), 0)
  if (totalCost !== getAdvancementSlots()) {
    throw new Error(`Advancements must use exactly ${getAdvancementSlots()} slots, got ${totalCost}`)
  }

  // Start with base updates
  let result: Character = {
    ...character,
    level: newLevel,
    proficiency: getProficiency(newLevel),
    // New experience at +2 modifier
    experiences: [...character.experiences, { text: choices.newExperience.text, bonus: 2 }],
    // Add new domain cards (1 mandatory + any from add_domain_card advancements)
    domainCards: [...character.domainCards, ...choices.newDomainCards],
    // Track all advancements
    advancements: [...character.advancements, ...choices.advancements.map(a => ({ ...a, level: newLevel }))],
    markedTraits: [...character.markedTraits],
  }

  // Handle optional card exchange
  if (choices.exchangeCard) {
    result = {
      ...result,
      domainCards: result.domainCards
        .filter(c => c.name !== choices.exchangeCard!.remove)
        .concat(choices.exchangeCard.add),
    }
  }

  // Apply each advancement
  for (const advancement of choices.advancements) {
    switch (advancement.type) {
      case 'increase_traits': {
        if (!advancement.traits) break
        const newTraits = { ...result.traits }
        for (const trait of advancement.traits) {
          newTraits[trait] = (newTraits[trait] || 0) + 1
        }
        result = {
          ...result,
          traits: newTraits,
          markedTraits: [...result.markedTraits, ...advancement.traits],
        }
        break
      }
      case 'add_hp':
        result = {
          ...result,
          hp: { current: result.hp.current + 1, max: result.hp.max + 1 },
        }
        break
      case 'add_stress':
        result = {
          ...result,
          stress: { current: result.stress.current, max: result.stress.max + 1 },
        }
        break
      case 'boost_experiences': {
        if (!advancement.experienceIndices) break
        const newExperiences = [...result.experiences]
        for (const idx of advancement.experienceIndices) {
          if (newExperiences[idx]) {
            newExperiences[idx] = {
              ...newExperiences[idx],
              bonus: newExperiences[idx].bonus + 1,
            }
          }
        }
        result = { ...result, experiences: newExperiences }
        break
      }
      case 'add_domain_card': {
        // The card should be provided on the advancement
        // This is handled separately from the mandatory card
        if (advancement.cardName) {
          // Card data should be resolved by the caller and added to domainCards
          // We just track the advancement
        }
        break
      }
      case 'increase_evasion':
        result = { ...result, evasion: result.evasion + 1 }
        break
      case 'upgrade_subclass':
        result = {
          ...result,
          subclassTier: result.subclassTier === 'foundation' ? 'specialization' : 'mastery',
        }
        break
      case 'increase_proficiency':
        result = { ...result, proficiency: result.proficiency + 1 }
        break
    }
  }

  return result
}
