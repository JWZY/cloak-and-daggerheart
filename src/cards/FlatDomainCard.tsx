import { motion } from 'framer-motion'
import { DOMAIN_COLORS } from './domain-colors'
import { type DomainIconName, getDomainIconPath } from './domain-icons'

// ---------------------------------------------------------------------------
// FlatDomainCard — horizontal "list-row" card for compact domain card pickers
// ---------------------------------------------------------------------------

export interface FlatDomainCardProps {
  /** Card name, e.g. "Book of Ava" */
  title: string
  /** Domain name, e.g. "Codex" */
  domain: string
  /** Card type, e.g. "Grimoire" */
  type?: string
  /** Card level */
  level?: string | number
  /** Recall cost (shown as badge if > 0) */
  recall?: string
  /** Path to artwork image */
  artworkSrc?: string
  /** Parsed body text sections */
  abilities?: { name: string; text: string }[]
  /** Whether this card is currently selected */
  selected?: boolean
  /** Whether this card is dimmed (max selected and not this one) */
  dimmed?: boolean
  /** Called when the card is tapped/clicked */
  onClick?: () => void
}

const THUMB_SIZE = 80

export function FlatDomainCard({
  title,
  domain,
  type,
  level,
  recall,
  artworkSrc,
  abilities = [],
  selected = false,
  dimmed = false,
  onClick,
}: FlatDomainCardProps) {
  const basePath = import.meta.env.BASE_URL || '/'
  const domainColor = DOMAIN_COLORS[domain] || '#4e345b'
  const iconName = domain.toLowerCase() as DomainIconName

  // Build metadata line: "Grimoire / Level 1 / Recall 2"
  const metaParts: string[] = []
  if (type) metaParts.push(type)
  if (level !== undefined) metaParts.push(`Level ${level}`)
  if (recall && parseInt(String(recall)) > 0) metaParts.push(`Recall ${recall}`)
  const metaLine = metaParts.join('  \u00B7  ')

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
      style={{
        display: 'flex',
        width: '100%',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        background: selected
          ? 'rgba(231, 186, 144, 0.06)'
          : 'rgba(255, 255, 255, 0.02)',
        border: selected
          ? '1px solid rgba(231, 186, 144, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.06)',
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
            ? `linear-gradient(180deg, ${domainColor}, rgba(231, 186, 144, 0.6))`
            : domainColor,
          opacity: selected ? 1 : 0.6,
          borderRadius: '12px 0 0 12px',
        }}
      />

      {/* Selection glow */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: `inset 0 0 20px rgba(231, 186, 144, 0.08), 0 0 12px rgba(231, 186, 144, 0.1)`,
            borderRadius: 12,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Thumbnail area */}
      <div
        style={{
          position: 'relative',
          width: THUMB_SIZE,
          minHeight: THUMB_SIZE,
          flexShrink: 0,
          overflow: 'hidden',
          background: '#0a0e14',
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

        {/* Dark overlay for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Level badge (top-left) */}
        {level != null && (
          <span
            style={{
              position: 'absolute',
              top: 6,
              left: 8,
              fontFamily: "'EB Garamond', serif",
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'lining-nums proportional-nums',
              color: '#e7ba90',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {level}
          </span>
        )}

        {/* Domain icon (bottom-right) */}
        <img
          src={getDomainIconPath(iconName, basePath)}
          alt=""
          style={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            width: 18,
            height: 18,
            opacity: 0.8,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
          }}
          draggable={false}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: '10px 12px 10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 17,
              fontWeight: 600,
              fontVariant: 'small-caps',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              color: selected ? '#f9f8f3' : 'rgba(212, 207, 199, 0.95)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </span>

          {/* Recall cost badge */}
          {recall && parseInt(String(recall)) > 0 && (
            <span
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: 6,
                background: `${domainColor}33`,
                border: `1px solid ${domainColor}66`,
                fontFamily: "'EB Garamond', serif",
                fontSize: 13,
                fontWeight: 600,
                color: '#e7ba90',
              }}
            >
              {recall}
            </span>
          )}
        </div>

        {/* Metadata line */}
        {metaLine && (
          <span
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'rgba(212, 207, 199, 0.45)',
              textTransform: 'uppercase',
            }}
          >
            {metaLine}
          </span>
        )}

        {/* Body text (abilities) */}
        {abilities.length > 0 && (
          <div
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 12.5,
              lineHeight: 1.4,
              color: 'rgba(212, 207, 199, 0.7)',
              marginTop: 2,
              // Limit to ~3 visible lines for scannability
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {abilities.map((a, i) => (
              <span key={i}>
                {i > 0 && ' '}
                {a.name && (
                  <strong style={{ color: 'rgba(212, 207, 199, 0.85)' }}>
                    {a.name}:{' '}
                  </strong>
                )}
                {a.text}
              </span>
            ))}
          </div>
        )}
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
}
