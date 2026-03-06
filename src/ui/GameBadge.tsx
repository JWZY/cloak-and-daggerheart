import { type ReactNode } from 'react'
import { typeMicro, goldDark } from './typography'

export interface GameBadgeProps {
  children: ReactNode
  color?: string // domain color override
}

export function GameBadge({ children, color }: GameBadgeProps) {
  const badgeColor = color ?? goldDark

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 9999,
        background: `${badgeColor}1A`,
        border: `1px solid ${badgeColor}4D`,
        ...typeMicro,
        color: badgeColor,
      }}
    >
      {children}
    </span>
  )
}
