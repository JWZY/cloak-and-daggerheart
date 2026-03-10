import { goldDark } from '../ui/typography'

// Domain colors — single source of truth (Figma banner = canonical, code fallback for Arcana/Sage)
export const DOMAIN_COLORS: Record<string, string> = {
  Arcana: '#77457E',
  Blade: '#A61118',
  Bone: '#A3A9A8',
  Codex: '#1D3B61',
  Grace: '#BD0C70',
  Midnight: '#1E1E1E',
  Sage: '#006E3A',
  Splendor: '#BEA228',
  Valor: '#EB5B00',
}

// Map class → primary domain (first domain from SRD classes.json)
const CLASS_DOMAIN: Record<string, string> = {
  Guardian: 'Valor',
  Warrior: 'Blade',
  Sorcerer: 'Arcana',
  Rogue: 'Midnight',
  Bard: 'Grace',
  Druid: 'Sage',
  Ranger: 'Bone',
  Seraph: 'Splendor',
  Wizard: 'Codex',
}

/** Get the primary domain accent color for a class name, or gold fallback */
export function getClassAccentColor(className: string | null): string {
  if (!className) return goldDark
  const domain = CLASS_DOMAIN[className]
  return domain ? (DOMAIN_COLORS[domain] ?? goldDark) : goldDark
}

/**
 * Semantic stat colors — map game mechanics to their thematic domain colors.
 * Armor = Bone gray, HP = Blade red, Stress = Midnight dark, Hope = Splendor gold.
 */
export const STAT_COLORS = {
  armor: DOMAIN_COLORS.Bone,
  hp: DOMAIN_COLORS.Blade,
  stress: DOMAIN_COLORS.Midnight,
  hope: DOMAIN_COLORS.Splendor,
  /** Red for negative trait values, danger states */
  negative: DOMAIN_COLORS.Blade,
} as const

// Muted variants — darker, still saturated (for banner outer layer)
export const DOMAIN_COLORS_MUTED: Record<string, string> = {
  Arcana: '#47294C',
  Blade: '#640a0e',
  Bone: '#626565',
  Codex: '#11233a',
  Grace: '#710743',
  Midnight: '#121212',
  Sage: '#004223',
  Splendor: '#726118',
  Valor: '#8d3700',
}
