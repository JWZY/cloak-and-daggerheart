import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface GameButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
}

const sizeStyles = {
  sm: { padding: '6px 16px', fontSize: 13 },
  md: { padding: '10px 24px', fontSize: 15 },
  lg: { padding: '14px 32px', fontSize: 17 },
} as const

export function GameButton({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
}: GameButtonProps) {
  const sizeStyle = sizeStyles[size]

  const baseStyle: React.CSSProperties = {
    fontFamily: "'EB Garamond', serif",
    fontWeight: 600,
    letterSpacing: '0.04em',
    fontVariant: 'small-caps',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    minHeight: 44,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontSize: sizeStyle.fontSize,
    padding: sizeStyle.padding,
  }

  if (variant === 'primary') {
    return (
      <motion.button
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
        onClick={onClick}
        disabled={disabled}
        className={className}
        style={{
          ...baseStyle,
          background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
          border: '1px solid #C29734',
          color: '#4d381e',
          textShadow:
            '0 1px 0 rgba(249, 248, 243, 0.4), 0 -1px 1px rgba(77, 56, 30, 0.3)',
          boxShadow:
            'inset 0 1px 1px rgba(249, 248, 243, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        {children}
      </motion.button>
    )
  }

  if (variant === 'secondary') {
    return (
      <motion.button
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
        onClick={onClick}
        disabled={disabled}
        className={className}
        style={{
          ...baseStyle,
          background: 'rgba(3, 7, 13, 0.8)',
          border: '1px solid #e7ba90',
          color: '#e7ba90',
          textShadow: '0px 1px 1px #4d381e',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        {children}
      </motion.button>
    )
  }

  // ghost
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
      onClick={onClick}
      disabled={disabled}
      className={`group ${className}`}
      style={{
        ...baseStyle,
        background: 'transparent',
        border: 'none',
        color: '#e7ba90',
        padding: '8px 16px',
        fontSize: sizeStyle.fontSize,
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: 4,
          left: 16,
          right: 16,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #e7ba90, transparent)',
          opacity: 0,
          transition: 'opacity 0.15s ease',
        }}
        className="group-hover:!opacity-100"
      />
    </motion.button>
  )
}
