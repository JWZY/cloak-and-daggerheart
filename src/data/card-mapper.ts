// Card Mapper — single translation layer between SRD data and card component props.
// Card components should never import from srd.ts directly.

import type { SRDCardProps, SRDCardFeat } from '../cards/SRDCard'
import type { InfoCardProps } from '../cards/InfoCard'
import type { DomainCardProps } from '../cards/DomainCard'
import type { DomainIconName } from '../cards/domain-icons'
import type { Subclass, ClassData, DomainCard, Ancestry, Community } from '../types/character'
import { DOMAIN_COLORS, DOMAIN_COLORS_MUTED } from '../cards/domain-colors'
import { getClassByName, getSubclassesForClass, getLevel1DomainCards, getDomainCardsUpToLevel as srdGetDomainCardsUpToLevel, ancestries, communities } from './srd'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a name to kebab-case for file paths */
export function kebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Parse SRD ability text into structured paragraphs.
 *
 * Domain card text uses two patterns:
 * 1. Multi-ability (Grimoire): sections starting with `**Name:**` separated by double newlines
 * 2. Single-ability: plain text (no bold header)
 *
 * Returns an array of { name, text } objects where `name` may be empty.
 */
export function parseAbilityText(text: string): { name: string; text: string }[] {
  // Split on double newlines (handles \n\n)
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean)

  return paragraphs.map(paragraph => {
    // Preserve newlines in bullet lists so FormatText can render them
    const hasBullets = /^- /m.test(paragraph)
    const collapse = (s: string) => hasBullets ? s.trim() : s.replace(/\n/g, ' ').trim()

    // Check for **Name:** pattern at the start
    const match = paragraph.match(/^\*\*(.+?):\*\*\s*(.*)$/s)
    if (match) {
      return { name: match[1], text: collapse(match[2]) }
    }
    // No bold header — plain text paragraph
    return { name: '', text: collapse(paragraph) }
  })
}

// ---------------------------------------------------------------------------
// Subclass → SRDCardProps
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.BASE_URL

/** Maps a domain name (e.g. "Codex") to a DomainIconName (e.g. "codex") */
function toDomainIconName(domain: string): DomainIconName {
  return domain.toLowerCase() as DomainIconName
}

/** Maps a Subclass + ClassData to SRDCardProps */
export function subclassToCardProps(subclass: Subclass, classData: ClassData): SRDCardProps {
  const feats: SRDCardFeat[] = subclass.foundations.map(f => ({
    name: f.name,
    text: f.text,
  }))

  return {
    name: subclass.name,
    className: classData.name,
    tier: 'Foundation',
    spellcastTrait: subclass.spellcast_trait,
    feats,
    bannerColor: DOMAIN_COLORS_MUTED[classData.domain_2],
    bannerInnerColor: DOMAIN_COLORS[classData.domain_1],
    domainIcons: [toDomainIconName(classData.domain_1), toDomainIconName(classData.domain_2)],
    illustrationSrc: `${BASE_URL}images/cards/subclasses/${kebabCase(subclass.name)}.avif`,
  }
}

// ---------------------------------------------------------------------------
// DomainCard → MappedDomainCard
// ---------------------------------------------------------------------------

export interface MappedDomainCard {
  props: Omit<DomainCardProps, 'children'>
  bodyText: string
}

/** Maps a DomainCard (SRD data type) to MappedDomainCard */
export function domainCardToProps(card: DomainCard): MappedDomainCard {
  return {
    props: {
      title: card.name,
      domain: card.domain,
      type: card.type,
      level: card.level,
      recall: card.recall,
      artworkSrc: `${BASE_URL}images/cards/domains/${kebabCase(card.name)}.avif`,
    },
    bodyText: card.text,
  }
}

// ---------------------------------------------------------------------------
// Convenience: Class-generic accessors
// ---------------------------------------------------------------------------

/** Get subclass card props for a given class */
export function getSubclassCards(className: string): SRDCardProps[] {
  const classData = getClassByName(className)
  const subs = getSubclassesForClass(className)
  return subs.map(sub => subclassToCardProps(sub, classData))
}

/** Get level 1 domain card props for a given class */
export function getDomainCards(className: string): MappedDomainCard[] {
  return getLevel1DomainCards(className).map(domainCardToProps)
}

// ---------------------------------------------------------------------------
// Ancestry → Display Props
// ---------------------------------------------------------------------------

export interface AncestryDisplayProps {
  name: string
  description: string
  feats: { name: string; text: string }[]
}

/** Map ancestry to glass card display props */
export function ancestryToDisplayProps(ancestry: Ancestry): AncestryDisplayProps {
  return {
    name: ancestry.name,
    description: ancestry.description,
    feats: ancestry.feats.map(f => ({ name: f.name, text: f.text })),
  }
}

/** Get all ancestries as display props */
export function getAllAncestries(): AncestryDisplayProps[] {
  return ancestries.map(ancestryToDisplayProps)
}

// ---------------------------------------------------------------------------
// Community → Display Props
// ---------------------------------------------------------------------------

export interface CommunityDisplayProps {
  name: string
  description: string
  feats: { name: string; text: string }[]
}

/** Map community to glass card display props */
export function communityToDisplayProps(community: Community): CommunityDisplayProps {
  return {
    name: community.name,
    description: community.description,
    feats: community.feats.map(f => ({ name: f.name, text: f.text })),
  }
}

/** Get all communities */
export function getAllCommunities(): CommunityDisplayProps[] {
  return communities.map(communityToDisplayProps)
}

// ---------------------------------------------------------------------------
// Ancestry → InfoCardProps
// ---------------------------------------------------------------------------

/** Map an ancestry to InfoCard props for full-size card rendering */
export function ancestryToInfoCardProps(ancestry: Ancestry): InfoCardProps {
  // First sentence only (matches official card style)
  const desc = ancestry.description.split('. ')[0] + '.'
  return {
    title: ancestry.name,
    subtitle: 'Ancestry',
    description: desc,
    feats: ancestry.feats.map(f => ({ name: f.name, text: f.text })),
    footerLeft: 'Ancestry',
    footerRight: '',
    illustrationSrc: `${BASE_URL}images/cards/ancestries/${kebabCase(ancestry.name)}.avif`,
  }
}

/** Get all ancestries as InfoCard props */
export function getAllAncestryCards(): InfoCardProps[] {
  return ancestries.map(ancestryToInfoCardProps)
}

// ---------------------------------------------------------------------------
// Community → InfoCardProps
// ---------------------------------------------------------------------------

/** Map a community to InfoCard props for full-size card rendering */
export function communityToInfoCardProps(community: Community): InfoCardProps {
  // First sentence only (matches official card style)
  const desc = community.description.split('. ')[0] + '.'
  return {
    title: community.name,
    subtitle: 'Community',
    description: desc,
    feats: community.feats.map(f => ({ name: f.name, text: f.text })),
    footerLeft: 'Community',
    footerRight: '',
    illustrationSrc: `${BASE_URL}images/cards/communities/${kebabCase(community.name)}.avif`,
  }
}

/** Get all communities as InfoCard props */
export function getAllCommunityCards(): InfoCardProps[] {
  return communities.map(communityToInfoCardProps)
}

// ---------------------------------------------------------------------------
// Level-Up: Domain cards by level
// ---------------------------------------------------------------------------

/** Get domain card props up to a given level for a class (for level-up picker) */
export function getDomainCardsUpToLevel(className: string, maxLevel: number): MappedDomainCard[] {
  return srdGetDomainCardsUpToLevel(className, maxLevel).map(domainCardToProps)
}
