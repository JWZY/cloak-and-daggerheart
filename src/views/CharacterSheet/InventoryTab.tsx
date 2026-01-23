import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, ChevronRight, Swords, Shield, Package, FlaskConical, Coins } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Sheet } from '../../components/ui/Sheet'
import type { Character, Weapon, Armor, Item, Consumable } from '../../types/character'
import {
  tier1PrimaryWeapons,
  tier1SecondaryWeapons,
  tier1Armors,
  items as srdItems,
  consumables as srdConsumables,
} from '../../data/srd'

interface InventoryTabProps {
  character: Character
  onSetPrimaryWeapon: (weapon: Weapon | null) => void
  onSetSecondaryWeapon: (weapon: Weapon | null) => void
  onSetArmor: (armor: Armor | null) => void
  onAddItem: (item: Item) => void
  onRemoveItem: (itemName: string) => void
  onAddConsumable: (consumable: Consumable) => void
  onRemoveConsumable: (consumableName: string) => void
  onUpdateGold: (gold: number) => void
}

type SheetType = 'primary' | 'secondary' | 'armor' | 'items' | 'consumables' | null

export function InventoryTab({
  character,
  onSetPrimaryWeapon,
  onSetSecondaryWeapon,
  onSetArmor,
  onAddItem,
  onRemoveItem,
  onAddConsumable,
  onRemoveConsumable,
  onUpdateGold,
}: InventoryTabProps) {
  const [openSheet, setOpenSheet] = useState<SheetType>(null)

  // Fallback for equipment if not migrated
  const equipment = character.equipment ?? {
    primaryWeapon: null,
    secondaryWeapon: null,
    armor: null,
    items: [],
    consumables: [],
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Active Weapons Section */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Swords size={16} className="text-white/40" />
            <span className="text-xs uppercase tracking-wide text-white/40">Active Weapons</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Proficiency</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <div
                  key={level}
                  className={`w-2.5 h-2.5 rounded-full border border-white/30 ${
                    level <= character.proficiency ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Primary Weapon */}
        <button
          onClick={() => setOpenSheet('primary')}
          className="w-full text-left mb-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wide text-white/50">Primary</span>
            <ChevronRight size={14} className="text-white/30" />
          </div>
          {equipment.primaryWeapon ? (
            <div>
              <h4 className="font-semibold text-white">{equipment.primaryWeapon.name}</h4>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-white/40">Trait & Range</span>
                  <p className="text-white/80">{equipment.primaryWeapon.trait} · {equipment.primaryWeapon.range}</p>
                </div>
                <div>
                  <span className="text-white/40">Damage</span>
                  <p className="text-white/80">{equipment.primaryWeapon.damage} {equipment.primaryWeapon.physical_or_magical}</p>
                </div>
              </div>
              {equipment.primaryWeapon.feat_text && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs text-white/40">Feature</span>
                  <p className="text-xs text-amber-400/80 mt-0.5">{equipment.primaryWeapon.feat_text}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-white/40 italic text-sm">Tap to select weapon</p>
          )}
        </button>

        {/* Secondary Weapon */}
        <button
          onClick={() => setOpenSheet('secondary')}
          className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wide text-white/50">Secondary</span>
            <ChevronRight size={14} className="text-white/30" />
          </div>
          {equipment.secondaryWeapon ? (
            <div>
              <h4 className="font-semibold text-white">{equipment.secondaryWeapon.name}</h4>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-white/40">Trait & Range</span>
                  <p className="text-white/80">{equipment.secondaryWeapon.trait} · {equipment.secondaryWeapon.range}</p>
                </div>
                <div>
                  <span className="text-white/40">Damage</span>
                  <p className="text-white/80">{equipment.secondaryWeapon.damage} {equipment.secondaryWeapon.physical_or_magical}</p>
                </div>
              </div>
              {equipment.secondaryWeapon.feat_text && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs text-white/40">Feature</span>
                  <p className="text-xs text-amber-400/80 mt-0.5">{equipment.secondaryWeapon.feat_text}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-white/40 italic text-sm">Tap to select weapon</p>
          )}
        </button>
      </Card>

      {/* Active Armor */}
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-white/40" />
          <span className="text-xs uppercase tracking-wide text-white/40">Active Armor</span>
        </div>
        <button
          onClick={() => setOpenSheet('armor')}
          className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/50">Equipped</span>
            <ChevronRight size={14} className="text-white/30" />
          </div>
          {equipment.armor ? (
            <div>
              <h4 className="font-semibold text-white">{equipment.armor.name}</h4>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-white/40">Armor Score</span>
                  <p className="text-white/80">{equipment.armor.base_score}</p>
                </div>
                <div>
                  <span className="text-white/40">Thresholds</span>
                  <p className="text-white/80">{equipment.armor.base_thresholds}</p>
                </div>
              </div>
              {equipment.armor.feat_text && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs text-white/40">Feature</span>
                  <p className="text-xs text-amber-400/80 mt-0.5">{equipment.armor.feat_text}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-white/40 italic text-sm">Tap to select armor</p>
          )}
        </button>
      </Card>

      {/* Gold */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-amber-400/60" />
            <span className="text-xs uppercase tracking-wide text-white/40">Gold</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateGold(Math.max(0, character.gold - 1))}
              disabled={character.gold <= 0}
              className="lg-button w-8 h-8 disabled:opacity-30"
            >
              <Minus size={14} strokeWidth={2.5} />
            </motion.button>
            <span className="text-xl font-semibold text-white w-8 text-center">{character.gold}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateGold(character.gold + 1)}
              className="lg-button w-8 h-8"
            >
              <Plus size={14} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-white/40" />
            <span className="text-xs uppercase tracking-wide text-white/40">Items</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpenSheet('items')}
            className="lg-button px-3 py-1 text-xs"
          >
            <Plus size={12} className="mr-1" />
            Add
          </motion.button>
        </div>
        {equipment.items.length > 0 ? (
          <div className="space-y-2">
            {equipment.items.map((item, idx) => (
              <div key={`${item.name}-${idx}`} className="flex items-start justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                <div>
                  <h4 className="font-medium text-white text-sm">{item.name}</h4>
                  <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveItem(item.name)}
                  className="text-red-400/60 hover:text-red-400 p-1"
                >
                  <Minus size={14} />
                </motion.button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm italic">No items</p>
        )}
      </Card>

      {/* Consumables */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={16} className="text-white/40" />
            <span className="text-xs uppercase tracking-wide text-white/40">Consumables</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpenSheet('consumables')}
            className="lg-button px-3 py-1 text-xs"
          >
            <Plus size={12} className="mr-1" />
            Add
          </motion.button>
        </div>
        {equipment.consumables.length > 0 ? (
          <div className="space-y-2">
            {equipment.consumables.map((cons, idx) => (
              <div key={`${cons.name}-${idx}`} className="flex items-start justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white text-sm">{cons.name}</h4>
                    {(cons.quantity ?? 1) > 1 && (
                      <span className="text-xs text-white/40">×{cons.quantity}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">{cons.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveConsumable(cons.name)}
                    className="text-red-400/60 hover:text-red-400 p-1"
                  >
                    <Minus size={14} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onAddConsumable(cons)}
                    className="text-green-400/60 hover:text-green-400 p-1"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm italic">No consumables</p>
        )}
      </Card>

      {/* Selection Sheets */}
      <Sheet
        open={openSheet === 'primary'}
        onOpenChange={(open) => !open && setOpenSheet(null)}
        title="Select Primary Weapon"
      >
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          <button
            onClick={() => {
              onSetPrimaryWeapon(null)
              setOpenSheet(null)
            }}
            className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-white/40 italic">None</span>
          </button>
          {tier1PrimaryWeapons.map((weapon) => (
            <button
              key={weapon.name}
              onClick={() => {
                onSetPrimaryWeapon(weapon)
                setOpenSheet(null)
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                equipment.primaryWeapon?.name === weapon.name
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <h4 className="font-medium text-white">{weapon.name}</h4>
              <div className="flex gap-3 mt-1 text-xs text-white/50">
                <span>{weapon.damage}</span>
                <span>{weapon.range}</span>
                <span>{weapon.trait}</span>
              </div>
              {weapon.feat_text && (
                <p className="text-xs text-amber-400/80 mt-2">{weapon.feat_text}</p>
              )}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={openSheet === 'secondary'}
        onOpenChange={(open) => !open && setOpenSheet(null)}
        title="Select Secondary Weapon"
      >
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          <button
            onClick={() => {
              onSetSecondaryWeapon(null)
              setOpenSheet(null)
            }}
            className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-white/40 italic">None</span>
          </button>
          {tier1SecondaryWeapons.map((weapon) => (
            <button
              key={weapon.name}
              onClick={() => {
                onSetSecondaryWeapon(weapon)
                setOpenSheet(null)
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                equipment.secondaryWeapon?.name === weapon.name
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <h4 className="font-medium text-white">{weapon.name}</h4>
              <div className="flex gap-3 mt-1 text-xs text-white/50">
                <span>{weapon.damage}</span>
                <span>{weapon.range}</span>
                <span>{weapon.trait}</span>
              </div>
              {weapon.feat_text && (
                <p className="text-xs text-amber-400/80 mt-2">{weapon.feat_text}</p>
              )}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={openSheet === 'armor'}
        onOpenChange={(open) => !open && setOpenSheet(null)}
        title="Select Armor"
      >
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          <button
            onClick={() => {
              onSetArmor(null)
              setOpenSheet(null)
            }}
            className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-white/40 italic">None (Unarmored)</span>
          </button>
          {tier1Armors.map((armor) => (
            <button
              key={armor.name}
              onClick={() => {
                onSetArmor(armor)
                setOpenSheet(null)
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                equipment.armor?.name === armor.name
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <h4 className="font-medium text-white">{armor.name}</h4>
              <div className="flex gap-3 mt-1 text-xs text-white/50">
                <span>Score: {armor.base_score}</span>
                <span>Thresholds: {armor.base_thresholds}</span>
              </div>
              {armor.feat_text && (
                <p className="text-xs text-amber-400/80 mt-2">{armor.feat_text}</p>
              )}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={openSheet === 'items'}
        onOpenChange={(open) => !open && setOpenSheet(null)}
        title="Add Item"
      >
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {srdItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                onAddItem(item)
                setOpenSheet(null)
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <h4 className="font-medium text-white">{item.name}</h4>
              <p className="text-xs text-white/50 mt-1">{item.description}</p>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={openSheet === 'consumables'}
        onOpenChange={(open) => !open && setOpenSheet(null)}
        title="Add Consumable"
      >
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {srdConsumables.map((cons) => (
            <button
              key={cons.name}
              onClick={() => {
                onAddConsumable(cons)
                setOpenSheet(null)
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <h4 className="font-medium text-white">{cons.name}</h4>
              <p className="text-xs text-white/50 mt-1">{cons.description}</p>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}
