import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { springs } from '../../design-system/tokens/animations'
import { goldDarkAlpha } from '../../ui/typography'
import { SelectableOption } from '../../ui/SelectableOption'
import { GameBadge } from '../../ui/GameBadge'
import { EmberOverlay } from '../../ui/EmberOverlay'
import { typeSubtitle, typeBody } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { getClassAccentColor } from '../../cards/domain-colors'
import { tier1Armors, tier1PrimaryWeapons, tier1SecondaryWeapons, getSuggestedEquipment } from '../../data/srd'
import { parseThresholds } from '../../core/character/armor'
import type { Armor, Weapon } from '../../types/character'

// ---------------------------------------------------------------------------
// Diamond pip indicator (smaller version of GameButton's CornerOrnament)
// ---------------------------------------------------------------------------

function DiamondPip() {
  return (
    <div
      style={{
        position: 'absolute',
        right: -1,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
        flexShrink: 0,
        zIndex: 2,
      }}
    >
      {/* Outer diamond -- dark surround */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #5a5550 0%, #3a3530 100%)',
          transform: 'rotate(45deg)',
          borderRadius: 1.5,
        }}
      />
      {/* Inner diamond -- bright metallic center */}
      <div
        style={{
          position: 'absolute',
          inset: 3.5,
          background: 'linear-gradient(180deg, #c8c0b4 0%, #8a8078 100%)',
          transform: 'rotate(45deg)',
          borderRadius: 1,
          boxShadow:
            `0 0 3px rgba(200,192,180,0.4), 0 0 8px ${goldDarkAlpha(0.4)}`,
        }}
      />
    </div>
  )
}

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
  isDisabled,
  onSelect,
}: {
  armor: Armor
  isSelected: boolean
  isDimmed: boolean
  isDisabled?: boolean
  onSelect: () => void
}) {
  const thresholds = parseThresholds(armor.base_thresholds)
  const score = parseInt(armor.base_score, 10)

  return (
    <SelectableOption
      selected={isSelected}
      dimmed={isDimmed}
      disabled={isDisabled}
      onClick={onSelect}
    >
      {isSelected && <DiamondPip />}

      {/* Name row */}
      <div className="flex items-center justify-between mb-1">
        <span
          style={{
            ...typeSubtitle,
            color: isSelected ? 'var(--gold)' : 'var(--text-secondary)',
          }}
        >
          {armor.name}
        </span>
      </div>

      {/* Stats row */}
      <div
        className="flex gap-3 flex-wrap"
        style={{
          ...typeBody,
          color: 'var(--text-muted)',
        }}
      >
        <span>Major {thresholds.major}</span>
        <span>Severe {thresholds.severe}</span>
        <span>Slots {score}</span>
      </div>

      {/* Feat description */}
      {armor.feat_text && (
        <p
          style={{
            ...typeBody,
            color: isSelected ? 'var(--gold)' : 'var(--gold-secondary)',
            marginTop: 4,
          }}
        >
          {armor.feat_text}
        </p>
      )}
    </SelectableOption>
  )
}

function WeaponOption({
  weapon,
  isSelected,
  isDimmed,
  isDisabled,
  onSelect,
  isSuggested,
}: {
  weapon: Weapon
  isSelected: boolean
  isDimmed: boolean
  isDisabled?: boolean
  onSelect: () => void
  isSuggested?: boolean
}) {
  return (
    <SelectableOption
      selected={isSelected}
      dimmed={isDimmed}
      disabled={isDisabled}
      onClick={onSelect}
    >
      {isSelected && <DiamondPip />}

      {/* Name row */}
      <div className="flex items-center justify-between mb-1">
        <span
          style={{
            ...typeSubtitle,
            color: isSelected ? 'var(--gold)' : 'var(--text-secondary)',
          }}
        >
          {weapon.name}
        </span>
        <div className="flex items-center gap-2">
          {isSuggested && !isSelected && <GameBadge color="var(--text-muted)">Suggested</GameBadge>}
        </div>
      </div>

      {/* Stats row */}
      <div
        className="flex gap-3 flex-wrap"
        style={{
          ...typeBody,
          color: 'var(--text-muted)',
        }}
      >
        <span>{weapon.trait}</span>
        <span>{weapon.range}</span>
        <span>{weapon.damage}</span>
        <span>{weapon.burden}</span>
      </div>

      {/* Feat description */}
      {weapon.feat_text && (
        <p
          style={{
            ...typeBody,
            color: isSelected ? 'var(--gold)' : 'var(--gold-secondary)',
            marginTop: 4,
          }}
        >
          {weapon.feat_name && (
            <span style={{ fontWeight: 600 }}>{weapon.feat_name}: </span>
          )}
          {weapon.feat_text}
        </p>
      )}
    </SelectableOption>
  )
}

// ---------------------------------------------------------------------------
// Section type for accordion state
// ---------------------------------------------------------------------------

type SectionKey = 'armor' | 'primary' | 'secondary'

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PickEquipment() {
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const suggested = selectedClass ? getSuggestedEquipment(selectedClass) : null
  const selectedArmor = useDeckStore((s) => s.selectedArmor)
  const selectedPrimaryWeapon = useDeckStore((s) => s.selectedPrimaryWeapon)
  const selectedSecondaryWeapon = useDeckStore((s) => s.selectedSecondaryWeapon)
  const setArmor = useDeckStore((s) => s.setArmor)
  const setPrimaryWeapon = useDeckStore((s) => s.setPrimaryWeapon)
  const setSecondaryWeapon = useDeckStore((s) => s.setSecondaryWeapon)

  // Accordion state: which section is currently expanded (null = all collapsed)
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>(null)

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
    // Collapse after selection
    setExpandedSection(null)
  }

  const handleArmorSelect = (name: string) => {
    setArmor(name)
    // Collapse after selection
    setExpandedSection(null)
  }

  const handleSecondarySelect = (name: string) => {
    setSecondaryWeapon(selectedSecondaryWeapon === name ? null : name)
    // Collapse after selection (only if we just selected, not deselected)
    if (selectedSecondaryWeapon !== name) {
      setExpandedSection(null)
    }
  }

  const toggleSection = (section: SectionKey) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  // Determine if a section should show all items
  const isArmorExpanded = selectedArmor === null || expandedSection === 'armor'
  const isPrimaryExpanded = selectedPrimaryWeapon === null || expandedSection === 'primary'
  const isSecondaryExpanded = selectedSecondaryWeapon === null || expandedSection === 'secondary'

  // Determine secondary section state
  const secondaryDisabledReason: string | null = !selectedPrimaryWeapon
    ? 'Choose a primary weapon first'
    : !allowSecondary
      ? 'Requires a one-handed primary weapon'
      : null
  const isSecondaryDisabled = secondaryDisabledReason !== null

  const primaryGroups = useMemo(() => groupWeapons(tier1PrimaryWeapons), [])
  const secondaryGroups = useMemo(() => groupWeapons(tier1SecondaryWeapons), [])

  // Find selected items for collapsed view
  const selectedArmorData = tier1Armors.find((a) => a.name === selectedArmor)
  const selectedPrimaryData = tier1PrimaryWeapons.find((w) => w.name === selectedPrimaryWeapon)
  const selectedSecondaryData = tier1SecondaryWeapons.find((w) => w.name === selectedSecondaryWeapon)

  const accentColor = getClassAccentColor(selectedClass)

  return (
    <>
      <EmberOverlay color={accentColor} rate={6} />
      <div className="flex flex-col items-center px-4" style={{ paddingTop: 48 }}>
      <p className="max-w-[360px]" style={{
        ...typeBody,
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        {selectedClass ?? 'Class'} suggested build pre-selected
      </p>

      {/* ----------------------------------------------------------------- */}
      {/* Armor Section                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[360px] mb-6">
        <h3 style={{
          ...typeSubtitle,
          color: 'var(--gold)',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          Armor
        </h3>
        <p
          style={{
            ...typeBody,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          Heavier armor raises damage thresholds and armor slots but lowers evasion
        </p>
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {isArmorExpanded ? (
              /* Expanded: show all armors */
              tier1Armors.map((armor) => (
                <motion.div
                  key={armor.name}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', ...springs.smooth }}
                >
                  <ArmorOption
                    armor={armor}
                    isSelected={selectedArmor === armor.name}
                    isDimmed={selectedArmor !== null && selectedArmor !== armor.name}
                    onSelect={() => handleArmorSelect(armor.name)}
                  />
                </motion.div>
              ))
            ) : selectedArmorData ? (
              /* Collapsed: show only selected */
              <motion.div
                key={`collapsed-armor-${selectedArmorData.name}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', ...springs.smooth }}
              >
                <ArmorOption
                  armor={selectedArmorData}
                  isSelected
                  isDimmed={false}
                  onSelect={() => toggleSection('armor')}

                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Primary Weapon Section                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[360px] mb-6">
        <h3 style={{
          ...typeSubtitle,
          color: 'var(--gold)',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          Primary Weapon
        </h3>
        <AnimatePresence mode="popLayout" initial={false}>
          {isPrimaryExpanded ? (
            /* Expanded: show all weapon groups */
            primaryGroups.map((group) => (
              <motion.div
                key={group.label}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', ...springs.smooth }}
                className="mb-4"
              >
                <p
                  style={{
                    ...typeBody,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
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
                      isSuggested={weapon.name === suggested?.primary}
                    />
                  ))}
                </div>
              </motion.div>
            ))
          ) : selectedPrimaryData ? (
            /* Collapsed: show only selected */
            <motion.div
              key={`collapsed-primary-${selectedPrimaryData.name}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', ...springs.smooth }}
            >
              <WeaponOption
                weapon={selectedPrimaryData}
                isSelected
                isDimmed={false}
                onSelect={() => toggleSection('primary')}

              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Secondary Weapon Section (always visible)                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[360px] mb-6">
        <h3 style={{
          ...typeSubtitle,
          color: 'var(--gold)',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          Secondary Weapon
        </h3>

        <p
          style={{
            ...typeBody,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            fontStyle: isSecondaryDisabled ? 'italic' : undefined,
            marginBottom: 12,
          }}
        >
          {isSecondaryDisabled
            ? secondaryDisabledReason
            : 'Optional — your free hand allows a secondary weapon'}
        </p>

        <AnimatePresence mode="popLayout" initial={false}>
          {isSecondaryExpanded || isSecondaryDisabled ? (
            /* Expanded (or disabled -- show all, grayed out) */
            secondaryGroups.map((group) => (
              <motion.div
                key={group.label}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', ...springs.smooth }}
                className="mb-4"
              >
                <p
                  style={{
                    ...typeBody,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
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
                      isDimmed={!isSecondaryDisabled && selectedSecondaryWeapon !== null && selectedSecondaryWeapon !== weapon.name}
                      isDisabled={isSecondaryDisabled}
                      onSelect={() => handleSecondarySelect(weapon.name)}
                    />
                  ))}
                </div>
              </motion.div>
            ))
          ) : selectedSecondaryData ? (
            /* Collapsed: show only selected */
            <motion.div
              key={`collapsed-secondary-${selectedSecondaryData.name}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', ...springs.smooth }}
            >
              <WeaponOption
                weapon={selectedSecondaryData}
                isSelected
                isDimmed={false}
                onSelect={() => toggleSection('secondary')}

              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
    </>
  )
}
