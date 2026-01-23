import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Layers, Sword, FileText, Pencil } from 'lucide-react'
import { StatsTab } from './StatsTab'
import { CardsTab } from './CardsTab'
import { InventoryTab } from './InventoryTab'
import { NotesTab } from './NotesTab'
import { useCharacterStore } from '../../stores/characterStore'
import type { Character } from '../../types/character'
import type { LucideIcon } from 'lucide-react'

type Tab = 'stats' | 'cards' | 'inventory' | 'notes'

interface CharacterSheetProps {
  character: Character
  onEdit: () => void
}

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'cards', label: 'Cards', icon: Layers },
  { id: 'inventory', label: 'Gear', icon: Sword },
  { id: 'notes', label: 'Notes', icon: FileText },
]

export function CharacterSheet({ character, onEdit }: CharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stats')
  const {
    updateHP,
    updateArmorSlots,
    updateHope,
    updateStress,
    updateCharacter,
    setPrimaryWeapon,
    setSecondaryWeapon,
    setArmor,
    addItem,
    removeItem,
    addConsumable,
    removeConsumable,
    updateGold,
  } = useCharacterStore()

  const handleNotesChange = (notes: string) => {
    updateCharacter(character.id, { notes })
  }

  const handleBackgroundAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...(character.backgroundAnswers || [])]
    newAnswers[index] = answer
    updateCharacter(character.id, { backgroundAnswers: newAnswers })
  }

  const handleConnectionAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...(character.connectionAnswers || [])]
    newAnswers[index] = answer
    updateCharacter(character.id, { connectionAnswers: newAnswers })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass-strong px-4 py-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{character.name}</h1>
          <p className="text-sm text-white/60">
            {character.ancestry.name} {character.class} · {character.subclass}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="glass px-2 py-2">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/20 rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <Icon size={16} />
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'stats' && (
              <StatsTab
                character={character}
                onHPChange={(value) => updateHP(character.id, value)}
                onArmorChange={(value) => updateArmorSlots(character.id, value)}
                onHopeChange={(value) => updateHope(character.id, value)}
                onStressChange={(value) => updateStress(character.id, value)}
              />
            )}
            {activeTab === 'cards' && (
              <CardsTab character={character} />
            )}
            {activeTab === 'inventory' && (
              <InventoryTab
                character={character}
                onSetPrimaryWeapon={(weapon) => setPrimaryWeapon(character.id, weapon)}
                onSetSecondaryWeapon={(weapon) => setSecondaryWeapon(character.id, weapon)}
                onSetArmor={(armor) => setArmor(character.id, armor)}
                onAddItem={(item) => addItem(character.id, item)}
                onRemoveItem={(itemName) => removeItem(character.id, itemName)}
                onAddConsumable={(consumable) => addConsumable(character.id, consumable)}
                onRemoveConsumable={(consumableName) => removeConsumable(character.id, consumableName)}
                onUpdateGold={(gold) => updateGold(character.id, gold)}
              />
            )}
            {activeTab === 'notes' && (
              <NotesTab
                character={character}
                onNotesChange={handleNotesChange}
                onBackgroundAnswerChange={handleBackgroundAnswerChange}
                onConnectionAnswerChange={handleConnectionAnswerChange}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-6 right-4 left-4 flex justify-end gap-3 z-30">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="w-14 h-14 rounded-full glass bg-white/20 text-white shadow-lg flex items-center justify-center"
        >
          <Pencil size={22} />
        </motion.button>
      </div>
    </div>
  )
}
