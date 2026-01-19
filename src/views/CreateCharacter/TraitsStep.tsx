import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import type { Traits, TraitName } from '../../types/character'

interface TraitsStepProps {
  traits: Traits | undefined
  onSelect: (traits: Traits) => void
  onNext: () => void
  onBack: () => void
}

const TRAIT_NAMES: TraitName[] = [
  'agility',
  'strength',
  'finesse',
  'instinct',
  'presence',
  'knowledge',
]

const TRAIT_DESCRIPTIONS: Record<TraitName, string> = {
  agility: 'Moving quickly and avoiding danger',
  strength: 'Physical power and endurance',
  finesse: 'Precision and delicate manipulation',
  instinct: 'Gut feelings and awareness',
  presence: 'Social influence and charisma',
  knowledge: 'Learning, memory, and reasoning',
}

// Available values to assign: -1, 0, 0, +1, +1, +2
const AVAILABLE_VALUES = [-1, 0, 0, 1, 1, 2]

export function TraitsStep({ traits, onSelect, onNext, onBack }: TraitsStepProps) {
  const [assignments, setAssignments] = useState<Record<TraitName, number | null>>({
    agility: traits?.agility ?? null,
    strength: traits?.strength ?? null,
    finesse: traits?.finesse ?? null,
    instinct: traits?.instinct ?? null,
    presence: traits?.presence ?? null,
    knowledge: traits?.knowledge ?? null,
  })

  const [availablePool, setAvailablePool] = useState<number[]>(() => {
    if (traits) {
      // If we have existing traits, calculate remaining pool
      const used = Object.values(traits)
      const pool = [...AVAILABLE_VALUES]
      used.forEach((v) => {
        const idx = pool.indexOf(v)
        if (idx !== -1) pool.splice(idx, 1)
      })
      return pool
    }
    return [...AVAILABLE_VALUES]
  })

  const isComplete = Object.values(assignments).every((v) => v !== null)

  const handleContinue = () => {
    if (isComplete) {
      onSelect(assignments as Traits)
      onNext()
    }
  }

  const assignValue = (trait: TraitName, value: number) => {
    const currentValue = assignments[trait]

    // If this trait already has a value, return it to the pool
    if (currentValue !== null) {
      setAvailablePool((prev) => [...prev, currentValue].sort((a, b) => a - b))
    }

    // Remove the new value from the pool
    setAvailablePool((prev) => {
      const idx = prev.indexOf(value)
      if (idx !== -1) {
        const newPool = [...prev]
        newPool.splice(idx, 1)
        return newPool
      }
      return prev
    })

    // Assign the value
    setAssignments((prev) => ({ ...prev, [trait]: value }))
  }

  const clearTrait = (trait: TraitName) => {
    const currentValue = assignments[trait]
    if (currentValue !== null) {
      setAvailablePool((prev) => [...prev, currentValue].sort((a, b) => a - b))
      setAssignments((prev) => ({ ...prev, [trait]: null }))
    }
  }

  const formatValue = (v: number | null) => {
    if (v === null) return '—'
    if (v > 0) return `+${v}`
    return v.toString()
  }

  // Group available values for display
  const poolDisplay = availablePool.reduce(
    (acc, v) => {
      acc[v] = (acc[v] || 0) + 1
      return acc
    },
    {} as Record<number, number>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Assign Your Traits</h2>
        <p className="text-gray-600 text-sm mt-1">
          Distribute these values among your six traits: -1, 0, 0, +1, +1, +2
        </p>
      </div>

      {/* Available pool */}
      <div className="mb-4 p-3 bg-ios-gray-light rounded-xl">
        <span className="text-sm text-gray-600">Available: </span>
        <div className="flex gap-2 mt-2 flex-wrap">
          {[-1, 0, 1, 2].map((v) =>
            poolDisplay[v] ? (
              <span
                key={v}
                className="px-3 py-1 bg-white rounded-lg text-sm font-medium"
              >
                {formatValue(v)}
                {poolDisplay[v] > 1 && ` ×${poolDisplay[v]}`}
              </span>
            ) : null
          )}
          {availablePool.length === 0 && (
            <span className="text-sm text-green-600">All assigned!</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20 space-y-3">
        {TRAIT_NAMES.map((trait) => (
          <div
            key={trait}
            className="p-4 bg-white rounded-xl border border-ios-separator"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">{trait}</h3>
                <p className="text-xs text-gray-500">{TRAIT_DESCRIPTIONS[trait]}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xl font-bold w-10 text-center ${
                    assignments[trait] !== null ? 'text-ios-blue' : 'text-gray-300'
                  }`}
                >
                  {formatValue(assignments[trait])}
                </span>
                {assignments[trait] !== null && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => clearTrait(trait)}
                    className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center"
                  >
                    ×
                  </motion.button>
                )}
              </div>
            </div>

            {assignments[trait] === null && (
              <div className="flex gap-2 flex-wrap">
                {[-1, 0, 1, 2].map((v) =>
                  poolDisplay[v] ? (
                    <motion.button
                      key={v}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => assignValue(trait, v)}
                      className="px-4 py-2 bg-ios-blue text-white rounded-lg text-sm font-medium"
                    >
                      {formatValue(v)}
                    </motion.button>
                  ) : null
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-ios-separator flex gap-3">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!isComplete} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )
}
