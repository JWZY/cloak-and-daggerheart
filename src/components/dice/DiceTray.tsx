import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dice5, Plus, Minus } from 'lucide-react'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { DualityRoll } from './DualityRoll'
import { useCharacterStore } from '../../stores/characterStore'
import { determineDualityResult } from './diceLogic'
import type { DiceRoll } from '../../types/character'

function rollD12(): number {
  return Math.floor(Math.random() * 12) + 1
}

export function DiceTray() {
  const [isOpen, setIsOpen] = useState(false)
  const [modifier, setModifier] = useState(0)
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const { rollHistory, addRoll } = useCharacterStore()

  const handleRoll = () => {
    setIsRolling(true)

    // Animate the roll
    setTimeout(() => {
      const hopeDie = rollD12()
      const fearDie = rollD12()
      const roll = determineDualityResult(hopeDie, fearDie, modifier)

      setCurrentRoll(roll)
      addRoll(roll)
      setIsRolling(false)
    }, 500)
  }

  const adjustModifier = (delta: number) => {
    setModifier((prev) => prev + delta)
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full glass bg-white/20 text-white shadow-lg flex items-center justify-center z-30"
      >
        <Dice5 size={24} />
      </motion.button>

      <Sheet open={isOpen} onOpenChange={setIsOpen} title="Dice Tray">
        <div className="space-y-6">
          {/* Modifier control */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-white/70">Modifier:</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => adjustModifier(-1)}
              className="w-10 h-10 rounded-full glass text-white flex items-center justify-center"
            >
              <Minus size={18} strokeWidth={2.5} />
            </motion.button>
            <span className="text-2xl font-bold text-white w-12 text-center">
              {modifier >= 0 ? `+${modifier}` : modifier}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => adjustModifier(1)}
              className="w-10 h-10 rounded-full glass text-white flex items-center justify-center"
            >
              <Plus size={18} strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* Roll button */}
          <Button
            onClick={handleRoll}
            disabled={isRolling}
            variant="glass-primary"
            size="lg"
            className="w-full"
          >
            {isRolling ? 'Rolling...' : 'Roll Duality Dice'}
          </Button>

          {/* Current roll result */}
          <AnimatePresence mode="wait">
            {currentRoll && !isRolling && (
              <DualityRoll key={currentRoll.timestamp || 'current'} roll={currentRoll} />
            )}
          </AnimatePresence>

          {/* Roll history */}
          {rollHistory.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white/50 mb-2">Recent Rolls</h3>
              <div className="space-y-2">
                {rollHistory.slice(0, 5).map((roll) => (
                  <DualityRoll key={roll.id} roll={roll} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </Sheet>
    </>
  )
}
