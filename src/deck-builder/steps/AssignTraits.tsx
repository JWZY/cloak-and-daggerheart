import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { tapFeedback } from '../../design-system/tokens/animations'
import { TRAIT_NAMES, TRAIT_DESCRIPTIONS, parseSuggestedTraits, formatTraitValue, getRemainingTraitValues } from '../../core/rules/traits'
import type { TraitName } from '../../types/character'
import { SelectableOption } from '../../ui/SelectableOption'
import { EmberOverlay } from '../../ui/EmberOverlay'
import { typeSubtitle, typeBody, goldDarkAlpha } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { getClassAccentColor } from '../../cards/domain-colors'
import { getClassByName } from '../../data/srd'

type Variant = 'pills' | 'stepper' | 'cycle'

const VARIANT_LABELS: Record<Variant, string> = {
  pills: 'A: Pills',
  stepper: 'B: Stepper',
  cycle: 'C: Cycle',
}
const VARIANTS: Variant[] = ['pills', 'stepper', 'cycle']

export function AssignTraits() {
  const storedTraits = useDeckStore((s) => s.traits)
  const setTraits = useDeckStore((s) => s.setTraits)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const [variant, setVariant] = useState<Variant>('pills')

  // Local trait assignment state — each trait maps to a value or null (unassigned)
  const [assignments, setAssignments] = useState<Record<TraitName, number | null>>(() => {
    if (storedTraits) {
      return storedTraits as Record<TraitName, number>
    }
    const classData = selectedClass ? getClassByName(selectedClass) : null
    const suggestedTraits = classData ? parseSuggestedTraits(classData.suggested_traits) : null
    return suggestedTraits
      ? { ...suggestedTraits }
      : Object.fromEntries(TRAIT_NAMES.map(n => [n, null])) as Record<TraitName, number | null>
  })

  const remaining = getRemainingTraitValues(assignments).sort((a, b) => b - a) // highest first
  const allAssigned = remaining.length === 0

  // Sync to store when all traits are assigned, clear when incomplete
  useEffect(() => {
    if (allAssigned) {
      const traitValues: Record<string, number> = {}
      for (const name of TRAIT_NAMES) {
        traitValues[name] = assignments[name]!
      }
      setTraits(traitValues)
    } else {
      setTraits(null)
    }
  }, [allAssigned, assignments, setTraits])

  // ─── Shared handlers ─────────────────────────────────────────────────────

  const handleSlotTap = (traitName: TraitName) => {
    const currentValue = assignments[traitName]
    if (currentValue !== null) {
      setAssignments((prev) => ({ ...prev, [traitName]: null }))
    } else if (remaining.length > 0) {
      setAssignments((prev) => ({ ...prev, [traitName]: remaining[0] }))
    }
  }

  const handlePillTap = (value: number, poolIndex: number) => {
    const emptySlot = TRAIT_NAMES.find((name) => assignments[name] === null)
    if (!emptySlot) return
    const remainingCopy = [...remaining]
    let targetIdx = -1
    let count = 0
    for (let i = 0; i < remainingCopy.length; i++) {
      if (remainingCopy[i] === value) {
        if (count === poolIndex) { targetIdx = i; break }
        count++
      }
    }
    if (targetIdx === -1) return
    setAssignments((prev) => ({ ...prev, [emptySlot]: value }))
  }

  // Stepper: increment/decrement within available pool
  const handleStep = (traitName: TraitName, direction: 1 | -1) => {
    const currentValue = assignments[traitName]
    const pool = [...remaining]
    if (currentValue !== null) pool.push(currentValue)
    pool.sort((a, b) => a - b)
    const uniquePool = [...new Set(pool)]

    if (currentValue === null) {
      // Assign first available
      setAssignments((prev) => ({ ...prev, [traitName]: direction > 0 ? uniquePool[uniquePool.length - 1] : uniquePool[0] }))
      return
    }

    const currentIdx = uniquePool.indexOf(currentValue)
    const nextIdx = currentIdx + direction
    if (nextIdx < 0 || nextIdx >= uniquePool.length) return
    const nextValue = uniquePool[nextIdx]

    // Check if nextValue is actually available in the pool (remaining + current)
    const fullPool = [...remaining, currentValue].sort((a, b) => a - b)
    const available = fullPool.includes(nextValue)
    if (!available) return

    setAssignments((prev) => ({ ...prev, [traitName]: nextValue }))
  }

  // Cycle: tap to advance to next available value
  const handleCycle = (traitName: TraitName) => {
    const currentValue = assignments[traitName]
    const pool = [...remaining]
    if (currentValue !== null) pool.push(currentValue)
    pool.sort((a, b) => a - b)

    // Cycle through: null → lowest → ... → highest → null
    const cycleOrder: (number | null)[] = [null, ...pool.filter((v, i, arr) => i === 0 || v !== arr[i - 1])]
    const currentIdx = cycleOrder.indexOf(currentValue)
    const nextIdx = (currentIdx + 1) % cycleOrder.length
    const nextValue = cycleOrder[nextIdx]

    // Verify nextValue is available
    if (nextValue !== null) {
      const availablePool = [...remaining]
      if (currentValue !== null) availablePool.push(currentValue)
      const idx = availablePool.indexOf(nextValue)
      if (idx === -1) {
        // Not available, skip to null
        setAssignments((prev) => ({ ...prev, [traitName]: null }))
        return
      }
    }

    setAssignments((prev) => ({ ...prev, [traitName]: nextValue }))
  }

  // Pills grouping
  const pillValues: { value: number; poolIndex: number }[] = []
  const seenCounts: Record<number, number> = {}
  for (const v of remaining) {
    const idx = seenCounts[v] ?? 0
    pillValues.push({ value: v, poolIndex: idx })
    seenCounts[v] = idx + 1
  }

  const cycleVariant = () => {
    const idx = VARIANTS.indexOf(variant)
    setVariant(VARIANTS[(idx + 1) % VARIANTS.length])
  }

  const accentColor = getClassAccentColor(selectedClass)

  return (
    <>
      <EmberOverlay color={accentColor} rate={6} />
      <div className="flex flex-col items-center px-4" style={{ paddingTop: '20%' }}>
      <p className="max-w-[360px]" style={{
        ...typeBody,
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        {variant === 'pills' && 'Tap a value to assign it to a trait'}
        {variant === 'stepper' && 'Use +/\u2212 to adjust each trait'}
        {variant === 'cycle' && 'Tap a trait to cycle through values'}
      </p>

      {/* ─── Variant A: Pills ─────────────────────────────────────────── */}
      {variant === 'pills' && (
        <>
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
          </div>

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
                >
                  <span style={{ ...typeSubtitle, color: isAssigned ? 'var(--gold)' : 'var(--text-muted)' }}>
                    {traitName}
                  </span>
                  <span style={{
                    ...typeBody,
                    fontSize: 20,
                    fontWeight: 700,
                    color: isAssigned ? 'var(--gold)' : 'var(--text-muted)',
                    minWidth: 32,
                    textAlign: 'right',
                  }}>
                    {isAssigned ? formatTraitValue(value) : '\u2014'}
                  </span>
                </SelectableOption>
              )
            })}
          </div>
        </>
      )}

      {/* ─── Variant B: Stepper ───────────────────────────────────────── */}
      {variant === 'stepper' && (
        <div className="flex flex-col gap-3 w-full max-w-[360px]">
          {TRAIT_NAMES.map((traitName) => {
            const value = assignments[traitName]
            const isAssigned = value !== null
            const pool = [...remaining]
            if (value !== null) pool.push(value)
            const uniquePool = [...new Set(pool)].sort((a, b) => a - b)
            const canDecrement = isAssigned && uniquePool.indexOf(value) > 0
            const canIncrement = isAssigned ? uniquePool.indexOf(value) < uniquePool.length - 1 : remaining.length > 0

            return (
              <div
                key={traitName}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 12,
                  background: 'var(--surface-faint)',
                  border: isAssigned ? `1px solid ${goldDarkAlpha(0.3)}` : '1px solid var(--surface-light)',
                }}
              >
                {/* Trait name + description */}
                <div style={{ flex: 1 }}>
                  <span style={{ ...typeSubtitle, color: isAssigned ? 'var(--gold)' : 'var(--text-muted)' }}>
                    {traitName}
                  </span>
                  <p style={{
                    ...typeBody,
                    color: 'var(--text-muted)',
                    margin: '2px 0 0',
                  }}>
                    {TRAIT_DESCRIPTIONS[traitName]}
                  </p>
                </div>

                {/* Stepper controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <motion.button
                    whileTap={canDecrement ? tapFeedback.strong : undefined}
                    onClick={() => canDecrement ? handleStep(traitName, -1) : isAssigned ? handleSlotTap(traitName) : null}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: `1px solid ${goldDarkAlpha(canDecrement || isAssigned ? 0.4 : 0.15)}`,
                      background: 'transparent',
                      color: canDecrement || isAssigned ? 'var(--gold)' : 'var(--text-muted)',
                      fontSize: 18,
                      cursor: canDecrement || isAssigned ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    −
                  </motion.button>

                  <span style={{
                    ...typeSubtitle,
                    fontSize: 22,
                    color: isAssigned ? 'var(--gold)' : 'var(--text-muted)',
                    minWidth: 40,
                    textAlign: 'center',
                  }}>
                    {isAssigned ? formatTraitValue(value) : '\u2014'}
                  </span>

                  <motion.button
                    whileTap={canIncrement ? tapFeedback.strong : undefined}
                    onClick={() => canIncrement ? (isAssigned ? handleStep(traitName, 1) : handleSlotTap(traitName)) : null}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: `1px solid ${goldDarkAlpha(canIncrement ? 0.4 : 0.15)}`,
                      background: 'transparent',
                      color: canIncrement ? 'var(--gold)' : 'var(--text-muted)',
                      fontSize: 18,
                      cursor: canIncrement ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── Variant C: Cycle ─────────────────────────────────────────── */}
      {variant === 'cycle' && (
        <div className="flex flex-col gap-3 w-full max-w-[360px]">
          {TRAIT_NAMES.map((traitName) => {
            const value = assignments[traitName]
            const isAssigned = value !== null

            return (
              <motion.button
                key={traitName}
                whileTap={tapFeedback.strong}
                onClick={() => handleCycle(traitName)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderRadius: 12,
                  background: 'var(--surface-faint)',
                  border: isAssigned ? `1px solid ${goldDarkAlpha(0.3)}` : '1px solid var(--surface-light)',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ ...typeSubtitle, color: isAssigned ? 'var(--gold)' : 'var(--text-muted)' }}>
                  {traitName}
                </span>

                {/* Value indicator strip */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[-1, 0, 1, 2].map((v) => (
                    <span
                      key={v}
                      style={{
                        ...typeSubtitle,
                        fontSize: 15,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: value === v ? 'var(--gold)' : 'transparent',
                        color: value === v ? 'var(--card-bg-dark)' : 'var(--text-muted)',
                        border: value === v ? 'none' : `1px solid ${goldDarkAlpha(0.15)}`,
                        fontWeight: value === v ? 700 : 400,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {formatTraitValue(v)}
                    </span>
                  ))}
                </div>
              </motion.button>
            )
          })}

          <div style={{ textAlign: 'center', marginTop: 8 }}>
          </div>
        </div>
      )}

      {/* Dev variant toggle */}
      {(import.meta.env.DEV || new URLSearchParams(window.location.search).has('traittest')) && (
        <button
          onClick={cycleVariant}
          style={{
            position: 'fixed',
            top: 52,
            right: 12,
            zIndex: 9999,
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: 11,
            fontFamily: 'system-ui, sans-serif',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {VARIANT_LABELS[variant]}
        </button>
      )}
    </div>
    </>
  )
}
