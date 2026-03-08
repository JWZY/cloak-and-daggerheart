import { useState } from 'react'
import { FullBleedPicker, type PickerItem } from '../components/FullBleedPicker'
import { typeTitle, typeSubtitle, typeBody, typeMicro, goldGradient, goldDark } from '../../ui/typography'
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

export function PickAncestry({ onBack, onNext }: StepProps) {
  const showFullInfo = new URLSearchParams(window.location.search).has('fullinfo')
  const ancestryName = useDeckStore((s) => s.ancestryName)
  const setAncestry = useDeckStore((s) => s.setAncestry)

  const [focusedId, setFocusedId] = useState<string | null>(ancestryName ?? ancestries[0]?.name ?? null)

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
    background: goldGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    lineHeight: 1,
  }

  return (
    <FullBleedPicker
      title="Ancestry"
      items={pickerItems}
      focusedId={focusedId}
      selectedIds={ancestryName ? [ancestryName] : []}
      onFocus={handleFocus}
      onBack={onBack}
      onConfirm={handleConfirm}
      canConfirm={!!ancestryName}
      prevStepLabel="Domain Cards"
      nextStepLabel="Community"
    >
      {focusedAncestry && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <h2 style={goldTitleStyle}>
            {focusedAncestry.name}
          </h2>
          <Separator text="Ancestry" />
          <div style={{
            maxHeight: showFullInfo ? '40vh' : undefined,
            overflowY: showFullInfo ? 'auto' : undefined,
            maskImage: showFullInfo ? 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)' : undefined,
            WebkitMaskImage: showFullInfo ? 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)' : undefined,
          }}>
            <p style={{
              ...typeBody,
              color: 'rgba(212,207,199,0.9)',
              textShadow: '0px 1px 1px #4d381e',
              textAlign: 'center',
              margin: 0,
            }}>
              {showFullInfo ? focusedAncestry.description : `${focusedAncestry.description.split('. ')[0]}.`}
            </p>
            {showFullInfo ? (
              focusedAncestry.feats.map((f) => (
                <div key={f.name} style={{ marginTop: 8 }}>
                  <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                    {f.name}
                  </span>
                  <p style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: '0px 1px 1px #4d381e', margin: '4px 0 0' }}>
                    {f.text}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                {focusedAncestry.feats.map((f) => (
                  <span key={f.name} style={{
                    ...typeMicro,
                    color: goldDark,
                    background: 'rgba(231,186,144,0.1)',
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
  )
}
