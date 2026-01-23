import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, Shield, Check } from 'lucide-react'
import { Button } from '../../components/ui/Button'
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
  onNext: () => void
  onBack: () => void
}

export function EquipmentStep({ equipment, onSelect, onNext, onBack }: EquipmentStepProps) {
  const [primaryWeapon, setPrimaryWeapon] = useState<Weapon | null>(
    equipment?.primaryWeapon ?? quarterstaff
  )
  const [secondaryWeapon, setSecondaryWeapon] = useState<Weapon | null>(
    equipment?.secondaryWeapon ?? null
  )
  const [armor, setArmor] = useState<Armor | null>(
    equipment?.armor ?? leatherArmor
  )

  const handleContinue = () => {
    onSelect({
      primaryWeapon,
      secondaryWeapon,
      armor,
      items: equipment?.items ?? [],
      consumables: equipment?.consumables ?? [],
    })
    onNext()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Choose Your Equipment</h2>
        <p className="text-gray-600 text-sm mt-1">
          Select your starting weapons and armor
        </p>
      </div>

      <div className="flex-1 overflow-auto pb-24 space-y-6">
        {/* Primary Weapon */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Swords size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Primary Weapon</h3>
          </div>
          <div className="space-y-2">
            {tier1PrimaryWeapons.map((weapon) => (
              <motion.button
                key={weapon.name}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPrimaryWeapon(weapon)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  primaryWeapon?.name === weapon.name
                    ? 'bg-ios-blue/10 border-ios-blue'
                    : 'bg-white border-ios-separator hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{weapon.name}</h4>
                  {primaryWeapon?.name === weapon.name && (
                    <Check size={20} className="text-ios-blue" />
                  )}
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  <span>{weapon.damage} damage</span>
                  <span>{weapon.range}</span>
                  <span>{weapon.trait}</span>
                </div>
                {weapon.feat_text && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">{weapon.feat_text}</p>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Secondary Weapon */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Swords size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Secondary Weapon</h3>
            <span className="text-xs text-gray-400">(Optional)</span>
          </div>
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setSecondaryWeapon(null)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                secondaryWeapon === null
                  ? 'bg-ios-blue/10 border-ios-blue'
                  : 'bg-white border-ios-separator hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-500 italic">None</h4>
                {secondaryWeapon === null && (
                  <Check size={20} className="text-ios-blue" />
                )}
              </div>
            </motion.button>
            {tier1SecondaryWeapons.map((weapon) => (
              <motion.button
                key={weapon.name}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSecondaryWeapon(weapon)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  secondaryWeapon?.name === weapon.name
                    ? 'bg-ios-blue/10 border-ios-blue'
                    : 'bg-white border-ios-separator hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{weapon.name}</h4>
                  {secondaryWeapon?.name === weapon.name && (
                    <Check size={20} className="text-ios-blue" />
                  )}
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  <span>{weapon.damage} damage</span>
                  <span>{weapon.range}</span>
                  <span>{weapon.trait}</span>
                </div>
                {weapon.feat_text && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">{weapon.feat_text}</p>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Armor */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Armor</h3>
          </div>
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setArmor(null)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                armor === null
                  ? 'bg-ios-blue/10 border-ios-blue'
                  : 'bg-white border-ios-separator hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-500 italic">Unarmored</h4>
                {armor === null && (
                  <Check size={20} className="text-ios-blue" />
                )}
              </div>
              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                <span>Score: 3</span>
                <span>Thresholds: Default</span>
              </div>
            </motion.button>
            {tier1Armors.map((a) => (
              <motion.button
                key={a.name}
                whileTap={{ scale: 0.98 }}
                onClick={() => setArmor(a)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  armor?.name === a.name
                    ? 'bg-ios-blue/10 border-ios-blue'
                    : 'bg-white border-ios-separator hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{a.name}</h4>
                  {armor?.name === a.name && (
                    <Check size={20} className="text-ios-blue" />
                  )}
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  <span>Score: {a.base_score}</span>
                  <span>Thresholds: {a.base_thresholds}</span>
                </div>
                {a.feat_text && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">{a.feat_text}</p>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-ios-separator flex gap-3">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )
}
