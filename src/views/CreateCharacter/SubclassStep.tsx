import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { schoolOfKnowledge, schoolOfWar, wizard } from '../../data/srd'
import type { WizardSubclass } from '../../types/character'

interface SubclassStepProps {
  selected: WizardSubclass | undefined
  onSelect: (subclass: WizardSubclass) => void
  onNext: () => void
  onBack: () => void
}

export function SubclassStep({ selected, onSelect, onNext, onBack }: SubclassStepProps) {
  const subclasses = [
    {
      data: schoolOfKnowledge,
      highlight: 'Extra domain card, doubled Experience bonus',
    },
    {
      data: schoolOfWar,
      highlight: 'Extra HP slot, bonus magic damage on Fear rolls',
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Choose Your School</h2>
        <p className="text-gray-600 text-sm mt-1">
          As a Wizard, you follow one of two magical schools.
        </p>
      </div>

      {/* Class info */}
      <div className="mb-4 p-3 bg-indigo-50 rounded-xl">
        <h3 className="font-semibold text-indigo-900">Wizard</h3>
        <p className="text-sm text-indigo-700 mt-1">
          Domains: Codex + Splendor • HP: {wizard.hp} • Evasion: {wizard.evasion}
        </p>
      </div>

      <div className="flex-1 overflow-auto pb-20 space-y-4">
        {subclasses.map(({ data, highlight }) => (
          <Card
            key={data.name}
            selected={selected === data.name}
            onTap={() => onSelect(data.name as WizardSubclass)}
            padding="md"
          >
            <h3 className="font-semibold text-gray-900 mb-1">{data.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{data.description}</p>

            <div className="mb-3 px-3 py-2 bg-amber-50 rounded-lg">
              <span className="text-sm text-amber-800">{highlight}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Foundations</h4>
              {data.foundations.map((foundation) => (
                <div
                  key={foundation.name}
                  className="p-2 bg-ios-gray-light rounded-lg"
                >
                  <h5 className="text-sm font-medium text-gray-900">
                    {foundation.name}
                  </h5>
                  <p className="text-xs text-gray-600 mt-0.5">{foundation.text}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-ios-separator flex gap-3">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} disabled={!selected} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )
}
