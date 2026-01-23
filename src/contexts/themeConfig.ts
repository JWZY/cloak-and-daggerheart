import type { WizardSubclass } from '../types/character'

export interface ThemeConfig {
  backgroundClass: string
  accentColor: string
  textPrimary: string
  textSecondary: string
  textMuted: string
}

export const THEME_CONFIGS: Record<WizardSubclass | 'default', ThemeConfig> = {
  'School of Knowledge': {
    backgroundClass: 'bg-gradient-knowledge animate-gradient',
    accentColor: 'text-indigo-300',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/50',
  },
  'School of War': {
    backgroundClass: 'bg-gradient-war animate-gradient',
    accentColor: 'text-amber-300',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/50',
  },
  default: {
    backgroundClass: 'bg-gradient-default',
    accentColor: 'text-slate-300',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/50',
  },
}
