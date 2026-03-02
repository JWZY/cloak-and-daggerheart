import { type ReactNode } from 'react'

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
    background: `linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.02) 50%,
      rgba(0, 0, 0, 0.01) 100%
    )`,
    backdropFilter: 'blur(2px) saturate(150%)',
    WebkitBackdropFilter: 'blur(2px) saturate(150%)',
    borderRadius: 16,
    padding: 16,
  }

  let border: string
  let boxShadow: string

  if (variant === 'gold') {
    border = '1px solid var(--gold-muted)'
    boxShadow = `
      inset 0 1px 1px rgba(249, 248, 243, 0.15),
      inset 0 -1px 1px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.25)
    `
  } else if (variant === 'domain' && domainColor) {
    border = '1px solid var(--surface-border)'
    boxShadow = `
      inset 0 1px 1px rgba(255, 255, 255, 0.375),
      inset 0 -1px 1px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.25)
    `
  } else {
    border = '1px solid var(--surface-border)'
    boxShadow = `
      inset 0 1px 1px rgba(255, 255, 255, 0.375),
      inset 0 -1px 1px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.25)
    `
  }

  return (
    <div
      className={className}
      style={{
        ...base,
        border,
        boxShadow,
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
