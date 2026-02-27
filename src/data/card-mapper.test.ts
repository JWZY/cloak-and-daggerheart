import { describe, it, expect } from 'vitest'
import {
  parseAbilityText,
  subclassToCardProps,
  domainCardToProps,
  getSubclassCards,
  getDomainCards,
  getDomainCardsUpToLevel,
  getAllAncestries,
  getAllCommunities,
} from './card-mapper'
import { getClassByName, getSubclassesForClass, getLevel1DomainCards } from './srd'

// ---------------------------------------------------------------------------
// parseAbilityText
// ---------------------------------------------------------------------------

describe('parseAbilityText', () => {
  it('parses multi-ability text (Grimoire format with **Name:** headers)', () => {
    const text =
      '**Arcane Bolt:** You fire a bolt of arcane energy at a target.\n\n**Shield:** You conjure a magical shield.'
    const result = parseAbilityText(text)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      name: 'Arcane Bolt',
      text: 'You fire a bolt of arcane energy at a target.',
    })
    expect(result[1]).toEqual({
      name: 'Shield',
      text: 'You conjure a magical shield.',
    })
  })

  it('parses single-ability text (plain paragraph)', () => {
    const text = 'When you take damage, you can reduce it by 2.'
    const result = parseAbilityText(text)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      name: '',
      text: 'When you take damage, you can reduce it by 2.',
    })
  })

  it('handles empty text', () => {
    expect(parseAbilityText('')).toEqual([])
  })

  it('handles whitespace-only text', () => {
    expect(parseAbilityText('   \n\n   ')).toEqual([])
  })

  it('preserves text content after bold name', () => {
    const text = '**Prepared:** You may equip one additional domain card.'
    const result = parseAbilityText(text)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Prepared')
    expect(result[0].text).toBe('You may equip one additional domain card.')
  })

  it('collapses line breaks within a paragraph', () => {
    const text = 'This is a long ability\nthat spans multiple lines.'
    const result = parseAbilityText(text)

    expect(result).toHaveLength(1)
    expect(result[0].text).toBe(
      'This is a long ability that spans multiple lines.'
    )
  })
})

// ---------------------------------------------------------------------------
// subclassToCardProps
// ---------------------------------------------------------------------------

describe('subclassToCardProps', () => {
  const wizardSubclasses = getSubclassesForClass('Wizard')
  const wizard = getClassByName('Wizard')
  const schoolOfKnowledge = wizardSubclasses.find(
    (s) => s.name === 'School of Knowledge'
  )!
  const schoolOfWar = wizardSubclasses.find(
    (s) => s.name === 'School of War'
  )!

  it('maps School of Knowledge correctly', () => {
    const props = subclassToCardProps(schoolOfKnowledge, wizard)

    expect(props.name).toBe('School of Knowledge')
    expect(props.className).toBe('Wizard')
    expect(props.tier).toBe('Foundation')
    expect(props.feats.length).toBeGreaterThan(0)
    // Banner colors: outer = domain_2, inner = domain_1
    expect(props.bannerColor).toBeDefined()
    expect(props.bannerInnerColor).toBeDefined()
    // Domain icons should be lowercase domain names
    expect(props.domainIcons).toHaveLength(2)
    expect(props.domainIcons![0]).toBe(wizard.domain_1.toLowerCase())
    expect(props.domainIcons![1]).toBe(wizard.domain_2.toLowerCase())
  })

  it('maps School of War correctly', () => {
    const props = subclassToCardProps(schoolOfWar, wizard)

    expect(props.name).toBe('School of War')
    expect(props.className).toBe('Wizard')
    expect(props.tier).toBe('Foundation')
    expect(props.feats.length).toBeGreaterThan(0)
    expect(props.bannerColor).toBeDefined()
    expect(props.bannerInnerColor).toBeDefined()
  })

  it('includes spellcastTrait when present', () => {
    const knowledgeProps = subclassToCardProps(schoolOfKnowledge, wizard)
    const warProps = subclassToCardProps(schoolOfWar, wizard)

    // Both wizard subclasses have a spellcast_trait in the SRD data
    if (schoolOfKnowledge.spellcast_trait) {
      expect(knowledgeProps.spellcastTrait).toBe(
        schoolOfKnowledge.spellcast_trait
      )
    }
    if (schoolOfWar.spellcast_trait) {
      expect(warProps.spellcastTrait).toBe(schoolOfWar.spellcast_trait)
    }
  })

  it('generates correct illustration path', () => {
    const props = subclassToCardProps(schoolOfKnowledge, wizard)
    expect(props.illustrationSrc).toContain('school-of-knowledge')
    expect(props.illustrationSrc).toContain('.avif')
  })
})

// ---------------------------------------------------------------------------
// domainCardToProps
// ---------------------------------------------------------------------------

describe('domainCardToProps', () => {
  const wizardLevel1Cards = getLevel1DomainCards('Wizard')

  it('maps a Codex domain card correctly', () => {
    const codexCard = wizardLevel1Cards.find((c) => c.domain === 'Codex')!
    const mapped = domainCardToProps(codexCard)

    expect(mapped.props.title).toBe(codexCard.name)
    expect(mapped.props.domain).toBe('Codex')
    expect(mapped.props.type).toBe(codexCard.type)
    expect(mapped.props.level).toBe(codexCard.level)
    expect(mapped.props.recall).toBe(codexCard.recall)
    expect(mapped.props.artworkSrc).toContain('.avif')
    expect(mapped.bodyText).toBe(codexCard.text)
  })

  it('maps a Splendor domain card correctly', () => {
    const splendorCard = wizardLevel1Cards.find(
      (c) => c.domain === 'Splendor'
    )!
    const mapped = domainCardToProps(splendorCard)

    expect(mapped.props.title).toBe(splendorCard.name)
    expect(mapped.props.domain).toBe('Splendor')
    expect(mapped.props.type).toBe(splendorCard.type)
    expect(mapped.props.level).toBe(splendorCard.level)
    expect(mapped.bodyText).toBe(splendorCard.text)
  })
})

// ---------------------------------------------------------------------------
// getSubclassCards
// ---------------------------------------------------------------------------

describe('getSubclassCards', () => {
  it('returns exactly 2 Wizard cards', () => {
    const cards = getSubclassCards('Wizard')
    expect(cards).toHaveLength(2)
  })

  it('Wizard cards are both Wizard class', () => {
    const cards = getSubclassCards('Wizard')
    cards.forEach((card) => {
      expect(card.className).toBe('Wizard')
    })
  })

  it('Wizard: one is School of Knowledge, one is School of War', () => {
    const cards = getSubclassCards('Wizard')
    const names = cards.map((c) => c.name).sort()
    expect(names).toEqual(['School of Knowledge', 'School of War'])
  })

  it('returns exactly 2 Seraph cards', () => {
    const cards = getSubclassCards('Seraph')
    expect(cards).toHaveLength(2)
    const names = cards.map((c) => c.name).sort()
    expect(names).toEqual(['Divine Wielder', 'Winged Sentinel'])
  })

  it('returns exactly 2 Druid cards', () => {
    const cards = getSubclassCards('Druid')
    expect(cards).toHaveLength(2)
    const names = cards.map((c) => c.name).sort()
    expect(names).toEqual(['Warden of Renewal', 'Warden of the Elements'])
  })
})

// ---------------------------------------------------------------------------
// getDomainCards
// ---------------------------------------------------------------------------

describe('getDomainCards', () => {
  it('returns exactly 6 Wizard cards', () => {
    const cards = getDomainCards('Wizard')
    expect(cards).toHaveLength(6)
  })

  it('Wizard has 3 Codex cards and 3 Splendor cards', () => {
    const cards = getDomainCards('Wizard')
    const codex = cards.filter((c) => c.props.domain === 'Codex')
    const splendor = cards.filter((c) => c.props.domain === 'Splendor')
    expect(codex).toHaveLength(3)
    expect(splendor).toHaveLength(3)
  })

  it('each has bodyText with content', () => {
    const cards = getDomainCards('Wizard')
    cards.forEach((card) => {
      expect(card.bodyText).toBeTruthy()
      expect(card.bodyText.length).toBeGreaterThan(0)
    })
  })

  it('Seraph returns Splendor + Valor level 1 cards', () => {
    const cards = getDomainCards('Seraph')
    const domains = [...new Set(cards.map((c) => c.props.domain))].sort()
    expect(domains).toEqual(['Splendor', 'Valor'])
    expect(cards.length).toBeGreaterThan(0)
  })

  it('Druid returns Sage + Arcana level 1 cards', () => {
    const cards = getDomainCards('Druid')
    const domains = [...new Set(cards.map((c) => c.props.domain))].sort()
    expect(domains).toEqual(['Arcana', 'Sage'])
    expect(cards.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// getAllAncestries
// ---------------------------------------------------------------------------

describe('getAllAncestries', () => {
  it('returns 18 ancestries', () => {
    const ancestries = getAllAncestries()
    expect(ancestries).toHaveLength(18)
  })

  it('each has name, description, and feats', () => {
    const ancestries = getAllAncestries()
    ancestries.forEach((ancestry) => {
      expect(ancestry.name).toBeTruthy()
      expect(ancestry.description).toBeTruthy()
      expect(ancestry.feats.length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// getAllCommunities
// ---------------------------------------------------------------------------

describe('getAllCommunities', () => {
  it('returns 9 communities', () => {
    const communities = getAllCommunities()
    expect(communities).toHaveLength(9)
  })

  it('each has name, description, and feats', () => {
    const communities = getAllCommunities()
    communities.forEach((community) => {
      expect(community.name).toBeTruthy()
      expect(community.description).toBeTruthy()
      expect(community.feats.length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// getDomainCardsUpToLevel
// ---------------------------------------------------------------------------

describe('getDomainCardsUpToLevel', () => {
  it('returns level 1 and 2 cards for Wizard', () => {
    const cards = getDomainCardsUpToLevel('Wizard', 2)
    expect(cards.length).toBeGreaterThan(0)
    // All returned cards should be level 1 or 2
    cards.forEach((card) => {
      const level = parseInt(String(card.props.level))
      expect(level).toBeLessThanOrEqual(2)
    })
  })

  it('returns only level 1 cards when maxLevel is 1', () => {
    const cards = getDomainCardsUpToLevel('Wizard', 1)
    cards.forEach((card) => {
      expect(card.props.level).toBe('1')
    })
  })

  it('returns more cards at higher levels', () => {
    const level1Cards = getDomainCardsUpToLevel('Wizard', 1)
    const level3Cards = getDomainCardsUpToLevel('Wizard', 3)
    expect(level3Cards.length).toBeGreaterThanOrEqual(level1Cards.length)
  })

  it('returns cards from both class domains', () => {
    const cards = getDomainCardsUpToLevel('Wizard', 2)
    const domains = [...new Set(cards.map((c) => c.props.domain))]
    // Wizard has Codex + Splendor
    expect(domains).toContain('Codex')
    expect(domains).toContain('Splendor')
  })
})
