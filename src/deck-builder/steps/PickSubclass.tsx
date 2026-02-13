import { AnimatePresence, motion } from 'framer-motion'
import { getWizardSubclassCards } from '../../data/card-mapper'
import { SRDCard } from '../../cards/SRDCard'
import { CardZoom } from '../../cards/CardZoom'
import { CardSelector } from '../../cards/CardSelector'
import { useCardZoom } from '../../cards/useCardZoom'
import { SectionHeader } from '../../ui/SectionHeader'
import { useDeckStore } from '../../store/deck-store'

export function PickSubclass() {
  const subclass = useDeckStore((s) => s.subclass)
  const setSubclass = useDeckStore((s) => s.setSubclass)
  const subclassCards = getWizardSubclassCards()
  const { zoomedCard, openZoom, closeZoom } = useCardZoom()

  const handleTap = (name: string) => {
    if (subclass === name) {
      openZoom(`subclass-${name}`)
    } else {
      setSubclass(name)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="w-full max-w-xs mb-4 px-4">
        <SectionHeader>Choose Your Subclass</SectionHeader>
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

      <div className="flex justify-center gap-4">
        {subclassCards.map((props) => {
          const layoutId = `subclass-${props.name}`
          const isSelected = subclass === props.name
          const isDimmed = subclass !== null && !isSelected

          return (
            <CardSelector
              key={props.name}
              selected={isSelected}
              dimmed={isDimmed}
              onSelect={() => handleTap(props.name)}
            >
              <motion.div layoutId={layoutId}>
                <SRDCard {...props} />
              </motion.div>
            </CardSelector>
          )
        })}
      </div>

      <AnimatePresence>
        {zoomedCard && (
          <CardZoom layoutId={zoomedCard} onClose={closeZoom}>
            {subclassCards
              .filter((p) => `subclass-${p.name}` === zoomedCard)
              .map((props) => (
                <SRDCard key={props.name} {...props} />
              ))}
          </CardZoom>
        )}
      </AnimatePresence>
    </div>
  )
}
