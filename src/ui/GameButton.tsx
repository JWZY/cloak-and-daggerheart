import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { typeSubtitle } from './typography'

/**
 * Small diamond rivet ornament for button corners.
 * Pure CSS — can be replaced with an SVG asset for higher fidelity.
 */
function CornerOrnament({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      style={{
        position: 'absolute',
        [side]: -1,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 12,
        height: 12,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {/* Outer diamond — dark surround */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #5a5550 0%, #3a3530 100%)',
          transform: 'rotate(45deg)',
          borderRadius: 1,
        }}
      />
      {/* Inner diamond — bright metallic center */}
      <div
        style={{
          position: 'absolute',
          inset: 3,
          background: 'linear-gradient(180deg, #c8c0b4 0%, #8a8078 100%)',
          transform: 'rotate(45deg)',
          borderRadius: 0.5,
          boxShadow: '0 0 2px rgba(200,192,180,0.3)',
        }}
      />
    </div>
  )
}

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
  md: { padding: '10px 24px', fontSize: 13 },
  lg: { padding: '14px 32px', fontSize: 13 },
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
    ...typeSubtitle,
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
          background:
            'linear-gradient(180deg, #8a8d93 0%, #6b6e74 40%, #5a5d63 100%)',
          border: 'none',
          borderRadius: 6,
          padding: 3,
          boxShadow:
            '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
          display: 'block',
          touchAction: 'manipulation',
          overflow: 'visible',
        }}
      >
        {/* Inner surface — dark steel panel */}
        <div
          style={{
            position: 'relative',
            background:
              'linear-gradient(180deg, #1a1f2e 0%, #151a24 50%, #0d1018 100%)',
            borderRadius: 3,
            border: '1px solid #0a0d14',
            boxShadow:
              'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.04)',
            padding: sizeStyle.padding,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 38,
          }}
        >
          {/* Inner guide lines — faint horizontal engravings */}
          <div
            style={{
              position: 'absolute',
              top: 5,
              left: 14,
              right: 14,
              height: 1,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 5,
              left: 14,
              right: 14,
              height: 1,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.03) 70%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Corner ornaments — diamond rivets at left and right */}
          <CornerOrnament side="left" />
          <CornerOrnament side="right" />

          {/* Engraved text */}
          <span
            style={{
              ...typeSubtitle,
              fontSize: sizeStyle.fontSize,
              background:
                'linear-gradient(180deg, #c8c0b4 0%, #9e978b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.7))',
            }}
          >
            {children}
          </span>
        </div>
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
          background:
            'linear-gradient(180deg, #5a5d63 0%, #4a4d53 40%, #3a3d43 100%)',
          border: 'none',
          borderRadius: 6,
          padding: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          display: 'block',
          touchAction: 'manipulation',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(180deg, #151a24 0%, #0d1018 100%)',
            borderRadius: 4,
            border: '1px solid #0a0d14',
            boxShadow:
              'inset 0 1px 3px rgba(0,0,0,0.4), inset 0 -1px 1px rgba(255,255,255,0.03)',
            padding: sizeStyle.padding,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 40,
          }}
        >
          <span
            style={{
              ...typeSubtitle,
              fontSize: sizeStyle.fontSize,
              background:
                'linear-gradient(180deg, #9e978b 0%, #7a746a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))',
            }}
          >
            {children}
          </span>
        </div>
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
        color: 'var(--gold)',
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
