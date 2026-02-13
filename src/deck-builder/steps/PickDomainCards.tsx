import { useState } from 'react'
import { getWizardDomainCards, parseAbilityText } from '../../data/card-mapper'
import { DomainCard } from '../../cards/DomainCard'
import { CardBack } from '../../cards/CardBack'
import { CardFlip } from '../../cards/CardFlip'
import { CardSelector } from '../../cards/CardSelector'
import { SectionHeader } from '../../ui/SectionHeader'
import { GameBadge } from '../../ui/GameBadge'
import { useDeckStore } from '../../store/deck-store'

export function PickDomainCards() {
  const selectedDomainCards = useDeckStore((s) => s.selectedDomainCards)
  const toggleDomainCard = useDeckStore((s) => s.toggleDomainCard)
  const domainCards = getWizardDomainCards()

  // Track which cards have been revealed (flipped face-up)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const handleFlip = (index: number, flipped: boolean) => {
    setRevealed((prev) => ({ ...prev, [index]: flipped }))
  }

  const handleSelect = (cardName: string) => {
    toggleDomainCard(cardName)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="w-full max-w-xs mb-2 px-4">
        <SectionHeader>Draft Domain Cards</SectionHeader>
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
        Tap to reveal, then select your deck
      </p>
      <div className="mb-6">
        <GameBadge>{selectedDomainCards.length} of 3 selected</GameBadge>
      </div>

      <div className="flex justify-center gap-3 flex-wrap px-2">
        {domainCards.map(({ props, bodyText }, index) => {
          const isRevealed = revealed[index] ?? false
          const isSelected = selectedDomainCards.includes(props.title)

          const cardContent = (
            <DomainCard {...props} scale={0.6} selected={isSelected}>
              {parseAbilityText(bodyText).map((ability, i) => (
                <p key={i} className="mb-2">
                  {ability.name && <strong>{ability.name}: </strong>}
                  {ability.text}
                </p>
              ))}
            </DomainCard>
          )

          if (!isRevealed) {
            return (
              <CardFlip
                key={props.title}
                width={216}
                height={302}
                flipped={false}
                onFlip={(flipped) => handleFlip(index, flipped)}
                front={cardContent}
                back={<CardBack variant="domain" />}
              />
            )
          }

          return (
            <CardSelector
              key={props.title}
              selected={isSelected}
              onSelect={() => handleSelect(props.title)}
            >
              {cardContent}
            </CardSelector>
          )
        })}
      </div>
    </div>
  )
}
