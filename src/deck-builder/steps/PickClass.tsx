import { useState } from 'react'
import { FullBleedPicker, type PickerItem, type HeroMode } from '../components/FullBleedPicker'
import { FormatText } from '../../ui/FormatText'
import { typeTitle, typeSubtitle, typeBody, goldGradientStyle, goldSeparatorLeft, goldSeparatorRight } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { classes } from '../../data/srd'

const BASE_URL = import.meta.env.BASE_URL

const HERO_MODES: HeroMode[] = ['position', 'blur-fill', 'contain-blur']
const HERO_MODE_LABELS: Record<HeroMode, string> = {
  'position': 'A: Position',
  'blur-fill': 'B: Blur Fill',
  'contain-blur': 'C: Contain',
}

/** Per-class object-position for Mode A ("Position Map") */
const CLASS_ART_POSITION: Record<string, string> = {
  Guardian: 'center',
  Sorcerer: 'top',
  Warrior: 'center',
  Druid: 'center 30%',
  Bard: 'top',
  Wizard: 'center 40%',
  Rogue: 'top',
  Ranger: 'center',
  Seraph: 'center 30%',
}

/** AI content-aware filled covers (override domain card art when available) */
const CLASS_COVER: Record<string, string> = {
  Sorcerer: 'arcana-touched',
}

/** Hand-picked domain card artwork for each class splash image */
const CLASS_ART: Record<string, string> = {
  Guardian: 'valor-touched',
  Sorcerer: 'arcana-touched',
  Warrior: 'reapers-strike',
  Druid: 'conjure-swarm',
  Bard: 'grace-touched',
  Wizard: 'book-of-vagras',
  Rogue: 'midnight-spirit',
  Ranger: 'cruel-precision',
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

const featureBlockStyle: React.CSSProperties = {
  marginTop: 12,
  padding: '10px 14px',
  borderRadius: 10,
  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.15) 100%)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08), inset 0 -1px 1px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.2)',
  border: '1px solid rgba(231,186,144,0.12)',
}

interface StepProps {
  onBack?: () => void
  onNext: () => void
}

export function PickClass({ onNext }: StepProps) {
  const params = new URLSearchParams(window.location.search)
  const showFullInfo = params.has('fullinfo')
  const showHeroTest = params.has('herotest') || import.meta.env.DEV
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const setClass = useDeckStore((s) => s.setClass)

  const [focusedId, setFocusedId] = useState<string | null>(selectedClass ?? classes[0]?.name ?? null)
  const [heroMode, setHeroMode] = useState<HeroMode>('position')

  const pickerItems: PickerItem[] = classes.map((cls) => ({
    id: cls.name,
    name: cls.name,
    illustrationSrc: CLASS_COVER[cls.name]
      ? `${BASE_URL}images/cards/covers/${CLASS_COVER[cls.name]}.png`
      : `${BASE_URL}images/cards/domains/${CLASS_ART[cls.name] ?? 'unyielding-armor'}.avif`,
    objectPosition: CLASS_ART_POSITION[cls.name],
  }))

  const handleFocus = (id: string) => {
    setFocusedId(id)
    setClass(id)
  }

  const handleConfirm = () => {
    if (selectedClass) onNext()
  }

  const focusedClass = classes.find((c) => c.name === focusedId)

  const cycleHeroMode = () => {
    const idx = HERO_MODES.indexOf(heroMode)
    setHeroMode(HERO_MODES[(idx + 1) % HERO_MODES.length])
  }

  return (
    <>
    <FullBleedPicker
      currentStep={0}
      items={pickerItems}
      focusedId={focusedId}
      selectedIds={selectedClass ? [selectedClass] : []}
      onFocus={handleFocus}
      onConfirm={handleConfirm}
      canConfirm={!!selectedClass}
      heroMode={heroMode}
    >
      {focusedClass && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <h2 style={{
            ...typeTitle,
            fontSize: 36,
            fontWeight: 400,
            ...goldGradientStyle,
            margin: 0,
            lineHeight: 1,
          }}>
            {focusedClass.name}
          </h2>
          <Separator text={`${focusedClass.domain_1} · ${focusedClass.domain_2}`} />
          <div style={{
            maxHeight: '40vh',
            overflowY: 'auto',
            maskImage: 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)',
          }}>
            <div style={{
              ...typeBody,
              color: 'rgba(212,207,199,0.9)',
              textShadow: '0px 1px 1px #4d381e',
              textAlign: 'center',
              margin: 0,
            }}>
              <FormatText text={showFullInfo ? focusedClass.description : `${focusedClass.description.split('. ')[0]}.`} />
            </div>
            {/* Hope Feature */}
            <div style={featureBlockStyle}>
              <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                {focusedClass.hope_feat_name}
              </span>
              <div style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: '0px 1px 1px #4d381e', margin: '4px 0 0', textAlign: 'center' }}>
                <FormatText text={focusedClass.hope_feat_text} />
              </div>
            </div>
            {/* Class Feats */}
            {focusedClass.class_feats.map((feat, i) => (
              <div key={i} style={featureBlockStyle}>
                <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                  {feat.name}
                </span>
                <div style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: '0px 1px 1px #4d381e', margin: '4px 0 0', textAlign: 'center' }}>
                  <FormatText text={feat.text} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </FullBleedPicker>

    {/* Dev toggle: hero image mode */}
    {showHeroTest && (
      <button
        onClick={cycleHeroMode}
        style={{
          position: 'fixed',
          top: 52,
          right: 12,
          zIndex: 9999,
          padding: '4px 10px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          fontSize: 11,
          fontFamily: 'system-ui, sans-serif',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {HERO_MODE_LABELS[heroMode]}
      </button>
    )}
    </>
  )
}
