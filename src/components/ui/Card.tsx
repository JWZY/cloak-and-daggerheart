import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  selected?: boolean
  onTap?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'solid' | 'glass' | 'glass-strong'
}

export function Card({
  children,
  selected = false,
  onTap,
  padding = 'md',
  className = '',
  variant = 'solid',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }

  const getVariantStyles = () => {
    if (variant === 'glass') {
      return selected
        ? 'glass ring-2 ring-white/30'
        : 'glass'
    }
    if (variant === 'glass-strong') {
      return selected
        ? 'glass-strong ring-2 ring-white/30'
        : 'glass-strong'
    }
    return selected
      ? 'ring-2 ring-ios-blue bg-blue-50'
      : 'bg-white'
  }

  // For glass variants, use Liquid Glass interactive hover effect
  const interactiveClass = onTap && variant !== 'solid' ? 'lg-card-interactive' : ''
  const interactiveStyles = onTap
    ? variant === 'solid'
      ? 'cursor-pointer active:bg-gray-50'
      : 'cursor-pointer'
    : ''

  const borderStyles = variant === 'solid' ? 'border border-ios-separator shadow-sm' : ''

  // Use CSS var for card radius on glass variants
  const radiusClass = variant === 'solid' ? 'rounded-2xl' : 'rounded-[var(--lg-card-radius)]'

  return (
    <motion.div
      whileTap={onTap ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onTap}
      className={`${radiusClass} ${paddingStyles[padding]} ${getVariantStyles()} ${interactiveClass} ${interactiveStyles} ${borderStyles} ${className}`}
    >
      {children}
    </motion.div>
  )
}
