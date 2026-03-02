import { useId, useRef, useEffect, useState } from 'react'
import { type DomainIconName, getDomainIconPath } from './domain-icons'
import { AutoFitTitle } from '../ui/AutoFitTitle'
import { typeTitle, typeBody } from '../ui/typography'
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

export interface SRDCardFeat {
  name?: string  // if omitted, no bold prefix
  text: string
}

export interface SRDCardProps {
  name: string
  className: string
  tier: string
  spellcastTrait?: string
  feats: SRDCardFeat[]
  featList?: string[]
  bannerColor?: string
  bannerInnerColor?: string
  domainIcons?: [DomainIconName, DomainIconName]
  titleFontSize?: number
  titleLineHeight?: string
  titleLetterSpacing?: string
  titleSmallCaps?: boolean
  titleTextTransform?: string
  titleShadowStyle?: 'heavy' | 'subtle'
  classNameFontSize?: number
  classNameLetterSpacing?: string
  classNameSmallCaps?: boolean
  separatorStyle?: 'code' | 'figma'
  bodyFontFamily?: string
  bodyFontSize?: number
  bodyLineHeight?: string
  bodyTextShadow?: boolean
  footerFontSize?: number
  footerSmallCaps?: boolean
  footerTextTransform?: string
  contentLayout?: 'code' | 'figma'
  showCardFrame?: boolean
  showIllustrationOverlay?: boolean
  illustrationSrc?: string
  onClick?: () => void
}

// Masked banner — all layers clipped to a single pennant mask (Figma approach)
function MaskedBanner({ color = '#BD0C70', innerColor = '#1E1E1E', uid, domainIcons, basePath }: {
  color?: string; innerColor?: string; uid: string; domainIcons?: [DomainIconName, DomainIconName]; basePath: string
}) {
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
      {/* Layer 1: Outer trapezoid — masked to pennant */}
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
      {/* Layer 2: Inner pennant — masked to pennant */}
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
      {/* Layer 3: Domain icons — masked to pennant */}
      <div className="absolute flex flex-col items-center justify-center gap-0.5" style={{ top: 5, left: 10, width: 24, height: 54, ...maskAt(-10, -5) }}>
        <img src={getDomainIconPath(domainIcons?.[0] ?? 'midnight', basePath)} alt="" width={24} height={24} draggable={false} />
        <img src={getDomainIconPath(domainIcons?.[1] ?? 'grace', basePath)} alt="" width={24} height={24} draggable={false} />
      </div>
      {/* Layer 4: Texture overlay — masked to pennant */}
      <img
        src={`${basePath}images/cards/banners/texture.png`}
        alt=""
        className="absolute top-0 left-0 w-[44px] h-[80px] pointer-events-none"
        style={{ mixBlendMode: 'multiply', ...maskAt(0, 0) }}
      />
    </div>
  )
}



// Content area baseline height — used to calculate illustration centering offset
const CONTENT_MIN_HEIGHT = 297

export function SRDCard({
  name,
  className,
  tier,
  spellcastTrait,
  feats,
  featList,
  bannerColor = '#BD0C70',
  bannerInnerColor = '#1E1E1E',
  domainIcons,
  titleFontSize,
  titleLineHeight,
  titleLetterSpacing,
  titleSmallCaps = true,
  titleTextTransform,
  titleShadowStyle = 'heavy',
  // classNameFontSize, classNameLetterSpacing, classNameSmallCaps — kept in interface, not used in render

  separatorStyle = 'figma',
  bodyFontFamily,
  bodyFontSize,
  bodyLineHeight,
  bodyTextShadow = true,
  // footerFontSize, footerSmallCaps, footerTextTransform — kept in interface, not used in render

  contentLayout = 'figma',
  showCardFrame = true,
  showIllustrationOverlay = false,
  illustrationSrc,
  onClick,
}: SRDCardProps) {
  const basePath = import.meta.env.BASE_URL || '/'
  const uid = useId().replace(/:/g, '')

  // Measure content area to dynamically center illustration in visible space
  const contentRef = useRef<HTMLDivElement>(null)
  const [illustrationOffset, setIllustrationOffset] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => {
      const contentHeight = el.offsetHeight
      // Shift illustration up by half the content overshoot so the
      // focal point stays centered in the visible space above content.
      // When content is at its minimum (297px), offset is 0 — no change.
      const overshoot = Math.max(0, contentHeight - CONTENT_MIN_HEIGHT)
      setIllustrationOffset(overshoot / 2)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [feats, featList])

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden flex flex-col"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: CARD_BORDER_RADIUS,
        background: CARD_BG,
        cursor: onClick ? 'pointer' : 'default',
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
        {/* Character illustration — vertically centered in visible space above content */}
        {illustrationSrc && (
          <img
            src={illustrationSrc}
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

        {/* Dark gradient overlay from bottom */}
        {showIllustrationOverlay && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, transparent 30%, rgba(3, 7, 13, 0.95) 70%)',
            }}
          />
        )}

        {/* Class banner (top-left) */}
        <MaskedBanner color={bannerColor} innerColor={bannerInnerColor} uid={uid} domainIcons={domainIcons} basePath={basePath} />
      </div>

      {/* Background atmosphere layer — flipped texture behind content */}
      <img
        src={`${basePath}images/cards/atmosphere.png`}
        alt=""
        className="absolute w-full pointer-events-none"
        style={{ top: 188, height: 319, objectFit: 'cover', transform: 'scaleY(-1)', zIndex: 1 }}
        draggable={false}
      />

      {/* Content area — min 297px, pinned to bottom, grows upward */}
      <div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 flex flex-col px-6"
        style={{
          minHeight: 297,
          zIndex: 10,
          background: CONTENT_OVERLAY_GRADIENT,
          ...(contentLayout === 'figma' ? { gap: 12, paddingTop: 24, paddingBottom: 18 } : {}),
        }}
      >
        {/* Title section */}
        <div className={contentLayout === 'figma' ? 'flex flex-col items-center text-center' : 'flex flex-col items-center text-center pt-2'}>
          {/* Subclass name */}
          <div style={{ filter: titleShadowStyle === 'subtle' ? 'drop-shadow(0px 1px 1px #4d381e)' : GOLD_DROP_SHADOW, width: '100%' }}>
            <AutoFitTitle
              maxFontSize={titleFontSize ?? 36}
              style={{
                ...typeTitle,
                lineHeight: titleLineHeight ?? '32px',
                letterSpacing: titleLetterSpacing ?? typeTitle.letterSpacing,
                ...(titleSmallCaps ? {} : { fontVariant: 'normal' as const }),
                ...(titleTextTransform ? { textTransform: titleTextTransform as 'uppercase' | 'lowercase' | 'capitalize' | 'none' } : {}),
                ...goldGradientStyle,
                textAlign: 'center',
              }}
            >
              {name}
            </AutoFitTitle>
          </div>

          {/* Decorative separator with class name */}
          <div className={contentLayout === 'figma' ? 'flex items-center w-full gap-2' : 'flex items-center w-full mt-1 mb-3 gap-2'}>
            {/* Left line with diamond */}
            <div className="flex items-center flex-1">
              <div
                className="flex-1"
                style={{ height: separatorStyle === 'figma' ? 2 : 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }}
              />
              <div
                className="mx-0.5"
                style={{
                  width: separatorStyle === 'figma' ? 4 : 5,
                  height: separatorStyle === 'figma' ? 4 : 5,
                  background: 'var(--gold)',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>

            {/* Class name */}
            <div style={{ filter: GOLD_DROP_SHADOW }}>
              <span style={subtitleStyle}>
                {className}
              </span>
            </div>

            {/* Right line with diamond */}
            <div className="flex items-center flex-1">
              <div
                className="mx-0.5"
                style={{
                  width: separatorStyle === 'figma' ? 4 : 5,
                  height: separatorStyle === 'figma' ? 4 : 5,
                  background: 'var(--gold)',
                  transform: 'rotate(45deg)',
                }}
              />
              <div
                className="flex-1"
                style={{ height: separatorStyle === 'figma' ? 2 : 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }}
              />
            </div>
          </div>
        </div>

        {/* Body text — fixed size, content area grows upward if needed */}
        <div
          style={{
            flex: 1,
            fontSize: bodyFontSize ?? typeBody.fontSize,
            fontFamily: bodyFontFamily ?? typeBody.fontFamily,
            lineHeight: bodyLineHeight ?? '1.4',
            color: 'var(--text-primary)',
            ...(bodyTextShadow ? { textShadow: '0px 1px 1px #4d381e' } : {}),
            ...(contentLayout === 'figma' ? { display: 'flex', flexDirection: 'column' as const, gap: 12 } : {}),
          }}
        >
          {feats.map((feat, i) => (
            <p key={i} className={contentLayout === 'figma' ? '' : (i > 0 ? 'mt-2' : '')}>
              {feat.name && <><span style={{ fontWeight: 700 }}>{feat.name}:</span>{' '}</>}
              {feat.text}
            </p>
          ))}

          {featList && featList.length > 0 && (
            <ul
              className={contentLayout === 'figma' ? '' : 'mt-2'}
              style={{
                listStyleType: 'disc',
                paddingLeft: 19.5,
              }}
            >
              {featList.map((item, i) => (
                <li key={i} className={contentLayout === 'figma' ? '' : 'mb-0.5'}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div
          className={contentLayout === 'figma' ? 'flex items-center justify-between' : 'flex items-center justify-between py-3'}
          style={{ flexShrink: 0, filter: GOLD_DROP_SHADOW }}
        >
          <span style={subtitleStyle}>
            {tier}
          </span>

          {spellcastTrait && (
            <span style={subtitleStyle}>
              Spellcast: {spellcastTrait}
            </span>
          )}
        </div>
      </div>

      {/* Textured border frame overlay */}
      {showCardFrame && (
        <img
          src={`${basePath}images/cards/frame.svg`}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          style={{ opacity: CARD_FRAME_OPACITY }}
          draggable={false}
        />
      )}
    </div>
  )
}
