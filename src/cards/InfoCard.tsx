/**
 * InfoCard — Full-size card component for text-based content (ancestries, communities).
 * Matches the SRDCard visual language: 360×508px, dark background, gold gradient title,
 * diamond separators, EB Garamond typography, atmosphere texture, card frame overlay.
 */

import { motion } from 'framer-motion'
import { tapFeedback } from '../design-system/tokens/animations'
import { FormatText } from '../ui/FormatText'
import { typeTitle, typeBodyCard as typeBody } from '../ui/typography'
import {
  goldGradientStyle,
  subtitleStyle,
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_BORDER_RADIUS,
  CARD_BG,
  GOLD_DROP_SHADOW,
  CARD_FRAME_OPACITY,
  CONTENT_OVERLAY_GRADIENT,
  ILLUSTRATION_MASK,
} from './card-tokens'

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
  illustrationSrc?: string // optional card illustration (top zone)
  scale?: number
  onClick?: () => void
}

export function InfoCard({
  title,
  subtitle,
  description,
  feats,
  footerLeft,
  footerRight,
  accentColor,
  illustrationSrc,
  scale = 1,
  onClick,
}: InfoCardProps) {
  const basePath = import.meta.env.BASE_URL || '/'

  const card = (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: CARD_BORDER_RADIUS,
        background: CARD_BG,
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

      {/* Top illustration / decorative zone */}
      <div
        className="relative"
        style={{
          height: 180,
          flexShrink: 0,
          zIndex: 2,
          overflow: 'hidden',
          WebkitMaskImage: ILLUSTRATION_MASK,
          maskImage: ILLUSTRATION_MASK,
        }}
      >
        {illustrationSrc ? (
          <>
            {/* Illustration image */}
            <img
              src={illustrationSrc}
              alt=""
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ objectFit: 'cover', objectPosition: 'top', userSelect: 'none' }}
              draggable={false}
            />
            {/* Atmosphere overlay for texture */}
            <img
              src={`${basePath}images/cards/atmosphere.png`}
              alt=""
              className="absolute w-full h-full pointer-events-none"
              style={{ objectFit: 'cover', opacity: 0.15, mixBlendMode: 'overlay' }}
              draggable={false}
            />
          </>
        ) : (
          <>
            {/* Fallback: atmosphere texture */}
            <img
              src={`${basePath}images/cards/atmosphere.png`}
              alt=""
              className="absolute w-full h-full pointer-events-none"
              style={{ objectFit: 'cover', opacity: 0.3, transform: 'scaleY(-1) scaleX(-1)' }}
              draggable={false}
            />
            {/* Large decorative title — faint, centered */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                ...typeTitle,
                fontSize: 72,
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
          </>
        )}
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
          background: CONTENT_OVERLAY_GRADIENT,
          gap: 10,
          paddingTop: 20,
          paddingBottom: 18,
        }}
      >
        {/* Title */}
        <div className="flex flex-col items-center text-center">
          <div style={{ filter: GOLD_DROP_SHADOW, width: '100%' }}>
            <h2
              style={{
                ...typeTitle,
                fontSize: 32,
                lineHeight: '32px',
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
              <div className="flex-1" style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
              <div className="mx-0.5" style={{ width: 4, height: 4, background: 'var(--gold)', transform: 'rotate(45deg)' }} />
            </div>
            <div style={{ filter: GOLD_DROP_SHADOW }}>
              <span style={subtitleStyle}>{subtitle}</span>
            </div>
            <div className="flex items-center flex-1">
              <div className="mx-0.5" style={{ width: 4, height: 4, background: 'var(--gold)', transform: 'rotate(45deg)' }} />
              <div className="flex-1" style={{ height: 2, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            ...typeBody,
            color: 'var(--text-secondary)',
            textShadow: '0px 1px 1px #4d381e',
            fontStyle: 'italic',
          }}
        >
          <FormatText text={description} />
        </div>

        {/* Thin separator before feats */}
        <div className="flex items-center gap-2">
          <div className="flex-1" style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold-muted))' }} />
          <div style={{ width: 3, height: 3, background: 'var(--gold-secondary)', transform: 'rotate(45deg)' }} />
          <div className="flex-1" style={{ height: 1, background: 'linear-gradient(90deg, var(--gold-muted), transparent)' }} />
        </div>

        {/* Feats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {feats.map((feat, i) => (
            <div
              key={i}
              style={{
                ...typeBody,
                color: 'var(--text-primary)',
                textShadow: '0px 1px 1px #4d381e',
              }}
            >
              <span style={{ fontWeight: 700 }}>{feat.name}:</span>{' '}
              <FormatText text={feat.text} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{ flexShrink: 0, filter: GOLD_DROP_SHADOW }}
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
        style={{ opacity: CARD_FRAME_OPACITY }}
        draggable={false}
      />
    </div>
  )

  // Wrap in motion div for scale and interaction
  if (scale !== 1 || onClick) {
    return (
      <motion.div
        whileTap={onClick ? tapFeedback.subtle : undefined}
        whileHover={onClick ? { y: -4 } : undefined}
        onClick={onClick}
        style={{
          width: CARD_WIDTH * scale,
          height: CARD_HEIGHT * scale,
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}
        >
          {card}
        </div>
      </motion.div>
    )
  }

  return card
}
