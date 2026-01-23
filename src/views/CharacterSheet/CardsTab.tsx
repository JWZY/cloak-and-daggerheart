import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { CardHand, HandCard, CardLightbox } from '../../components/cards/CardHand'
import type { Character } from '../../types/character'
import { wizard, getSubclass } from '../../data/srd'

interface CardsTabProps {
  character: Character
}

// Helper to convert card name to image path
function getDomainCardImage(cardName: string): string {
  const slug = cardName.toLowerCase().replace(/\s+/g, '-')
  return `/images/cards/domains/${slug}.avif`
}

// Helper to get ancestry image path
function getAncestryImage(ancestryName: string): string {
  const slug = ancestryName.toLowerCase().replace(/\s+/g, '-')
  return `/images/cards/ancestries/${slug}.avif`
}

// Helper to get community image path
function getCommunityImage(communityName: string): string {
  const slug = communityName.toLowerCase().replace(/\s+/g, '-')
  return `/images/cards/communities/${slug}.avif`
}

interface ExpandedCard {
  title: string
  subtitle?: string
  tier?: 'Foundation' | 'Specialization' | 'Mastery'
  text: string
  backgroundImage?: string
}

export function CardsTab({ character }: CardsTabProps) {
  const [expandedCard, setExpandedCard] = useState<ExpandedCard | null>(null)
  const subclass = getSubclass(character.subclass)

  // Get background image based on subclass
  const subclassImage = character.subclass === 'School of Knowledge'
    ? '/images/cards/domains/school-of-knowledge.avif'
    : '/images/cards/domains/school-of-war.avif'

  const ancestryImage = getAncestryImage(character.ancestry.name)
  const communityImage = getCommunityImage(character.community.name)

  return (
    <div className="space-y-6 pb-24">
      {/* Domain Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wide text-white/40">Domain Cards</h3>
          <span className="text-sm text-white/50">
            {character.domainCards.length} cards
          </span>
        </div>

        <CardHand>
          {character.domainCards.map((card) => (
            <HandCard
              key={card.name}
              title={card.name}
              subtitle={`${card.domain} · ${card.type}`}
              backgroundImage={getDomainCardImage(card.name)}
              onClick={() => setExpandedCard({
                title: card.name,
                subtitle: `${card.domain} · ${card.type}`,
                text: card.text,
                backgroundImage: getDomainCardImage(card.name),
              })}
            >
              {card.text}
            </HandCard>
          ))}
        </CardHand>
      </div>

      {/* Subclass Cards */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">
          {character.subclass}
        </h3>

        <CardHand>
          {subclass.foundations.map((feat) => (
            <HandCard
              key={feat.name}
              title={feat.name}
              subtitle={character.subclass}
              tier="Foundation"
              backgroundImage={subclassImage}
              onClick={() => setExpandedCard({
                title: feat.name,
                subtitle: character.subclass,
                tier: 'Foundation',
                text: feat.text,
                backgroundImage: subclassImage,
              })}
            >
              {feat.text}
            </HandCard>
          ))}
          {subclass.specializations.map((feat) => (
            <HandCard
              key={feat.name}
              title={feat.name}
              subtitle={character.subclass}
              tier="Specialization"
              backgroundImage={subclassImage}
              onClick={() => setExpandedCard({
                title: feat.name,
                subtitle: character.subclass,
                tier: 'Specialization',
                text: feat.text,
                backgroundImage: subclassImage,
              })}
            >
              {feat.text}
            </HandCard>
          ))}
          {subclass.masteries.map((feat) => (
            <HandCard
              key={feat.name}
              title={feat.name}
              subtitle={character.subclass}
              tier="Mastery"
              backgroundImage={subclassImage}
              onClick={() => setExpandedCard({
                title: feat.name,
                subtitle: character.subclass,
                tier: 'Mastery',
                text: feat.text,
                backgroundImage: subclassImage,
              })}
            >
              {feat.text}
            </HandCard>
          ))}
        </CardHand>
      </div>

      {/* Ancestry Cards */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">
          Ancestry: {character.ancestry.name}
        </h3>

        <CardHand>
          {character.ancestry.feats.map((feat) => (
            <HandCard
              key={feat.name}
              title={feat.name}
              subtitle={character.ancestry.name}
              backgroundImage={ancestryImage}
              onClick={() => setExpandedCard({
                title: feat.name,
                subtitle: character.ancestry.name,
                text: feat.text,
                backgroundImage: ancestryImage,
              })}
            >
              {feat.text}
            </HandCard>
          ))}
        </CardHand>
      </div>

      {/* Community Cards */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">
          Community: {character.community.name}
        </h3>

        <CardHand>
          {character.community.feats.map((feat) => (
            <HandCard
              key={feat.name}
              title={feat.name}
              subtitle={character.community.name}
              backgroundImage={communityImage}
              onClick={() => setExpandedCard({
                title: feat.name,
                subtitle: character.community.name,
                text: feat.text,
                backgroundImage: communityImage,
              })}
            >
              {feat.text}
            </HandCard>
          ))}
        </CardHand>
      </div>

      {/* Class Features */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Class Features</h3>
        <div className="space-y-5">
          {wizard.class_feats.map((feat) => (
            <div key={feat.name}>
              <h4 className="font-medium text-white">{feat.name}</h4>
              <p className="text-sm text-white/50 mt-1.5">{feat.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Card Lightbox */}
      <CardLightbox
        isOpen={expandedCard !== null}
        onClose={() => setExpandedCard(null)}
        title={expandedCard?.title ?? ''}
        subtitle={expandedCard?.subtitle}
        tier={expandedCard?.tier}
        backgroundImage={expandedCard?.backgroundImage}
      >
        {expandedCard?.text}
      </CardLightbox>
    </div>
  )
}
