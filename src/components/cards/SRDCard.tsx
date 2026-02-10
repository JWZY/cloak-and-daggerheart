import { useId } from 'react'
import { type DomainIconName, DOMAIN_ICON_DATA } from './domain-icons'

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
  domainIcons?: [DomainIconName, DomainIconName]
  titleFontSize?: number
  titleLineHeight?: string
  titleLetterSpacing?: string
  titleSmallCaps?: boolean
  titleTextTransform?: string
  classNameFontSize?: number
  classNameLetterSpacing?: string
  bodyFontSize?: number
  bodyLineHeight?: string
  footerFontSize?: number
  footerSmallCaps?: boolean
  footerTextTransform?: string
  illustrationSrc?: string
  onClick?: () => void
}

// Generic domain icon with gold gradient fill and drop shadow
function DomainIconSvg({ name, uid }: { name: DomainIconName; uid: string }) {
  const icon = DOMAIN_ICON_DATA[name]
  const filterId = `${uid}-${name}-f`
  const gradientId = `${uid}-${name}-g`
  return (
    <svg viewBox={icon.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <g filter={`url(#${filterId})`}>
        <path d={icon.d} fill={`url(#${gradientId})`}/>
      </g>
      <defs>
        <filter id={filterId} filterUnits="objectBoundingBox" x="-0.1" y="-0.1" width="1.2" height="1.2" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feComposite in2="a" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.373 0 0 0 0 0.304 0 0 0 0 0 0 0 0 1 0"/>
          <feBlend in2="bg" result="s"/>
          <feBlend in="SourceGraphic" in2="s" result="shape"/>
        </filter>
        <linearGradient id={gradientId} gradientUnits="objectBoundingBox" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop stopColor="#F9F8F3"/>
          <stop offset="1" stopColor="#E7BA90"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// Masked banner — all layers clipped to a single pennant mask (Figma approach)
function MaskedBanner({ color = '#BD0C70', uid, domainIcons, basePath }: {
  color?: string; uid: string; domainIcons?: [DomainIconName, DomainIconName]; basePath: string
}) {
  const maskStyle = {
    WebkitMaskImage: `url('${basePath}images/cards/banners/banner-mask.svg')`,
    maskImage: `url('${basePath}images/cards/banners/banner-mask.svg')`,
    WebkitMaskSize: '40px 80px',
    maskSize: '40px 80px',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  } as React.CSSProperties

  const maskAt = (x: number, y: number) => ({
    ...maskStyle,
    WebkitMaskPosition: `${x}px ${y}px`,
    maskPosition: `${x}px ${y}px`,
  }) as React.CSSProperties

  return (
    <div className="absolute z-10" style={{ top: -2, left: 15, width: 40, height: 80 }}>
      {/* Layer 1: Outer trapezoid — masked to pennant */}
      <div className="absolute top-0 left-0 w-[40px] h-[70px]" style={maskAt(0, 0)}>
        <svg viewBox="0 0 40 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M39.4707 0.5L35.5283 69.5H4.47168L0.529297 0.5H39.4707Z" fill={color} stroke={`url(#${uid}-m-bg)`}/>
          <defs>
            <linearGradient id={`${uid}-m-bg`} x1="20" y1="24.57" x2="20" y2="53.62" gradientUnits="userSpaceOnUse">
              <stop offset="0.61" stopColor="#DBC593"/>
              <stop offset="1" stopColor="#C29734"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Layer 2: Inner pennant — masked to pennant */}
      <div className="absolute top-0 left-[5px] w-[30px] h-[80px]" style={maskAt(-5, 0)}>
        <svg viewBox="0 0 30 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M29.4854 0.5L27.5059 69.748L15 79.3691L2.49316 69.748L0.514648 0.5H29.4854Z" fill="#1E1E1E" stroke={`url(#${uid}-m-fg)`}/>
          <defs>
            <linearGradient id={`${uid}-m-fg`} x1="15" y1="0" x2="15" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9F8F3"/>
              <stop offset="1" stopColor="#E7BA90"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Layer 3: Domain icons — masked to pennant */}
      <div className="absolute flex flex-col items-center justify-center gap-0.5" style={{ top: 9, left: 8, width: 24, height: 48, ...maskAt(-8, -9) }}>
        <div style={{ width: 17, height: 18 }}>
          <DomainIconSvg name={domainIcons?.[0] ?? 'midnight'} uid={`${uid}-m`} />
        </div>
        <div style={{ width: 17, height: 18 }}>
          <DomainIconSvg name={domainIcons?.[1] ?? 'grace'} uid={`${uid}-m`} />
        </div>
      </div>
      {/* Layer 4: Texture overlay — masked to pennant */}
      <img
        src={`${basePath}images/cards/banners/banner-texture.png`}
        alt=""
        className="absolute top-0 left-0 w-[40px] h-[80px] pointer-events-none"
        style={{ mixBlendMode: 'multiply', ...maskAt(0, 0) }}
      />
    </div>
  )
}

// Gold gradient style shared across title elements
const goldGradientStyle = {
  background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: 'none', // text-shadow doesn't work with background-clip: text
} as const


export function SRDCard({
  name,
  className,
  tier,
  spellcastTrait,
  feats,
  featList,
  bannerColor = '#BD0C70',
  domainIcons,
  titleFontSize,
  titleLineHeight,
  titleLetterSpacing,
  titleSmallCaps,
  titleTextTransform,
  classNameFontSize,
  classNameLetterSpacing,
  bodyFontSize,
  bodyLineHeight,
  footerFontSize,
  footerSmallCaps = true,
  footerTextTransform,
  illustrationSrc,
  onClick,
}: SRDCardProps) {
  const basePath = import.meta.env.BASE_URL || '/'
  const uid = useId().replace(/:/g, '')

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 360,
        height: 508,
        borderRadius: 12,
        background: '#03070d',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Top illustration area */}
      <div className="relative" style={{ height: 288, flexShrink: 0 }}>
        {/* Character illustration */}
        {illustrationSrc && (
          <img
            src={illustrationSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
            draggable={false}
          />
        )}

        {/* Dark gradient overlay from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(3, 7, 13, 0.95) 70%)',
          }}
        />

        {/* Class banner (top-left) */}
        <MaskedBanner color={bannerColor} uid={uid} domainIcons={domainIcons} basePath={basePath} />
      </div>

      {/* Content area with gradient background */}
      <div
        className="relative flex flex-col flex-1 min-h-0 px-6"
        style={{
          marginTop: -120,
          zIndex: 10,
          background:
            'linear-gradient(180deg, rgba(31, 58, 96, 0) 0%, rgba(3, 7, 13, 0.81) 12%, rgba(3, 7, 13, 0.81) 83%, rgba(19, 36, 60, 0.35) 97%, rgba(31, 58, 96, 0) 100%)',
        }}
      >
        {/* Title section */}
        <div className="flex flex-col items-center text-center pt-2">
          {/* Subclass name */}
          <div style={{ filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))' }}>
            <h1
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: titleFontSize ?? 36,
                fontWeight: 400,
                lineHeight: titleLineHeight ?? '32px',
                letterSpacing: titleLetterSpacing ?? '0.02em',
                ...(titleSmallCaps ? { fontVariant: 'small-caps' as const } : {}),
                ...(titleTextTransform ? { textTransform: titleTextTransform as 'uppercase' | 'lowercase' | 'capitalize' | 'none' } : {}),
                ...goldGradientStyle,
              }}
            >
              {name}
            </h1>
          </div>

          {/* Decorative separator with class name */}
          <div className="flex items-center w-full mt-1 mb-3 gap-2">
            {/* Left line with diamond */}
            <div className="flex items-center flex-1">
              <div
                className="flex-1"
                style={{ height: 1, background: 'linear-gradient(90deg, transparent, #e7ba90)' }}
              />
              <div
                className="mx-0.5"
                style={{
                  width: 5,
                  height: 5,
                  background: '#e7ba90',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>

            {/* Class name */}
            <div style={{ filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))' }}>
              <span
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: classNameFontSize ?? 13,
                  fontWeight: 500,
                  letterSpacing: classNameLetterSpacing ?? '0.08em',
                  fontVariant: 'small-caps',
                  ...goldGradientStyle,
                }}
              >
                {className}
              </span>
            </div>

            {/* Right line with diamond */}
            <div className="flex items-center flex-1">
              <div
                className="mx-0.5"
                style={{
                  width: 5,
                  height: 5,
                  background: '#e7ba90',
                  transform: 'rotate(45deg)',
                }}
              />
              <div
                className="flex-1"
                style={{ height: 1, background: 'linear-gradient(90deg, #e7ba90, transparent)' }}
              />
            </div>
          </div>
        </div>

        {/* Body text */}
        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: bodyFontSize ?? 13,
            lineHeight: bodyLineHeight ?? '17px',
            color: 'rgba(249, 248, 243, 0.8)',
          }}
        >
          {feats.map((feat, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {feat.name && <><span style={{ fontWeight: 700 }}>{feat.name}:</span>{' '}</>}
              {feat.text}
            </p>
          ))}

          {featList && featList.length > 0 && (
            <ul
              className="mt-2"
              style={{
                listStyleType: 'disc',
                paddingLeft: 19.5,
              }}
            >
              {featList.map((item, i) => (
                <li key={i} className="mb-0.5">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between py-3"
          style={{ flexShrink: 0, filter: 'drop-shadow(0px 1px 2px #4d381e) drop-shadow(0px 0px 4px rgba(77, 56, 30, 0.5))' }}
        >
          <span
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: footerFontSize ?? 13,
              fontWeight: 500,
              lineHeight: 'normal',
              ...(footerSmallCaps ? { fontVariant: 'small-caps' as const } : {}),
              ...(footerTextTransform ? { textTransform: footerTextTransform as 'uppercase' | 'lowercase' | 'capitalize' | 'none' } : {}),
              ...goldGradientStyle,
            }}
          >
            {tier}
          </span>

          {spellcastTrait && (
            <span
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: footerFontSize ?? 13,
                fontWeight: 500,
                lineHeight: 'normal',
                ...(footerSmallCaps ? { fontVariant: 'small-caps' as const } : {}),
                ...(footerTextTransform ? { textTransform: footerTextTransform as 'uppercase' | 'lowercase' | 'capitalize' | 'none' } : {}),
                ...goldGradientStyle,
              }}
            >
              Spellcast: {spellcastTrait}
            </span>
          )}
        </div>
      </div>

      {/* Textured border frame overlay */}
      <img
        src={`${basePath}images/card-frame.svg`}
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{ opacity: 0.4 }}
        draggable={false}
      />
    </div>
  )
}
