import { type ReactNode, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { springs } from '../design-system/tokens/animations'

export interface CardFlipProps {
  front: ReactNode
  back: ReactNode
  flipped?: boolean
  onFlip?: (flipped: boolean) => void
  width: number
  height: number
}

export function CardFlip({ front, back, flipped: controlledFlipped, onFlip, width, height }: CardFlipProps) {
  const [internalFlipped, setInternalFlipped] = useState(false)

  const isControlled = controlledFlipped !== undefined
  const isFlipped = isControlled ? controlledFlipped : internalFlipped

  const handleTap = useCallback(() => {
    const next = !isFlipped
    if (isControlled) {
      onFlip?.(next)
    } else {
      setInternalFlipped(next)
      onFlip?.(next)
    }
  }, [isFlipped, isControlled, onFlip])

  return (
    <button
      type="button"
      aria-label={isFlipped ? 'Flip card to back' : 'Flip card to front'}
      style={{
        width,
        height,
        perspective: 1000,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
      onClick={handleTap}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={{
          type: 'spring',
          ...springs.smooth,
          duration: 0.6,
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face — the revealed card */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {front}
        </div>

        {/* Back face — pre-rotated 180deg so it shows when the container is at 0 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </button>
  )
}
