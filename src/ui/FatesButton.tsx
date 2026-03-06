import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import fatesLight from '../../assets/ui-exploration/button-bg-fates-light.avif'
import fatesDark from '../../assets/ui-exploration/button-bg-fates-dark.avif'

export interface FatesButtonProps {
  variant: 'light' | 'dark'
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

const bgSrc = {
  light: fatesLight,
  dark: fatesDark,
} as const

export function FatesButton({
  variant,
  children,
  onClick,
  disabled = false,
}: FatesButtonProps) {
  const textColor = variant === 'light' ? 'var(--midnight, #1e1e1e)' : 'white'

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        width: 150,
        height: 38,
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        overflow: 'hidden',
        touchAction: 'manipulation',
      }}
    >
      {/* Background image */}
      <img
        src={bgSrc[variant]}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Centered text */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'EB Garamond', serif",
          fontSize: 15.6,
          fontWeight: 500,
          fontVariant: 'all-small-caps',
          letterSpacing: '0.06em',
          color: textColor,
          pointerEvents: 'none',
        }}
      >
        {children}
      </span>
    </motion.button>
  )
}
