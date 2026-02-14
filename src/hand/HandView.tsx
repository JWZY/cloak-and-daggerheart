import { useState, useCallback, useMemo, useEffect } from 'react'
import { BarChart3, Sword, StickyNote, X } from 'lucide-react'
import { HeroCard } from './HeroCard'
import { CardCarousel } from './CardCarousel'
import { StatBar } from './StatBar'
import { CollapsiblePanel } from './panels/CollapsiblePanel'
import { StatsPanel } from './panels/StatsPanel'
import { EquipmentPanel } from './panels/EquipmentPanel'
import { NotesPanel } from './panels/NotesPanel'
import { CardZoom } from '../cards/CardZoom'
import { SRDCard } from '../cards/SRDCard'
import { DomainCard } from '../cards/DomainCard'
import { InfoCard } from '../cards/InfoCard'
import { useCardZoom } from '../cards/useCardZoom'
import { subclassToCardProps, domainCardToProps, parseAbilityText, ancestryToInfoCardProps, communityToInfoCardProps } from '../data/card-mapper'
import { getSubclass, getClassForSubclass } from '../data/srd'
import { DOMAIN_COLORS } from '../cards/domain-colors'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

export interface HandViewProps {
  character: Character
}

type PanelId = 'stats' | 'equipment' | 'notes' | null

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

/**
 * Derive a subtle accent color from the character's primary domain.
 * School of Knowledge -> Codex blue, School of War -> Splendor gold.
 */
function getAccentColor(character: Character): string {
  const classData = getClassForSubclass(character.subclass)
  if (!classData) return '#d4af37' // fallback gold
  return DOMAIN_COLORS[classData.domain_1] ?? '#d4af37'
}

export function HandView({ character }: HandViewProps) {
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter)
  const { zoomedCard, openZoom, closeZoom } = useCardZoom()
  const [openPanel, setOpenPanel] = useState<PanelId>(null)
  const isDesktop = useIsDesktop()

  const accentColor = useMemo(() => getAccentColor(character), [character])

  const togglePanel = useCallback((panel: PanelId) => {
    setOpenPanel((prev) => (prev === panel ? null : panel))
  }, [])

  const handleHeroTap = useCallback(() => {
    openZoom('hero-card')
  }, [openZoom])

  const handleCardTap = useCallback(
    (cardName: string) => {
      if (cardName === 'ancestry' || cardName === 'community') {
        openZoom(cardName)
      } else {
        openZoom(`domain-${cardName}`)
      }
    },
    [openZoom]
  )

  // Shared panels content
  const panelsContent = (
    <div className="flex flex-col gap-2">
      <StatBar character={character} accentColor={accentColor} />

      <CollapsiblePanel
        title="Traits"
        icon={BarChart3}
        isOpen={openPanel === 'stats'}
        onToggle={() => togglePanel('stats')}
        accentColor={accentColor}
      >
        <StatsPanel character={character} />
      </CollapsiblePanel>

      <CollapsiblePanel
        title="Equipment"
        icon={Sword}
        isOpen={openPanel === 'equipment'}
        onToggle={() => togglePanel('equipment')}
        accentColor={accentColor}
      >
        <EquipmentPanel character={character} />
      </CollapsiblePanel>

      <CollapsiblePanel
        title="Notes"
        icon={StickyNote}
        isOpen={openPanel === 'notes'}
        onToggle={() => togglePanel('notes')}
        accentColor={accentColor}
      >
        <NotesPanel character={character} />
      </CollapsiblePanel>
    </div>
  )

  // Desktop domain cards grid (replaces carousel)
  const domainCardsGrid = (
    <div className="grid grid-cols-3 gap-3">
      {character.domainCards.map((card) => {
        const mapped = domainCardToProps(card)
        const bodyParts = parseAbilityText(mapped.bodyText)
        return (
          <div
            key={card.name}
            className="relative"
            style={{
              width: 360 * 0.5,
              height: 508 * 0.5,
              overflow: 'hidden',
              borderRadius: 10,
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
              <DomainCard
                {...mapped.props}
                scale={1}
                onClick={() => handleCardTap(card.name)}
              >
                {bodyParts.map((part, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {part.name && (
                      <>
                        <span className="font-bold">{part.name}:</span>{' '}
                      </>
                    )}
                    {part.text}
                  </p>
                ))}
              </DomainCard>
            </div>
          </div>
        )
      })}
    </div>
  )

  // Desktop ancestry + community row
  const infoCardsRow = (
    <div className="grid grid-cols-2 gap-3">
      <InfoCard
        {...ancestryToInfoCardProps(character.ancestry)}
        scale={0.5}
        onClick={() => handleCardTap('ancestry')}
      />
      <InfoCard
        {...communityToInfoCardProps(character.community)}
        scale={0.5}
        onClick={() => handleCardTap('community')}
      />
    </div>
  )

  // Zoom overlays (shared between mobile and desktop)
  const zoomOverlays = (
    <>
      {zoomedCard === 'hero-card' && (
        <CardZoom layoutId="hero-card" onClose={closeZoom}>
          <SRDCard
            {...subclassToCardProps(
              getSubclass(character.subclass),
              getClassForSubclass(character.subclass)!
            )}
          />
        </CardZoom>
      )}

      {zoomedCard?.startsWith('domain-') && (() => {
        const cardName = zoomedCard.replace('domain-', '')
        const card = character.domainCards.find((c) => c.name === cardName)
        if (!card) return null
        const mapped = domainCardToProps(card)
        const bodyParts = parseAbilityText(mapped.bodyText)
        return (
          <CardZoom layoutId={zoomedCard} onClose={closeZoom}>
            <DomainCard {...mapped.props}>
              {bodyParts.map((part, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {part.name && (
                    <>
                      <span className="font-bold">{part.name}:</span>{' '}
                    </>
                  )}
                  {part.text}
                </p>
              ))}
            </DomainCard>
          </CardZoom>
        )
      })()}

      {zoomedCard === 'ancestry' && (
        <CardZoom layoutId="ancestry" onClose={closeZoom}>
          <InfoCard {...ancestryToInfoCardProps(character.ancestry)} />
        </CardZoom>
      )}

      {zoomedCard === 'community' && (
        <CardZoom layoutId="community" onClose={closeZoom}>
          <InfoCard {...communityToInfoCardProps(character.community)} />
        </CardZoom>
      )}
    </>
  )

  return (
    <div
      className="relative"
      style={{
        height: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        background: '#03070d',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        ['--accent-color' as string]: accentColor,
        ['--accent-color-15' as string]: `${accentColor}26`,
        ['--accent-color-30' as string]: `${accentColor}4D`,
      }}
    >
      {/* Delete button - top right corner, themed as gold ghost */}
      <div className="absolute top-2 right-3 z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <button
          data-testid="delete-character"
          onClick={() => deleteCharacter(character.id)}
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{
            background: 'transparent',
            border: '1px solid rgba(231, 186, 144, 0.15)',
            color: '#e7ba90',
            minWidth: 44,
            minHeight: 44,
            opacity: 0.6,
          }}
        >
          <X size={14} />
        </button>
      </div>

      {isDesktop ? (
        /* ===== DESKTOP: Two-column layout ===== */
        <div
          className="mx-auto px-6 py-4"
          style={{ maxWidth: 1200 }}
        >
          <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Left column: character name + hero card, sticky */}
            <div className="sticky top-0 self-start flex flex-col items-center justify-center pt-8" style={{ minHeight: '100dvh' }}>
              {/* Character name header */}
              <div className="flex flex-col items-center pb-4">
                <span
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 28,
                    fontWeight: 500,
                    fontVariant: 'small-caps',
                    background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textAlign: 'center',
                  }}
                >
                  {character.name}
                </span>
                <span
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 14,
                    fontWeight: 600,
                    fontVariant: 'small-caps',
                    color: '#e7ba90',
                    letterSpacing: '0.06em',
                    textAlign: 'center',
                  }}
                >
                  {character.subclass} Wizard
                </span>
              </div>

              {/* Hero card at 0.85 scale */}
              <div style={{ width: 360 * 0.85, height: 508 * 0.85, position: 'relative', flexShrink: 0 }}>
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                  <HeroCard subclass={character.subclass} onTap={handleHeroTap} />
                </div>
              </div>
            </div>

            {/* Right column: cards grid + stats + panels */}
            <div className="flex flex-col gap-6 py-8">
              {/* Domain cards in 3-column grid */}
              {domainCardsGrid}

              {/* Ancestry + Community in 2-column row */}
              {infoCardsRow}

              {/* Stats and panels */}
              <div className="px-0">
                {panelsContent}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ===== MOBILE: Single-column scrollable layout ===== */
        <div className="flex flex-col">
          {/* Character name header */}
          <div className="flex flex-col items-center pt-2 pb-1">
            <span
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 24,
                fontWeight: 500,
                fontVariant: 'small-caps',
                background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
              }}
            >
              {character.name}
            </span>
            <span
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 12,
                fontWeight: 600,
                fontVariant: 'small-caps',
                color: '#e7ba90',
                letterSpacing: '0.06em',
                textAlign: 'center',
              }}
            >
              {character.subclass} Wizard
            </span>
          </div>

          {/* Hero Card — natural height, centered */}
          <div className="flex items-center justify-center px-4 py-3">
            <div style={{ width: 360 * 0.75, height: 508 * 0.75, position: 'relative', flexShrink: 0 }}>
              <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left' }}>
                <HeroCard subclass={character.subclass} onTap={handleHeroTap} />
              </div>
            </div>
          </div>

          {/* Card Carousel */}
          <div className="py-2">
            <CardCarousel character={character} onCardTap={handleCardTap} />
          </div>

          {/* Stats + Panels */}
          <div className="px-3 pb-3 pt-1">
            {panelsContent}
          </div>
        </div>
      )}

      {/* Card Zoom Overlays (shared) */}
      {zoomOverlays}
    </div>
  )
}
