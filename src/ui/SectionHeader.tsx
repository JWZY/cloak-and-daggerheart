import { type ReactNode } from 'react'
import { typeSubtitle } from './typography'

export interface SectionHeaderProps {
  children: ReactNode
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
      }}
    >
      {/* Left line + diamond */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div
          style={{
            height: 2,
            flex: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold))',
          }}
        />
        <div
          style={{
            width: 4,
            height: 4,
            background: 'var(--gold)',
            transform: 'rotate(45deg)',
            margin: '0 2px',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Title */}
      <div
        className="gold-text-shadow-subtle"
        style={{ flexShrink: 0 }}
      >
        <span
          className="gold-text"
          style={{
            ...typeSubtitle,
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </span>
      </div>

      {/* Right diamond + line */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div
          style={{
            width: 4,
            height: 4,
            background: 'var(--gold)',
            transform: 'rotate(45deg)',
            margin: '0 2px',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            height: 2,
            flex: 1,
            background: 'linear-gradient(90deg, var(--gold), transparent)',
          }}
        />
      </div>
    </div>
  )
}
