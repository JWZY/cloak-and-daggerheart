import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { HorizontalCardRail } from '../../components/ui/HorizontalCardRail'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Sheet'
import { ancestries } from '../../data/srd'
import type { Ancestry } from '../../types/character'

interface AncestryStepProps {
  selected: Ancestry | undefined
  onSelect: (ancestry: Ancestry) => void
}

export function AncestryStep({ selected, onSelect }: AncestryStepProps) {
  const [detailAncestry, setDetailAncestry] = useState<Ancestry | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-glass-primary">Choose Your Ancestry</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Your ancestry determines your physical traits and unique abilities.
        </p>
      </div>

      {/* Horizontal Card Rail */}
      <HorizontalCardRail
        items={ancestries}
        selectedId={selected?.name}
        onSelect={onSelect}
        getId={(a) => a.name}
        cardWidth="md"
        renderContent={(ancestry, isSelected) => (
          <div className="flex flex-col h-full min-h-[80px]">
            <span className={`font-medium ${isSelected ? 'text-white' : 'text-glass-primary'}`}>
              {ancestry.name}
            </span>
            <p className="text-glass-muted text-xs mt-1 line-clamp-2">
              {ancestry.description.split('.')[0]}.
            </p>
          </div>
        )}
        renderActions={(ancestry) => (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setDetailAncestry(ancestry)
            }}
            className="lg-button w-6 h-6 flex items-center justify-center"
            style={{ '--lg-button-size': '24px' } as React.CSSProperties}
          >
            <Info size={12} />
          </motion.button>
        )}
      />

      {/* Selected Ancestry Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mt-6 glass-strong rounded-2xl p-4"
          >
            <h3 className="text-lg font-bold text-glass-primary mb-2">{selected.name}</h3>
            <p className="text-glass-secondary text-sm mb-4">{selected.description}</p>

            <h4 className="text-sm font-semibold text-glass-primary mb-2">Ancestry Feats</h4>
            <div className="space-y-2">
              {selected.feats.map((feat) => (
                <div key={feat.name} className="glass-flat p-3">
                  <h5 className="font-medium text-glass-primary text-sm">{feat.name}</h5>
                  <p className="text-glass-muted text-xs mt-1">{feat.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Sheet */}
      <AnimatePresence>
        {detailAncestry && (
          <Sheet
            open={!!detailAncestry}
            onOpenChange={() => setDetailAncestry(null)}
            title={detailAncestry.name}
            variant="glass"
          >
            <div className="space-y-4">
              <p className="text-glass-secondary text-sm">{detailAncestry.description}</p>

              <div>
                <h4 className="font-semibold text-glass-primary mb-2">Ancestry Feats</h4>
                <div className="space-y-3">
                  {detailAncestry.feats.map((feat) => (
                    <div
                      key={feat.name}
                      className="p-3 glass-flat"
                    >
                      <h5 className="font-medium text-glass-primary">{feat.name}</h5>
                      <p className="text-sm text-glass-muted mt-1">{feat.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  onSelect(detailAncestry)
                  setDetailAncestry(null)
                }}
                variant="glass-primary"
                className="w-full"
              >
                Select {detailAncestry.name}
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  )
}
