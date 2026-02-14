/**
 * InfoCard — Full-size card component for text-based content (ancestries, communities).
 * Matches the SRDCard visual language: 360×508px, dark background, gold gradient title,
 * diamond separators, EB Garamond typography, atmosphere texture, card frame overlay.
 */

import { motion } from 'framer-motion'

export interface InfoCardFeat {
  name: string
  text: string
}

export interface InfoCardProps {
  title: string
  subtitle: string       // e.g. "Ancestry" or "Community"
  description: string
  feats: InfoCardFeat[]
  footerLeft?: string    // e.g. tier or empty
  footerRight?: string   // e.g. note
  accentColor?: string   // top accent line color, default gold
  scale?: number
  onClick?: () => void
}

const goldGradientStyle = {
  background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: 'none',
} as const

const subtitleStyle = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 'normal' as const,
  letterSpacing: '0.06em',
  fontVariant: 'small-caps' as const,
  ...goldGradientStyle,
}

export function InfoCard({
  title,
  subtitle,
  description,
  feats,
  footerLeft,
  footerRight,
  accentColor,
  scale = 1,
  onClick,
}: InfoCardProps) {
  const basePath = import.meta.env.BASE_URL || '/'

  const card = (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 360,
        height: 508,
        borderRadius: 12,
        background: '#03070d',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Top accent line (optional color bar like domain cards) */}
      {accentColor && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 24,
            right: 24,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            zIndex: 20,
          }}
        />
      )}

      {/* Decorative top area — atmosphere texture filling illustration zone */}
      <div
        className="relative"
        style={{
          height: 180,
          flexShrink: 0,
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* Atmosphere texture (flipped, full bleed) */}
        <img
          src={`${basePath}images/cards/atmosphere.png`}
          alt=""
          className="absolute w-full h-full pointer-events-none"
          style={{ objectFit: 'cover', opacity: 0.3, transform: 'scaleY(-1) scaleX(-1)' }}
          draggable={false}
        />

        {/* Large decorative title — faint, centered in top zone */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 72,
            fontWeight: 500,
            fontVariant: 'small-caps',
            letterSpacing: '0.02em',
            ...goldGradientStyle,
            opacity: 0.08,
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>

        {/* Bottom gradient fade into content */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 60,
            background: 'linear-gradient(to bottom, transparent, #03070d)',
          }}
        />
      </div>

      {/* Background atmosphere layer behind content */}
      <img
        src={`${basePath}images/cards/atmosphere.png`}
        alt=""
        className="absolute w-full pointer-events-none"
        style={{ top: 160, height: 348, objectFit: 'cover', transform: 'scaleY(-1)', zIndex: 1, opacity: 0.8 }}
        draggable={false}
      />

      {/* Content area — pinned to bottom, same structure as SRDCard */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col px-6"
        style={{
          minHeight: 348,
          zIndex: 10,
          background:
            'linear-gradient(180deg, rgba(31, 58, 96, 0) 0%, rgba(3, 7, 13, 0.81) 8%, rgba(3, 7, 13, 0.81) 83%, rgba(19, 36, 60, 0.35) 97%, rgba(31, 58, 96, 0) 100%)',
          gap: 10,
          paddingTop: 20,
          paddingBottom: 18,
        }}
      >
        {/* Title */}
        <div className="flex flex-col items-center text-center">
          <div style={{ filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))', width: '100%' }}>
            <h2
              style={{
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                fontSize: 32,
                lineHeight: '32px',
                letterSpacing: '0.01em',
                fontVariant: 'small-caps' as const,
                ...goldGradientStyle,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </h2>
          </div>

          {/* Separator with subtitle */}
          <div className="flex items-center w-full gap-2">
            <div className="flex items-center flex-1">
              <div className="flex-1" style={{ height: 2, background: 'linear-gradient(90deg, transparent, #e7ba90)' }} />
              <div className="mx-0.5" style={{ width: 4, height: 4, background: '#e7ba90', transform: 'rotate(45deg)' }} />
            </div>
            <div style={{ filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))' }}>
              <span style={subtitleStyle}>{subtitle}</span>
            </div>
            <div className="flex items-center flex-1">
              <div className="mx-0.5" style={{ width: 4, height: 4, background: '#e7ba90', transform: 'rotate(45deg)' }} />
              <div className="flex-1" style={{ height: 2, background: 'linear-gradient(90deg, #e7ba90, transparent)' }} />
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 12.5,
            lineHeight: '1.5',
            color: 'rgba(212, 207, 199, 0.75)',
            textShadow: '0px 1px 1px #4d381e',
            fontStyle: 'italic',
          }}
        >
          {description}
        </p>

        {/* Thin separator before feats */}
        <div className="flex items-center gap-2">
          <div className="flex-1" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(231, 186, 144, 0.3))' }} />
          <div style={{ width: 3, height: 3, background: '#e7ba90', transform: 'rotate(45deg)', opacity: 0.5 }} />
          <div className="flex-1" style={{ height: 1, background: 'linear-gradient(90deg, rgba(231, 186, 144, 0.3), transparent)' }} />
        </div>

        {/* Feats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {feats.map((feat, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13.5,
                lineHeight: '1.4',
                color: 'rgba(212, 207, 199, 0.9)',
                textShadow: '0px 1px 1px #4d381e',
              }}
            >
              <span style={{ fontWeight: 700 }}>{feat.name}:</span> {feat.text}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{ flexShrink: 0, filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))' }}
        >
          {footerLeft && <span style={subtitleStyle}>{footerLeft}</span>}
          {!footerLeft && <span />}
          {footerRight && <span style={subtitleStyle}>{footerRight}</span>}
        </div>
      </div>

      {/* Card frame overlay */}
      <img
        src={`${basePath}images/cards/frame.svg`}
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{ opacity: 0.6 }}
        draggable={false}
      />
    </div>
  )

  // Wrap in motion div for scale and interaction
  if (scale !== 1 || onClick) {
    return (
      <motion.div
        whileTap={onClick ? { scale: 0.98 } : undefined}
        whileHover={onClick ? { y: -4 } : undefined}
        onClick={onClick}
        style={{
          width: 360 * scale,
          height: 508 * scale,
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: 360,
            height: 508,
          }}
        >
          {card}
        </div>
      </motion.div>
    )
  }

  return card
}
