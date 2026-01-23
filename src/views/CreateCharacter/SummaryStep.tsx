import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { wizard, getWizardCardCount } from '../../data/srd'
import type { Ancestry, Community, Traits, DomainCard, WizardSubclass } from '../../types/character'

interface SummaryStepProps {
  ancestry: Ancestry
  community: Community
  subclass: WizardSubclass
  domainCards: DomainCard[]
  traits: Traits
  onNameChange: (name: string) => void
  onComplete: () => void
  onBack: () => void
  isEditing?: boolean
  initialName?: string
}

export function SummaryStep({
  ancestry,
  community,
  subclass,
  domainCards,
  traits,
  onNameChange,
  onComplete,
  onBack,
  isEditing = false,
  initialName = '',
}: SummaryStepProps) {
  const [name, setName] = useState(initialName)

  const handleNameChange = (value: string) => {
    setName(value)
    onNameChange(value)
  }

  const formatTrait = (value: number) => {
    if (value > 0) return `+${value}`
    return value.toString()
  }

  // Calculate stats
  const baseHP = parseInt(wizard.hp)
  const maxHP = subclass === 'School of War' ? baseHP + 1 : baseHP

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Review Your Character</h2>
        <p className="text-gray-600 text-sm mt-1">
          Give your character a name and confirm your choices.
        </p>
      </div>

      <div className="flex-1 overflow-auto pb-24 space-y-4">
        {/* Name input */}
        <div className="p-4 bg-white rounded-xl border border-ios-separator">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Character Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your character's name"
            className="w-full px-4 py-3 rounded-xl border border-ios-separator focus:outline-none focus:ring-2 focus:ring-ios-blue text-lg"
          />
        </div>

        {/* Basic info */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Basic Info</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Ancestry</span>
              <p className="font-medium">{ancestry.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Community</span>
              <p className="font-medium">{community.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Class</span>
              <p className="font-medium">Wizard</p>
            </div>
            <div>
              <span className="text-gray-500">Subclass</span>
              <p className="font-medium">{subclass}</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Stats</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <span className="text-red-600">HP</span>
              <p className="font-bold text-red-700">{maxHP}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Evasion</span>
              <p className="font-bold text-gray-700">{wizard.evasion}</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <span className="text-blue-600">Hope</span>
              <p className="font-bold text-blue-700">2</p>
            </div>
          </div>
        </Card>

        {/* Traits */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Traits</h3>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(traits) as [keyof Traits, number][]).map(
              ([trait, value]) => (
                <div
                  key={trait}
                  className={`text-center p-2 rounded-lg ${
                    value > 0
                      ? 'bg-green-50'
                      : value < 0
                      ? 'bg-red-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="text-xs text-gray-600 capitalize">{trait}</span>
                  <p
                    className={`font-bold ${
                      value > 0
                        ? 'text-green-700'
                        : value < 0
                        ? 'text-red-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {formatTrait(value)}
                  </p>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Domain Cards */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">
            Domain Cards ({domainCards.length}/{getWizardCardCount(subclass)})
          </h3>
          <div className="space-y-2">
            {domainCards.map((card) => (
              <div
                key={card.name}
                className="p-2 bg-ios-gray-light rounded-lg flex items-center justify-between"
              >
                <span className="font-medium text-sm">{card.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    card.domain === 'Codex'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {card.domain}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Feats summary */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Feats</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-ios-gray-light rounded-lg">
              <span className="font-medium">{ancestry.feats[0].name}</span>
              <span className="text-gray-500 text-xs ml-2">(Ancestry)</span>
            </div>
            <div className="p-2 bg-ios-gray-light rounded-lg">
              <span className="font-medium">{ancestry.feats[1].name}</span>
              <span className="text-gray-500 text-xs ml-2">(Ancestry)</span>
            </div>
            <div className="p-2 bg-ios-gray-light rounded-lg">
              <span className="font-medium">{community.feats[0].name}</span>
              <span className="text-gray-500 text-xs ml-2">(Community)</span>
            </div>
            {wizard.class_feats.map((feat) => (
              <div key={feat.name} className="p-2 bg-ios-gray-light rounded-lg">
                <span className="font-medium">{feat.name}</span>
                <span className="text-gray-500 text-xs ml-2">(Class)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-ios-separator flex gap-3">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button
          onClick={onComplete}
          disabled={!name.trim()}
          className="flex-1"
        >
          {isEditing ? 'Save Changes' : 'Create Character'}
        </Button>
      </div>
    </div>
  )
}
