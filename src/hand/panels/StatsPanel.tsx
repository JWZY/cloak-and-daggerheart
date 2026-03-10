import { TRAIT_NAMES, formatTraitValue } from '../../core/rules/traits'
import { getSubclassByName } from '../../data/srd'
import { typeSubtitle, typeMicro, typeBody } from '../../ui/typography'
import { STAT_COLORS } from '../../cards/domain-colors'
import { GameBadge } from '../../ui/GameBadge'
import type { Character } from '../../types/character'

export interface StatsPanelProps {
  character: Character
}

const traitLabels: Record<string, string> = {
  agility: 'Agility',
  strength: 'Strength',
  finesse: 'Finesse',
  instinct: 'Instinct',
  presence: 'Presence',
  knowledge: 'Knowledge',
}

export function StatsPanel({ character }: StatsPanelProps) {
  // Determine spellcast trait from subclass data
  const subclassData = getSubclassByName(character.subclass)
  const spellcastTrait = subclassData?.spellcast_trait ?? null

  return (
    <div className="flex flex-col gap-3">
      {/* Trait grid: 2 columns x 3 rows */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {TRAIT_NAMES.map((trait) => {
          const value = character.traits[trait]
          const isSpellcast = spellcastTrait?.toLowerCase() === trait

          return (
            <div
              key={trait}
              className="flex items-center justify-between py-1 px-2 rounded-lg"
              style={{
                background: isSpellcast
                  ? 'var(--gold-muted)'
                  : 'transparent',
                border: isSpellcast
                  ? '1px solid var(--gold-muted)'
                  : '1px solid transparent',
              }}
            >
              <span
                style={{
                  ...typeSubtitle,
                  color: isSpellcast ? 'var(--gold)' : 'var(--text-secondary)',
                }}
              >
                {traitLabels[trait]}
                {isSpellcast && (
                  <span
                    className="ml-1"
                    style={{
                      ...typeMicro,
                      color: 'var(--gold-secondary)',
                    }}
                  >
                    SC
                  </span>
                )}
              </span>
              <span
                style={{
                  ...typeBody,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: value > 0
                    ? 'var(--gold)'
                    : value < 0
                      ? STAT_COLORS.negative
                      : 'var(--text-muted)',
                }}
              >
                {formatTraitValue(value)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Derived stats */}
      <div className="flex items-center justify-center gap-6 pt-1">
        <GameBadge>Evasion {character.evasion}</GameBadge>
        <GameBadge>Prof +{character.proficiency}</GameBadge>
      </div>
    </div>
  )
}
