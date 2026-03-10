import { useState, useEffect } from 'react'
import { FullBleedPicker, type PickerItem } from '../components/FullBleedPicker'
import { CardPreviewButton } from '../components/CardPreviewButton'
import { CardZoom } from '../../cards/CardZoom'
import { SRDCard } from '../../cards/SRDCard'
import { FormatText } from '../../ui/FormatText'
import { typeTitle, typeSubtitle, typeBody, goldGradientStyle, goldSeparatorLeft, goldSeparatorRight, textShadowWarm } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { getSubclassesForClass, getSubclassByName, getClassByName } from '../../data/srd'
import { subclassToCardProps } from '../../data/card-mapper'

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

export function PickSubclass({ onBack, onNext }: StepProps) {
  const showFullInfo = new URLSearchParams(window.location.search).has('fullinfo')
  const subclass = useDeckStore((s) => s.subclass)
  const setSubclass = useDeckStore((s) => s.setSubclass)
  const selectedClass = useDeckStore((s) => s.selectedClass)

  const subclassData = getSubclassesForClass(selectedClass ?? 'Wizard')

  const [focusedId, setFocusedId] = useState<string | null>(subclass ?? subclassData[0]?.name ?? null)
  const [showCard, setShowCard] = useState(false)

  // Auto-select first item on mount for faster testing
  useEffect(() => {
    if (!subclass && subclassData[0]) setSubclass(subclassData[0].name)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const pickerItems: PickerItem[] = subclassData.map((sub) => ({
    id: sub.name,
    name: sub.name,
    illustrationSrc: `${BASE_URL}images/cards/subclasses/${kebabCase(sub.name)}.avif`,
  }))

  const handleFocus = (id: string) => {
    setFocusedId(id)
    setSubclass(id)
  }

  const handleConfirm = () => {
    if (subclass) onNext()
  }

  const focusedSub = subclassData.find((s) => s.name === focusedId)

  // Build description: use the subclass description field, falling back to first foundation text
  const descriptionText = focusedSub
    ? (focusedSub.description || (focusedSub.foundations[0]?.text?.split('. ')[0] + '.') || '')
    : ''

  return (
    <>
    <FullBleedPicker
      items={pickerItems}
      focusedId={focusedId}
      selectedIds={subclass ? [subclass] : []}
      onFocus={handleFocus}
      onBack={onBack}
      onConfirm={handleConfirm}
      canConfirm={!!subclass}
    >
      {focusedSub && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{
              ...typeTitle,
              fontSize: 36,
              fontWeight: 400,
              ...goldGradientStyle,
              margin: 0,
              lineHeight: 1,
            }}>
              {focusedSub.name}
            </h2>
            <CardPreviewButton onClick={() => setShowCard(true)} />
          </div>
          <Separator text={selectedClass ?? ''} />
          <div style={{
            maxHeight: showFullInfo ? '40vh' : undefined,
            overflowY: showFullInfo ? 'auto' : undefined,
            maskImage: showFullInfo ? 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)' : undefined,
            WebkitMaskImage: showFullInfo ? 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)' : undefined,
          }}>
            <div style={{
              ...typeBody,
              color: 'rgba(212,207,199,0.9)',
              textShadow: textShadowWarm,
              textAlign: 'center',
              margin: 0,
            }}>
              <FormatText text={showFullInfo ? (focusedSub.description || descriptionText) : descriptionText} />
            </div>
            {showFullInfo && (
              <>
                {focusedSub.spellcast_trait && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                      Spellcast Trait
                    </span>
                    <p style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: textShadowWarm, margin: '4px 0 0' }}>
                      {focusedSub.spellcast_trait}
                    </p>
                  </div>
                )}
                {focusedSub.foundations.map((foundation, i) => (
                  <div key={i} style={{ marginTop: 8 }}>
                    <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                      {foundation.name}
                    </span>
                    <div style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: textShadowWarm, margin: '4px 0 0' }}>
                      <FormatText text={foundation.text} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </FullBleedPicker>

    {showCard && focusedSub && selectedClass && (() => {
      const sub = getSubclassByName(focusedSub.name)
      if (!sub) return null
      return (
        <CardZoom layoutId={`preview-${focusedSub.name}`} onClose={() => setShowCard(false)}>
          <SRDCard {...subclassToCardProps(sub, getClassByName(selectedClass))} />
        </CardZoom>
      )
    })()}
    </>
  )
}
