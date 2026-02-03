// Duality roll logic for Daggerheart dice system
// Pure functions - no React, no side effects

export type DualityResult = 'hope' | 'fear' | 'critical'

export interface DualityRollResult {
  hopeDie: number
  fearDie: number
  modifier: number
  total: number
  result: DualityResult
}

/**
 * Determine the result of a duality roll
 * - Critical: Both dice show the same value
 * - Hope: Hope die is higher
 * - Fear: Fear die is higher
 */
export function determineDualityResult(
  hopeDie: number,
  fearDie: number,
  modifier: number
): DualityRollResult {
  const total = hopeDie + fearDie + modifier

  let result: DualityResult
  if (hopeDie === fearDie) {
    result = 'critical'
  } else if (hopeDie > fearDie) {
    result = 'hope'
  } else {
    result = 'fear'
  }

  return {
    hopeDie,
    fearDie,
    modifier,
    total,
    result,
  }
}

/**
 * Roll a single d12
 */
export function rollD12(): number {
  return Math.floor(Math.random() * 12) + 1
}

/**
 * Perform a complete duality roll
 */
export function rollDuality(modifier: number = 0): DualityRollResult {
  return determineDualityResult(rollD12(), rollD12(), modifier)
}
