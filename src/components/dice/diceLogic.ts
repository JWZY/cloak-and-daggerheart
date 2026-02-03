// Re-export duality roll logic from core
// This file maintained for backwards compatibility

import type { DiceRoll } from '../../types/character'
import { determineDualityResult as coreDetermineDualityResult } from '../../core/dice/duality'

/**
 * Wrapper that returns DiceRoll type for store compatibility
 */
export function determineDualityResult(hopeDie: number, fearDie: number, modifier: number): DiceRoll {
  const result = coreDetermineDualityResult(hopeDie, fearDie, modifier)
  return {
    id: '',
    ...result,
    timestamp: 0,
  }
}
