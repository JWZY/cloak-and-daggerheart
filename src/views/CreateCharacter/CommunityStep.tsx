import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { HorizontalCardRail } from '../../components/ui/HorizontalCardRail'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Sheet'
import { communities } from '../../data/srd'
import type { Community } from '../../types/character'

interface CommunityStepProps {
  selected: Community | undefined
  onSelect: (community: Community) => void
}

export function CommunityStep({ selected, onSelect }: CommunityStepProps) {
  const [detailCommunity, setDetailCommunity] = useState<Community | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-glass-primary">Choose Your Community</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Your community shaped who you are and grants unique social abilities.
        </p>
      </div>

      {/* Horizontal Card Rail */}
      <HorizontalCardRail
        items={communities}
        selectedId={selected?.name}
        onSelect={onSelect}
        getId={(c) => c.name}
        cardWidth="md"
        renderContent={(community, isSelected) => (
          <div className="flex flex-col h-full min-h-[80px]">
            <span className={`font-medium ${isSelected ? 'text-white' : 'text-glass-primary'}`}>
              {community.name}
            </span>
            <p className="text-glass-muted text-xs mt-1 line-clamp-2">
              {community.description.split('.')[0]}.
            </p>
          </div>
        )}
        renderActions={(community) => (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setDetailCommunity(community)
            }}
            className="lg-button w-6 h-6 flex items-center justify-center"
            style={{ '--lg-button-size': '24px' } as React.CSSProperties}
          >
            <Info size={12} />
          </motion.button>
        )}
      />

      {/* Selected Community Detail Panel */}
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

            {selected.note && (
              <p className="text-glass-muted text-sm italic mb-4">{selected.note}</p>
            )}

            <h4 className="text-sm font-semibold text-glass-primary mb-2">Community Feat</h4>
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
        {detailCommunity && (
          <Sheet
            open={!!detailCommunity}
            onOpenChange={() => setDetailCommunity(null)}
            title={detailCommunity.name}
            variant="glass"
          >
            <div className="space-y-4">
              <p className="text-glass-secondary text-sm">{detailCommunity.description}</p>

              {detailCommunity.note && (
                <p className="text-glass-muted text-sm italic">{detailCommunity.note}</p>
              )}

              <div>
                <h4 className="font-semibold text-glass-primary mb-2">Community Feat</h4>
                <div className="space-y-3">
                  {detailCommunity.feats.map((feat) => (
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
                  onSelect(detailCommunity)
                  setDetailCommunity(null)
                }}
                variant="glass-primary"
                className="w-full"
              >
                Select {detailCommunity.name}
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  )
}
