import { createContext, useContext, type ReactNode } from 'react'
import type { WizardSubclass } from '../types/character'
import { THEME_CONFIGS, type ThemeConfig } from './themeConfig'

interface ThemeContextValue {
  theme: ThemeConfig
  subclass: WizardSubclass | null
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEME_CONFIGS.default,
  subclass: null,
})

interface ThemeProviderProps {
  children: ReactNode
  subclass?: WizardSubclass | null
}

export function ThemeProvider({ children, subclass }: ThemeProviderProps) {
  const theme = subclass ? THEME_CONFIGS[subclass] : THEME_CONFIGS.default

  return (
    <ThemeContext.Provider value={{ theme, subclass: subclass || null }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}
