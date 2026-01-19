import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Sheet'
import { ancestries } from '../../data/srd'
import type { Ancestry } from '../../types/character'

interface AncestryStepProps {
  selected: Ancestry | undefined
  onSelect: (ancestry: Ancestry) => void
  onNext: () => void
}

export function AncestryStep({ selected, onSelect, onNext }: AncestryStepProps) {
  const [detailAncestry, setDetailAncestry] = useState<Ancestry | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Choose Your Ancestry</h2>
        <p className="text-gray-600 text-sm mt-1">
          Your ancestry determines your physical traits and unique abilities.
        </p>
      </div>

      <div className="flex-1 overflow-auto pb-20">
        <div className="grid grid-cols-2 gap-3">
          {ancestries.map((ancestry) => (
            <Card
              key={ancestry.name}
              selected={selected?.name === ancestry.name}
              onTap={() => onSelect(ancestry)}
              padding="sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{ancestry.name}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDetailAncestry(ancestry)
                  }}
                  className="w-6 h-6 rounded-full bg-ios-gray-light flex items-center justify-center text-ios-gray text-sm"
                >
                  i
                </motion.button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-ios-separator">
        <Button onClick={onNext} disabled={!selected} className="w-full">
          Continue
        </Button>
      </div>

      <AnimatePresence>
        {detailAncestry && (
          <Sheet
            open={!!detailAncestry}
            onOpenChange={() => setDetailAncestry(null)}
            title={detailAncestry.name}
          >
            <div className="space-y-4">
              <p className="text-gray-700 text-sm">{detailAncestry.description}</p>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ancestry Feats</h4>
                <div className="space-y-3">
                  {detailAncestry.feats.map((feat) => (
                    <div
                      key={feat.name}
                      className="p-3 bg-ios-gray-light rounded-xl"
                    >
                      <h5 className="font-medium text-gray-900">{feat.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{feat.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  onSelect(detailAncestry)
                  setDetailAncestry(null)
                }}
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
