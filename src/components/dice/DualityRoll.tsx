import { motion } from 'framer-motion'
import type { DiceRoll } from '../../types/character'

interface DualityRollProps {
  roll: DiceRoll
  compact?: boolean
}

export function DualityRoll({ roll, compact = false }: DualityRollProps) {
  const getResultText = () => {
    if (roll.result === 'critical') {
      return 'Critical Success!'
    }
    return `${roll.total} with ${roll.result === 'hope' ? 'Hope' : 'Fear'}`
  }

  const getResultColor = () => {
    if (roll.result === 'critical') return 'text-amber-600'
    if (roll.result === 'hope') return 'text-blue-600'
    return 'text-red-600'
  }

  const getBgColor = () => {
    if (roll.result === 'critical') return 'bg-amber-50 border-amber-200'
    if (roll.result === 'hope') return 'bg-blue-50 border-blue-200'
    return 'bg-red-50 border-red-200'
  }

  if (compact) {
    return (
      <div className={`px-3 py-1.5 rounded-lg border ${getBgColor()}`}>
        <span className={`font-medium ${getResultColor()}`}>{getResultText()}</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl border-2 ${getBgColor()}`}
    >
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Hope</span>
          <div className="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
            {roll.hopeDie}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Fear</span>
          <div className="w-12 h-12 rounded-lg bg-red-500 text-white flex items-center justify-center text-xl font-bold">
            {roll.fearDie}
          </div>
        </div>
        {roll.modifier !== 0 && (
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Mod</span>
            <div className="w-12 h-12 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center text-xl font-bold">
              {roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier}
            </div>
          </div>
        )}
      </div>
      <div className="text-center">
        <span className={`text-xl font-bold ${getResultColor()}`}>
          {getResultText()}
        </span>
      </div>
    </motion.div>
  )
}
