import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassChipProps {
  children: ReactNode
  variant?: 'default' | 'positive' | 'negative' | 'neutral'
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

export function GlassChip({
  children,
  variant = 'default',
  size = 'md',
  onClick,
  className = '',
}: GlassChipProps) {
  const baseStyles = 'glass rounded-lg font-medium inline-flex items-center justify-center'

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  const variantStyles = {
    default: 'text-white',
    positive: 'text-emerald-300',
    negative: 'text-red-300',
    neutral: 'text-white/70',
  }

  const content = (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )

  if (onClick) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="focus:outline-none"
      >
        {content}
      </motion.button>
    )
  }

  return content
}
