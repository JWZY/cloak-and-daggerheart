import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Sheet'
import { communities } from '../../data/srd'
import type { Community } from '../../types/character'

interface CommunityStepProps {
  selected: Community | undefined
  onSelect: (community: Community) => void
  onNext: () => void
  onBack: () => void
}

export function CommunityStep({ selected, onSelect, onNext, onBack }: CommunityStepProps) {
  const [detailCommunity, setDetailCommunity] = useState<Community | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Choose Your Community</h2>
        <p className="text-gray-600 text-sm mt-1">
          Your community shaped who you are and grants unique social abilities.
        </p>
      </div>

      <div className="flex-1 overflow-auto pb-20">
        <div className="grid grid-cols-2 gap-3">
          {communities.map((community) => (
            <Card
              key={community.name}
              selected={selected?.name === community.name}
              onTap={() => onSelect(community)}
              padding="sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{community.name}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDetailCommunity(community)
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-ios-separator flex gap-3">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} disabled={!selected} className="flex-1">
          Continue
        </Button>
      </div>

      <AnimatePresence>
        {detailCommunity && (
          <Sheet
            open={!!detailCommunity}
            onOpenChange={() => setDetailCommunity(null)}
            title={detailCommunity.name}
          >
            <div className="space-y-4">
              <p className="text-gray-700 text-sm">{detailCommunity.description}</p>

              {detailCommunity.note && (
                <p className="text-gray-500 text-sm italic">{detailCommunity.note}</p>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Community Feat</h4>
                <div className="space-y-3">
                  {detailCommunity.feats.map((feat) => (
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
                  onSelect(detailCommunity)
                  setDetailCommunity(null)
                }}
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
