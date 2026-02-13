import { motion } from 'framer-motion'
import { getWizardSubclassCards, getWizardDomainCards, parseAbilityText, ancestryToInfoCardProps, communityToInfoCardProps } from '../../data/card-mapper'
import { SRDCard } from '../../cards/SRDCard'
import { DomainCard } from '../../cards/DomainCard'
import { InfoCard } from '../../cards/InfoCard'
import { ancestries, communities } from '../../data/srd'
import { TRAIT_NAMES, formatTraitValue } from '../../core/rules/traits'
import type { TraitName } from '../../types/character'
import { SectionHeader } from '../../ui/SectionHeader'
import { useDeckStore } from '../../store/deck-store'

export function ReviewDeck() {
  const {
    subclass,
    selectedDomainCards,
    ancestryName,
    communityName,
    traits,
    characterName,
  } = useDeckStore()

  const subclassCards = getWizardSubclassCards()
  const domainCards = getWizardDomainCards()

  const heroCard = subclassCards.find((c) => c.name === subclass)
  const selectedDomains = domainCards.filter((d) =>
    selectedDomainCards.includes(d.props.title)
  )

  return (
    <div className="flex flex-col items-center px-4">
      {/* Character name */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gold-text-shadow mb-1"
      >
        <h1
          className="gold-text"
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 32,
            fontWeight: 500,
            fontVariant: 'small-caps',
            textAlign: 'center',
          }}
        >
          {characterName}
        </h1>
      </motion.div>
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          fontVariant: 'small-caps',
          color: '#e7ba90',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        {subclass} Wizard
      </p>

      {/* Hero subclass card */}
      {heroCard && (
        <div className="mb-6">
          <SRDCard {...heroCard} />
        </div>
      )}

      {/* Domain cards row */}
      {selectedDomains.length > 0 && (
        <div className="mb-6 w-full">
          <div className="mb-3">
            <SectionHeader>Domain Cards</SectionHeader>
          </div>
          <div className="flex justify-center gap-2">
            {selectedDomains.map(({ props, bodyText }) => (
              <DomainCard key={props.title} {...props} scale={0.4}>
                {parseAbilityText(bodyText).map((ability, i) => (
                  <p key={i} className="mb-1 text-xs">
                    {ability.name && <strong>{ability.name}: </strong>}
                    {ability.text}
                  </p>
                ))}
              </DomainCard>
            ))}
          </div>
        </div>
      )}

      {/* Ancestry & Community cards */}
      {(ancestryName || communityName) && (
        <div className="mb-6 w-full">
          <div className="mb-3">
            <SectionHeader>Origin</SectionHeader>
          </div>
          <div className="flex justify-center gap-2">
            {ancestryName && (() => {
              const a = ancestries.find(x => x.name === ancestryName)
              if (!a) return null
              return (
                <div style={{ width: 360 * 0.4, height: 508 * 0.4, position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
                  <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left' }}>
                    <InfoCard {...ancestryToInfoCardProps(a)} />
                  </div>
                </div>
              )
            })()}
            {communityName && (() => {
              const c = communities.find(x => x.name === communityName)
              if (!c) return null
              return (
                <div style={{ width: 360 * 0.4, height: 508 * 0.4, position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
                  <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left' }}>
                    <InfoCard {...communityToInfoCardProps(c)} />
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Summary info */}
      <div className="w-full max-w-xs flex flex-col gap-3 mb-6">
        {/* Traits */}
        {traits && (
          <div className="mt-2">
            <div className="mb-3">
              <SectionHeader>Traits</SectionHeader>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TRAIT_NAMES.map((name) => (
                <div key={name} className="text-center">
                  <span
                    className="block"
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#e7ba90',
                    }}
                  >
                    {formatTraitValue(traits[name as TraitName] ?? 0)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: 12,
                      fontVariant: 'small-caps',
                      letterSpacing: '0.04em',
                      color: 'rgba(212, 207, 199, 0.5)',
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
