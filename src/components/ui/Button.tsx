import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'glass-primary'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-medium transition-colors focus:outline-none'

  // Glass variants use Liquid Glass styling
  const isGlass = variant === 'glass' || variant === 'glass-primary'

  const variantStyles = {
    primary: 'bg-ios-blue text-white focus:ring-2 focus:ring-ios-blue focus:ring-offset-2 active:bg-blue-600 rounded-xl',
    secondary: 'bg-ios-gray-light text-gray-900 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:bg-gray-200 rounded-xl',
    ghost: 'bg-transparent text-ios-blue focus:ring-2 focus:ring-ios-blue focus:ring-offset-2 active:bg-ios-gray-light rounded-xl',
    // Liquid Glass variants
    glass: 'glass text-white rounded-[9999px]',
    'glass-primary': 'glass-strong text-white rounded-[9999px]',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const disabledStyles = disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''

  // Glass buttons get Liquid Glass hover effect via CSS
  const glassInteractive = isGlass ? 'glass-interactive' : ''

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: isGlass ? 0.95 : 0.97 }}
      whileHover={isGlass && !disabled ? { scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${glassInteractive} ${disabledStyles} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  )
}
