import { getDomainCards, parseAbilityText } from '../../data/card-mapper'
import { DomainCard } from '../../cards/DomainCard'
import { CardSelector } from '../../cards/CardSelector'
import { CardHand } from '../../cards/CardHand'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { GameBadge } from '../../ui/GameBadge'
import { useDeckStore } from '../../store/deck-store'
import { getSubclassCardCount } from '../../core/rules/class-rules'

export function PickDomainCards() {
  const selectedDomainCards = useDeckStore((s) => s.selectedDomainCards)
  const subclass = useDeckStore((s) => s.subclass)
  const toggleDomainCard = useDeckStore((s) => s.toggleDomainCard)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const domainCards = getDomainCards(selectedClass ?? 'Wizard')

  const maxCards = subclass ? getSubclassCardCount(subclass) : 2
  const maxSelected = selectedDomainCards.length >= maxCards

  const handleTap = (name: string) => {
    toggleDomainCard(name)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="w-full max-w-xs mb-2 px-4">
        <SectionHeader>Choose Your Domain Cards</SectionHeader>
      </h2>
      <StepInstruction style={{ marginBottom: 8 }}>Tap to select or deselect</StepInstruction>
      <div className="mb-4">
        <GameBadge>{selectedDomainCards.length} of {maxCards} selected</GameBadge>
      </div>

      {/* Hand-of-cards layout */}
      <CardHand scale={0.65} overlap={-50} mobileScale={0.5}>
        {domainCards.map(({ props, bodyText }) => {
          const isSelected = selectedDomainCards.includes(props.title)
          const isDimmed = maxSelected && !isSelected

          return (
            <CardSelector
              key={props.title}
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
          )
        })}
      </CardHand>
    </div>
  )
}
