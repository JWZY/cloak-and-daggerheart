import { describe, it, expect } from 'vitest'
import { determineDualityResult } from './diceLogic'

describe('determineDualityResult', () => {
  describe('result determination', () => {
    it('returns critical when hope and fear dice are equal', () => {
      const roll = determineDualityResult(6, 6, 0)
      expect(roll.result).toBe('critical')
    })

    it('returns hope when hope die is greater than fear die', () => {
      const roll = determineDualityResult(8, 4, 0)
      expect(roll.result).toBe('hope')
    })

    it('returns fear when fear die is greater than hope die', () => {
      const roll = determineDualityResult(3, 9, 0)
      expect(roll.result).toBe('fear')
    })

    it('handles edge case: hope=1, fear=1 is critical', () => {
      const roll = determineDualityResult(1, 1, 0)
      expect(roll.result).toBe('critical')
    })

    it('handles edge case: hope=12, fear=12 is critical', () => {
      const roll = determineDualityResult(12, 12, 0)
      expect(roll.result).toBe('critical')
    })

    it('handles edge case: hope=12, fear=11 is hope', () => {
      const roll = determineDualityResult(12, 11, 0)
      expect(roll.result).toBe('hope')
    })

    it('handles edge case: hope=1, fear=2 is fear', () => {
      const roll = determineDualityResult(1, 2, 0)
      expect(roll.result).toBe('fear')
    })
  })

  describe('total calculation', () => {
    it('calculates total correctly with no modifier', () => {
      const roll = determineDualityResult(5, 7, 0)
      expect(roll.total).toBe(12)
    })

    it('calculates total correctly with positive modifier', () => {
      const roll = determineDualityResult(5, 7, 3)
      expect(roll.total).toBe(15)
    })

    it('calculates total correctly with negative modifier', () => {
      const roll = determineDualityResult(5, 7, -2)
      expect(roll.total).toBe(10)
    })

    it('handles maximum possible total (12 + 12 + large modifier)', () => {
      const roll = determineDualityResult(12, 12, 10)
      expect(roll.total).toBe(34)
    })

    it('handles minimum possible dice with negative modifier', () => {
      const roll = determineDualityResult(1, 1, -5)
      expect(roll.total).toBe(-3)
    })
  })

  describe('return value structure', () => {
    it('returns all expected properties', () => {
      const roll = determineDualityResult(6, 4, 2)
      expect(roll).toHaveProperty('id', '')
      expect(roll).toHaveProperty('hopeDie', 6)
      expect(roll).toHaveProperty('fearDie', 4)
      expect(roll).toHaveProperty('modifier', 2)
      expect(roll).toHaveProperty('total', 12)
      expect(roll).toHaveProperty('result', 'hope')
      expect(roll).toHaveProperty('timestamp', 0)
    })
  })
})
