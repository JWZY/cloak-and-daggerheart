import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '../../ui/SectionHeader'
import { GameBadge } from '../../ui/GameBadge'
import { useDeckStore } from '../../store/deck-store'
import { tier1Armors, tier1PrimaryWeapons, tier1SecondaryWeapons } from '../../data/srd'
import { parseThresholds } from '../../core/character/armor'
import type { Armor, Weapon } from '../../types/character'

// ---------------------------------------------------------------------------
// Weapon grouping helpers
// ---------------------------------------------------------------------------

interface WeaponGroup {
  label: string
  weapons: Weapon[]
}

function groupWeapons(weapons: Weapon[]): WeaponGroup[] {
  const physMelee: Weapon[] = []
  const physRanged: Weapon[] = []
  const magical: Weapon[] = []

  for (const w of weapons) {
    if (w.physical_or_magical === 'Magical') {
      magical.push(w)
    } else if (w.range === 'Melee') {
      physMelee.push(w)
    } else {
      physRanged.push(w)
    }
  }

  const groups: WeaponGroup[] = []
  if (physMelee.length > 0) groups.push({ label: 'Physical Melee', weapons: physMelee })
  if (physRanged.length > 0) groups.push({ label: 'Physical Ranged', weapons: physRanged })
  if (magical.length > 0) groups.push({ label: 'Magical', weapons: magical })
  return groups
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ArmorOption({
  armor,
  isSelected,
  isDimmed,
  onSelect,
}: {
  armor: Armor
  isSelected: boolean
  isDimmed: boolean
  onSelect: () => void
}) {
  const thresholds = parseThresholds(armor.base_thresholds)
  const score = parseInt(armor.base_score, 10)

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="w-full text-left rounded-xl px-4 py-3"
      style={{
        background: isSelected
          ? 'rgba(231, 186, 144, 0.08)'
          : 'rgba(255, 255, 255, 0.03)',
        border: isSelected
          ? '1px solid rgba(231, 186, 144, 0.3)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isSelected
          ? 'inset 0 1px 1px rgba(249, 248, 243, 0.1), 0 2px 8px rgba(0, 0, 0, 0.15)'
          : 'none',
        opacity: isDimmed ? 0.4 : 1,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      }}
    >
      {/* Name row */}
      <div className="flex items-center justify-between mb-1">
        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 15,
            fontWeight: 600,
            fontVariant: 'small-caps',
            letterSpacing: '0.04em',
            color: isSelected ? '#e7ba90' : 'rgba(212, 207, 199, 0.7)',
          }}
        >
          {armor.name}
        </span>
        {isSelected && <GameBadge>Selected</GameBadge>}
      </div>

      {/* Stats row */}
      <div
        className="flex gap-3 flex-wrap"
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 12,
          color: 'rgba(212, 207, 199, 0.5)',
        }}
      >
        <span>Major {thresholds.major}</span>
        <span>Severe {thresholds.severe}</span>
        <span>Slots {score}</span>
        {armor.feat_name && (
          <span style={{ color: isSelected ? '#e7ba90' : 'rgba(231, 186, 144, 0.5)' }}>
            {armor.feat_text}
          </span>
        )}
      </div>
    </motion.button>
  )
}

function WeaponOption({
  weapon,
  isSelected,
  isDimmed,
  onSelect,
  isSuggested,
}: {
  weapon: Weapon
  isSelected: boolean
  isDimmed: boolean
  onSelect: () => void
  isSuggested?: boolean
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="w-full text-left rounded-xl px-4 py-3"
      style={{
        background: isSelected
          ? 'rgba(231, 186, 144, 0.08)'
          : 'rgba(255, 255, 255, 0.03)',
        border: isSelected
          ? '1px solid rgba(231, 186, 144, 0.3)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isSelected
          ? 'inset 0 1px 1px rgba(249, 248, 243, 0.1), 0 2px 8px rgba(0, 0, 0, 0.15)'
          : 'none',
        opacity: isDimmed ? 0.4 : 1,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      }}
    >
      {/* Name row */}
      <div className="flex items-center justify-between mb-1">
        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 15,
            fontWeight: 600,
            fontVariant: 'small-caps',
            letterSpacing: '0.04em',
            color: isSelected ? '#e7ba90' : 'rgba(212, 207, 199, 0.7)',
          }}
        >
          {weapon.name}
        </span>
        <div className="flex gap-1">
          {isSuggested && !isSelected && <GameBadge color="rgba(212, 207, 199, 0.5)">Suggested</GameBadge>}
          {isSelected && <GameBadge>Selected</GameBadge>}
        </div>
      </div>

      {/* Stats row */}
      <div
        className="flex gap-3 flex-wrap"
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 12,
          color: 'rgba(212, 207, 199, 0.5)',
        }}
      >
        <span>{weapon.trait}</span>
        <span>{weapon.range}</span>
        <span>{weapon.damage}</span>
        <span>{weapon.burden}</span>
        {weapon.feat_name && (
          <span style={{ color: isSelected ? '#e7ba90' : 'rgba(231, 186, 144, 0.5)' }}>
            {weapon.feat_name}
          </span>
        )}
      </div>
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PickEquipment() {
  const selectedArmor = useDeckStore((s) => s.selectedArmor)
  const selectedPrimaryWeapon = useDeckStore((s) => s.selectedPrimaryWeapon)
  const selectedSecondaryWeapon = useDeckStore((s) => s.selectedSecondaryWeapon)
  const setArmor = useDeckStore((s) => s.setArmor)
  const setPrimaryWeapon = useDeckStore((s) => s.setPrimaryWeapon)
  const setSecondaryWeapon = useDeckStore((s) => s.setSecondaryWeapon)

  // Determine if primary weapon is one-handed (allows secondary)
  const primaryWeapon = tier1PrimaryWeapons.find((w) => w.name === selectedPrimaryWeapon)
  const allowSecondary = primaryWeapon?.burden === 'One-Handed'

  // Clear secondary weapon if primary is two-handed
  const handlePrimarySelect = (name: string) => {
    setPrimaryWeapon(name)
    const weapon = tier1PrimaryWeapons.find((w) => w.name === name)
    if (weapon?.burden === 'Two-Handed') {
      setSecondaryWeapon(null)
    }
  }

  const primaryGroups = useMemo(() => groupWeapons(tier1PrimaryWeapons), [])
  const secondaryGroups = useMemo(() => groupWeapons(tier1SecondaryWeapons), [])

  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="w-full max-w-sm mb-2">
        <SectionHeader>Choose Your Equipment</SectionHeader>
      </h2>
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(231, 186, 144, 0.5)',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        Wizard suggested build pre-selected
      </p>

      {/* ----------------------------------------------------------------- */}
      {/* Armor Section                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-sm mb-6">
        <div className="mb-3">
          <SectionHeader>Armor</SectionHeader>
        </div>
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 12,
            color: 'rgba(212, 207, 199, 0.4)',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          Heavier armor raises damage thresholds and armor slots but lowers evasion
        </p>
        <div className="flex flex-col gap-2">
          {tier1Armors.map((armor) => (
            <ArmorOption
              key={armor.name}
              armor={armor}
              isSelected={selectedArmor === armor.name}
              isDimmed={selectedArmor !== null && selectedArmor !== armor.name}
              onSelect={() => setArmor(armor.name)}
            />
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Primary Weapon Section                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-sm mb-6">
        <div className="mb-3">
          <SectionHeader>Primary Weapon</SectionHeader>
        </div>
        {primaryGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 12,
                fontWeight: 600,
                fontVariant: 'small-caps',
                letterSpacing: '0.06em',
                color: 'rgba(212, 207, 199, 0.35)',
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {group.label}
            </p>
            <div className="flex flex-col gap-2">
              {group.weapons.map((weapon) => (
                <WeaponOption
                  key={weapon.name}
                  weapon={weapon}
                  isSelected={selectedPrimaryWeapon === weapon.name}
                  isDimmed={selectedPrimaryWeapon !== null && selectedPrimaryWeapon !== weapon.name}
                  onSelect={() => handlePrimarySelect(weapon.name)}
                  isSuggested={weapon.name === 'Greatstaff'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Secondary Weapon Section (only if one-handed primary)             */}
      {/* ----------------------------------------------------------------- */}
      {allowSecondary && (
        <div className="w-full max-w-sm mb-6">
          <div className="mb-3">
            <SectionHeader>Secondary Weapon</SectionHeader>
          </div>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 12,
              color: 'rgba(212, 207, 199, 0.4)',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Optional -- your free hand allows a secondary weapon
          </p>
          {secondaryGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 12,
                  fontWeight: 600,
                  fontVariant: 'small-caps',
                  letterSpacing: '0.06em',
                  color: 'rgba(212, 207, 199, 0.35)',
                  marginBottom: 8,
                  paddingLeft: 4,
                }}
              >
                {group.label}
              </p>
              <div className="flex flex-col gap-2">
                {group.weapons.map((weapon) => (
                  <WeaponOption
                    key={weapon.name}
                    weapon={weapon}
                    isSelected={selectedSecondaryWeapon === weapon.name}
                    isDimmed={selectedSecondaryWeapon !== null && selectedSecondaryWeapon !== weapon.name}
                    onSelect={() =>
                      setSecondaryWeapon(
                        selectedSecondaryWeapon === weapon.name ? null : weapon.name
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!allowSecondary && selectedPrimaryWeapon && (
        <div className="w-full max-w-sm mb-6">
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 12,
              color: 'rgba(212, 207, 199, 0.3)',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            Two-handed weapon equipped -- no secondary weapon available
          </p>
        </div>
      )}
    </div>
  )
}
