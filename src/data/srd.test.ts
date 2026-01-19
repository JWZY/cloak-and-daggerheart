import { describe, it, expect } from 'vitest'
import { getWizardCardCount, getSubclass, schoolOfKnowledge, schoolOfWar } from './srd'

describe('getWizardCardCount', () => {
  it('returns 3 for School of Knowledge', () => {
    expect(getWizardCardCount('School of Knowledge')).toBe(3)
  })

  it('returns 2 for School of War', () => {
    expect(getWizardCardCount('School of War')).toBe(2)
  })
})

describe('getSubclass', () => {
  it('returns School of Knowledge subclass correctly', () => {
    const subclass = getSubclass('School of Knowledge')
    expect(subclass).toBe(schoolOfKnowledge)
    expect(subclass.name).toBe('School of Knowledge')
  })

  it('returns School of War subclass correctly', () => {
    const subclass = getSubclass('School of War')
    expect(subclass).toBe(schoolOfWar)
    expect(subclass.name).toBe('School of War')
  })
})
