import { useId } from 'react'
import { motion } from 'framer-motion'
import { DOMAIN_COLORS, DOMAIN_COLORS_MUTED } from './domain-colors'
import { DomainBanner } from './DomainBanner'
import { typeTitle } from '../ui/typography'

// ---------------------------------------------------------------------------
// FlatDomainCard — compact ~60px row with artwork bleed, pennant banner,
// and name-only text. Tap to select, tap again to expand into full card.
// ---------------------------------------------------------------------------

const PAGE_BG = 'var(--bg-page)'
const ARTWORK_WIDTH = 130
const ROW_HEIGHT = 60

export interface FlatDomainCardProps {
  /** Card name, e.g. "Book of Ava" */
  title: string
  /** Domain name, e.g. "Codex" */
  domain: string
  /** Card level */
  level?: string | number
  /** Recall cost (shown as badge if > 0) */
  recall?: string
  /** Path to artwork image */
  artworkSrc?: string
  /** Whether this card is currently selected */
  selected?: boolean
  /** Whether this card is dimmed (max selected and not this one) */
  dimmed?: boolean
  /** Layout ID for shared layout animation (expand-to-full) */
  layoutId?: string
  /** Called when the card is tapped/clicked */
  onClick?: () => void
}

export function FlatDomainCard({
  title,
  domain,
  level,
  recall,
  artworkSrc,
  selected = false,
  dimmed = false,
  layoutId,
  onClick,
}: FlatDomainCardProps) {
  const basePath = import.meta.env.BASE_URL || '/'
  const uid = useId().replace(/:/g, '')
  const domainColor = DOMAIN_COLORS[domain] || '#77457E'
  const domainColorMuted = DOMAIN_COLORS_MUTED[domain] || '#47294C'

  const card = (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: ROW_HEIGHT,
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        background: selected
          ? 'var(--gold-muted)'
          : 'var(--surface-faint)',
        border: selected
          ? '1px solid var(--gold-secondary)'
          : '1px solid var(--surface-light)',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        opacity: dimmed ? 0.4 : 1,
        pointerEvents: dimmed ? 'none' : 'auto',
        touchAction: 'manipulation',
      }}
    >
      {/* Domain color accent stripe (left edge) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 3,
          background: selected
            ? `linear-gradient(180deg, ${domainColor}, var(--gold-secondary))`
            : domainColor,
          opacity: selected ? 1 : 0.6,
          borderRadius: '12px 0 0 12px',
          zIndex: 5,
        }}
      />

      {/* Selection glow */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: `inset 0 0 20px var(--gold-muted), 0 0 12px var(--gold-muted)`,
            borderRadius: 12,
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />
      )}

      {/* Artwork bleed area */}
      <div
        style={{
          position: 'relative',
          width: ARTWORK_WIDTH,
          height: ROW_HEIGHT,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {artworkSrc && (
          <img
            src={artworkSrc}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            draggable={false}
          />
        )}

        {/* Gradient fade rightward into page background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, transparent 40%, ${PAGE_BG} 85%)`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Pennant banner (scaled to fit row) */}
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
          <DomainBanner
            outerColor={domainColorMuted}
            innerColor={domainColor}
            uid={uid}
            domain={domain}
            basePath={basePath}
            level={level}
            scale={0.55}
          />
        </div>

        {/* Recall badge (bottom-right within artwork zone) */}
        {recall && parseInt(String(recall)) > 0 && (
          <span
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              zIndex: 3,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: 6,
              background: `${domainColor}33`,
              border: `1px solid ${domainColor}66`,
              fontFamily: typeTitle.fontFamily,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--gold)',
            }}
          >
            {recall}
          </span>
        )}
      </div>

      {/* Name-only text */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: '0 12px 0 8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            ...typeTitle,
            fontSize: 16,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            color: selected ? 'var(--gold)' : 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </span>
      </div>

      {/* Selection checkmark */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            zIndex: 5,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="#03070d"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </motion.button>
  )

  // Wrap with layoutId for shared layout animation if provided
  if (layoutId) {
    return (
      <motion.div layoutId={layoutId}>
        {card}
      </motion.div>
    )
  }

  return card
}
