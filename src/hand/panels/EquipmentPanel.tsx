import { Sword, Shield, Scroll } from 'lucide-react'
import type { Character } from '../../types/character'

export interface EquipmentPanelProps {
  character: Character
}

function EquipmentRow({
  icon: Icon,
  label,
  name,
  details,
}: {
  icon: React.ElementType
  label: string
  name: string | null
  details?: string
}) {
  if (!name) return null

  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <div
        className="flex items-center justify-center rounded-lg shrink-0 mt-0.5"
        style={{
          width: 28,
          height: 28,
          background: 'rgba(3, 7, 13, 0.6)',
          border: '1px solid rgba(231, 186, 144, 0.1)',
        }}
      >
        <Icon size={14} color="rgba(231, 186, 144, 0.4)" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'rgba(231, 186, 144, 0.4)',
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(212, 207, 199, 0.85)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
        </div>
        {details && (
          <span
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 11,
              display: 'block',
              marginTop: 2,
              color: 'rgba(212, 207, 199, 0.45)',
            }}
          >
            {details}
          </span>
        )}
      </div>
    </div>
  )
}

export function EquipmentPanel({ character }: EquipmentPanelProps) {
  const { equipment } = character

  const primaryDetails = equipment.primaryWeapon
    ? `${equipment.primaryWeapon.damage} damage, ${equipment.primaryWeapon.range}, ${equipment.primaryWeapon.trait}`
    : undefined

  const secondaryDetails = equipment.secondaryWeapon
    ? `${equipment.secondaryWeapon.damage} damage, ${equipment.secondaryWeapon.range}, ${equipment.secondaryWeapon.trait}`
    : undefined

  const armorDetails = equipment.armor
    ? `Score ${equipment.armor.base_score}, Thresholds ${equipment.armor.base_thresholds}`
    : undefined

  return (
    <div className="flex flex-col">
      <EquipmentRow
        icon={Sword}
        label="Primary"
        name={equipment.primaryWeapon?.name ?? null}
        details={primaryDetails}
      />

      {/* Gold separator */}
      <div
        style={{
          height: 1,
          margin: '4px 0',
          background: 'linear-gradient(90deg, transparent, rgba(231, 186, 144, 0.1), transparent)',
        }}
      />

      <EquipmentRow
        icon={Sword}
        label="Secondary"
        name={equipment.secondaryWeapon?.name ?? null}
        details={secondaryDetails}
      />

      {/* Gold separator */}
      <div
        style={{
          height: 1,
          margin: '4px 0',
          background: 'linear-gradient(90deg, transparent, rgba(231, 186, 144, 0.1), transparent)',
        }}
      />

      <EquipmentRow
        icon={Shield}
        label="Armor"
        name={equipment.armor?.name ?? null}
        details={armorDetails}
      />

      {/* Gold */}
      <div
        className="flex items-center gap-2 pt-2 mt-1"
        style={{ borderTop: '1px solid rgba(231, 186, 144, 0.08)' }}
      >
        <Scroll size={12} color="rgba(231, 186, 144, 0.5)" />
        <span
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(231, 186, 144, 0.4)',
          }}
        >
          Gold
        </span>
        <span
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: '#e7ba90',
          }}
        >
          {character.gold}
        </span>
      </div>
    </div>
  )
}
