import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { DomainCard } from '../../components/cards/DomainCard'
import { SubclassCard } from '../../components/cards/SubclassCard'
import { Markdown } from '../../components/ui/Markdown'
import type { Character } from '../../types/character'
import { wizard, getSubclass } from '../../data/srd'

// Scale for full-size cards in horizontal rails
// Full card is 360x504, scaled to fit nicely in viewport
const CARD_SCALE = 0.55

// Horizontal scrolling rail for full-size cards
function HorizontalCardRail({ children }: { children: ReactNode }) {
  return (
    <div
      className="scrollbar-hide -mx-4"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        gap: '12px',
        overflowX: 'auto',
        paddingTop: '8px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  )
}

interface CardsTabProps {
  character: Character
}

// Helper to convert card name to image path
function getDomainCardImage(cardName: string): string {
  const basePath = import.meta.env.BASE_URL || '/'
  const slug = cardName.toLowerCase().replace(/\s+/g, '-')
  return `${basePath}images/cards/domains/${slug}.avif`
}

// Helper to get ancestry image path
function getAncestryImage(ancestryName: string): string {
  const basePath = import.meta.env.BASE_URL || '/'
  const slug = ancestryName.toLowerCase().replace(/\s+/g, '-')
  return `${basePath}images/cards/ancestries/${slug}.avif`
}

// Helper to get community image path
function getCommunityImage(communityName: string): string {
  const basePath = import.meta.env.BASE_URL || '/'
  const slug = communityName.toLowerCase().replace(/\s+/g, '-')
  return `${basePath}images/cards/communities/${slug}.avif`
}

// Helper to get subclass image path
function getSubclassImage(subclassName: string): string {
  const basePath = import.meta.env.BASE_URL || '/'
  const slug = subclassName.toLowerCase().replace(/\s+/g, '-')
  return `${basePath}images/cards/subclass/${slug}.webp`
}

// Subclass domain colors
const SUBCLASS_COLORS: Record<string, string> = {
  'School of Knowledge': '#4e345b',
  'School of War': '#8b2942',
}

interface ExpandedCard {
  title: string
  subtitle?: string
  domain?: string
  type?: string
  level?: string | number
  recall?: string
  text: string
  backgroundImage?: string
  cardType: 'domain' | 'subclass' | 'ancestry' | 'community'
}

export function CardsTab({ character }: CardsTabProps) {
  const [expandedCard, setExpandedCard] = useState<ExpandedCard | null>(null)
  const subclass = getSubclass(character.subclass)

  const subclassImage = getSubclassImage(character.subclass)
  const ancestryImage = getAncestryImage(character.ancestry.name)
  const communityImage = getCommunityImage(character.community.name)
  const subclassColor = SUBCLASS_COLORS[character.subclass] || '#4e345b'

  return (
    <div className="space-y-6 pb-24">
      {/* Domain Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wide text-white/40 font-semibold">Domain Cards</h3>
          <span className="text-sm text-white/50">
            {character.domainCards.length} cards
          </span>
        </div>

        <HorizontalCardRail>
          {character.domainCards.map((card) => (
            <DomainCard
              key={card.name}
              title={card.name}
              subtitle={`${card.domain} Domain`}
              domain={card.domain}
              type={card.type}
              level={card.level}
              recall={card.recall}
              artworkSrc={getDomainCardImage(card.name)}
              scale={CARD_SCALE}
              onClick={() => setExpandedCard({
                title: card.name,
                subtitle: `${card.domain} Domain`,
                domain: card.domain,
                type: card.type,
                level: card.level,
                recall: card.recall,
                text: card.text,
                backgroundImage: getDomainCardImage(card.name),
                cardType: 'domain',
              })}
            >
              <Markdown>{card.text}</Markdown>
            </DomainCard>
          ))}
        </HorizontalCardRail>
      </div>

      {/* Subclass Cards - One card per tier, grouped by Foundation/Specialization/Mastery */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-white/40 font-semibold mb-2">
          {character.subclass}
        </h3>

        <HorizontalCardRail>
          {/* Foundation Card - always shown at level 1 */}
          {subclass.foundations.length > 0 && (
            <SubclassCard
              key="foundation"
              title="Foundation"
              subtitle={character.subclass}
              className="Wizard"
              domainColor={subclassColor}
              artworkSrc={subclassImage}
              scale={CARD_SCALE}
              onClick={() => setExpandedCard({
                title: 'Foundation',
                subtitle: character.subclass,
                text: subclass.foundations.map(f => `**${f.name}**\n\n${f.text}`).join('\n\n---\n\n'),
                backgroundImage: subclassImage,
                cardType: 'subclass',
              })}
            >
              {subclass.foundations.map((feat, idx) => (
                <div key={feat.name} className={idx > 0 ? 'mt-3 pt-3 border-t border-white/10' : ''}>
                  <div className="font-semibold text-white/90 mb-1">{feat.name}</div>
                  <Markdown>{feat.text}</Markdown>
                </div>
              ))}
            </SubclassCard>
          )}
          {/* TODO: Show Specialization at higher levels */}
          {/* TODO: Show Mastery at even higher levels */}
        </HorizontalCardRail>
      </div>

      {/* Ancestry Cards */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-white/40 font-semibold mb-2">
          Ancestry: {character.ancestry.name}
        </h3>

        <HorizontalCardRail>
          {character.ancestry.feats.map((feat) => (
            <DomainCard
              key={feat.name}
              title={feat.name}
              subtitle={`${character.ancestry.name} Ancestry`}
              domain="Grace"
              artworkSrc={ancestryImage}
              scale={CARD_SCALE}
              onClick={() => setExpandedCard({
                title: feat.name,
                subtitle: `${character.ancestry.name} Ancestry`,
                text: feat.text,
                backgroundImage: ancestryImage,
                cardType: 'ancestry',
              })}
            >
              <Markdown>{feat.text}</Markdown>
            </DomainCard>
          ))}
        </HorizontalCardRail>
      </div>

      {/* Community Cards */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-white/40 font-semibold mb-2">
          Community: {character.community.name}
        </h3>

        <HorizontalCardRail>
          {character.community.feats.map((feat) => (
            <DomainCard
              key={feat.name}
              title={feat.name}
              subtitle={`${character.community.name} Community`}
              domain="Valor"
              artworkSrc={communityImage}
              scale={CARD_SCALE}
              onClick={() => setExpandedCard({
                title: feat.name,
                subtitle: `${character.community.name} Community`,
                text: feat.text,
                backgroundImage: communityImage,
                cardType: 'community',
              })}
            >
              <Markdown>{feat.text}</Markdown>
            </DomainCard>
          ))}
        </HorizontalCardRail>
      </div>

      {/* Class Features */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 font-semibold mb-4">Class Features</h3>
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
        card={expandedCard}
        onClose={() => setExpandedCard(null)}
        subclassColor={subclassColor}
      />
    </div>
  )
}

// Lightbox component for viewing cards at full size
interface CardLightboxProps {
  card: ExpandedCard | null
  onClose: () => void
  subclassColor: string
}

function CardLightbox({ card, onClose, subclassColor }: CardLightboxProps) {
  if (!card) return null

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '24px',
          }}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </motion.button>

          {/* Card display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {card.cardType === 'subclass' ? (
              <SubclassCard
                title={card.title}
                subtitle={card.subtitle}
                className="Wizard"
                domainColor={subclassColor}
                artworkSrc={card.backgroundImage}
                scale={0.85}
              >
                <Markdown>{card.text}</Markdown>
              </SubclassCard>
            ) : (
              <DomainCard
                title={card.title}
                subtitle={card.subtitle}
                domain={card.domain || 'Arcana'}
                type={card.type}
                level={card.level}
                recall={card.recall}
                artworkSrc={card.backgroundImage}
                scale={0.85}
              >
                <Markdown>{card.text}</Markdown>
              </DomainCard>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
