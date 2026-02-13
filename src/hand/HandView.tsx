import { useState, useCallback, useMemo } from 'react'
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
import { useCardZoom } from '../cards/useCardZoom'
import { subclassToCardProps, domainCardToProps, parseAbilityText } from '../data/card-mapper'
import { getSubclass, getClassForSubclass } from '../data/srd'
import { DOMAIN_COLORS } from '../cards/domain-colors'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

export interface HandViewProps {
  character: Character
}

type PanelId = 'stats' | 'equipment' | 'notes' | null

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

  const accentColor = useMemo(() => getAccentColor(character), [character])

  const togglePanel = useCallback((panel: PanelId) => {
    setOpenPanel((prev) => (prev === panel ? null : panel))
  }, [])

  const handleHeroTap = useCallback(() => {
    openZoom('hero-card')
  }, [openZoom])

  const handleDomainCardTap = useCallback(
    (cardName: string) => {
      openZoom(`domain-${cardName}`)
    },
    [openZoom]
  )

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        height: '100dvh',
        background: '#03070d',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        // Expose accent color as CSS variable for children
        ['--accent-color' as string]: accentColor,
        ['--accent-color-15' as string]: `${accentColor}26`,
        ['--accent-color-30' as string]: `${accentColor}4D`,
      }}
    >
      {/* Delete button - top right corner, themed as gold ghost */}
      <div className="absolute top-2 right-3 z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <button
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

      {/* Zone 1: Hero Card — flex-1 to fill remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-4 pt-2 pb-2 overflow-hidden">
        {/* Sized wrapper constrains layout to the scaled card dimensions */}
        <div style={{ width: 360 * 0.65, height: 508 * 0.65, position: 'relative', flexShrink: 0 }}>
          <div style={{ transform: 'scale(0.65)', transformOrigin: 'top left' }}>
            <HeroCard character={character} onTap={handleHeroTap} />
          </div>
        </div>
      </div>

      {/* Zone 2: Card Carousel — fixed height, overflow hidden */}
      <div className="shrink-0" style={{ height: 180 }}>
        <CardCarousel character={character} onCardTap={handleDomainCardTap} />
      </div>

      {/* Zone 3: Stats + Panels — scrollable bottom zone */}
      <div className="shrink-0 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-2">
          {/* Stat bar */}
          <StatBar character={character} accentColor={accentColor} />

          {/* Collapsible panels (accordion) */}
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
      </div>

      {/* Card Zoom Overlay */}
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

      {/* Domain card zoom */}
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
    </div>
  )
}
