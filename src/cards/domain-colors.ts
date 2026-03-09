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
  if (!className) return '#e7ba90'
  const domain = CLASS_DOMAIN[className]
  return domain ? (DOMAIN_COLORS[domain] ?? '#e7ba90') : '#e7ba90'
}

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
