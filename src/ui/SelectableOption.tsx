import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

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
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      className={`w-full text-left rounded-xl px-4 py-3 ${className}`}
      style={{
        position: 'relative',
        background: selected
          ? 'var(--gold-muted)'
          : 'var(--surface-faint)',
        border: selected
          ? '1px solid var(--gold-muted)'
          : '1px solid var(--surface-light)',
        boxShadow: selected
          ? 'inset 0 1px 1px rgba(249, 248, 243, 0.1), 0 2px 8px rgba(0, 0, 0, 0.15)'
          : 'none',
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
