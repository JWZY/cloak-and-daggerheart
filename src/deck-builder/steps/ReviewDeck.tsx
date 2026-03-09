import { motion } from 'framer-motion'
import { FormatText } from '../../ui/FormatText'
import { typeTitle, typeSubtitle, typeBody, goldGradient } from '../../ui/typography'
import { getSubclassCards, getDomainCards, parseAbilityText } from '../../data/card-mapper'
import { SRDCard } from '../../cards/SRDCard'
import { DomainCard } from '../../cards/DomainCard'
import { AncestryCard } from '../../cards/AncestryCard'
import { CommunityCard } from '../../cards/CommunityCard'
import { ancestries, communities } from '../../data/srd'
import { TRAIT_NAMES, formatTraitValue } from '../../core/rules/traits'
import type { TraitName } from '../../types/character'
import { GameBadge } from '../../ui/GameBadge'
import { useDeckStore } from '../../store/deck-store'

export function ReviewDeck() {
  const {
    subclass,
    selectedClass,
    selectedDomainCards,
    ancestryName,
    communityName,
    traits,
    backgroundAnswers,
    experiences,
    characterName,
    connectionAnswers,
  } = useDeckStore()

  const subclassCards = getSubclassCards(selectedClass ?? 'Wizard')
  const domainCards = getDomainCards(selectedClass ?? 'Wizard')

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
            ...typeTitle,
            fontSize: 24,
            textAlign: 'center',
          }}
        >
          {characterName}
        </h1>
      </motion.div>
      <p
        style={{
          ...typeSubtitle,
          color: 'var(--gold)',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        {subclass} {selectedClass}
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
          <h3 style={{
            ...typeSubtitle,
            background: goldGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Domain Cards
          </h3>
          <div className="flex justify-center gap-2">
            {selectedDomains.map(({ props, bodyText }) => (
              <DomainCard key={props.title} {...props} scale={0.4}>
                {parseAbilityText(bodyText).map((ability, i) => (
                  <div key={i} className="mb-1 text-xs">
                    {ability.name && <strong>{ability.name}: </strong>}
                    <FormatText text={ability.text} />
                  </div>
                ))}
              </DomainCard>
            ))}
          </div>
        </div>
      )}

      {/* Ancestry & Community cards */}
      {(ancestryName || communityName) && (
        <div className="mb-6 w-full">
          <h3 style={{
            ...typeSubtitle,
            background: goldGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Origin
          </h3>
          <div className="flex justify-center gap-2">
            {ancestryName && (() => {
              const a = ancestries.find(x => x.name === ancestryName)
              if (!a) return null
              return <AncestryCard ancestry={a} scale={0.4} />
            })()}
            {communityName && (() => {
              const c = communities.find(x => x.name === communityName)
              if (!c) return null
              return <CommunityCard community={c} scale={0.4} />
            })()}
          </div>
        </div>
      )}

      {/* Summary info */}
      <div className="w-full max-w-[360px] flex flex-col gap-3 mb-6">
        {/* Traits */}
        {traits && (
          <div className="mt-2">
            <h3 style={{
              ...typeSubtitle,
              background: goldGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              Traits
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {TRAIT_NAMES.map((name) => (
                <div key={name} className="text-center">
                  <span
                    className="block"
                    style={{
                      ...typeBody,
                      fontWeight: 700,
                      color: 'var(--gold)',
                    }}
                  >
                    {formatTraitValue(traits[name as TraitName] ?? 0)}
                  </span>
                  <span
                    style={{
                      ...typeSubtitle,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences */}
        {(experiences || []).filter((e) => e?.text?.trim()).length > 0 && (
          <div className="mt-2">
            <h3 style={{
              ...typeSubtitle,
              background: goldGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              Experiences
            </h3>
            <div className="flex flex-col gap-2">
              {(experiences || [])
                .filter((e) => e?.text?.trim())
                .map((exp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                    style={{
                      padding: '8px 12px',
                      background: 'var(--surface-faint)',
                      borderRadius: 8,
                      border: '1px solid var(--gold-muted)',
                    }}
                  >
                    <span
                      style={{
                        ...typeBody,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {exp.text}
                    </span>
                    <GameBadge>+{exp.bonus}</GameBadge>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Background */}
        {(backgroundAnswers || []).filter((a) => a?.trim()).length > 0 && (
          <div className="mt-2">
            <h3 style={{
              ...typeSubtitle,
              background: goldGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              Background
            </h3>
            <div className="flex flex-col gap-2">
              {(backgroundAnswers || [])
                .filter((a) => a?.trim())
                .map((answer, i) => (
                  <p
                    key={i}
                    style={{
                      ...typeBody,
                      color: 'var(--text-primary)',
                      fontStyle: 'italic',
                    }}
                  >
                    {answer}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* Connections */}
        {(connectionAnswers || []).filter((a) => a?.trim()).length > 0 && (
          <div className="mt-2">
            <h3 style={{
              ...typeSubtitle,
              background: goldGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              Connections
            </h3>
            <div className="flex flex-col gap-2">
              {(connectionAnswers || [])
                .filter((a) => a?.trim())
                .map((answer, i) => (
                  <p
                    key={i}
                    style={{
                      ...typeBody,
                      color: 'var(--text-primary)',
                      fontStyle: 'italic',
                    }}
                  >
                    {answer}
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
