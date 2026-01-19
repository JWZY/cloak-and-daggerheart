import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatsTab } from './StatsTab'
import { CardsTab } from './CardsTab'
import { InventoryTab } from './InventoryTab'
import { NotesTab } from './NotesTab'
import { DiceTray } from '../../components/dice/DiceTray'
import { useCharacterStore } from '../../stores/characterStore'
import type { Character } from '../../types/character'

type Tab = 'stats' | 'cards' | 'inventory' | 'notes'

interface CharacterSheetProps {
  character: Character
  onBack: () => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'cards', label: 'Cards', icon: '🃏' },
  { id: 'inventory', label: 'Gear', icon: '⚔️' },
  { id: 'notes', label: 'Notes', icon: '📝' },
]

export function CharacterSheet({ character, onBack }: CharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stats')
  const { updateHP, updateArmor, updateHope, updateStress, toggleCardUsed, updateCharacter } =
    useCharacterStore()

  const handleNotesChange = (notes: string) => {
    updateCharacter(character.id, { notes })
  }

  return (
    <div className="h-full flex flex-col bg-ios-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-ios-separator px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-ios-blue font-medium">
            ← Back
          </button>
          <div className="text-center">
            <h1 className="font-bold text-gray-900">{character.name}</h1>
            <p className="text-xs text-gray-500">
              {character.ancestry.name} {character.class}
            </p>
          </div>
          <span className="w-12" />
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-ios-separator px-2 py-2">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-ios-blue'
                  : 'text-gray-500'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-50 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
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
                onArmorChange={(value) => updateArmor(character.id, value)}
                onHopeChange={(value) => updateHope(character.id, value)}
                onStressChange={(value) => updateStress(character.id, value)}
              />
            )}
            {activeTab === 'cards' && (
              <CardsTab
                character={character}
                onToggleCardUsed={(cardName) => toggleCardUsed(character.id, cardName)}
              />
            )}
            {activeTab === 'inventory' && (
              <InventoryTab characterName={character.name} />
            )}
            {activeTab === 'notes' && (
              <NotesTab
                character={character}
                onNotesChange={handleNotesChange}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dice tray */}
      <DiceTray />
    </div>
  )
}
