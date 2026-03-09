import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { tapFeedback } from '../design-system/tokens/animations'
import { warmGlass, warmGlassSelectedBorder, RADIUS_OPTION } from '../design-system/tokens/surfaces'

export interface SelectableOptionProps {
  selected: boolean
  dimmed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  /** Whether framer-motion layout animation is enabled (default: true) */
  layout?: boolean
}

export function SelectableOption({
  selected,
  dimmed = false,
  disabled = false,
  onClick,
  children,
  className = '',
  style,
  layout: layoutProp = true,
}: SelectableOptionProps) {
  return (
    <motion.button
      layout={layoutProp}
      whileTap={disabled ? undefined : tapFeedback.medium}
      onClick={disabled ? undefined : onClick}
      className={`w-full text-left px-4 py-3 ${className}`}
      style={{
        position: 'relative',
        ...warmGlass,
        borderRadius: RADIUS_OPTION,
        border: selected ? warmGlassSelectedBorder : warmGlass.border,
        opacity: disabled ? 0.35 : dimmed ? 0.65 : 1,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'opacity 0.2s',
        ...style,
      }}
    >
      {children}
    </motion.button>
  )
}
