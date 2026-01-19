import type { DiceRoll } from '../../types/character'

export function determineDualityResult(hopeDie: number, fearDie: number, modifier: number): DiceRoll {
  const total = hopeDie + fearDie + modifier

  let result: 'hope' | 'fear' | 'critical'
  if (hopeDie === fearDie) {
    result = 'critical'
  } else if (hopeDie > fearDie) {
    result = 'hope'
  } else {
    result = 'fear'
  }

  return {
    id: '',
    hopeDie,
    fearDie,
    modifier,
    total,
    result,
    timestamp: 0,
  }
}
