import { useState } from 'react'
import { FullBleedPicker, type PickerItem } from '../components/FullBleedPicker'
import { typeTitle, typeSubtitle, typeBody, goldGradient } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { classes } from '../../data/srd'

const BASE_URL = import.meta.env.BASE_URL

/** Hand-picked domain card artwork for each class splash image */
const CLASS_ART: Record<string, string> = {
  Guardian: 'unyielding-armor',
  Sorcerer: 'eclipse',
  Warrior: 'reapers-strike',
  Druid: 'sage-touched',
  Bard: 'grace-touched',
  Wizard: 'codex-touched',
  Rogue: 'midnight-spirit',
  Ranger: 'natural-familiar',
  Seraph: 'hold-the-line',
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
  onBack?: () => void
  onNext: () => void
}

export function PickClass({ onNext }: StepProps) {
  const showFullInfo = new URLSearchParams(window.location.search).has('fullinfo')
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const setClass = useDeckStore((s) => s.setClass)

  const [focusedId, setFocusedId] = useState<string | null>(selectedClass ?? classes[0]?.name ?? null)

  const pickerItems: PickerItem[] = classes.map((cls) => ({
    id: cls.name,
    name: cls.name,
    illustrationSrc: `${BASE_URL}images/cards/domains/${CLASS_ART[cls.name] ?? 'unyielding-armor'}.avif`,
  }))

  const handleFocus = (id: string) => {
    setFocusedId(id)
    setClass(id)
  }

  const handleConfirm = () => {
    if (selectedClass) onNext()
  }

  const focusedClass = classes.find((c) => c.name === focusedId)

  return (
    <FullBleedPicker
      title="Class"
      items={pickerItems}
      focusedId={focusedId}
      selectedIds={selectedClass ? [selectedClass] : []}
      onFocus={handleFocus}
      onConfirm={handleConfirm}
      canConfirm={!!selectedClass}
      nextStepLabel="Subclass"
    >
      {focusedClass && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <h2 style={{
            ...typeTitle,
            fontSize: 36,
            fontWeight: 400,
            background: goldGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            lineHeight: 1,
            textShadow: 'none',
          }}>
            {focusedClass.name}
          </h2>
          <Separator text={`${focusedClass.domain_1} · ${focusedClass.domain_2}`} />
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
              {showFullInfo ? focusedClass.description : `${focusedClass.description.split('. ')[0]}.`}
            </p>
            {showFullInfo && (
              <>
                <div style={{ marginTop: 8 }}>
                  <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                    {focusedClass.hope_feat_name}
                  </span>
                  <p style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: '0px 1px 1px #4d381e', margin: '4px 0 0' }}>
                    {focusedClass.hope_feat_text}
                  </p>
                </div>
                {focusedClass.class_feats.map((feat, i) => (
                  <div key={i} style={{ marginTop: 8 }}>
                    <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                      {feat.name}
                    </span>
                    <p style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: '0px 1px 1px #4d381e', margin: '4px 0 0' }}>
                      {feat.text}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </FullBleedPicker>
  )
}
