import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassChip } from '../../components/ui/GlassChip'
import type { Traits, TraitName } from '../../types/character'
import {
  TRAIT_NAMES,
  TRAIT_DESCRIPTIONS,
  AVAILABLE_TRAIT_VALUES,
  SUGGESTED_WIZARD_TRAITS,
  formatTraitValue,
  getRemainingTraitValues,
} from '../../core/rules/traits'

interface TraitsStepProps {
  traits: Traits | undefined
  onSelect: (traits: Traits) => void
}

export function TraitsStep({ traits, onSelect }: TraitsStepProps) {
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
      return getRemainingTraitValues(traits)
    }
    return [...AVAILABLE_TRAIT_VALUES]
  })

  const isComplete = Object.values(assignments).every((v) => v !== null)

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
    const newAssignments = { ...assignments, [trait]: value }
    setAssignments(newAssignments)

    // Notify parent if all traits are now assigned
    if (Object.values(newAssignments).every((v) => v !== null)) {
      onSelect(newAssignments as Traits)
    }
  }

  const clearTrait = (trait: TraitName) => {
    const currentValue = assignments[trait]
    if (currentValue !== null) {
      setAvailablePool((prev) => [...prev, currentValue].sort((a, b) => a - b))
      setAssignments((prev) => ({ ...prev, [trait]: null }))
    }
  }

  const applySuggested = () => {
    setAssignments(SUGGESTED_WIZARD_TRAITS)
    setAvailablePool([]) // All values used
    onSelect(SUGGESTED_WIZARD_TRAITS)
  }

  // Group available values for display
  const poolDisplay = availablePool.reduce(
    (acc, v) => {
      acc[v] = (acc[v] || 0) + 1
      return acc
    },
    {} as Record<number, number>
  )

  const getValueVariant = (value: number): 'positive' | 'negative' | 'neutral' => {
    if (value > 0) return 'positive'
    if (value < 0) return 'negative'
    return 'neutral'
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-glass-primary">Assign Your Traits</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Distribute these values among your six traits: -1, 0, 0, +1, +1, +2
        </p>
      </div>

      {/* Available pool */}
      <div className="mb-4 glass-flat p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-glass-secondary">Available:</span>
          {availablePool.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={applySuggested}
              className="text-xs text-purple-300 hover:text-purple-200 font-medium"
            >
              Use Suggested
            </motion.button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {[-1, 0, 1, 2].map((v) =>
            poolDisplay[v] ? (
              <GlassChip key={v} variant={getValueVariant(v)}>
                {formatTraitValue(v)}
                {poolDisplay[v] > 1 && ` x${poolDisplay[v]}`}
              </GlassChip>
            ) : null
          )}
          {availablePool.length === 0 && (
            <span className="text-sm text-emerald-300">All assigned!</span>
          )}
        </div>
      </div>

      {/* Trait cards */}
      <div className="flex-1 overflow-auto space-y-3">
        {TRAIT_NAMES.map((trait) => (
          <div
            key={trait}
            className="glass-flat p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-glass-primary capitalize">{trait}</h3>
                <p className="text-xs text-glass-muted">{TRAIT_DESCRIPTIONS[trait]}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xl font-bold w-10 text-center ${
                    assignments[trait] !== null
                      ? assignments[trait]! > 0
                        ? 'text-emerald-300'
                        : assignments[trait]! < 0
                        ? 'text-red-300'
                        : 'text-white'
                      : 'text-white/30'
                  }`}
                >
                  {formatTraitValue(assignments[trait])}
                </span>
                {assignments[trait] !== null && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => clearTrait(trait)}
                    className="w-6 h-6 rounded-full glass-flat-sm bg-red-500/20 text-red-300 text-xs flex items-center justify-center"
                  >
                    x
                  </motion.button>
                )}
              </div>
            </div>

            {assignments[trait] === null && (
              <div className="flex gap-2 flex-wrap mt-3">
                {[-1, 0, 1, 2].map((v) =>
                  poolDisplay[v] ? (
                    <motion.button
                      key={v}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => assignValue(trait, v)}
                      className={`lg-button w-10 h-10 text-sm font-medium ${
                        v > 0 ? 'text-emerald-300' : v < 0 ? 'text-red-300' : 'text-white'
                      }`}
                      style={{ '--lg-button-size': '40px' } as React.CSSProperties}
                    >
                      {formatTraitValue(v)}
                    </motion.button>
                  ) : null
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Visual indicator when complete */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass-flat p-3 text-center"
        >
          <span className="text-emerald-300 text-sm font-medium">
            All traits assigned! Continue when ready.
          </span>
        </motion.div>
      )}
    </div>
  )
}
