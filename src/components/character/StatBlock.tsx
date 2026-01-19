import { motion } from 'framer-motion'

interface SlotDisplayProps {
  current: number
  max: number
  onChange: (value: number) => void
  label: string
  color: 'red' | 'blue' | 'purple' | 'gray'
}

function SlotDisplay({ current, max, onChange, label, color }: SlotDisplayProps) {
  const colorStyles = {
    red: { filled: 'bg-red-500 border-red-600', empty: 'border-red-300' },
    blue: { filled: 'bg-blue-500 border-blue-600', empty: 'border-blue-300' },
    purple: { filled: 'bg-purple-500 border-purple-600', empty: 'border-purple-300' },
    gray: { filled: 'bg-gray-500 border-gray-600', empty: 'border-gray-300' },
  }

  const styles = colorStyles[color]

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
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: max }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleTap(i)}
            className={`w-7 h-7 rounded-full border-2 transition-colors ${
              i < current ? styles.filled : `bg-white ${styles.empty}`
            }`}
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
          label={`Hit Points (${hp.current}/${hp.max})`}
          color="red"
        />
        <SlotDisplay
          current={armor.current}
          max={armor.max}
          onChange={onArmorChange}
          label={`Armor (${armor.current}/${armor.max})`}
          color="gray"
        />
      </div>

      {/* Hope counter */}
      <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
        <span className="text-sm font-medium text-blue-700">Hope</span>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onHopeChange(Math.max(0, hope - 1))}
            disabled={hope <= 0}
            className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center disabled:opacity-40"
          >
            -
          </motion.button>
          <span className="text-xl font-bold text-blue-700 w-8 text-center">{hope}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onHopeChange(hope + 1)}
            className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Stress slots */}
      <SlotDisplay
        current={stress.current}
        max={stress.max}
        onChange={onStressChange}
        label={`Stress (${stress.current}/${stress.max})`}
        color="purple"
      />
    </div>
  )
}
