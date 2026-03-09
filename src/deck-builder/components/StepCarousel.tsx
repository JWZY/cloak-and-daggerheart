import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useSpring, useTransform, useMotionValue, type MotionStyle } from 'framer-motion'
import { typeTitle, goldGradientStyle, goldDarkAlpha } from '../../ui/typography'

const STEP_NAMES = [
  'Class',
  'Subclass',
  'Domains',
  'Ancestry',
  'Community',
  'Equipment',
  'Traits',
  'Experiences',
  'Name',
]

const DOT_WIDTH = 24 // approximate width of " · " separator

const labelStyle: React.CSSProperties = {
  ...typeTitle,
  fontSize: 36,
  fontWeight: 400,
  lineHeight: 1,
  background: 'none',
  border: 'none',
  padding: '8px 4px',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  whiteSpace: 'nowrap',
}

interface StepCarouselProps {
  currentStep: number
  /** Navigate to any step by index */
  onGoToStep: (step: number) => void
  /** Which steps are reachable (visited or completable) */
  maxReachableStep?: number
}

export function StepCarousel({
  currentStep,
  onGoToStep,
  maxReachableStep = currentStep,
}: StepCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [containerWidth, setContainerWidth] = useState(0)

  // Measure container width
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Calculate the x offset to center the current step
  const getOffset = useCallback(() => {
    const items = itemRefs.current
    if (!items.length || !containerWidth) return 0

    let offset = 0
    for (let i = 0; i < currentStep; i++) {
      const el = items[i]
      if (el) offset += el.offsetWidth
      if (i < STEP_NAMES.length - 1) offset += DOT_WIDTH
    }

    const currentEl = items[currentStep]
    const currentWidth = currentEl?.offsetWidth ?? 0
    offset += currentWidth / 2

    return containerWidth / 2 - offset
  }, [currentStep, containerWidth])

  // Spring-animated base offset (centers current step)
  const baseX = useSpring(getOffset(), { stiffness: 200, damping: 30, mass: 0.8 })

  useEffect(() => {
    baseX.set(getOffset())
  }, [currentStep, containerWidth, getOffset, baseX])

  // Drag offset (added on top of base)
  const dragX = useMotionValue(0)

  // Combine base spring + drag offset
  const trackX = useTransform([baseX, dragX], ([b, d]) => `translateX(${(b as number) + (d as number)}px)`)

  // Track drag start to distinguish taps from drags
  const dragStartX = useRef(0)
  const isDragging = useRef(false)

  const handleClick = (index: number) => {
    // Don't navigate if we just finished a drag
    if (isDragging.current) return
    if (index === currentStep) return
    // Allow going back to any visited step, or forward if reachable
    if (index <= maxReachableStep) {
      onGoToStep(index)
    }
  }

  const getItemStyle = (index: number): MotionStyle => {
    const isCurrent = index === currentStep
    const isReachable = index <= maxReachableStep

    if (isCurrent) {
      return { ...labelStyle, ...goldGradientStyle, cursor: 'default' }
    }

    return {
      ...labelStyle,
      color: goldDarkAlpha(0.3),
      opacity: isReachable ? 1 : 0.4,
      cursor: isReachable ? 'pointer' : 'default',
    }
  }

  const dotColor = goldDarkAlpha(0.3)

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        paddingTop: 12,
        paddingBottom: 4,
        overflow: 'hidden',
        maskImage:
          'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        touchAction: 'pan-y',
      }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={(_, info) => {
          dragStartX.current = info.point.x
          isDragging.current = false
        }}
        onDrag={(_, info) => {
          if (Math.abs(info.point.x - dragStartX.current) > 5) {
            isDragging.current = true
          }
          dragX.set(info.offset.x)
        }}
        onDragEnd={() => {
          // Snap back — spring the drag offset to 0
          dragX.set(0)
          // Reset drag flag after a tick so click handlers can check it
          requestAnimationFrame(() => { isDragging.current = false })
        }}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          whiteSpace: 'nowrap',
          transform: trackX,
          willChange: 'transform',
          cursor: 'grab',
        }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {STEP_NAMES.map((name, index) => (
          <span key={index} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
            {index > 0 && (
              <span style={{
                ...labelStyle,
                color: dotColor,
                padding: '0 8px',
                cursor: 'default',
                width: DOT_WIDTH,
                textAlign: 'center',
              }}>
                &middot;
              </span>
            )}
            <motion.button
              ref={(el) => { itemRefs.current[index] = el }}
              onClick={() => handleClick(index)}
              whileTap={index <= maxReachableStep && index !== currentStep ? { scale: 0.95 } : undefined}
              style={getItemStyle(index)}
            >
              {name}
            </motion.button>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
