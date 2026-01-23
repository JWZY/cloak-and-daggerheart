import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import type { Character, Traits } from '../../types/character'
import { wizard, parseThresholds } from '../../data/srd'

interface StatsTabProps {
  character: Character
  onHPChange: (value: number) => void
  onArmorChange: (value: number) => void
  onHopeChange: (value: number) => void
  onStressChange: (value: number) => void
}

// Liquid Glass slot style
const slotBaseStyle = `
  w-10 h-10 rounded-full transition-all
  bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.01)_100%)]
  shadow-[inset_0_1px_1px_rgba(255,255,255,0.375),inset_0_1.5px_3px_rgba(255,255,255,0.09),inset_0_-1px_1px_rgba(0,0,0,0.1),inset_0_-1.5px_3px_rgba(0,0,0,0.05)]
`.trim().replace(/\s+/g, ' ')

const slotFilledStyle = `
  w-10 h-10 rounded-full transition-all
  bg-white/90
  shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(255,255,255,0.3)]
`.trim().replace(/\s+/g, ' ')

interface SlotDisplayProps {
  current: number
  max: number
  onChange: (value: number) => void
  label: string
}

function SlotDisplay({ current, max, onChange, label }: SlotDisplayProps) {
  const handleTap = (index: number) => {
    if (index < current) {
      onChange(index)
    } else {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-white/40">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: max }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleTap(i)}
            className={i < current ? slotFilledStyle : slotBaseStyle}
          />
        ))}
      </div>
    </div>
  )
}

export function StatsTab({
  character,
  onHPChange,
  onArmorChange,
  onHopeChange,
  onStressChange,
}: StatsTabProps) {
  const formatTrait = (value: number) => {
    if (value > 0) return `+${value}`
    return value.toString()
  }

  // Damage thresholds from equipped armor
  const thresholds = character.equipment?.armor
    ? parseThresholds(character.equipment.armor.base_thresholds)
    : { major: 6, severe: 13 }
  const majorThreshold = thresholds.major
  const severeThreshold = thresholds.severe

  // Fallback for armorSlots if not migrated
  const armorSlots = character.armorSlots ?? { current: 0, max: 3 }

  return (
    <div className="space-y-4 pb-24">
      {/* Health: HP & Stress */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Health</h3>
        <div className="space-y-4">
          <SlotDisplay
            current={character.hp.current}
            max={character.hp.max}
            onChange={onHPChange}
            label={`HP ${character.hp.current}/${character.hp.max}`}
          />
          <SlotDisplay
            current={character.stress.current}
            max={character.stress.max}
            onChange={onStressChange}
            label={`Stress ${character.stress.current}/${character.stress.max}`}
          />
        </div>
      </Card>

      {/* Defense: Armor & Evasion */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Defense</h3>
        <div className="flex gap-6 items-start">
          <div className="flex-1">
            <SlotDisplay
              current={armorSlots.current}
              max={armorSlots.max}
              onChange={onArmorChange}
              label={`Armor ${armorSlots.current}/${armorSlots.max}`}
            />
          </div>
          <div className="text-center px-4">
            <span className="text-xs uppercase tracking-wide text-white/40 block mb-2">Evasion</span>
            <p className="text-3xl font-semibold text-white">{character.evasion}</p>
          </div>
        </div>
      </Card>

      {/* Damage Thresholds */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Damage Thresholds</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wide text-white/40 block mb-1">Minor</span>
            <span className="text-2xl font-semibold text-white">1-{majorThreshold - 1}</span>
          </div>
          <div className="text-center">
            <span className="text-xs uppercase tracking-wide text-amber-400/80 block mb-1">Major</span>
            <span className="text-2xl font-semibold text-white">{majorThreshold}-{severeThreshold - 1}</span>
          </div>
          <div className="text-center">
            <span className="text-xs uppercase tracking-wide text-red-400/80 block mb-1">Severe</span>
            <span className="text-2xl font-semibold text-white">{severeThreshold}+</span>
          </div>
        </div>
      </Card>

      {/* Hope Section */}
      <Card variant="glass" padding="md">
        <div className="flex items-start gap-4">
          {/* Hope Counter */}
          <div className="flex-shrink-0">
            <span className="text-xs uppercase tracking-wide text-white/40 block mb-3">Hope</span>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => onHopeChange(Math.max(0, character.hope - 1))}
                disabled={character.hope <= 0}
                className="lg-button w-10 h-10 disabled:opacity-30"
              >
                <Minus size={18} strokeWidth={2.5} />
              </motion.button>
              <span className="text-3xl font-semibold text-white w-10 text-center">{character.hope}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => onHopeChange(character.hope + 1)}
                className="lg-button w-10 h-10"
              >
                <Plus size={18} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-white/10 self-stretch" />

          {/* Hope Feature */}
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase tracking-wide text-white/40 block mb-2">Hope Feature</span>
            <h4 className="font-medium text-white text-sm">{wizard.hope_feat_name}</h4>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">{wizard.hope_feat_text}</p>
          </div>
        </div>
      </Card>

      {/* Proficiency */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs uppercase tracking-wide text-white/40">Proficiency</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full border border-white/30 ${
                  level <= character.proficiency ? 'bg-white' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Traits */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Traits</h3>
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(character.traits) as [keyof Traits, number][]).map(
            ([trait, value]) => (
              <div key={trait} className="text-center">
                <span className="text-xs uppercase tracking-wide text-white/40 block mb-1">
                  {trait}
                </span>
                <span className="text-2xl font-semibold text-white">
                  {formatTrait(value)}
                </span>
              </div>
            )
          )}
        </div>
      </Card>

      {/* Character info */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Character Info</h3>
        <div className="divide-y divide-white/10">
          <div className="py-3 first:pt-0 last:pb-0 flex justify-between items-center">
            <span className="text-sm text-white/50">Ancestry</span>
            <span className="text-sm font-medium text-white">{character.ancestry.name}</span>
          </div>
          <div className="py-3 first:pt-0 last:pb-0 flex justify-between items-center">
            <span className="text-sm text-white/50">Community</span>
            <span className="text-sm font-medium text-white">{character.community.name}</span>
          </div>
          <div className="py-3 first:pt-0 last:pb-0 flex justify-between items-center">
            <span className="text-sm text-white/50">Class</span>
            <span className="text-sm font-medium text-white">{character.class}</span>
          </div>
          <div className="py-3 last:pb-0 flex justify-between items-center">
            <span className="text-sm text-white/50">Subclass</span>
            <span className="text-sm font-medium text-white">{character.subclass}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
