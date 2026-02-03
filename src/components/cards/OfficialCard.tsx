import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Official Daggerheart card dimensions: 360x504px at full size
const CARD_WIDTH = 360
const CARD_HEIGHT = 504

// Domain colors from Daggerheart
// eslint-disable-next-line react-refresh/only-export-components
export const DOMAIN_COLORS: Record<string, string> = {
  Arcana: '#4e345b',    // Deep purple
  Blade: '#8b2635',     // Deep red
  Bone: '#4a4238',      // Dark brown
  Codex: '#1e3a5f',     // Deep blue
  Grace: '#7a3654',     // Deep magenta
  Midnight: '#1a1a2e',  // Near black
  Sage: '#2d4a3e',      // Deep green
  Splendor: '#8b6914',  // Deep gold
  Valor: '#944e1c',     // Deep orange
}

// Domain icons (simplified geometric versions)
const DomainIcon = ({ domain, size = 32 }: { domain: string; size?: number }) => {
  // Using simplified geometric shapes for each domain
  const iconPaths: Record<string, ReactNode> = {
    Arcana: (
      <path d="M16 4l3 8h8l-6.5 5 2.5 8-7-5-7 5 2.5-8L5 12h8z" fill="currentColor" />
    ),
    Blade: (
      <path d="M16 2L8 30h2l6-20 6 20h2z" fill="currentColor" />
    ),
    Bone: (
      <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    ),
    Codex: (
      <path d="M6 4v24h20V8l-6-4H6zm14 0v6h6" fill="none" stroke="currentColor" strokeWidth="2" />
    ),
    Grace: (
      <path d="M16 4c-6 8-10 12-10 16a10 10 0 0020 0c0-4-4-8-10-16z" fill="currentColor" />
    ),
    Midnight: (
      <path d="M16 4A12 12 0 004 16a12 12 0 0012 12c-4-3-6-7-6-12s2-9 6-12z" fill="currentColor" />
    ),
    Sage: (
      <path d="M16 28c6-4 10-10 10-18-4 2-6 4-10 4s-6-2-10-4c0 8 4 14 10 18z" fill="currentColor" />
    ),
    Splendor: (
      <path d="M16 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="currentColor" />
    ),
    Valor: (
      <path d="M8 8h16v6l-8 10-8-10z" fill="currentColor" />
    ),
  }

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="fill-white/90">
      {iconPaths[domain] || <circle cx="16" cy="16" r="10" fill="currentColor" />}
    </svg>
  )
}

interface OfficialCardProps {
  title: string
  subtitle?: string
  domain: string
  tier: 'Foundation' | 'Specialization' | 'Mastery'
  type?: string
  level?: number
  recall?: string
  children: ReactNode
  backgroundImage?: string
  scale?: number
  onClick?: () => void
  className?: string
}

export function OfficialCard({
  title,
  subtitle,
  domain,
  tier,
  type,
  level,
  recall,
  children,
  backgroundImage,
  scale = 1,
  onClick,
  className = '',
}: OfficialCardProps) {
  const domainColor = DOMAIN_COLORS[domain] || '#4e345b'
  const width = CARD_WIDTH * scale
  const height = CARD_HEIGHT * scale

  const tierLabel = {
    Foundation: 'I',
    Specialization: 'II',
    Mastery: 'III',
  }

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      whileHover={onClick ? { y: -4 } : undefined}
      onClick={onClick}
      className={`relative overflow-hidden flex flex-col bg-white shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        width,
        height,
        borderRadius: 20 * scale,
        border: `${2 * scale}px solid #c9a227`, // Gold border
      }}
    >
      {/* Main content area */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white w-full overflow-hidden">
        {/* Left banner */}
        <div
          className="absolute -top-1 z-40"
          style={{
            left: 13.5 * scale,
          }}
        >
          {/* Banner background image */}
          <img
            src="/images/cards/official/banner.webp"
            alt=""
            className="block"
            style={{
              height: 120 * scale,
              width: 75 * scale,
            }}
          />
          {/* Domain color overlay (using clip-path for banner shape) */}
          <div
            className="absolute -top-1"
            style={{
              left: 2.5 * scale,
              height: 120 * scale,
              width: 71 * scale,
              background: `linear-gradient(180deg, ${domainColor} 0%, ${domainColor}dd 50%, ${domainColor}bb 100%)`,
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
            }}
          />
          {/* Domain icon */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pb-3 gap-1"
            style={{ paddingTop: 8 * scale }}
          >
            <DomainIcon domain={domain} size={36 * scale} />
            <DomainIcon domain={domain} size={36 * scale} />
          </div>
        </div>

        {/* Background image (for subclass cards) */}
        {backgroundImage && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />
        )}

        {/* Card header */}
        <div
          className="relative z-30 flex flex-col"
          style={{
            paddingLeft: 100 * scale,
            paddingRight: 16 * scale,
            paddingTop: 16 * scale,
          }}
        >
          {/* Tier badge */}
          <div
            className="inline-flex items-center gap-1 self-start rounded-full text-white font-semibold"
            style={{
              backgroundColor: domainColor,
              padding: `${4 * scale}px ${12 * scale}px`,
              fontSize: 11 * scale,
              marginBottom: 8 * scale,
            }}
          >
            <span>{tier}</span>
            <span className="opacity-70">({tierLabel[tier]})</span>
          </div>

          {/* Title */}
          <h2
            className="font-bold text-gray-900 leading-tight"
            style={{
              fontSize: 20 * scale,
              marginBottom: subtitle ? 4 * scale : 0,
            }}
          >
            {title}
          </h2>

          {/* Subtitle (e.g., subclass name) */}
          {subtitle && (
            <p
              className="text-gray-600"
              style={{ fontSize: 12 * scale }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          className="relative z-30"
          style={{
            marginTop: 12 * scale,
            marginBottom: 12 * scale,
            marginLeft: 16 * scale,
            marginRight: 16 * scale,
          }}
        >
          <img
            src="/images/cards/official/subclass-divider.png"
            alt=""
            className="w-full opacity-60"
            style={{ height: 8 * scale }}
          />
        </div>

        {/* Card metadata row */}
        {(type || level !== undefined || recall) && (
          <div
            className="relative z-30 flex items-center gap-3 text-gray-500"
            style={{
              paddingLeft: 16 * scale,
              paddingRight: 16 * scale,
              marginBottom: 8 * scale,
              fontSize: 11 * scale,
            }}
          >
            {type && <span className="uppercase tracking-wider">{type}</span>}
            {level !== undefined && (
              <>
                <span>•</span>
                <span>Level {level}</span>
              </>
            )}
            {recall && parseInt(recall) > 0 && (
              <>
                <span>•</span>
                <span>Recall {recall}</span>
              </>
            )}
          </div>
        )}

        {/* Content area */}
        <div
          className="relative z-30 flex-1 overflow-auto"
          style={{
            paddingLeft: 16 * scale,
            paddingRight: 16 * scale,
          }}
        >
          <div
            className="text-gray-800 leading-relaxed"
            style={{ fontSize: 13 * scale }}
          >
            {children}
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ height: 16 * scale }} />
      </div>
    </motion.div>
  )
}

// Compact version for rail display
interface OfficialCardCompactProps {
  title: string
  subtitle?: string
  domain: string
  tier: 'Foundation' | 'Specialization' | 'Mastery'
  children: ReactNode
  backgroundImage?: string
  onClick?: () => void
}

export function OfficialCardCompact({
  title,
  subtitle,
  domain,
  tier,
  children,
  backgroundImage,
  onClick,
}: OfficialCardCompactProps) {
  return (
    <OfficialCard
      title={title}
      subtitle={subtitle}
      domain={domain}
      tier={tier}
      backgroundImage={backgroundImage}
      scale={0.5}
      onClick={onClick}
    >
      {children}
    </OfficialCard>
  )
}
