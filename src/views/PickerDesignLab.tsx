import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Picker from 'react-mobile-picker'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, Heart, Brain, Shield, Zap } from 'lucide-react'
import { DrumPicker } from '../components/ui/DrumPicker'

// ============================================
// APPROACH 1: iOS Wheel Picker (react-mobile-picker)
// ============================================

interface WheelPickerProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label: string
  icon?: React.ReactNode
}

function WheelPicker({ value, min = 0, max = 30, onChange, label, icon }: WheelPickerProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  const pickerValue = { stat: value }

  const handleChange = (newValue: { stat: number }) => {
    onChange(newValue.stat)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-white/70">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="w-24 h-40 rounded-2xl overflow-hidden glass">
        <Picker
          value={pickerValue}
          onChange={handleChange}
          wheelMode="natural"
          height={160}
          itemHeight={40}
        >
          <Picker.Column name="stat">
            {options.map((opt) => (
              <Picker.Item key={opt} value={opt}>
                {({ selected }) => (
                  <div
                    className={`text-center text-2xl font-bold transition-all ${
                      selected ? 'text-white scale-110' : 'text-white/30'
                    }`}
                  >
                    {opt}
                  </div>
                )}
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </div>
    </div>
  )
}

// ============================================
// APPROACH 2: Horizontal Scroll Picker (embla-carousel)
// ============================================

interface HorizontalPickerProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label: string
  icon?: React.ReactNode
}

function HorizontalPicker({ value, min = 0, max = 30, onChange, label, icon }: HorizontalPickerProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const startIndex = value - min

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'x',
    align: 'center',
    containScroll: false,
    startIndex,
    dragFree: false,
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    onChange(min + index)
  }, [emblaApi, onChange, min])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Sync external value changes
  useEffect(() => {
    if (!emblaApi) return
    const targetIndex = value - min
    if (emblaApi.selectedScrollSnap() !== targetIndex) {
      emblaApi.scrollTo(targetIndex)
    }
  }, [emblaApi, value, min])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-white/70">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="w-full max-w-[280px]">
        <div className="relative">
          {/* Selection indicator */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-14 rounded-xl bg-white/20 border border-white/30 pointer-events-none z-10" />

          {/* Gradient fade edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/80 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/80 to-transparent pointer-events-none z-20" />

          <div className="overflow-hidden py-3" ref={emblaRef}>
            <div className="flex">
              {options.map((opt) => {
                const isSelected = opt === value
                return (
                  <div
                    key={opt}
                    className="flex-none w-14 flex items-center justify-center"
                  >
                    <motion.span
                      animate={{
                        scale: isSelected ? 1.2 : 1,
                        opacity: isSelected ? 1 : 0.4,
                      }}
                      className={`text-2xl font-bold text-white`}
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
    </div>
  )
}

// ============================================
// APPROACH 3: Ruler/Scale Picker (custom embla)
// ============================================

interface RulerPickerProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label: string
  icon?: React.ReactNode
}

function RulerPicker({ value, min = 0, max = 30, onChange, label, icon }: RulerPickerProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const startIndex = value - min

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'x',
    align: 'center',
    containScroll: false,
    startIndex,
    dragFree: true,
  })

  const onSettle = useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    onChange(min + index)
  }, [emblaApi, onChange, min])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('settle', onSettle)
    return () => {
      emblaApi.off('settle', onSettle)
    }
  }, [emblaApi, onSettle])

  useEffect(() => {
    if (!emblaApi) return
    const targetIndex = value - min
    if (emblaApi.selectedScrollSnap() !== targetIndex) {
      emblaApi.scrollTo(targetIndex)
    }
  }, [emblaApi, value, min])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-white/70">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </div>

      {/* Current value display */}
      <div className="text-4xl font-bold text-white mb-2">{value}</div>

      <div className="w-full max-w-[300px]">
        <div className="relative">
          {/* Center indicator line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-orange-500 pointer-events-none z-10" />

          {/* Gradient fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/90 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/90 to-transparent pointer-events-none z-20" />

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex items-end h-16">
              {options.map((opt) => {
                const isMajor = opt % 5 === 0
                return (
                  <div
                    key={opt}
                    className="flex-none w-4 flex flex-col items-center justify-end"
                  >
                    <div
                      className={`w-0.5 ${
                        isMajor ? 'h-8 bg-white/60' : 'h-4 bg-white/30'
                      }`}
                    />
                    {isMajor && (
                      <span className="text-xs text-white/50 mt-1">{opt}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// APPROACH 4: Neumorphic Toggle Slots
// ============================================

interface NeumorphicSlotsProps {
  value: number
  max?: number
  onChange: (value: number) => void
  label: string
  icon?: React.ReactNode
}

function NeumorphicSlots({ value, max = 6, onChange, label, icon }: NeumorphicSlotsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-white/70">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </div>

      {/* Neumorphic container */}
      <div
        className="flex gap-2 p-2 rounded-full"
        style={{
          background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
          boxShadow: 'inset 4px 4px 8px #0a0a0a, inset -4px -4px 8px #3a3a3a',
        }}
      >
        {Array.from({ length: max }).map((_, i) => {
          const isFilled = i < value
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(value === i + 1 ? i : i + 1)}
              className="relative w-10 h-10 rounded-full"
              style={{
                background: isFilled
                  ? 'linear-gradient(145deg, #ff6b4a, #ff4a2a)'
                  : 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                boxShadow: isFilled
                  ? '4px 4px 8px #0a0a0a, -2px -2px 6px #3a3a3a, inset 1px 1px 2px rgba(255,255,255,0.2)'
                  : 'inset 3px 3px 6px #0a0a0a, inset -3px -3px 6px #3a3a3a',
              }}
            >
              {/* Inner highlight dot for filled state */}
              {isFilled && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-white/80" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <span className="text-2xl font-bold text-white">{value} / {max}</span>
    </div>
  )
}

// ============================================
// APPROACH 5: Compact Inline Picker (tap to open wheel)
// ============================================

interface CompactPickerProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label: string
  icon?: React.ReactNode
  color?: string
}

function CompactPicker({ value, min = 0, max = 30, onChange, label, icon, color = 'white' }: CompactPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <>
      {/* Compact display - tap to open */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center gap-1 p-3 rounded-2xl glass"
      >
        <div className="flex items-center gap-1.5 text-white/60">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-3xl font-bold" style={{ color }}>{value}</span>
      </motion.button>

      {/* Fullscreen picker overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-6 w-48"
            >
              <div className="flex items-center justify-center gap-2 text-white/70 mb-4">
                {icon}
                <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
              </div>

              <div className="h-48 rounded-2xl overflow-hidden bg-black/30">
                <Picker
                  value={{ stat: value }}
                  onChange={(v: { stat: number }) => onChange(v.stat)}
                  wheelMode="natural"
                  height={192}
                  itemHeight={48}
                >
                  <Picker.Column name="stat">
                    {options.map((opt) => (
                      <Picker.Item key={opt} value={opt}>
                        {({ selected }) => (
                          <div
                            className={`text-center text-3xl font-bold transition-all ${
                              selected ? 'text-white' : 'text-white/20'
                            }`}
                            style={{ color: selected ? color : undefined }}
                          >
                            {opt}
                          </div>
                        )}
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                </Picker>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 py-3 rounded-xl bg-white/20 text-white font-semibold"
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// DESIGN LAB
// ============================================

interface PickerDesignLabProps {
  onBack?: () => void
}

export function PickerDesignLab({ onBack }: PickerDesignLabProps) {
  const [hp, setHp] = useState(12)
  const [stress, setStress] = useState(3)
  const [armor, setArmor] = useState(2)

  const [hp2, setHp2] = useState(12)
  const [stress2, setStress2] = useState(3)
  const [armor2, setArmor2] = useState(2)

  const [hp3, setHp3] = useState(12)

  const [hp4, setHp4] = useState(4)

  const [hp5, setHp5] = useState(12)
  const [stress5, setStress5] = useState(3)
  const [armor5, setArmor5] = useState(2)

  // Approach 6: Drum Picker (Spotify-style)
  const [hp6, setHp6] = useState(12)
  const [stress6, setStress6] = useState(3)
  const [armor6, setArmor6] = useState(2)

  return (
    <div className="fixed inset-0 bg-black text-white overflow-y-scroll" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center gap-4 bg-black/80 backdrop-blur-xl border-b border-white/10 safe-top">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold">Picker Design Lab</h1>
      </div>

      <div className="p-6 space-y-12 pb-48">
        {/* Approach 1: Wheel Pickers */}
        <section>
          <h2 className="text-lg font-semibold text-white/60 mb-4">1. iOS Wheel Picker (react-mobile-picker)</h2>
          <p className="text-sm text-white/40 mb-6">Vertical drum-style picker like iOS date/time selector</p>

          <div className="flex justify-center gap-6">
            <WheelPicker
              value={hp}
              max={20}
              onChange={setHp}
              label="HP"
              icon={<Heart size={16} />}
            />
            <WheelPicker
              value={stress}
              max={6}
              onChange={setStress}
              label="Stress"
              icon={<Brain size={16} />}
            />
            <WheelPicker
              value={armor}
              max={10}
              onChange={setArmor}
              label="Armor"
              icon={<Shield size={16} />}
            />
          </div>
        </section>

        {/* Approach 2: Horizontal Scroll */}
        <section>
          <h2 className="text-lg font-semibold text-white/60 mb-4">2. Horizontal Scroll Picker (embla-carousel)</h2>
          <p className="text-sm text-white/40 mb-6">Swipe left/right to select, snaps to values</p>

          <div className="space-y-8">
            <HorizontalPicker
              value={hp2}
              max={20}
              onChange={setHp2}
              label="HP"
              icon={<Heart size={16} />}
            />
            <HorizontalPicker
              value={stress2}
              max={6}
              onChange={setStress2}
              label="Stress"
              icon={<Brain size={16} />}
            />
            <HorizontalPicker
              value={armor2}
              max={10}
              onChange={setArmor2}
              label="Armor"
              icon={<Shield size={16} />}
            />
          </div>
        </section>

        {/* Approach 3: Ruler */}
        <section>
          <h2 className="text-lg font-semibold text-white/60 mb-4">3. Ruler/Scale Picker</h2>
          <p className="text-sm text-white/40 mb-6">Like a measuring tape - drag to slide along the scale</p>

          <RulerPicker
            value={hp3}
            max={20}
            onChange={setHp3}
            label="HP"
            icon={<Heart size={16} />}
          />
        </section>

        {/* Approach 4: Neumorphic Slots */}
        <section>
          <h2 className="text-lg font-semibold text-white/60 mb-4">4. Neumorphic Toggle Slots</h2>
          <p className="text-sm text-white/40 mb-6">Tactile push-button style like your reference image</p>

          <div className="flex justify-center">
            <NeumorphicSlots
              value={hp4}
              max={6}
              onChange={setHp4}
              label="Stress"
              icon={<Brain size={16} />}
            />
          </div>
        </section>

        {/* Approach 5: Compact with Modal */}
        <section>
          <h2 className="text-lg font-semibold text-white/60 mb-4">5. Compact Display + Modal Picker</h2>
          <p className="text-sm text-white/40 mb-6">Tap the stat to open a fullscreen wheel picker</p>

          <div className="flex justify-center gap-4">
            <CompactPicker
              value={hp5}
              max={20}
              onChange={setHp5}
              label="HP"
              icon={<Heart size={14} />}
              color="#ef4444"
            />
            <CompactPicker
              value={stress5}
              max={6}
              onChange={setStress5}
              label="Stress"
              icon={<Brain size={14} />}
              color="#a855f7"
            />
            <CompactPicker
              value={armor5}
              max={10}
              onChange={setArmor5}
              label="Armor"
              icon={<Shield size={14} />}
              color="#3b82f6"
            />
          </div>
        </section>

        {/* Approach 6: Drum Picker (Spotify-style) */}
        <section>
          <h2 className="text-lg font-semibold text-white/60 mb-4">6. Drum Picker (Spotify-style)</h2>
          <p className="text-sm text-white/40 mb-6">Compact trigger + bottom drawer with horizontal drum and tick marks</p>

          <div className="flex justify-center gap-4">
            <DrumPicker
              value={hp6}
              min={0}
              max={20}
              onChange={setHp6}
              label="HP"
              icon={<Heart size={14} />}
              color="#ef4444"
            />
            <DrumPicker
              value={stress6}
              min={0}
              max={6}
              onChange={setStress6}
              label="Stress"
              icon={<Brain size={14} />}
              color="#a855f7"
            />
            <DrumPicker
              value={armor6}
              min={0}
              max={10}
              onChange={setArmor6}
              label="Armor"
              icon={<Shield size={14} />}
              color="#3b82f6"
            />
          </div>

          {/* Additional example with different configuration */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-white/50 mb-4">Wide range example (0-100)</h3>
            <div className="flex justify-center">
              <DrumPicker
                value={50}
                min={0}
                max={100}
                onChange={(v) => console.log('Speed:', v)}
                label="Speed"
                icon={<Zap size={14} />}
                color="#f59e0b"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
