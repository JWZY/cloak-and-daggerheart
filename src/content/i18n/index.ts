// i18n foundation for Cloak & Daggerheart
// Type-safe translation hook

import en from './en.json'

// Type for the translation keys - extracts nested paths like 'character.creation.chooseAncestry'
type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
    }[keyof T & string]
  : never

export type TranslationKey = NestedKeyOf<typeof en>

// Available locales (only English for now, foundation for future)
export type Locale = 'en'

const translations: Record<Locale, typeof en> = {
  en,
}

// Current locale (could be made reactive with context later)
let currentLocale: Locale = 'en'

/**
 * Get a translation by key path
 * @example t('character.creation.chooseAncestry') → "Choose Your Ancestry"
 */
export function t(key: TranslationKey): string {
  const keys = key.split('.')
  let value: unknown = translations[currentLocale]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      console.warn(`Translation not found: ${key}`)
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale
}

/**
 * Get the current locale
 */
export function getLocale(): Locale {
  return currentLocale
}

/**
 * Hook for React components (simple version - could be enhanced with context)
 * @returns Translation function
 */
export function useTranslation() {
  return { t, locale: currentLocale, setLocale }
}
