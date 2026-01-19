import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeView } from './views/HomeView'
import { CreateCharacter } from './views/CreateCharacter'
import { CharacterSheet } from './views/CharacterSheet'
import { useCharacterStore } from './stores/characterStore'
import type { Character } from './types/character'

type AppView = 'home' | 'create' | 'sheet'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const { setCurrentCharacter } = useCharacterStore()

  const handleCreateNew = () => {
    setCurrentView('create')
  }

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character)
    setCurrentCharacter(character.id)
    setCurrentView('sheet')
  }

  const handleCreateComplete = (characterId: string) => {
    const character = useCharacterStore.getState().characters.find(c => c.id === characterId)
    if (character) {
      setSelectedCharacter(character)
      setCurrentView('sheet')
    }
  }

  const handleBack = () => {
    setSelectedCharacter(null)
    setCurrentCharacter(null)
    setCurrentView('home')
  }

  // Refresh character data when viewing sheet
  const currentCharacter = selectedCharacter
    ? useCharacterStore.getState().characters.find(c => c.id === selectedCharacter.id) || selectedCharacter
    : null

  return (
    <div className="h-screen w-screen overflow-hidden bg-ios-gray-light font-ios">
      {/* Safe area top */}
      <div className="h-[env(safe-area-inset-top)] bg-white" />

      <div className="h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <HomeView
                onCreateNew={handleCreateNew}
                onSelectCharacter={handleSelectCharacter}
              />
            </motion.div>
          )}

          {currentView === 'create' && (
            <motion.div
              key="create"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full"
            >
              <CreateCharacter
                onComplete={handleCreateComplete}
                onCancel={handleBack}
              />
            </motion.div>
          )}

          {currentView === 'sheet' && currentCharacter && (
            <motion.div
              key="sheet"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full"
            >
              <CharacterSheet character={currentCharacter} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Safe area bottom */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  )
}

export default App
