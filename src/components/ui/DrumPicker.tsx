import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { Sheet } from './Sheet'

interface DrumPickerProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  label: string
  icon?: React.ReactNode
  color?: string
}

export function DrumPicker({
  value,
  onChange,
  min,
  max,
  label,
  icon,
  color = 'white',
}: DrumPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Called only when scrolling settles - commits the final value
  const handleSettle = (newValue: number) => {
    onChange(newValue)
  }

  return (
    <>
      {/* Compact Trigger */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center gap-1 p-3 rounded-2xl glass min-w-[80px]"
      >
        <div className="flex items-center gap-1.5 text-white/60">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-3xl font-bold text-white">
          {value}
        </span>
      </motion.button>

      {/* Bottom Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col items-center gap-4 pb-6">
          {/* Label with icon */}
          <div className="flex items-center gap-2 text-white/70">
            {icon}
            <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
          </div>

          {/* Horizontal Number Picker */}
          <HorizontalNumberPicker
            value={value}
            min={min}
            max={max}
            onSettle={handleSettle}
            color={color}
          />
        </div>
      </Sheet>
    </>
  )
}

// ============================================
// HORIZONTAL NUMBER PICKER - Scrollable numbers
// ============================================

interface HorizontalNumberPickerProps {
  value: number
  min: number
  max: number
  onSettle: (value: number) => void
  color?: string
}

function HorizontalNumberPicker({ value, min, max, onSettle, color = 'white' }: HorizontalNumberPickerProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const startIndex = value - min
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [isScrolling, setIsScrolling] = useState(false)
  const currentIndexRef = useRef(startIndex)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'x',
    align: 'center',
    containScroll: false,
    startIndex,
    dragFree: false,
  })

  // Update visual state in real-time during scroll
  // Uses scrollProgress to calculate closest snap for continuous updates
  const onScroll = useCallback(() => {
    if (!emblaApi) return
    setIsScrolling(true)

    const progress = emblaApi.scrollProgress()
    const snapList = emblaApi.scrollSnapList()

    // Find closest snap to current scroll position
    let closestIndex = 0
    let closestDistance = Infinity

    snapList.forEach((snapPos, index) => {
      const distance = Math.abs(progress - snapPos)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    if (closestIndex !== currentIndexRef.current) {
      currentIndexRef.current = closestIndex
      setCurrentIndex(closestIndex)
    }
  }, [emblaApi])

  // Called when snap selection changes - update visual state immediately
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const newIndex = emblaApi.selectedScrollSnap()
    currentIndexRef.current = newIndex
    setCurrentIndex(newIndex)
  }, [emblaApi])

  // Called when scrolling settles - commit the final value
  const onSettleHandler = useCallback(() => {
    if (!emblaApi) return
    setIsScrolling(false)
    const newIndex = emblaApi.selectedScrollSnap()
    const newValue = min + newIndex
    currentIndexRef.current = newIndex
    setCurrentIndex(newIndex)
    onSettle(newValue)
  }, [emblaApi, min, onSettle])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('scroll', onScroll)
    emblaApi.on('select', onSelect)
    emblaApi.on('settle', onSettleHandler)
    return () => {
      emblaApi.off('scroll', onScroll)
      emblaApi.off('select', onSelect)
      emblaApi.off('settle', onSettleHandler)
    }
  }, [emblaApi, onScroll, onSelect, onSettleHandler])

  // Sync external value changes - only when not actively scrolling
  useEffect(() => {
    if (!emblaApi || isScrolling) return
    const targetIndex = value - min
    if (emblaApi.selectedScrollSnap() !== targetIndex) {
      emblaApi.scrollTo(targetIndex)
    }
  }, [emblaApi, value, min, isScrolling])

  return (
    <div className="w-full max-w-[320px]">
      <div className="relative">
        {/* Center indicator - triangle marker pointing down */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `12px solid ${color}`,
          }}
        />

        {/* Number scroll area - uses mask-image for edge fade */}
        <div
          className="overflow-hidden pt-5"
          ref={emblaRef}
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <div className="flex items-center justify-center h-16">
            {options.map((opt, i) => {
              const isSelected = i === currentIndex
              const distance = Math.abs(i - currentIndex)
              // Scale: selected = 1.4, adjacent = 1, further = smaller
              const scale = isSelected ? 1.4 : Math.max(0.7, 1 - distance * 0.1)
              // Opacity: selected = 1, fades with distance
              const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.25)

              return (
                <div
                  key={opt}
                  className="flex-none w-14 flex items-center justify-center"
                >
                  <motion.span
                    animate={{
                      scale,
                      opacity,
                      color: isSelected ? color : 'rgba(255,255,255,0.8)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="text-3xl font-bold"
                  >
                    {opt}
                  </motion.span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
