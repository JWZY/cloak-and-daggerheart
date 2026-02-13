import { AnimatePresence } from 'framer-motion'
import { getAllAncestryCards } from '../../data/card-mapper'
import { InfoCard } from '../../cards/InfoCard'
import { CardSelector } from '../../cards/CardSelector'
import { CardZoom } from '../../cards/CardZoom'
import { useCardZoom } from '../../cards/useCardZoom'
import { SectionHeader } from '../../ui/SectionHeader'
import { useDeckStore } from '../../store/deck-store'

export function PickAncestry() {
  const ancestryName = useDeckStore((s) => s.ancestryName)
  const setAncestry = useDeckStore((s) => s.setAncestry)
  const ancestryCards = getAllAncestryCards()
  const { zoomedCard, openZoom, closeZoom } = useCardZoom()

  const handleTap = (name: string) => {
    if (ancestryName === name) {
      openZoom(`ancestry-${name}`)
    } else {
      setAncestry(name)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="w-full max-w-xs mb-2 px-4">
        <SectionHeader>Choose Your Ancestry</SectionHeader>
      </h2>
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(231, 186, 144, 0.5)',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        Tap to select — tap again to zoom
      </p>

      {/* Horizontal scrollable card rail */}
      <div
        className="flex gap-3 overflow-x-auto w-full px-4 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {ancestryCards.map((cardProps) => {
          const isSelected = ancestryName === cardProps.title
          const isDimmed = ancestryName !== null && !isSelected

          return (
            <div key={cardProps.title} className="snap-center shrink-0" style={{ width: 360 * 0.52, height: 508 * 0.52 }}>
              <div style={{ transform: 'scale(0.52)', transformOrigin: 'top left' }}>
                <CardSelector
                  selected={isSelected}
                  dimmed={isDimmed}
                  onSelect={() => handleTap(cardProps.title)}
                >
                  <InfoCard {...cardProps} />
                </CardSelector>
              </div>
            </div>
          )
        })}
      </div>

      {/* Card Zoom */}
      <AnimatePresence>
        {zoomedCard?.startsWith('ancestry-') && (() => {
          const name = zoomedCard.replace('ancestry-', '')
          const cardProps = ancestryCards.find((c) => c.title === name)
          if (!cardProps) return null
          return (
            <CardZoom layoutId={zoomedCard} onClose={closeZoom}>
              <InfoCard {...cardProps} />
            </CardZoom>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
