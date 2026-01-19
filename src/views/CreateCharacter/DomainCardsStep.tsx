import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Sheet'
import { wizardLevel1Cards, getWizardCardCount } from '../../data/srd'
import type { DomainCard, WizardSubclass } from '../../types/character'

interface DomainCardsStepProps {
  subclass: WizardSubclass
  selected: DomainCard[]
  onSelect: (cards: DomainCard[]) => void
  onNext: () => void
  onBack: () => void
}

export function DomainCardsStep({
  subclass,
  selected,
  onSelect,
  onNext,
  onBack,
}: DomainCardsStepProps) {
  const [detailCard, setDetailCard] = useState<DomainCard | null>(null)
  const requiredCount = getWizardCardCount(subclass)

  const toggleCard = (card: DomainCard) => {
    const isSelected = selected.some((c) => c.name === card.name)
    if (isSelected) {
      onSelect(selected.filter((c) => c.name !== card.name))
    } else if (selected.length < requiredCount) {
      onSelect([...selected, card])
    }
  }

  const getDomainColor = (domain: string) => {
    return domain === 'Codex'
      ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
      : 'bg-amber-100 text-amber-800 border-amber-200'
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Choose Domain Cards</h2>
        <p className="text-gray-600 text-sm mt-1">
          Select {requiredCount} level 1 cards from Codex or Splendor domains.
        </p>
        <div className="mt-2 text-sm">
          <span
            className={`font-medium ${
              selected.length === requiredCount ? 'text-green-600' : 'text-ios-blue'
            }`}
          >
            {selected.length} / {requiredCount} selected
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20 space-y-3">
        {wizardLevel1Cards.map((card) => {
          const isSelected = selected.some((c) => c.name === card.name)
          const isDisabled = !isSelected && selected.length >= requiredCount

          return (
            <Card
              key={card.name}
              selected={isSelected}
              onTap={() => !isDisabled && toggleCard(card)}
              padding="md"
              className={isDisabled ? 'opacity-50' : ''}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{card.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getDomainColor(
                        card.domain
                      )}`}
                    >
                      {card.domain}
                    </span>
                    <span className="text-xs text-gray-500">{card.type}</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDetailCard(card)
                  }}
                  className="w-6 h-6 rounded-full bg-ios-gray-light flex items-center justify-center text-ios-gray text-sm"
                >
                  i
                </motion.button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{card.text}</p>
            </Card>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-ios-separator flex gap-3">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={selected.length !== requiredCount}
          className="flex-1"
        >
          Continue
        </Button>
      </div>

      {detailCard && (
        <Sheet
          open={!!detailCard}
          onOpenChange={() => setDetailCard(null)}
          title={detailCard.name}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm px-3 py-1 rounded-full border ${getDomainColor(
                  detailCard.domain
                )}`}
              >
                {detailCard.domain}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {detailCard.type}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Level {detailCard.level}
              </span>
              {parseInt(detailCard.recall) > 0 && (
                <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Recall {detailCard.recall}
                </span>
              )}
            </div>

            <p className="text-gray-700 whitespace-pre-wrap">{detailCard.text}</p>

            <Button
              onClick={() => {
                toggleCard(detailCard)
                setDetailCard(null)
              }}
              className="w-full"
              disabled={
                !selected.some((c) => c.name === detailCard.name) &&
                selected.length >= requiredCount
              }
            >
              {selected.some((c) => c.name === detailCard.name)
                ? 'Remove Card'
                : 'Select Card'}
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  )
}
