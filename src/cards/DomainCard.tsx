import { ReactNode, useId, useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { tapFeedback } from '../design-system/tokens/animations'
import { DOMAIN_COLORS, DOMAIN_COLORS_MUTED } from './domain-colors'
import { AutoFitTitle } from '../ui/AutoFitTitle'
import { DomainBanner } from './DomainBanner'
import { typeTitle, typeBodyCard as typeBody, textShadowWarm, selectionGreen, selectionGlow } from '../ui/typography'
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

// Content area baseline height
const CONTENT_MIN_HEIGHT = 297

export interface DomainCardProps {
  title: string
  subtitle?: string
  domain: string
  type?: string
  level?: string | number
  recall?: string
  artworkSrc?: string
  scale?: number
  selected?: boolean
  children?: ReactNode
  onClick?: () => void
}

export function DomainCard({
  title,
  domain,
  type,
  level,
  recall,
  artworkSrc,
  scale = 1,
  selected = false,
  children,
  onClick,
}: DomainCardProps) {
  const basePath = import.meta.env.BASE_URL || '/'
  const uid = useId().replace(/:/g, '')
  const domainColor = DOMAIN_COLORS[domain] || '#77457E'
  const domainColorMuted = DOMAIN_COLORS_MUTED[domain] || '#47294C'

  const separatorLabel = type || domain

  // Measure content area to dynamically center illustration in visible space
  const contentRef = useRef<HTMLDivElement>(null)
  const [illustrationOffset, setIllustrationOffset] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => {
      const contentHeight = el.offsetHeight
      const overshoot = Math.max(0, contentHeight - CONTENT_MIN_HEIGHT)
      setIllustrationOffset(overshoot / 2)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [children])

  const card = (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: CARD_BORDER_RADIUS,
        background: CARD_BG,
        cursor: onClick ? 'pointer' : 'default',
        // Selection ring
        ...(selected ? {
          outline: `3px solid ${selectionGreen}`,
          outlineOffset: -3,
          boxShadow: `0 0 20px ${selectionGlow}`,
        } : {}),
      }}
    >
      {/* Top illustration area */}
      <div className="relative" style={{
        height: 288,
        flexShrink: 0,
        zIndex: 2,
        WebkitMaskImage: ILLUSTRATION_MASK,
        maskImage: ILLUSTRATION_MASK,
      }}>
        {/* Artwork */}
        {artworkSrc && (
          <img
            src={artworkSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              objectPosition: `center calc(50% - ${illustrationOffset}px)`,
            }}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Domain banner (top-left) — single icon */}
        <DomainBanner outerColor={domainColorMuted} innerColor={domainColor} uid={uid} domain={domain} basePath={basePath} level={level} />

        {/* Recall cost badge (top-right) */}
        {recall && parseInt(String(recall)) > 0 && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              border: '1.5px solid var(--gold)',
              zIndex: 10,
            }}
          >
            <span style={{
              fontFamily: typeTitle.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--gold)',
              lineHeight: 1,
            }}>
              {recall}
            </span>
          </div>
        )}
      </div>

      {/* Background atmosphere layer */}
      <img
        src={`${basePath}images/cards/atmosphere.png`}
        alt=""
        className="absolute w-full pointer-events-none"
        style={{ top: 188, height: 319, objectFit: 'cover', transform: 'scaleY(-1)', zIndex: 1 }}
        draggable={false}
        loading="lazy"
        decoding="async"
      />

      {/* Content area — pinned to bottom, grows upward */}
      <div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 flex flex-col px-6"
        style={{
          minHeight: 297,
          zIndex: 10,
          background: CONTENT_OVERLAY_GRADIENT,
          gap: 12,
          paddingTop: 24,
          paddingBottom: 18,
        }}
      >
        {/* Title section */}
        <div className="flex flex-col items-center text-center">
          {/* Card name */}
          <div style={{ filter: GOLD_DROP_SHADOW, width: '100%' }}>
            <AutoFitTitle
              maxFontSize={36}
              style={{
                ...typeTitle,
                lineHeight: '32px',
                ...goldGradientStyle,
                textAlign: 'center',
              }}
            >
              {title}
            </AutoFitTitle>
          </div>

          {/* Decorative separator with domain name */}
          <div className="flex items-center w-full gap-2">
            {/* Left line with diamond */}
            <div className="flex items-center flex-1">
              <div
                className="flex-1"
                style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--gold))' }}
              />
              <div
                className="mx-0.5"
                style={{
                  width: 4,
                  height: 4,
                  background: 'var(--gold)',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>

            {/* Type label */}
            <div style={{ filter: GOLD_DROP_SHADOW }}>
              <span style={subtitleStyle}>
                {separatorLabel}
              </span>
            </div>

            {/* Right line with diamond */}
            <div className="flex items-center flex-1">
              <div
                className="mx-0.5"
                style={{
                  width: 4,
                  height: 4,
                  background: 'var(--gold)',
                  transform: 'rotate(45deg)',
                }}
              />
              <div
                className="flex-1"
                style={{ height: 2, background: 'linear-gradient(90deg, var(--gold), transparent)' }}
              />
            </div>
          </div>
        </div>

        {/* Body text */}
        <div
          style={{
            flex: 1,
            ...typeBody,
            color: 'var(--text-primary)',
            textShadow: textShadowWarm,
            display: 'flex',
            flexDirection: 'column' as const,
            gap: 12,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{ flexShrink: 0, filter: GOLD_DROP_SHADOW }}
        >
          <span style={subtitleStyle}>
            {domain}
          </span>
        </div>
      </div>

      {/* Textured border frame overlay */}
      <img
        src={`${basePath}images/cards/frame.svg`}
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{ opacity: CARD_FRAME_OPACITY }}
        draggable={false}
        loading="lazy"
        decoding="async"
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
