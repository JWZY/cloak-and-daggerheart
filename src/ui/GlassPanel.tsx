import { type ReactNode } from 'react'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import { goldDarkAlpha } from './typography'

export interface GlassPanelProps {
  variant?: 'default' | 'gold' | 'domain'
  domainColor?: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function GlassPanel({
  variant = 'default',
  domainColor,
  children,
  className = '',
  style,
}: GlassPanelProps) {
  const base: React.CSSProperties = {
    ...warmGlass,
    borderRadius: RADIUS_CARD,
    padding: 16,
  }

  if (variant === 'gold') {
    base.border = `1px solid ${goldDarkAlpha(0.4)}`
  }

  return (
    <div
      className={className}
      style={{
        ...base,
        borderTop:
          variant === 'domain' && domainColor
            ? `2px solid ${domainColor}`
            : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
