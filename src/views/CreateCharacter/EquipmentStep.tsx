import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Swords, Shield, Check } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { GlassSectionHeader } from '../../components/ui/GlassSectionHeader'
import type { Equipment, Weapon, Armor } from '../../types/character'
import {
  tier1PrimaryWeapons,
  tier1SecondaryWeapons,
  tier1Armors,
  quarterstaff,
  leatherArmor,
} from '../../data/srd'

interface EquipmentStepProps {
  equipment: Partial<Equipment> | undefined
  onSelect: (equipment: Partial<Equipment>) => void
}

export function EquipmentStep({ equipment, onSelect }: EquipmentStepProps) {
  const [primaryWeapon, setPrimaryWeapon] = useState<Weapon | null>(
    equipment?.primaryWeapon ?? quarterstaff
  )
  const [secondaryWeapon, setSecondaryWeapon] = useState<Weapon | null>(
    equipment?.secondaryWeapon ?? null
  )
  const [armor, setArmor] = useState<Armor | null>(
    equipment?.armor ?? leatherArmor
  )

  // Use ref to avoid onSelect in dependency array (prevents infinite loop)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Stable callback for updating parent
  const updateEquipment = useCallback((
    primary: Weapon | null,
    secondary: Weapon | null,
    arm: Armor | null
  ) => {
    onSelectRef.current({
      primaryWeapon: primary,
      secondaryWeapon: secondary,
      armor: arm,
      items: equipment?.items ?? [],
      consumables: equipment?.consumables ?? [],
    })
  }, [equipment?.items, equipment?.consumables])

  // Update parent on mount and when equipment changes
  useEffect(() => {
    updateEquipment(primaryWeapon, secondaryWeapon, armor)
  }, [primaryWeapon, secondaryWeapon, armor, updateEquipment])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-glass-primary">Choose Your Equipment</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Select your starting weapons and armor
        </p>
      </div>

      <div className="flex-1 overflow-auto space-y-6">
        {/* Primary Weapon */}
        <div>
          <GlassSectionHeader title="Primary Weapon" icon={Swords} />
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
            <div className="flex gap-3 pb-2">
              {tier1PrimaryWeapons.map((weapon) => {
                const isSelected = primaryWeapon?.name === weapon.name
                return (
                  <motion.div
                    key={weapon.name}
                    className="snap-center flex-shrink-0 w-[200px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card
                      variant={isSelected ? 'glass-strong' : 'glass'}
                      selected={false}
                      onTap={() => setPrimaryWeapon(weapon)}
                      padding="md"
                      className={`h-full ${isSelected ? 'glass-selected' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-glass-primary truncate">{weapon.name}</h4>
                        {isSelected && <Check size={16} className="text-emerald-300 flex-shrink-0" />}
                      </div>
                      <div className="flex gap-2 mt-1 text-xs text-glass-muted flex-wrap">
                        <span>{weapon.damage} dmg</span>
                        <span>&bull;</span>
                        <span>{weapon.range}</span>
                      </div>
                      <div className="text-xs text-glass-muted mt-1">{weapon.trait}</div>
                      {weapon.feat_text && (
                        <p className="text-xs text-amber-300/80 mt-2 line-clamp-2">{weapon.feat_text}</p>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Secondary Weapon */}
        <div>
          <GlassSectionHeader title="Secondary Weapon" subtitle="Optional" icon={Swords} />
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
            <div className="flex gap-3 pb-2">
              {/* None option */}
              <motion.div
                className="snap-center flex-shrink-0 w-[140px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card
                  variant={secondaryWeapon === null ? 'glass-strong' : 'glass'}
                  selected={false}
                  onTap={() => setSecondaryWeapon(null)}
                  padding="md"
                  className={`h-full ${secondaryWeapon === null ? 'glass-selected' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-glass-muted italic">None</h4>
                    {secondaryWeapon === null && <Check size={16} className="text-emerald-300" />}
                  </div>
                </Card>
              </motion.div>

              {tier1SecondaryWeapons.map((weapon) => {
                const isSelected = secondaryWeapon?.name === weapon.name
                return (
                  <motion.div
                    key={weapon.name}
                    className="snap-center flex-shrink-0 w-[200px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card
                      variant={isSelected ? 'glass-strong' : 'glass'}
                      selected={false}
                      onTap={() => setSecondaryWeapon(weapon)}
                      padding="md"
                      className={`h-full ${isSelected ? 'glass-selected' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-glass-primary truncate">{weapon.name}</h4>
                        {isSelected && <Check size={16} className="text-emerald-300 flex-shrink-0" />}
                      </div>
                      <div className="flex gap-2 mt-1 text-xs text-glass-muted flex-wrap">
                        <span>{weapon.damage} dmg</span>
                        <span>&bull;</span>
                        <span>{weapon.range}</span>
                      </div>
                      <div className="text-xs text-glass-muted mt-1">{weapon.trait}</div>
                      {weapon.feat_text && (
                        <p className="text-xs text-amber-300/80 mt-2 line-clamp-2">{weapon.feat_text}</p>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Armor */}
        <div>
          <GlassSectionHeader title="Armor" icon={Shield} />
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
            <div className="flex gap-3 pb-2">
              {/* Unarmored option */}
              <motion.div
                className="snap-center flex-shrink-0 w-[160px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card
                  variant={armor === null ? 'glass-strong' : 'glass'}
                  selected={false}
                  onTap={() => setArmor(null)}
                  padding="md"
                  className={`h-full ${armor === null ? 'glass-selected' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-glass-muted italic">Unarmored</h4>
                    {armor === null && <Check size={16} className="text-emerald-300" />}
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-glass-muted">
                    <span>Score: 3</span>
                  </div>
                  <div className="text-xs text-glass-muted mt-1">Thresholds: Default</div>
                </Card>
              </motion.div>

              {tier1Armors.map((a) => {
                const isSelected = armor?.name === a.name
                return (
                  <motion.div
                    key={a.name}
                    className="snap-center flex-shrink-0 w-[180px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card
                      variant={isSelected ? 'glass-strong' : 'glass'}
                      selected={false}
                      onTap={() => setArmor(a)}
                      padding="md"
                      className={`h-full ${isSelected ? 'glass-selected' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-glass-primary truncate">{a.name}</h4>
                        {isSelected && <Check size={16} className="text-emerald-300 flex-shrink-0" />}
                      </div>
                      <div className="flex gap-2 mt-1 text-xs text-glass-muted flex-wrap">
                        <span>Score: {a.base_score}</span>
                        <span>&bull;</span>
                        <span>{a.base_thresholds}</span>
                      </div>
                      {a.feat_text && (
                        <p className="text-xs text-amber-300/80 mt-2 line-clamp-2">{a.feat_text}</p>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
