import { motion, AnimatePresence } from 'framer-motion'
import { typeSubtitle, typeTitle, typeMicro } from '../../ui/typography'
import { SRDCard } from '../../cards/SRDCard'
import { DomainCard } from '../../cards/DomainCard'
import { AncestryCard } from '../../cards/AncestryCard'
import { CommunityCard } from '../../cards/CommunityCard'
import { SectionHeader } from '../../ui/SectionHeader'
import { GameBadge } from '../../ui/GameBadge'
import { getSubclassCards, getDomainCards, parseAbilityText } from '../../data/card-mapper'
import { ancestries, communities } from '../../data/srd'
import { TRAIT_NAMES, formatTraitValue } from '../../core/rules/traits'
import type { TraitName } from '../../types/character'
import { useDeckStore } from '../../store/deck-store'
import { getSubclassCardCount } from '../../core/rules/class-rules'

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
}

/**
 * Desktop-only preview panel that progressively shows selections
 * as the user builds their character through the deck builder steps.
 */
export function DeckPreview() {
  const {
    subclass,
    selectedClass,
    selectedDomainCards,
    ancestryName,
    communityName,
    traits,
    characterName,
  } = useDeckStore()

  const subclassCards = getSubclassCards(selectedClass ?? 'Wizard')
  const domainCards = getDomainCards(selectedClass ?? 'Wizard')

  const heroCard = subclassCards.find((c) => c.name === subclass)
  const selectedDomains = domainCards.filter((d) =>
    selectedDomainCards.includes(d.props.title)
  )

  const hasAnything = subclass || selectedDomainCards.length > 0 || ancestryName || communityName || traits || characterName

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '16px 20px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--gold-muted) transparent',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p
          className="gold-text"
          style={{
            ...typeSubtitle,
          }}
        >
          Character Preview
        </p>
        <div
          style={{
            height: 1,
            margin: '8px 0',
            background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
          }}
        />
      </div>

      {/* Empty state */}
      {!hasAnything && (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            Selections will appear here
          </p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {/* Character name */}
        {characterName.trim() && (
          <motion.div key="name" {...fadeIn} style={{ textAlign: 'center', marginBottom: 16 }}>
            <p
              className="gold-text gold-text-shadow"
              style={{
                ...typeTitle,
                fontSize: 24,
                letterSpacing: '0.02em',
              }}
            >
              {characterName.trim()}
            </p>
          </motion.div>
        )}

        {/* Subclass card */}
        {heroCard && (
          <motion.div key="subclass" {...fadeIn} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 360 * 0.55, height: 508 * 0.55, position: 'relative' }}>
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left' }}>
                  <SRDCard {...heroCard} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Domain cards */}
        {selectedDomains.length > 0 && (
          <motion.div key="domains" {...fadeIn} style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 8 }}>
              <SectionHeader>Domain Cards</SectionHeader>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              {selectedDomains.map(({ props, bodyText }) => (
                <div
                  key={props.title}
                  style={{
                    width: 360 * 0.28,
                    height: 508 * 0.28,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 6,
                  }}
                >
                  <div style={{ transform: 'scale(0.28)', transformOrigin: 'top left' }}>
                    <DomainCard {...props}>
                      {parseAbilityText(bodyText).map((ability, i) => (
                        <p key={i} className="mb-1">
                          {ability.name && <strong>{ability.name}: </strong>}
                          {ability.text}
                        </p>
                      ))}
                    </DomainCard>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Ancestry & Community cards */}
        {(ancestryName || communityName) && (
          <motion.div key="origin" {...fadeIn} style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 8 }}>
              <SectionHeader>Origin</SectionHeader>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              {ancestryName && (() => {
                const a = ancestries.find(x => x.name === ancestryName)
                if (!a) return null
                return <AncestryCard ancestry={a} scale={0.28} />
              })()}
              {communityName && (() => {
                const c = communities.find(x => x.name === communityName)
                if (!c) return null
                return <CommunityCard community={c} scale={0.28} />
              })()}
            </div>
          </motion.div>
        )}

        {/* Traits */}
        {traits && (
          <motion.div key="traits" {...fadeIn} style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 8 }}>
              <SectionHeader>Traits</SectionHeader>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {TRAIT_NAMES.map((name) => (
                <div key={name} style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: typeMicro.fontFamily,
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--gold)',
                    }}
                  >
                    {formatTraitValue(traits[name as TraitName] ?? 0)}
                  </span>
                  <span
                    style={{
                      ...typeMicro,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Domain card count badge */}
        {selectedDomainCards.length > 0 && selectedDomainCards.length < getSubclassCardCount(subclass ?? '') && (
          <motion.div key="domain-count" {...fadeIn} style={{ textAlign: 'center', marginBottom: 12 }}>
            <GameBadge>{selectedDomainCards.length} of {getSubclassCardCount(subclass ?? '')} cards</GameBadge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
