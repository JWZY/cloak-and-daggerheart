import { Sword, Shield, Scroll } from 'lucide-react'
import { typeMicro, typeSubtitle, typeBody } from '../../ui/typography'
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
          background: 'var(--bg-surface)',
          border: '1px solid var(--gold-muted)',
        }}
      >
        <Icon size={14} color="var(--gold-secondary)" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            style={{
              ...typeMicro,
              color: 'var(--gold-secondary)',
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: typeSubtitle.fontFamily,
              fontSize: typeSubtitle.fontSize,
              fontWeight: typeSubtitle.fontWeight,
              color: 'var(--text-primary)',
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
              fontFamily: typeBody.fontFamily,
              fontSize: typeMicro.fontSize,
              display: 'block',
              marginTop: 2,
              color: 'var(--text-muted)',
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
          background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
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
          background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
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
        style={{ borderTop: '1px solid var(--gold-muted)' }}
      >
        <Scroll size={12} color="var(--gold-secondary)" />
        <span
          style={{
            ...typeMicro,
            color: 'rgba(231, 186, 144, 0.4)',
          }}
        >
          Gold
        </span>
        <span
          style={{
            fontFamily: typeBody.fontFamily,
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--gold)',
          }}
        >
          {character.gold}
        </span>
      </div>
    </div>
  )
}
