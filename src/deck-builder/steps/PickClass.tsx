import { useState, useEffect } from 'react'
import { FullBleedPicker, type PickerItem, type HeroMode } from '../components/FullBleedPicker'
import { FormatText } from '../../ui/FormatText'
import { typeTitle, typeSubtitle, typeBody, goldGradientStyle, goldSeparatorLeft, goldSeparatorRight } from '../../ui/typography'
import { DOMAIN_COLORS_MUTED } from '../../cards/domain-colors'
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
  Warrior: 'reapers-strike',
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

/** Primary domain for each class — used for feature block tinting */
const CLASS_DOMAIN: Record<string, string> = {
  Guardian: 'Valor',
  Warrior: 'Blade',
  Sorcerer: 'Arcana',
  Rogue: 'Midnight',
  Bard: 'Grace',
  Druid: 'Sage',
  Ranger: 'Bone',
  Seraph: 'Splendor',
  Wizard: 'Codex',
}

/** Hex to rgba helper */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
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

  // Auto-select first item on mount for faster testing
  useEffect(() => {
    if (!selectedClass && classes[0]) setClass(classes[0].name)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      {focusedClass && (() => {
        const domain = CLASS_DOMAIN[focusedClass.name] ?? 'Valor'
        const muted = DOMAIN_COLORS_MUTED[domain] ?? '#8d3700'

        const glowMask = [
          'linear-gradient(to bottom, transparent, black 8%, black 88%, transparent)',
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        ].join(', ')

        return (
          <div
            className="picker-info-column"
            style={{
              background: `radial-gradient(ellipse 140% 120% at 50% 20%, ${hexToRgba(muted, 1)} 0%, ${hexToRgba(muted, 0.5)} 45%, transparent 85%)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              width: '100%',
              /* Extend up past the info area with negative margin + extra top padding */
              marginTop: -40,
              padding: '56px 24px 12px',
              maxHeight: '55vh',
              overflowY: 'auto',
              maskImage: glowMask,
              WebkitMaskImage: glowMask,
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            } as React.CSSProperties}
          >
            <h2 style={{
              ...typeTitle,
              fontSize: 36,
              fontWeight: 400,
              ...goldGradientStyle,
              margin: 0,
              lineHeight: 1,
              textAlign: 'center',
              width: '100%',
            }}>
              {focusedClass.name}
            </h2>
            <Separator text={`${focusedClass.domain_1} · ${focusedClass.domain_2}`} />

            <div style={{
              ...typeBody,
              color: 'rgba(212,207,199,0.9)',
              textShadow: '0px 1px 1px #4d381e',
              textAlign: 'left',
              margin: 0,
            }}>
              <FormatText text={showFullInfo ? focusedClass.description : `${focusedClass.description.split('. ')[0]}.`} />
            </div>

            {/* Hope Feature */}
            <div style={{ marginTop: 8, borderTop: `1px solid ${hexToRgba(muted, 0.4)}`, paddingTop: 8 }}>
              <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                {focusedClass.hope_feat_name}
              </span>
              <div style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: '0px 1px 1px #4d381e', margin: '4px 0 0', textAlign: 'left' }}>
                <FormatText text={focusedClass.hope_feat_text} />
              </div>
            </div>

            {/* Class Feats */}
            {focusedClass.class_feats.map((feat, i) => (
              <div key={i} style={{ marginTop: 8, borderTop: `1px solid ${hexToRgba(muted, 0.4)}`, paddingTop: 8 }}>
                <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                  {feat.name}
                </span>
                <div style={{ ...typeBody, color: 'rgba(212,207,199,0.9)', textShadow: '0px 1px 1px #4d381e', margin: '4px 0 0', textAlign: 'left' }}>
                  <FormatText text={feat.text} />
                </div>
              </div>
            ))}
          </div>
        )
      })()}
    </FullBleedPicker>

    {/* Dev toggles */}
    {showHeroTest && (
      <div style={{ position: 'fixed', top: 52, right: 12, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          onClick={cycleHeroMode}
          style={{
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
      </div>
    )}
    </>
  )
}
