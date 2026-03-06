import { CARD_WIDTH, CARD_HEIGHT } from './card-tokens'

interface ScaledCardProps {
  scale: number
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Wraps a card component at full resolution (360x508) and applies CSS
 * `transform: scale()` to visually shrink it. This keeps artwork sharp
 * on retina displays — the card always renders at its canonical size
 * and the outer container clips to the scaled dimensions.
 */
export function ScaledCard({ scale, children, className, style }: ScaledCardProps) {
  return (
    <div
      className={className}
      style={{
        width: CARD_WIDTH * scale,
        height: CARD_HEIGHT * scale,
        position: 'relative',
        ...style,
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}
