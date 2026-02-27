/**
 * CardHand — Displays cards in an overlapping hand layout, like holding cards in your hand.
 *
 * Inspired by the reference project at /Users/javan/Documents/Projects/cards/.
 * Cards overlap horizontally with negative margins. Hover lifts a card up and
 * raises its z-index so the full card is visible. Selected cards stay lifted.
 *
 * Props:
 * - children: Card elements (each wrapped in CardSelector for selection)
 * - overlap: Negative margin between cards in px (default -50)
 * - liftY: How many px to lift on hover (default 30)
 * - scale: CSS transform scale for each card slot (default 0.65)
 * - mobileScale: Scale override for mobile (<768px), falls back to scale * 0.8
 */

import {
  Children,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { CARD_WIDTH, CARD_HEIGHT } from './card-tokens'

export interface CardHandProps {
  children: ReactNode
  /** Negative margin between cards (default -50) */
  overlap?: number
  /** Hover lift in px (default 30) */
  liftY?: number
  /** Card scale factor for desktop (default 0.65) */
  scale?: number
  /** Card scale factor for mobile, defaults to scale * 0.8 */
  mobileScale?: number
}

export function CardHand({
  children,
  overlap = -50,
  liftY = 30,
  scale = 0.65,
  mobileScale,
}: CardHandProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const items = Children.toArray(children)
  const count = items.length

  // Scaled card slot dimensions
  const slotWidth = CARD_WIDTH * scale
  const slotHeight = CARD_HEIGHT * scale

  // Mobile scaled dimensions
  const mScale = mobileScale ?? scale * 0.8
  const mSlotWidth = CARD_WIDTH * mScale
  const mSlotHeight = CARD_HEIGHT * mScale

  // Mobile overlap: proportionally tighter
  const mOverlap = Math.round(overlap * (mScale / scale))

  // Compute visible width of the hand
  // First card: full width, subsequent cards: slotWidth + overlap
  const handWidth = count > 0
    ? slotWidth + (count - 1) * (slotWidth + overlap)
    : 0
  const mHandWidth = count > 0
    ? mSlotWidth + (count - 1) * (mSlotWidth + mOverlap)
    : 0

  return (
    <>
      {/* Desktop hand */}
      <div
        className="hidden md:flex"
        style={{
          justifyContent: 'center',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'visible',
          paddingTop: liftY + 10,
          paddingBottom: 10,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            width: handWidth,
            flexShrink: 0,
          }}
        >
          {items.map((child, i) => {
            const isHovered = hoveredIndex === i

            const slotStyle: CSSProperties = {
              width: slotWidth,
              height: slotHeight,
              flexShrink: 0,
              marginLeft: i === 0 ? 0 : overlap,
              zIndex: isHovered ? 100 : i + 1,
              transform: isHovered
                ? `translateY(-${liftY}px)`
                : 'translateY(0)',
              transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), z-index 0s',
              cursor: 'pointer',
              position: 'relative',
            }

            return (
              <div
                key={i}
                style={slotStyle}
                onPointerEnter={() => setHoveredIndex(i)}
                onPointerLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                  }}
                >
                  {child}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile hand — scrollable */}
      <div
        className="flex md:hidden"
        style={{
          justifyContent: 'flex-start',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'visible',
          paddingTop: liftY + 10,
          paddingBottom: 10,
          paddingLeft: 12,
          paddingRight: 12,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            width: mHandWidth,
            flexShrink: 0,
            margin: '0 auto',
          }}
        >
          {items.map((child, i) => {
            const slotStyle: CSSProperties = {
              width: mSlotWidth,
              height: mSlotHeight,
              flexShrink: 0,
              marginLeft: i === 0 ? 0 : mOverlap,
              zIndex: i + 1,
              cursor: 'pointer',
              position: 'relative',
            }

            return (
              <div key={i} style={slotStyle}>
                <div
                  style={{
                    transform: `scale(${mScale})`,
                    transformOrigin: 'top left',
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                  }}
                >
                  {child}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
