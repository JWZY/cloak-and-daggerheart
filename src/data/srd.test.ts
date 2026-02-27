import { describe, it, expect } from 'vitest'
import { getSubclassCardCount } from '../core/rules/class-rules'
import { getSubclassByName } from './srd'

describe('getSubclassCardCount', () => {
  it('returns 3 for School of Knowledge', () => {
    expect(getSubclassCardCount('School of Knowledge')).toBe(3)
  })

  it('returns 2 for School of War', () => {
    expect(getSubclassCardCount('School of War')).toBe(2)
  })

  it('returns 2 for other subclasses (default)', () => {
    expect(getSubclassCardCount('Divine Wielder')).toBe(2)
    expect(getSubclassCardCount('Warden of the Elements')).toBe(2)
  })
})

describe('getSubclassByName', () => {
  it('returns School of Knowledge subclass correctly', () => {
    const subclass = getSubclassByName('School of Knowledge')
    expect(subclass.name).toBe('School of Knowledge')
  })

  it('returns School of War subclass correctly', () => {
    const subclass = getSubclassByName('School of War')
    expect(subclass.name).toBe('School of War')
  })

  it('returns Seraph subclasses correctly', () => {
    const divine = getSubclassByName('Divine Wielder')
    expect(divine.name).toBe('Divine Wielder')

    const winged = getSubclassByName('Winged Sentinel')
    expect(winged.name).toBe('Winged Sentinel')
  })

  it('returns Druid subclasses correctly', () => {
    const elements = getSubclassByName('Warden of the Elements')
    expect(elements.name).toBe('Warden of the Elements')

    const renewal = getSubclassByName('Warden of Renewal')
    expect(renewal.name).toBe('Warden of Renewal')
  })
})
