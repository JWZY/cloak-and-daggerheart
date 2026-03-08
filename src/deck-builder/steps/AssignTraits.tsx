import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { tapFeedback } from '../../design-system/tokens/animations'
import { TRAIT_NAMES, parseSuggestedTraits, formatTraitValue, getRemainingTraitValues } from '../../core/rules/traits'
import type { TraitName } from '../../types/character'
import { SelectableOption } from '../../ui/SelectableOption'
import { GameBadge } from '../../ui/GameBadge'
import { typeTitle, typeSubtitle, typeBody, goldGradient } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { getClassByName } from '../../data/srd'

export function AssignTraits() {
  const storedTraits = useDeckStore((s) => s.traits)
  const setTraits = useDeckStore((s) => s.setTraits)
  const selectedClass = useDeckStore((s) => s.selectedClass)

  // Local trait assignment state — each trait maps to a value or null (unassigned)
  const [assignments, setAssignments] = useState<Record<TraitName, number | null>>(() => {
    if (storedTraits) {
      // Restore from store
      return storedTraits as Record<TraitName, number>
    }
    // Pre-fill with suggested traits for the selected class
    const classData = selectedClass ? getClassByName(selectedClass) : null
    const suggestedTraits = classData ? parseSuggestedTraits(classData.suggested_traits) : null
    return suggestedTraits
      ? { ...suggestedTraits }
      : Object.fromEntries(TRAIT_NAMES.map(n => [n, null])) as Record<TraitName, number | null>
  })

  const remaining = getRemainingTraitValues(assignments)
  const allAssigned = remaining.length === 0

  // Sync to store when all traits are assigned
  useEffect(() => {
    if (allAssigned) {
      const traitValues: Record<string, number> = {}
      for (const name of TRAIT_NAMES) {
        traitValues[name] = assignments[name]!
      }
      setTraits(traitValues)
    }
  }, [allAssigned, assignments, setTraits])

  const handleSlotTap = (traitName: TraitName) => {
    const currentValue = assignments[traitName]
    if (currentValue !== null) {
      // Unassign this slot
      setAssignments((prev) => ({ ...prev, [traitName]: null }))
    } else if (remaining.length > 0) {
      // Assign the first available value
      setAssignments((prev) => ({ ...prev, [traitName]: remaining[0] }))
    }
  }

  const handlePillTap = (value: number, poolIndex: number) => {
    // Find the first empty slot and assign this value
    const emptySlot = TRAIT_NAMES.find((name) => assignments[name] === null)
    if (!emptySlot) return

    // Remove this specific value from the pool by finding it
    // We need to track which specific pool item was tapped
    const remainingCopy = [...remaining]
    let targetIdx = -1
    let count = 0
    for (let i = 0; i < remainingCopy.length; i++) {
      if (remainingCopy[i] === value) {
        if (count === poolIndex) {
          targetIdx = i
          break
        }
        count++
      }
    }
    if (targetIdx === -1) return

    setAssignments((prev) => ({ ...prev, [emptySlot]: value }))
  }

  // Group remaining values and track indices for duplicate handling
  const pillValues: { value: number; poolIndex: number }[] = []
  const seenCounts: Record<number, number> = {}
  for (const v of remaining) {
    const idx = seenCounts[v] ?? 0
    pillValues.push({ value: v, poolIndex: idx })
    seenCounts[v] = idx + 1
  }

  return (
    <div className="flex flex-col items-center px-4">
      <h2 style={{
        ...typeTitle,
        fontSize: 28,
        fontWeight: 400,
        background: goldGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        margin: '0 0 8px',
      }}>
        Assign Traits
      </h2>
      <p style={{
        ...typeSubtitle,
        fontStyle: 'italic',
        color: 'var(--gold-secondary)',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        Tap a trait to unassign, tap a pill to assign
      </p>

      {/* Available values (pills) */}
      <div className="flex gap-2 mb-6 justify-center">
        {pillValues.map(({ value, poolIndex }, i) => (
          <motion.button
            key={`${value}-${i}`}
            whileTap={tapFeedback.strong}
            onClick={() => handlePillTap(value, poolIndex)}
            style={{
              ...typeSubtitle,
              background: 'var(--bg-overlay)',
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
              textShadow: '0px 1px 1px #4d381e',
              borderRadius: 9999,
              padding: '6px 16px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            {formatTraitValue(value)}
          </motion.button>
        ))}
        {remaining.length === 0 && (
          <div className="flex flex-col items-center gap-1">
            <GameBadge>All values assigned</GameBadge>
            <span
              style={{
                fontFamily: typeSubtitle.fontFamily,
                fontStyle: 'italic',
                fontSize: 11,
                color: 'var(--gold-secondary)',
              }}
            >
              Suggested traits applied
            </span>
          </div>
        )}
      </div>

      {/* Trait slots */}
      <div className="flex flex-col gap-3 w-full max-w-[360px]">
        {TRAIT_NAMES.map((traitName) => {
          const value = assignments[traitName]
          const isAssigned = value !== null

          return (
            <SelectableOption
              key={traitName}
              selected={isAssigned}
              onClick={() => handleSlotTap(traitName)}
              layout={false}
              className="flex items-center justify-between"
              style={{
                background: isAssigned
                  ? 'var(--gold-muted)'
                  : 'var(--surface-faint)',
                border: isAssigned
                  ? '1px solid var(--gold-muted)'
                  : '1px solid var(--surface-light)',
              }}
            >
              <span
                style={{
                  ...typeSubtitle,
                  color: isAssigned ? 'var(--gold)' : 'var(--text-muted)',
                }}
              >
                {traitName}
              </span>
              <span
                style={{
                  fontFamily: typeBody.fontFamily,
                  fontSize: 15,
                  fontWeight: 700,
                  color: isAssigned ? 'var(--gold)' : 'var(--text-muted)',
                  minWidth: 32,
                  textAlign: 'right',
                }}
              >
                {isAssigned ? formatTraitValue(value) : '\u2014'}
              </span>
            </SelectableOption>
          )
        })}
      </div>
    </div>
  )
}
