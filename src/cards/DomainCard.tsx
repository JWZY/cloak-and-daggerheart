import { ReactNode, useId, useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DOMAIN_COLORS } from './domain-colors'
import { type DomainIconName, getDomainIconPath } from './domain-icons'

// Gold gradient style shared across title elements (matches SRDCard)
const goldGradientStyle = {
  background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: 'none',
} as const

// Shared subtitle style — used by domain name in separator and footer (matches SRDCard)
const subtitleStyle = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 'normal' as const,
  letterSpacing: '0.06em',
  fontVariant: 'small-caps' as const,
  ...goldGradientStyle,
}

// Single-domain masked banner (adapted from SRDCard's MaskedBanner for one icon)
function DomainBanner({ color, uid, domain, basePath }: {
  color: string; uid: string; domain: string; basePath: string
}) {
  // Darken the domain color for the inner pennant
  const innerColor = darkenColor(color, 0.35)
  const iconName = domain.toLowerCase() as DomainIconName

  const maskStyle = {
    WebkitMaskImage: `url('${basePath}images/cards/banners/mask.svg')`,
    maskImage: `url('${basePath}images/cards/banners/mask.svg')`,
    WebkitMaskSize: '44px 80px',
    maskSize: '44px 80px',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  } as React.CSSProperties

  const maskAt = (x: number, y: number) => ({
    ...maskStyle,
    WebkitMaskPosition: `${x}px ${y}px`,
    maskPosition: `${x}px ${y}px`,
  }) as React.CSSProperties

  return (
    <div className="absolute z-10" style={{ top: -2, left: 15, width: 44, height: 80, transform: 'scale(1.2)', transformOrigin: 'top left' }}>
      {/* Layer 1: Outer trapezoid */}
      <div className="absolute top-0 left-0 w-[44px] h-[70px]" style={maskAt(0, 0)}>
        <svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M43.4678 0.5L39.1299 69.5H4.87012L0.532227 0.5H43.4678Z" fill={color} stroke={`url(#${uid}-m-bg)`}/>
          <defs>
            <linearGradient id={`${uid}-m-bg`} x1="22" y1="24.57" x2="22" y2="53.62" gradientUnits="userSpaceOnUse">
              <stop offset="0.61" stopColor="#DBC593"/>
              <stop offset="1" stopColor="#C29734"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Layer 2: Inner pennant */}
      <div className="absolute top-0 left-[7px] w-[30px] h-[80px]" style={maskAt(-7, 0)}>
        <svg viewBox="0 0 30 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M29.4854 0.5L27.5059 69.748L15 79.3691L2.49316 69.748L0.514648 0.5H29.4854Z" fill={innerColor} stroke={`url(#${uid}-m-fg)`}/>
          <defs>
            <linearGradient id={`${uid}-m-fg`} x1="15" y1="0" x2="15" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9F8F3"/>
              <stop offset="1" stopColor="#E7BA90"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Layer 3: Single domain icon — centered in pennant */}
      <div className="absolute flex flex-col items-center justify-center" style={{ top: 10, left: 10, width: 24, height: 44, ...maskAt(-10, -10) }}>
        <img src={getDomainIconPath(iconName, basePath)} alt="" width={24} height={24} draggable={false} />
      </div>
      {/* Layer 4: Texture overlay */}
      <img
        src={`${basePath}images/cards/banners/texture.png`}
        alt=""
        className="absolute top-0 left-0 w-[44px] h-[80px] pointer-events-none"
        style={{ mixBlendMode: 'multiply', ...maskAt(0, 0) }}
      />
    </div>
  )
}

/** Darken a hex color by a factor (0 = no change, 1 = black) */
function darkenColor(hex: string, factor: number): string {
  const h = hex.replace('#', '')
  const r = Math.round(parseInt(h.substring(0, 2), 16) * (1 - factor))
  const g = Math.round(parseInt(h.substring(2, 4), 16) * (1 - factor))
  const b = Math.round(parseInt(h.substring(4, 6), 16) * (1 - factor))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Auto-sizing title that scales down to fit on one line (same as SRDCard)
function AutoFitTitle({ children, maxFontSize = 36, style }: {
  children: React.ReactNode
  maxFontSize?: number
  style?: React.CSSProperties
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const [fontSize, setFontSize] = useState(maxFontSize)

  const fit = useCallback(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return
    let size = maxFontSize
    text.style.fontSize = `${size}px`
    while (text.scrollWidth > container.clientWidth && size > 12) {
      size -= 0.5
      text.style.fontSize = `${size}px`
    }
    setFontSize(size)
  }, [maxFontSize])

  useEffect(() => { fit() }, [fit, children])

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden' }}>
      <h1 ref={textRef} style={{ ...style, fontSize, whiteSpace: 'nowrap' }}>
        {children}
      </h1>
    </div>
  )
}

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
  const domainColor = DOMAIN_COLORS[domain] || '#4e345b'

  // Build subtitle line: "Grimoire · Level 1 · Recall 2"
  const subtitleParts: string[] = []
  if (type) subtitleParts.push(type)
  if (level !== undefined) subtitleParts.push(`Level ${level}`)
  if (recall && parseInt(String(recall)) > 0) subtitleParts.push(`Recall ${recall}`)
  const subtitleLine = subtitleParts.join(' \u00B7 ')

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
        width: 360,
        height: 508,
        borderRadius: 12,
        background: '#03070d',
        cursor: onClick ? 'pointer' : 'default',
        // Selection ring
        ...(selected ? {
          outline: '3px solid #22c55e',
          outlineOffset: -3,
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
        } : {}),
      }}
    >
      {/* Top illustration area */}
      <div className="relative" style={{
        height: 288,
        flexShrink: 0,
        zIndex: 2,
        WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 10px), transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black calc(100% - 10px), transparent 100%)',
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
          />
        )}

        {/* Domain banner (top-left) — single icon */}
        <DomainBanner color={domainColor} uid={uid} domain={domain} basePath={basePath} />
      </div>

      {/* Background atmosphere layer */}
      <img
        src={`${basePath}images/cards/atmosphere.png`}
        alt=""
        className="absolute w-full pointer-events-none"
        style={{ top: 188, height: 319, objectFit: 'cover', transform: 'scaleY(-1)', zIndex: 1 }}
        draggable={false}
      />

      {/* Content area — pinned to bottom, grows upward */}
      <div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 flex flex-col px-6"
        style={{
          minHeight: 297,
          zIndex: 10,
          background:
            'linear-gradient(180deg, rgba(31, 58, 96, 0) 0%, rgba(3, 7, 13, 0.81) 12%, rgba(3, 7, 13, 0.81) 83%, rgba(19, 36, 60, 0.35) 97%, rgba(31, 58, 96, 0) 100%)',
          gap: 12,
          paddingTop: 24,
          paddingBottom: 18,
        }}
      >
        {/* Title section */}
        <div className="flex flex-col items-center text-center">
          {/* Card name */}
          <div style={{ filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))', width: '100%' }}>
            <AutoFitTitle
              maxFontSize={36}
              style={{
                fontFamily: "'EB Garamond', serif",
                fontWeight: 500,
                lineHeight: '32px',
                letterSpacing: '0.01em',
                fontVariant: 'small-caps' as const,
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
                style={{ height: 2, background: 'linear-gradient(90deg, transparent, #e7ba90)' }}
              />
              <div
                className="mx-0.5"
                style={{
                  width: 4,
                  height: 4,
                  background: '#e7ba90',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>

            {/* Domain name */}
            <div style={{ filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))' }}>
              <span style={subtitleStyle}>
                {domain}
              </span>
            </div>

            {/* Right line with diamond */}
            <div className="flex items-center flex-1">
              <div
                className="mx-0.5"
                style={{
                  width: 4,
                  height: 4,
                  background: '#e7ba90',
                  transform: 'rotate(45deg)',
                }}
              />
              <div
                className="flex-1"
                style={{ height: 2, background: 'linear-gradient(90deg, #e7ba90, transparent)' }}
              />
            </div>
          </div>
        </div>

        {/* Subtitle metadata line */}
        {subtitleLine && (
          <div className="text-center" style={{ marginTop: -4 }}>
            <span style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'rgba(212, 207, 199, 0.6)',
            }}>
              {subtitleLine}
            </span>
          </div>
        )}

        {/* Body text */}
        <div
          style={{
            flex: 1,
            fontSize: 13.5,
            fontFamily: "'Source Sans 3', sans-serif",
            lineHeight: '1.4',
            color: 'rgba(212, 207, 199, 0.9)',
            textShadow: '0px 1px 1px #4d381e',
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
          style={{ flexShrink: 0, filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))' }}
        >
          <span style={subtitleStyle}>
            {domain}
          </span>
          <span style={subtitleStyle}>
            Daggerheart Compatible
          </span>
        </div>
      </div>

      {/* Textured border frame overlay */}
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
