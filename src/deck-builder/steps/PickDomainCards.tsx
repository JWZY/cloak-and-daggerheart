import { useState } from 'react'
import { FullBleedPicker, type PickerItem } from '../components/FullBleedPicker'
import { CardPreviewButton } from '../components/CardPreviewButton'
import { CardZoom } from '../../cards/CardZoom'
import { DomainCard } from '../../cards/DomainCard'
import { DomainCardBody } from '../../hand/DomainCardBody'
import { FormatText } from '../../ui/FormatText'
import { typeTitle, typeSubtitle, typeBody, goldGradientStyle, goldSeparatorLeft, goldSeparatorRight, textShadowWarm } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { getDomainCards, parseAbilityText } from '../../data/card-mapper'
import { getSubclassCardCount } from '../../core/rules/class-rules'

const BASE_URL = import.meta.env.BASE_URL

function kebabCase(str: string): string {
  return str.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function Separator({ text }: { text: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      justifyContent: 'center',
    }}>
      <div style={{ flex: 1, maxWidth: 60, height: 2, background: goldSeparatorLeft }} />
      <span style={{
        ...typeSubtitle,
        ...goldGradientStyle,
      }}>
        {text}
      </span>
      <div style={{ flex: 1, maxWidth: 60, height: 2, background: goldSeparatorRight }} />
    </div>
  )
}

interface StepProps {
  onBack: () => void
  onNext: () => void
}

export function PickDomainCards({ onBack, onNext }: StepProps) {
  const showFullInfo = new URLSearchParams(window.location.search).has('fullinfo')
  const selectedDomainCards = useDeckStore((s) => s.selectedDomainCards)
  const subclass = useDeckStore((s) => s.subclass)
  const toggleDomainCard = useDeckStore((s) => s.toggleDomainCard)
  const selectedClass = useDeckStore((s) => s.selectedClass)

  const domainCards = getDomainCards(selectedClass ?? 'Wizard')
  const maxCards = subclass ? getSubclassCardCount(subclass) : 2

  const [focusedId, setFocusedId] = useState<string | null>(
    selectedDomainCards[0] ?? domainCards[0]?.props.title ?? null
  )
  const [showCard, setShowCard] = useState(false)

  const pickerItems: PickerItem[] = domainCards.map((card) => ({
    id: card.props.title,
    name: card.props.title,
    illustrationSrc: `${BASE_URL}images/cards/domains/${kebabCase(card.props.title)}.avif`,
    objectPosition: 'center',
  }))

  const handleFocus = (id: string) => {
    setFocusedId(id)
    toggleDomainCard(id)
  }

  const canConfirm = selectedDomainCards.length === maxCards

  const handleConfirm = () => {
    if (canConfirm) onNext()
  }

  const focusedCard = domainCards.find((c) => c.props.title === focusedId)

  const goldTitleStyle: React.CSSProperties = {
    ...typeTitle,
    fontSize: 36,
    fontWeight: 400,
    ...goldGradientStyle,
    margin: 0,
    lineHeight: 1,
  }

  return (
    <>
    <FullBleedPicker
      items={pickerItems}
      focusedId={focusedId}
      selectedIds={selectedDomainCards}
      onFocus={handleFocus}
      onBack={onBack}
      onConfirm={handleConfirm}
      canConfirm={canConfirm}
      badge={`${selectedDomainCards.length} / ${maxCards}`}
    >
      {focusedCard && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={goldTitleStyle}>
              {focusedCard.props.title}
            </h2>
            <CardPreviewButton onClick={() => setShowCard(true)} />
          </div>
          <Separator text={`${focusedCard.props.domain} · ${focusedCard.props.type} · L${focusedCard.props.level}`} />
          <div style={{
            maxHeight: showFullInfo ? '40vh' : undefined,
            overflowY: showFullInfo ? 'auto' : undefined,
            maskImage: showFullInfo ? 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)' : undefined,
            WebkitMaskImage: showFullInfo ? 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)' : undefined,
          }}>
            {showFullInfo ? (
              parseAbilityText(focusedCard.bodyText).map((ability, i) => (
                <div key={i} style={{
                  ...typeBody,
                  color: 'rgba(212,207,199,0.9)',
                  textShadow: textShadowWarm,
                  textAlign: 'center',
                  margin: 0,
                  marginTop: i > 0 ? 8 : 0,
                }}>
                  {ability.name && <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>{ability.name}: </span>}
                  <FormatText text={ability.text} />
                </div>
              ))
            ) : (
              <p style={{
                ...typeBody,
                color: 'rgba(212,207,199,0.9)',
                textShadow: textShadowWarm,
                textAlign: 'center',
                margin: 0,
                maxHeight: 60,
                overflow: 'hidden',
              }}>
                {focusedCard.bodyText.split('\n\n')[0].replace(/\*\*.*?\*\*\s*/g, '').slice(0, 150)}
                {focusedCard.bodyText.length > 150 ? '...' : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </FullBleedPicker>

    {showCard && focusedCard && (
      <CardZoom layoutId={`preview-${focusedCard.props.title}`} onClose={() => setShowCard(false)}>
        <DomainCard {...focusedCard.props}>
          <DomainCardBody bodyText={focusedCard.bodyText} />
        </DomainCard>
      </CardZoom>
    )}
    </>
  )
}
