import { Shield } from 'lucide-react'
import { typeSubtitle, typeMicro, goldDarkAlpha } from '../ui/typography'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

interface ArmorEvasionBlockProps {
  character: Character
}

/**
 * Determines the grid column count based on total armor slots.
 * 1-4 slots: 2 columns, 5-9: 3 columns, 10-12: 4 columns
 */
function gridCols(max: number): number {
  if (max <= 4) return 2
  if (max <= 9) return 3
  return 4
}

function ArmorSlotIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <Shield
      size={size}
      fill={filled ? goldDarkAlpha(0.3) : 'transparent'}
      color={filled ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}
      strokeWidth={filled ? 1.5 : 1}
    />
  )
}

export function ArmorEvasionBlock({ character }: ArmorEvasionBlockProps) {
  const updateArmor = useCharacterStore((s) => s.updateArmor)
  const cols = gridCols(character.armorSlots.max)

  return (
    <div
      style={{
        ...warmGlass,
        borderRadius: RADIUS_CARD,
        padding: '14px 16px',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
      }}
    >
      {/* Evasion Badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          minWidth: 52,
        }}
      >
        <span
          style={{
            ...typeSubtitle,
            fontSize: 28,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--gold)',
            lineHeight: 1.1,
          }}
        >
          {character.evasion}
        </span>
        <span style={{ ...typeMicro, color: 'var(--text-muted)', marginTop: 2 }}>
          Evasion
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          alignSelf: 'stretch',
          background: goldDarkAlpha(0.15),
        }}
      />

      {/* Armor Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <span style={{ ...typeMicro, color: 'var(--text-muted)' }}>
          Armor {character.armorSlots.current}/{character.armorSlots.max}
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 4,
          }}
        >
          {Array.from({ length: character.armorSlots.max }).map((_, i) => {
            const filled = i < character.armorSlots.current
            return (
              <button
                key={i}
                type="button"
                aria-label={filled ? `Remove armor slot ${i + 1}` : `Restore armor slot ${i + 1}`}
                onClick={() =>
                  updateArmor(character.id, filled ? -1 : 1)
                }
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArmorSlotIcon filled={filled} size={22} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
