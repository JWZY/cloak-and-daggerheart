import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { springs } from '../design-system/tokens/animations'

export interface CardSelectorProps {
  selected: boolean
  onSelect: () => void
  color?: string
  dimmed?: boolean
  children: ReactNode
}

export function CardSelector({
  selected,
  onSelect,
  color = '#d4af37',
  dimmed = false,
  children,
}: CardSelectorProps) {
  return (
    <motion.div
      onClick={onSelect}
      animate={{
        scale: selected ? 1.02 : 1,
        y: selected ? -8 : 0,
        opacity: dimmed ? 0.85 : 1,
      }}
      transition={{
        type: 'spring',
        ...springs.select,
      }}
      style={{
        cursor: 'pointer',
        borderRadius: 14,
        border: selected ? `3px solid ${color}` : '3px solid transparent',
        boxShadow: selected
          ? `0 0 20px ${color}40, 0 0 40px ${color}20`
          : 'none',
      }}
    >
      {children}
    </motion.div>
  )
}
