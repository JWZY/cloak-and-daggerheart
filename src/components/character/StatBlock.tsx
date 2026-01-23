import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

interface SlotDisplayProps {
  current: number
  max: number
  onChange: (value: number) => void
  label: string
}

// Liquid Glass slot style
const slotBaseStyle = `
  w-10 h-10 rounded-full transition-all
  bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.01)_100%)]
  shadow-[inset_0_1px_1px_rgba(255,255,255,0.375),inset_0_1.5px_3px_rgba(255,255,255,0.09),inset_0_-1px_1px_rgba(0,0,0,0.1),inset_0_-1.5px_3px_rgba(0,0,0,0.05)]
`.trim().replace(/\s+/g, ' ')

const slotFilledStyle = `
  w-10 h-10 rounded-full transition-all
  bg-white/90
  shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(255,255,255,0.3)]
`.trim().replace(/\s+/g, ' ')

function SlotDisplay({ current, max, onChange, label }: SlotDisplayProps) {
  const handleTap = (index: number) => {
    // Toggle: if tapping the last filled slot, unfill it; otherwise fill up to that slot
    if (index < current) {
      onChange(index)
    } else {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-white/40">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: max }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleTap(i)}
            className={i < current ? slotFilledStyle : slotBaseStyle}
          />
        ))}
      </div>
    </div>
  )
}

interface StatBlockProps {
  hp: { current: number; max: number }
  armor: { current: number; max: number }
  hope: number
  stress: { current: number; max: number }
  onHPChange: (value: number) => void
  onArmorChange: (value: number) => void
  onHopeChange: (value: number) => void
  onStressChange: (value: number) => void
}

export function StatBlock({
  hp,
  armor,
  hope,
  stress,
  onHPChange,
  onArmorChange,
  onHopeChange,
  onStressChange,
}: StatBlockProps) {
  return (
    <div className="space-y-4">
      {/* HP and Armor row */}
      <div className="grid grid-cols-2 gap-4">
        <SlotDisplay
          current={hp.current}
          max={hp.max}
          onChange={onHPChange}
          label={`HP ${hp.current}/${hp.max}`}
        />
        <SlotDisplay
          current={armor.current}
          max={armor.max}
          onChange={onArmorChange}
          label={`Armor ${armor.current}/${armor.max}`}
        />
      </div>

      {/* Hope counter */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs uppercase tracking-wide text-white/40">Hope</span>
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onHopeChange(Math.max(0, hope - 1))}
            disabled={hope <= 0}
            className="lg-button w-10 h-10 disabled:opacity-30"
          >
            <Minus size={18} strokeWidth={2.5} />
          </motion.button>
          <span className="text-2xl font-semibold text-white w-8 text-center">{hope}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onHopeChange(hope + 1)}
            className="lg-button w-10 h-10"
          >
            <Plus size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Stress slots */}
      <SlotDisplay
        current={stress.current}
        max={stress.max}
        onChange={onStressChange}
        label={`Stress ${stress.current}/${stress.max}`}
      />
    </div>
  )
}
