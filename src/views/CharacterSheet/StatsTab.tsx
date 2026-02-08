import { Heart, Zap, Sparkles, Shield } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { DrumPicker } from '../../components/ui/DrumPicker'
import type { Character, Traits } from '../../types/character'
import { wizard, parseThresholds } from '../../data/srd'

interface StatsTabProps {
  character: Character
  onHPChange: (value: number) => void
  onArmorChange: (value: number) => void
  onHopeChange: (value: number) => void
  onStressChange: (value: number) => void
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
      {/* Defense: Evasion + Armor Slots */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/75 font-semibold mb-4">Defense</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wide text-white/75 block mb-2">Evasion</span>
            <p className="text-3xl font-semibold text-white">{character.evasion}</p>
          </div>
          <DrumPicker
            value={armorSlots.current}
            onChange={onArmorChange}
            min={0}
            max={armorSlots.max}
            label="Armor"
            icon={<Shield size={14} />}
          />
        </div>
      </Card>

      {/* Damage & Health: Thresholds + HP + Stress */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/75 font-semibold mb-4">Damage &amp; Health</h3>
        {/* Damage Thresholds */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wide text-white/75 block mb-1">Minor</span>
            <span className="text-2xl font-semibold text-white">1-{majorThreshold - 1}</span>
          </div>
          <div className="text-center">
            <span className="text-xs uppercase tracking-wide text-white/75 block mb-1">Major</span>
            <span className="text-2xl font-semibold text-white">{majorThreshold}-{severeThreshold - 1}</span>
          </div>
          <div className="text-center">
            <span className="text-xs uppercase tracking-wide text-white/75 block mb-1">Severe</span>
            <span className="text-2xl font-semibold text-white">{severeThreshold}+</span>
          </div>
        </div>
        {/* HP and Stress */}
        <div className="grid grid-cols-2 gap-3">
          <DrumPicker
            value={character.hp.current}
            onChange={onHPChange}
            min={0}
            max={character.hp.max}
            label="HP"
            icon={<Heart size={14} />}
          />
          <DrumPicker
            value={character.stress.current}
            onChange={onStressChange}
            min={0}
            max={character.stress.max}
            label="Stress"
            icon={<Zap size={14} />}
          />
        </div>
      </Card>

      {/* Hope: DrumPicker + Hope Feature */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/75 font-semibold mb-4">Hope</h3>
        <div className="flex justify-center mb-4">
          <DrumPicker
            value={character.hope}
            onChange={onHopeChange}
            min={0}
            max={6}
            label="Hope"
            icon={<Sparkles size={14} />}
          />
        </div>
        <div className="border-t border-white/10 pt-3">
          <span className="text-xs uppercase tracking-wide text-white/75 font-semibold block mb-2">Hope Feature</span>
          <h4 className="font-medium text-white text-sm">{wizard.hope_feat_name}</h4>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">{wizard.hope_feat_text}</p>
        </div>
      </Card>

      {/* Traits */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/75 font-semibold mb-4">Traits</h3>
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(character.traits) as [keyof Traits, number][]).map(
            ([trait, value]) => (
              <div key={trait} className="text-center">
                <span className="text-xs uppercase tracking-wide text-white/75 block mb-1">
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

    </div>
  )
}
