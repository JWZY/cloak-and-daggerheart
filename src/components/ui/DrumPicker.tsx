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
  const [displayValue, setDisplayValue] = useState(value)

  // Sync displayValue when value prop changes externally
  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  // Called on every scroll for live visual feedback
  const handleDisplayChange = (newValue: number) => {
    setDisplayValue(newValue)
  }

  // Called only when scrolling settles - commits the final value
  const handleSettle = (newValue: number) => {
    setDisplayValue(newValue)
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
      <Sheet open={isOpen} onOpenChange={setIsOpen} title={label}>
        <div className="flex flex-col items-center gap-6 pb-6">
          {/* Large Value Display */}
          <div className="flex items-center gap-3">
            {icon && <span className="text-white/60">{icon}</span>}
            <motion.span
              key={displayValue}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold text-white"
            >
              {displayValue}
            </motion.span>
          </div>

          {/* Horizontal Drum */}
          <HorizontalDrum
            value={value}
            min={min}
            max={max}
            onDisplayChange={handleDisplayChange}
            onSettle={handleSettle}
            color={color}
          />
        </div>
      </Sheet>
    </>
  )
}

// ============================================
// HORIZONTAL DRUM - Spotify-style tick marks
// ============================================

interface HorizontalDrumProps {
  value: number
  min: number
  max: number
  onDisplayChange: (value: number) => void
  onSettle: (value: number) => void
  color?: string
}

function HorizontalDrum({ value, min, max, onDisplayChange, onSettle, color = 'white' }: HorizontalDrumProps) {
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

  // Update display value in real-time during scroll for visual feedback
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
      onDisplayChange(min + closestIndex)
    }
  }, [emblaApi, min, onDisplayChange])

  // Called when snap selection changes - update display immediately
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const newIndex = emblaApi.selectedScrollSnap()
    currentIndexRef.current = newIndex
    setCurrentIndex(newIndex)
    const newValue = min + newIndex
    onDisplayChange(newValue)
  }, [emblaApi, min, onDisplayChange])

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
        {/* Center indicator - triangle marker */}
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

        {/* Drum scroll area - uses mask-image for edge fade */}
        <div
          className="overflow-hidden pt-4"
          ref={emblaRef}
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          {/* Padding on left/right allows first and last tick to center under indicator */}
          <div className="flex items-end h-20" style={{ paddingLeft: 'calc(50% - 8px)', paddingRight: 'calc(50% - 8px)' }}>
            {options.map((opt, i) => {
              const isMajor = opt % 5 === 0
              const isSelected = i === currentIndex
              const distance = Math.abs(i - currentIndex)
              const opacity = Math.max(0.2, 1 - distance * 0.15)

              return (
                <div
                  key={opt}
                  className="flex-none w-4 flex flex-col items-center justify-end"
                >
                  {/* Tick mark */}
                  <motion.div
                    animate={{
                      height: isSelected ? 48 : isMajor ? 32 : 16,
                      backgroundColor: isSelected ? color : 'rgba(255,255,255,0.4)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="w-0.5 rounded-full"
                    style={{ opacity }}
                  />
                  {/* Number label for major ticks */}
                  {isMajor && (
                    <motion.span
                      animate={{
                        opacity: isSelected ? 1 : 0.5,
                        scale: isSelected ? 1.1 : 1,
                      }}
                      className="text-xs mt-1 font-medium text-white"
                    >
                      {opt}
                    </motion.span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
