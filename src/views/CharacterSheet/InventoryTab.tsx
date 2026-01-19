import { Card } from '../../components/ui/Card'
import { wizard, leatherArmor } from '../../data/srd'

interface InventoryTabProps {
  characterName: string
}

export function InventoryTab({ characterName }: InventoryTabProps) {
  // Starting equipment for a Wizard
  const equipment = {
    primary: wizard.suggested_primary,
    secondary: wizard.suggested_secondary,
    armor: wizard.suggested_armor,
    specialItem: wizard.items,
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Weapons */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Weapons</h3>
        <div className="space-y-3">
          <div className="p-3 bg-ios-gray-light rounded-xl">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{equipment.primary}</h4>
              <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                Primary
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Wizard's main weapon</p>
          </div>
          {equipment.secondary && (
            <div className="p-3 bg-ios-gray-light rounded-xl">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{equipment.secondary}</h4>
                <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                  Secondary
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Backup weapon</p>
            </div>
          )}
        </div>
      </Card>

      {/* Armor */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Armor</h3>
        <div className="p-3 bg-ios-gray-light rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{equipment.armor}</h4>
          </div>
          {leatherArmor && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Armor Score:</span>
                <span className="ml-2 font-medium">{leatherArmor.base_score}</span>
              </div>
              <div>
                <span className="text-gray-500">Thresholds:</span>
                <span className="ml-2 font-medium">{leatherArmor.base_thresholds}</span>
              </div>
            </div>
          )}
          {leatherArmor?.feat_text && (
            <p className="text-sm text-gray-600 mt-2">{leatherArmor.feat_text}</p>
          )}
        </div>
      </Card>

      {/* Special Item */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Special Item</h3>
        <div className="p-3 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-800">{equipment.specialItem}</p>
          <p className="text-xs text-amber-600 mt-2 italic">
            A personal item from {characterName}'s past
          </p>
        </div>
      </Card>

      {/* Gold & Supplies */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-yellow-50 rounded-xl text-center">
            <span className="text-xs text-yellow-600">Gold</span>
            <p className="text-xl font-bold text-yellow-700">1</p>
            <span className="text-xs text-yellow-600">handful</span>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-center">
            <span className="text-xs text-green-600">Supplies</span>
            <p className="text-xl font-bold text-green-700">-</p>
            <span className="text-xs text-green-600">basic</span>
          </div>
        </div>
      </Card>

      {/* Standard Adventuring Gear */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Standard Gear</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Backpack</p>
          <p>• Bedroll</p>
          <p>• Rope (50 ft)</p>
          <p>• Rations (3 days)</p>
          <p>• Waterskin</p>
          <p>• Tinderbox</p>
          <p>• Torch (2)</p>
        </div>
      </Card>
    </div>
  )
}
