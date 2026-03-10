import { useState, useEffect } from 'react'
import { FullBleedPicker, type PickerItem } from '../components/FullBleedPicker'
import { CardPreviewButton } from '../components/CardPreviewButton'
import { CardZoom } from '../../cards/CardZoom'
import { AncestryCard } from '../../cards/AncestryCard'
import { FormatText } from '../../ui/FormatText'
import { typeTitle, typeSubtitle, typeBody, typeMicro, goldGradientStyle, goldDark, goldDarkAlpha, goldSeparatorLeft, goldSeparatorRight, textShadowWarm } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { ancestries } from '../../data/srd'

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

export function PickAncestry({ onBack, onNext }: StepProps) {
  const showFullInfo = new URLSearchParams(window.location.search).has('fullinfo')
  const ancestryName = useDeckStore((s) => s.ancestryName)
  const setAncestry = useDeckStore((s) => s.setAncestry)

  const [focusedId, setFocusedId] = useState<string | null>(ancestryName ?? ancestries[0]?.name ?? null)
  const [showCard, setShowCard] = useState(false)

  // Auto-select first item on mount for faster testing
  useEffect(() => {
    if (!ancestryName && ancestries[0]) setAncestry(ancestries[0].name)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const pickerItems: PickerItem[] = ancestries.map((ancestry) => ({
    id: ancestry.name,
    name: ancestry.name,
    illustrationSrc: `${BASE_URL}images/cards/ancestries/${kebabCase(ancestry.name)}.avif`,
  }))

  const handleFocus = (id: string) => {
    setFocusedId(id)
    setAncestry(id)
  }

  const handleConfirm = () => {
    if (ancestryName) onNext()
  }

  const focusedAncestry = ancestries.find((a) => a.name === focusedId)

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
      selectedIds={ancestryName ? [ancestryName] : []}
      onFocus={handleFocus}
      onBack={onBack}
      onConfirm={handleConfirm}
      canConfirm={!!ancestryName}
    >
      {focusedAncestry && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={goldTitleStyle}>
              {focusedAncestry.name}
            </h2>
            <CardPreviewButton onClick={() => setShowCard(true)} />
          </div>
          <Separator text="Ancestry" />
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
              <FormatText text={showFullInfo ? focusedAncestry.description : `${focusedAncestry.description.split('. ')[0]}.`} />
            </div>
            {showFullInfo ? (
              focusedAncestry.feats.map((f) => (
                <div key={f.name} style={{ marginTop: 8 }}>
                  <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                    {f.name}
                  </span>
                  <div style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: textShadowWarm, margin: '4px 0 0' }}>
                    <FormatText text={f.text} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                {focusedAncestry.feats.map((f) => (
                  <span key={f.name} style={{
                    ...typeMicro,
                    color: goldDark,
                    background: goldDarkAlpha(0.1),
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}>
                    {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </FullBleedPicker>

    {showCard && focusedAncestry && (
      <CardZoom layoutId={`preview-${focusedAncestry.name}`} onClose={() => setShowCard(false)}>
        <AncestryCard ancestry={focusedAncestry} />
      </CardZoom>
    )}
    </>
  )
}
