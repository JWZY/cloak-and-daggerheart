import { useState, useEffect } from 'react'
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
  initialName?: string
}

export function SummaryStep({
  ancestry,
  community,
  subclass,
  domainCards,
  traits,
  onNameChange,
  initialName = '',
}: SummaryStepProps) {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName])

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
      <div className="mb-6">
        <h2 className="text-xl font-bold text-glass-primary">Review Your Character</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Give your character a name and confirm your choices.
        </p>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        {/* Name input with glass styling */}
        <div className="glass-strong rounded-2xl p-4">
          <label className="block text-sm font-medium text-glass-secondary mb-2">
            Character Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your character's name"
            className="glass-input-flat text-lg"
          />
        </div>

        {/* Basic info - glass-strong for prominence */}
        <Card variant="glass-strong" padding="md">
          <h3 className="font-semibold text-glass-primary mb-3">Basic Info</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-glass-muted">Ancestry</span>
              <p className="font-medium text-glass-primary">{ancestry.name}</p>
            </div>
            <div>
              <span className="text-glass-muted">Community</span>
              <p className="font-medium text-glass-primary">{community.name}</p>
            </div>
            <div>
              <span className="text-glass-muted">Class</span>
              <p className="font-medium text-glass-primary">Wizard</p>
            </div>
            <div>
              <span className="text-glass-muted">Subclass</span>
              <p className="font-medium text-glass-primary">{subclass}</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card variant="glass" padding="md">
          <h3 className="font-semibold text-glass-primary mb-3">Stats</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 glass-flat-sm bg-red-500/20">
              <span className="text-red-300 text-xs">HP</span>
              <p className="font-bold text-red-300">{maxHP}</p>
            </div>
            <div className="text-center p-2 glass-flat-sm bg-slate-500/20">
              <span className="text-slate-300 text-xs">Evasion</span>
              <p className="font-bold text-slate-300">{wizard.evasion}</p>
            </div>
            <div className="text-center p-2 glass-flat-sm bg-blue-500/20">
              <span className="text-blue-300 text-xs">Hope</span>
              <p className="font-bold text-blue-300">2</p>
            </div>
          </div>
        </Card>

        {/* Traits */}
        <Card variant="glass" padding="md">
          <h3 className="font-semibold text-glass-primary mb-3">Traits</h3>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(traits) as [keyof Traits, number][]).map(
              ([trait, value]) => (
                <div
                  key={trait}
                  className={`text-center p-2 glass-flat-sm ${
                    value > 0
                      ? 'bg-emerald-500/20'
                      : value < 0
                      ? 'bg-red-500/20'
                      : 'bg-white/5'
                  }`}
                >
                  <span className="text-xs text-glass-muted capitalize">{trait}</span>
                  <p
                    className={`font-bold ${
                      value > 0
                        ? 'text-emerald-300'
                        : value < 0
                        ? 'text-red-300'
                        : 'text-white'
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
        <Card variant="glass" padding="md">
          <h3 className="font-semibold text-glass-primary mb-3">
            Domain Cards ({domainCards.length}/{getWizardCardCount(subclass)})
          </h3>
          <div className="space-y-2">
            {domainCards.map((card) => (
              <div
                key={card.name}
                className="p-2 glass-flat-sm flex items-center justify-between"
              >
                <span className="font-medium text-sm text-glass-primary">{card.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    card.domain === 'Codex'
                      ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/30'
                      : 'bg-amber-500/30 text-amber-200 border-amber-400/30'
                  }`}
                >
                  {card.domain}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Feats summary */}
        <Card variant="glass" padding="md">
          <h3 className="font-semibold text-glass-primary mb-3">Feats</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 glass-flat-sm">
              <span className="font-medium text-glass-primary">{ancestry.feats[0].name}</span>
              <span className="text-glass-muted text-xs ml-2">(Ancestry)</span>
            </div>
            <div className="p-2 glass-flat-sm">
              <span className="font-medium text-glass-primary">{ancestry.feats[1].name}</span>
              <span className="text-glass-muted text-xs ml-2">(Ancestry)</span>
            </div>
            <div className="p-2 glass-flat-sm">
              <span className="font-medium text-glass-primary">{community.feats[0].name}</span>
              <span className="text-glass-muted text-xs ml-2">(Community)</span>
            </div>
            {wizard.class_feats.map((feat) => (
              <div key={feat.name} className="p-2 glass-flat-sm">
                <span className="font-medium text-glass-primary">{feat.name}</span>
                <span className="text-glass-muted text-xs ml-2">(Class)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
