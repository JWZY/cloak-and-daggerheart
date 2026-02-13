import { type ReactNode } from 'react'

export interface GameBadgeProps {
  children: ReactNode
  color?: string // domain color override
}

export function GameBadge({ children, color }: GameBadgeProps) {
  const badgeColor = color ?? '#e7ba90'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 9999,
        background: `${badgeColor}1A`,
        border: `1px solid ${badgeColor}4D`,
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: badgeColor,
      }}
    >
      {children}
    </span>
  )
}
