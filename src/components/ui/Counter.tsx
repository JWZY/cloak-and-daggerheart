import { motion } from 'framer-motion'

interface CounterProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label?: string
  showSlots?: boolean
  slotCount?: number
}

export function Counter({
  value,
  min = 0,
  max = 99,
  onChange,
  label,
  showSlots = false,
  slotCount = 5,
}: CounterProps) {
  const increment = () => {
    if (value < max) onChange(value + 1)
  }

  const decrement = () => {
    if (value > min) onChange(value - 1)
  }

  if (showSlots) {
    return (
      <div className="flex flex-col gap-2">
        {label && <span className="text-sm font-medium text-gray-600">{label}</span>}
        <div className="flex gap-1.5">
          {Array.from({ length: slotCount }).map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(value === i + 1 ? i : i + 1)}
              className={`w-8 h-8 rounded-full border-2 transition-colors ${
                i < value
                  ? 'bg-red-500 border-red-600'
                  : 'bg-white border-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-sm font-medium text-gray-600">{label}</span>}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={decrement}
          disabled={value <= min}
          className="w-10 h-10 rounded-full bg-ios-gray-light text-gray-700 text-xl font-bold flex items-center justify-center disabled:opacity-40"
        >
          -
        </motion.button>
        <span className="text-2xl font-bold w-12 text-center">{value}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={increment}
          disabled={value >= max}
          className="w-10 h-10 rounded-full bg-ios-gray-light text-gray-700 text-xl font-bold flex items-center justify-center disabled:opacity-40"
        >
          +
        </motion.button>
      </div>
    </div>
  )
}
