import { type DomainIconName, getDomainIconPath } from './domain-icons'
import { typeTitle, goldLight, goldDark, textShadowWarm } from '../ui/typography'

// Single-domain masked banner — shared between DomainCard and FlatDomainCard
// Optional domain2: when provided, shows two domain icons stacked (no level number)
export function DomainBanner({ outerColor, innerColor, uid, domain, basePath, level, domain2, scale = 1.2 }: {
  outerColor: string; innerColor: string; uid: string; domain: string; basePath: string; level?: string | number; domain2?: string; scale?: number
}) {
  const iconName = domain.toLowerCase() as DomainIconName
  const icon2Name = domain2?.toLowerCase() as DomainIconName | undefined

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
    <div className="absolute z-10" style={{ top: -2, left: 15, width: 44, height: 80, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      {/* Layer 1: Outer trapezoid */}
      <div className="absolute top-0 left-0 w-[44px] h-[70px]" style={maskAt(0, 0)}>
        <svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M43.4678 0.5L39.1299 69.5H4.87012L0.532227 0.5H43.4678Z" fill={outerColor} stroke={`url(#${uid}-m-bg)`}/>
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
          <path d="M29.4854 0.5L27.5059 69.748L15 79.3691L2.49316 69.748L0.514648 0.5H29.4854Z" fill={innerColor} stroke={`url(#${uid}-m-fg)`} />
          <defs>
            <linearGradient id={`${uid}-m-fg`} x1="15" y1="0" x2="15" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor={goldLight}/>
              <stop offset="1" stopColor={goldDark}/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Layer 3: Content — either level+icon, or two domain icons */}
      <div className="absolute flex flex-col items-center justify-center" style={{ top: 4, left: 10, width: 24, height: 60, gap: icon2Name ? 4 : 2, ...maskAt(-10, -4) }}>
        {icon2Name ? (
          <>
            <img src={getDomainIconPath(iconName, basePath)} alt="" width={20} height={20} draggable={false} />
            <img src={getDomainIconPath(icon2Name, basePath)} alt="" width={20} height={20} draggable={false} />
          </>
        ) : (
          <>
            {level != null && (
              <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  fontFamily: typeTitle.fontFamily,
                  fontSize: 24,
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: '-1.62px',
                  fontVariantNumeric: 'lining-nums proportional-nums',
                  textShadow: textShadowWarm,
                  color: 'var(--gold)',
                }}>
                  {level}
                </span>
              </div>
            )}
            <img src={getDomainIconPath(iconName, basePath)} alt="" width={24} height={24} draggable={false} />
          </>
        )}
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
