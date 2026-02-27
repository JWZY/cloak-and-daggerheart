import { TRAIT_NAMES, formatTraitValue } from '../../core/rules/traits'
import { getSubclassByName } from '../../data/srd'
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
  const spellcastTrait = subclassData.spellcast_trait

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
                  ? 'rgba(231, 186, 144, 0.06)'
                  : 'transparent',
                border: isSpellcast
                  ? '1px solid rgba(231, 186, 144, 0.15)'
                  : '1px solid transparent',
              }}
            >
              <span
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 13,
                  fontWeight: 600,
                  fontVariant: 'small-caps',
                  letterSpacing: '0.04em',
                  color: isSpellcast ? '#e7ba90' : 'rgba(212, 207, 199, 0.7)',
                }}
              >
                {traitLabels[trait]}
                {isSpellcast && (
                  <span
                    className="ml-1"
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'rgba(231, 186, 144, 0.5)',
                      fontVariant: 'normal',
                    }}
                  >
                    SC
                  </span>
                )}
              </span>
              <span
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: value > 0
                    ? '#e7ba90'
                    : value < 0
                      ? '#A61118'
                      : 'rgba(212, 207, 199, 0.5)',
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
