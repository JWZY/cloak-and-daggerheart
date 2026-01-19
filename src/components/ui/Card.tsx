import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  selected?: boolean
  onTap?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

export function Card({
  children,
  selected = false,
  onTap,
  padding = 'md',
  className = '',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }

  const selectedStyles = selected
    ? 'ring-2 ring-ios-blue bg-blue-50'
    : 'bg-white'

  const interactiveStyles = onTap
    ? 'cursor-pointer active:bg-gray-50'
    : ''

  return (
    <motion.div
      whileTap={onTap ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onTap}
      className={`rounded-2xl shadow-sm border border-ios-separator ${paddingStyles[padding]} ${selectedStyles} ${interactiveStyles} ${className}`}
    >
      {children}
    </motion.div>
  )
}
