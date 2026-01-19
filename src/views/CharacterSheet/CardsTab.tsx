import { DomainCard } from '../../components/character/DomainCard'
import { Card } from '../../components/ui/Card'
import type { Character } from '../../types/character'
import { wizard } from '../../data/srd'

interface CardsTabProps {
  character: Character
  onToggleCardUsed: (cardName: string) => void
}

export function CardsTab({ character, onToggleCardUsed }: CardsTabProps) {
  const usedCount = character.domainCards.filter((c) => c.used).length
  const totalCount = character.domainCards.length

  return (
    <div className="space-y-4 pb-24">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Domain Cards</h3>
        <span className="text-sm text-gray-500">
          {totalCount - usedCount} / {totalCount} available
        </span>
      </div>

      {/* Domain cards */}
      <div className="space-y-3">
        {character.domainCards.map((card) => (
          <DomainCard
            key={card.name}
            card={card}
            onToggleUsed={() => onToggleCardUsed(card.name)}
          />
        ))}
      </div>

      {/* Class feats */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Class Features</h3>
        <div className="space-y-3">
          {wizard.class_feats.map((feat) => (
            <div key={feat.name} className="p-3 bg-ios-gray-light rounded-xl">
              <h4 className="font-medium text-gray-900">{feat.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{feat.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Hope feature */}
      <Card padding="md">
        <div className="p-3 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900">{wizard.hope_feat_name}</h4>
          <p className="text-sm text-blue-700 mt-1">{wizard.hope_feat_text}</p>
        </div>
      </Card>

      {/* Ancestry feats */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">
          Ancestry: {character.ancestry.name}
        </h3>
        <div className="space-y-3">
          {character.ancestry.feats.map((feat) => (
            <div key={feat.name} className="p-3 bg-ios-gray-light rounded-xl">
              <h4 className="font-medium text-gray-900">{feat.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{feat.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Community feat */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">
          Community: {character.community.name}
        </h3>
        <div className="space-y-3">
          {character.community.feats.map((feat) => (
            <div key={feat.name} className="p-3 bg-ios-gray-light rounded-xl">
              <h4 className="font-medium text-gray-900">{feat.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{feat.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
