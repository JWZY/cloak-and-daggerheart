import { FormatText } from '../ui/FormatText'
import { typeSubtitle, typeBody, typeMicro, goldGradientStyle } from '../ui/typography'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import type { Weapon } from '../types/character'

export interface WeaponPanelProps {
  weapon: Weapon
  /** Pre-calculated trait modifier (character.traits[weapon.trait.toLowerCase()]) */
  attackMod: number
  proficiency: number
}

/** Small pill badge for weapon metadata (range, burden, damage type) */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        ...typeMicro,
        color: 'var(--gold-secondary)',
        background: 'rgba(231,186,144,0.08)',
        border: '1px solid rgba(231,186,144,0.15)',
        borderRadius: 9999,
        padding: '2px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/**
 * Warm glass weapon display — shows everything a player needs for their attack action.
 * Attack mod and damage dice are the most prominent numbers (scan targets during combat).
 */
export function WeaponPanel({ weapon, attackMod, proficiency }: WeaponPanelProps) {
  const totalAttack = attackMod + proficiency

  return (
    <div
      style={{
        ...warmGlass,
        borderRadius: RADIUS_CARD,
        padding: 16,
      }}
    >
      {/* Row 1: Weapon name + pills */}
      <div className="flex items-start justify-between gap-3">
        <span style={{ ...typeSubtitle, ...goldGradientStyle }}>
          {weapon.name}
        </span>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <Pill>{weapon.range}</Pill>
          <Pill>{weapon.burden}</Pill>
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      {/* Row 2: Attack + Damage — the two numbers players scan for */}
      <div className="flex items-baseline gap-6">
        {/* Attack modifier */}
        <div className="flex flex-col">
          <span style={{ ...typeMicro, color: 'var(--text-muted)', marginBottom: 2 }}>
            Attack
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              style={{
                ...typeSubtitle,
                fontSize: 22,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--gold)',
              }}
            >
              {totalAttack >= 0 ? '+' : ''}{totalAttack}
            </span>
            <span style={{ ...typeBody, color: 'var(--text-muted)' }}>
              {weapon.trait}
            </span>
          </div>
        </div>

        {/* Damage */}
        <div className="flex flex-col">
          <span style={{ ...typeMicro, color: 'var(--text-muted)', marginBottom: 2 }}>
            Damage
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              style={{
                ...typeSubtitle,
                fontSize: 22,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--gold)',
              }}
            >
              {weapon.damage}
            </span>
            <Pill>{weapon.physical_or_magical}</Pill>
          </div>
        </div>
      </div>

      {/* Weapon feat (if present) */}
      {weapon.feat_name && weapon.feat_text && (
        <>
          <div
            style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
              marginTop: 10,
              marginBottom: 10,
            }}
          />
          <div>
            <span style={{ ...typeBody, fontWeight: 600, color: 'var(--gold-secondary)' }}>
              {weapon.feat_name}
            </span>
            <div style={{ ...typeBody, color: 'var(--text-secondary)', marginTop: 2 }}>
              <FormatText text={weapon.feat_text} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
