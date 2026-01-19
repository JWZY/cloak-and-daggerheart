import { StatBlock } from '../../components/character/StatBlock'
import { Card } from '../../components/ui/Card'
import type { Character, Traits } from '../../types/character'

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

  return (
    <div className="space-y-4 pb-24">
      {/* Resource tracking */}
      <Card padding="md">
        <StatBlock
          hp={character.hp}
          armor={character.armor}
          hope={character.hope}
          stress={character.stress}
          onHPChange={onHPChange}
          onArmorChange={onArmorChange}
          onHopeChange={onHopeChange}
          onStressChange={onStressChange}
        />
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="md">
          <div className="text-center">
            <span className="text-sm text-gray-500">Evasion</span>
            <p className="text-2xl font-bold text-gray-900">{character.evasion}</p>
          </div>
        </Card>
        <Card padding="md">
          <div className="text-center">
            <span className="text-sm text-gray-500">Proficiency</span>
            <p className="text-2xl font-bold text-gray-900">d{character.proficiency * 2 + 4}</p>
          </div>
        </Card>
      </div>

      {/* Traits */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Traits</h3>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(character.traits) as [keyof Traits, number][]).map(
            ([trait, value]) => (
              <div
                key={trait}
                className={`text-center p-3 rounded-xl ${
                  value > 0
                    ? 'bg-green-50'
                    : value < 0
                    ? 'bg-red-50'
                    : 'bg-gray-50'
                }`}
              >
                <span className="text-xs text-gray-600 capitalize block mb-1">
                  {trait}
                </span>
                <span
                  className={`text-xl font-bold ${
                    value > 0
                      ? 'text-green-700'
                      : value < 0
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}
                >
                  {formatTrait(value)}
                </span>
              </div>
            )
          )}
        </div>
      </Card>

      {/* Character info */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Character Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Ancestry</span>
            <span className="font-medium">{character.ancestry.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Community</span>
            <span className="font-medium">{character.community.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Class</span>
            <span className="font-medium">{character.class}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Subclass</span>
            <span className="font-medium">{character.subclass}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
