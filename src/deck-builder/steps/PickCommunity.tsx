import { useState } from 'react'
import { FullBleedPicker, type PickerItem } from '../components/FullBleedPicker'
import { typeTitle, typeSubtitle, typeBody, typeMicro, goldGradientStyle, goldDark, goldDarkAlpha, goldSeparatorLeft, goldSeparatorRight } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { communities } from '../../data/srd'

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

export function PickCommunity({ onBack, onNext }: StepProps) {
  const showFullInfo = new URLSearchParams(window.location.search).has('fullinfo')
  const communityName = useDeckStore((s) => s.communityName)
  const setCommunity = useDeckStore((s) => s.setCommunity)

  const [focusedId, setFocusedId] = useState<string | null>(communityName ?? communities[0]?.name ?? null)

  const pickerItems: PickerItem[] = communities.map((community) => ({
    id: community.name,
    name: community.name,
    illustrationSrc: `${BASE_URL}images/cards/communities/${kebabCase(community.name)}.avif`,
  }))

  const handleFocus = (id: string) => {
    setFocusedId(id)
    setCommunity(id)
  }

  const handleConfirm = () => {
    if (communityName) onNext()
  }

  const focusedCommunity = communities.find((c) => c.name === focusedId)

  const goldTitleStyle: React.CSSProperties = {
    ...typeTitle,
    fontSize: 36,
    fontWeight: 400,
    ...goldGradientStyle,
    margin: 0,
    lineHeight: 1,
  }

  return (
    <FullBleedPicker
      title="Community"
      items={pickerItems}
      focusedId={focusedId}
      selectedIds={communityName ? [communityName] : []}
      onFocus={handleFocus}
      onBack={onBack}
      onConfirm={handleConfirm}
      canConfirm={!!communityName}
      prevStepLabel="Ancestry"
      nextStepLabel="Equipment"
    >
      {focusedCommunity && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <h2 style={goldTitleStyle}>
            {focusedCommunity.name}
          </h2>
          <Separator text="Community" />
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
              {showFullInfo ? focusedCommunity.description : `${focusedCommunity.description.split('. ')[0]}.`}
            </p>
            {showFullInfo ? (
              focusedCommunity.feats.map((f) => (
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
                {focusedCommunity.feats.map((f) => (
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
  )
}
