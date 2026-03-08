import { useState, useCallback, useMemo, useEffect } from 'react'
import { typeTitle, typeSubtitle, goldGradient } from '../ui/typography'
import { BarChart3, Sword, StickyNote, X } from 'lucide-react'
import { LevelUpWizard } from '../level-up/LevelUpWizard'
import { HeroCard } from './HeroCard'
import { CardCarousel } from './CardCarousel'
import { StatBar } from './StatBar'
import { StatsPanel } from './panels/StatsPanel'
import { EquipmentPanel } from './panels/EquipmentPanel'
import { NotesPanel } from './panels/NotesPanel'
import { CardZoom } from '../cards/CardZoom'
import { SRDCard } from '../cards/SRDCard'
import { DomainCard } from '../cards/DomainCard'
import { AncestryCard } from '../cards/AncestryCard'
import { CommunityCard } from '../cards/CommunityCard'
import { ScaledCard } from '../cards/ScaledCard'
import { cardScale } from '../cards/card-tokens'
import { useCardZoom } from '../cards/useCardZoom'
import { subclassToCardProps, domainCardToProps, parseAbilityText } from '../data/card-mapper'
import { getSubclassByName, getClassForSubclass } from '../data/srd'
import { DOMAIN_COLORS } from '../cards/domain-colors'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

export interface HandViewProps {
  character: Character
}

function InlineSection({ title, icon: Icon, children }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 pb-2 mb-2" style={{ borderBottom: '1px solid var(--gold-muted)' }}>
        <Icon size={14} color="var(--gold-secondary)" />
        <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

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
  const [showLevelUp, setShowLevelUp] = useState(false)
  const isDesktop = useIsDesktop()

  const accentColor = useMemo(() => getAccentColor(character), [character])

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
    <div className="flex flex-col gap-4">
      <StatBar character={character} accentColor={accentColor} />

      <InlineSection title="Traits" icon={BarChart3}>
        <StatsPanel character={character} />
      </InlineSection>

      <InlineSection title="Equipment" icon={Sword}>
        <EquipmentPanel character={character} />
      </InlineSection>

      <InlineSection title="Notes" icon={StickyNote}>
        <NotesPanel character={character} />
      </InlineSection>
    </div>
  )

  // Desktop domain cards grid (replaces carousel)
  const domainCardsGrid = (
    <div className="grid grid-cols-3 gap-3">
      {character.domainCards.map((card) => {
        const mapped = domainCardToProps(card)
        const bodyParts = parseAbilityText(mapped.bodyText)
        return (
          <ScaledCard
            key={card.name}
            scale={0.5}
            style={{ overflow: 'hidden', borderRadius: 10 }}
          >
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
          </ScaledCard>
        )
      })}
    </div>
  )

  // Desktop ancestry + community row
  const infoCardsRow = (
    <div className="grid grid-cols-2 gap-3">
      <AncestryCard
        ancestry={character.ancestry}
        scale={0.5}
        onClick={() => handleCardTap('ancestry')}
      />
      <CommunityCard
        community={character.community}
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
              getSubclassByName(character.subclass),
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
          <AncestryCard ancestry={character.ancestry} />
        </CardZoom>
      )}

      {zoomedCard === 'community' && (
        <CardZoom layoutId="community" onClose={closeZoom}>
          <CommunityCard community={character.community} />
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
        background: 'var(--bg-page)',
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
            border: '1px solid var(--gold-muted)',
            color: 'var(--gold)',
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
                    ...typeTitle,
                    fontSize: 24,
                    background: goldGradient,
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
                    ...typeSubtitle,
                    color: 'var(--gold)',
                    textAlign: 'center',
                  }}
                >
                  {character.subclass} {character.class}
                </span>
              </div>

              {/* Level Up button (desktop) */}
              {character.level < 2 && (
                <div className="flex justify-center pb-4">
                  <button
                    onClick={() => setShowLevelUp(true)}
                    className="px-4 py-1.5 rounded-full text-sm transition-all"
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontWeight: 600,
                      fontVariant: 'small-caps',
                      letterSpacing: '0.06em',
                      background: 'linear-gradient(180deg, rgba(249,248,243,0.12) 0%, rgba(231,186,144,0.12) 100%)',
                      border: '1px solid var(--gold-muted)',
                      color: 'var(--gold)',
                    }}
                  >
                    Level Up
                  </button>
                </div>
              )}

              {/* Hero card at 0.85 scale */}
              <ScaledCard scale={cardScale.hero} style={{ flexShrink: 0 }}>
                <HeroCard subclass={character.subclass} onTap={handleHeroTap} />
              </ScaledCard>
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
                fontSize: 13,
                fontWeight: 600,
                fontVariant: 'small-caps',
                color: 'var(--gold)',
                letterSpacing: '0.06em',
                textAlign: 'center',
              }}
            >
              {character.subclass} {character.class}
            </span>
          </div>

          {/* Level Up button */}
          {character.level < 2 && (
            <div className="flex justify-center pb-2">
              <button
                onClick={() => setShowLevelUp(true)}
                className="px-4 py-1.5 rounded-full text-sm transition-all"
                style={{
                  ...typeSubtitle,
                  background: 'linear-gradient(180deg, rgba(249,248,243,0.12) 0%, rgba(231,186,144,0.12) 100%)',
                  border: '1px solid rgba(231, 186, 144, 0.3)',
                  color: '#e7ba90',
                }}
              >
                Level Up
              </button>
            </div>
          )}

          {/* Hero Card — natural height, centered */}
          <div className="flex items-center justify-center px-4 py-3">
            <ScaledCard scale={cardScale.large} style={{ flexShrink: 0 }}>
              <HeroCard subclass={character.subclass} onTap={handleHeroTap} />
            </ScaledCard>
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

      {/* Level Up Wizard Overlay */}
      {showLevelUp && (
        <LevelUpWizard
          character={character}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </div>
  )
}
