import { AnimatePresence } from 'framer-motion'
import { getWizardDomainCards, parseAbilityText } from '../../data/card-mapper'
import { DomainCard } from '../../cards/DomainCard'
import { CardSelector } from '../../cards/CardSelector'
import { CardZoom } from '../../cards/CardZoom'
import { useCardZoom } from '../../cards/useCardZoom'
import { SectionHeader } from '../../ui/SectionHeader'
import { GameBadge } from '../../ui/GameBadge'
import { useDeckStore } from '../../store/deck-store'
import { getWizardCardCount } from '../../core/rules/wizard'
import type { WizardSubclass } from '../../types/character'

export function PickDomainCards() {
  const selectedDomainCards = useDeckStore((s) => s.selectedDomainCards)
  const subclass = useDeckStore((s) => s.subclass)
  const toggleDomainCard = useDeckStore((s) => s.toggleDomainCard)
  const domainCards = getWizardDomainCards()
  const { zoomedCard, openZoom, closeZoom } = useCardZoom()

  const maxCards = subclass ? getWizardCardCount(subclass as WizardSubclass) : 2
  const maxSelected = selectedDomainCards.length >= maxCards

  const handleTap = (name: string) => {
    if (selectedDomainCards.includes(name)) {
      openZoom(`domain-${name}`)
    } else {
      toggleDomainCard(name)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="w-full max-w-xs mb-2 px-4">
        <SectionHeader>Choose Your Domain Cards</SectionHeader>
      </h2>
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(231, 186, 144, 0.5)',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Tap to select — tap again to zoom
      </p>
      <div className="mb-6">
        <GameBadge>{selectedDomainCards.length} of {maxCards} selected</GameBadge>
      </div>

      {/* Horizontal scrollable card rail */}
      <div
        className="flex gap-3 overflow-x-auto w-full px-4 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {domainCards.map(({ props, bodyText }) => {
          const isSelected = selectedDomainCards.includes(props.title)
          const isDimmed = maxSelected && !isSelected

          return (
            <div key={props.title} className="snap-center shrink-0" style={{ width: 360 * 0.52, height: 508 * 0.52 }}>
              <div style={{ transform: 'scale(0.52)', transformOrigin: 'top left' }}>
                <CardSelector
                  selected={isSelected}
                  dimmed={isDimmed}
                  onSelect={() => handleTap(props.title)}
                >
                  <DomainCard {...props}>
                    {parseAbilityText(bodyText).map((ability, i) => (
                      <p key={i} className="mb-1">
                        {ability.name && <strong>{ability.name}: </strong>}
                        {ability.text}
                      </p>
                    ))}
                  </DomainCard>
                </CardSelector>
              </div>
            </div>
          )
        })}
      </div>

      {/* Card Zoom */}
      <AnimatePresence>
        {zoomedCard?.startsWith('domain-') && (() => {
          const name = zoomedCard.replace('domain-', '')
          const card = domainCards.find((c) => c.props.title === name)
          if (!card) return null
          return (
            <CardZoom layoutId={zoomedCard} onClose={closeZoom}>
              <DomainCard {...card.props}>
                {parseAbilityText(card.bodyText).map((ability, i) => (
                  <p key={i} className="mb-1">
                    {ability.name && <strong>{ability.name}: </strong>}
                    {ability.text}
                  </p>
                ))}
              </DomainCard>
            </CardZoom>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
