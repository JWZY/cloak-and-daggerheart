import { useState } from 'react'
import { FullBleedPicker, type PickerItem } from '../components/FullBleedPicker'
import { typeTitle, typeSubtitle, typeBody, goldGradient } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { getDomainCards } from '../../data/card-mapper'
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
      <div style={{ flex: 1, maxWidth: 60, height: 2, background: 'linear-gradient(90deg, transparent, rgba(231,186,144,0.4))' }} />
      <span style={{
        ...typeSubtitle,
        background: goldGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {text}
      </span>
      <div style={{ flex: 1, maxWidth: 60, height: 2, background: 'linear-gradient(270deg, transparent, rgba(231,186,144,0.4))' }} />
    </div>
  )
}

interface StepProps {
  onBack: () => void
  onNext: () => void
}

export function PickDomainCards({ onBack, onNext }: StepProps) {
  const selectedDomainCards = useDeckStore((s) => s.selectedDomainCards)
  const subclass = useDeckStore((s) => s.subclass)
  const toggleDomainCard = useDeckStore((s) => s.toggleDomainCard)
  const selectedClass = useDeckStore((s) => s.selectedClass)

  const domainCards = getDomainCards(selectedClass ?? 'Wizard')
  const maxCards = subclass ? getSubclassCardCount(subclass) : 2

  const [focusedId, setFocusedId] = useState<string | null>(
    selectedDomainCards[0] ?? domainCards[0]?.props.title ?? null
  )

  const pickerItems: PickerItem[] = domainCards.map((card) => ({
    id: card.props.title,
    name: card.props.title,
    illustrationSrc: `${BASE_URL}images/cards/domains/${kebabCase(card.props.title)}.avif`,
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
    background: goldGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    lineHeight: 1,
  }

  return (
    <FullBleedPicker
      title="Domain Cards"
      items={pickerItems}
      focusedId={focusedId}
      selectedIds={selectedDomainCards}
      onFocus={handleFocus}
      onBack={onBack}
      onConfirm={handleConfirm}
      canConfirm={canConfirm}
      badge={`${selectedDomainCards.length} of ${maxCards} selected`}
      prevStepLabel="Subclass"
      nextStepLabel="Ancestry"
    >
      {focusedCard && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <h2 style={goldTitleStyle}>
            {focusedCard.props.title}
          </h2>
          <Separator text={`${focusedCard.props.domain} · ${focusedCard.props.type} · L${focusedCard.props.level}`} />
          <p style={{
            ...typeBody,
            color: 'rgba(212,207,199,0.9)',
            textShadow: '0px 1px 1px #4d381e',
            textAlign: 'center',
            margin: 0,
            maxHeight: 60,
            overflow: 'hidden',
          }}>
            {focusedCard.bodyText.split('\n\n')[0].replace(/\*\*.*?\*\*\s*/g, '').slice(0, 150)}
            {focusedCard.bodyText.length > 150 ? '...' : ''}
          </p>
        </div>
      )}
    </FullBleedPicker>
  )
}
