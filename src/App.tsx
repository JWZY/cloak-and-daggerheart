import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CreateCharacter } from './views/CreateCharacter'
import { CharacterSheet } from './views/CharacterSheet'
import { ComponentsLibrary } from './views/ComponentsLibrary'
import { CardDesignLab } from './views/CardDesignLab'
import { PickerDesignLab } from './views/PickerDesignLab'
import { useCharacterStore } from './stores/characterStore'
import { ThemeProvider } from './contexts/ThemeContext'
import { THEME_CONFIGS } from './contexts/themeConfig'
import { useMouseGlow } from './hooks/useMouseGlow'
import { KnowledgeWisps } from './components/effects/KnowledgeWisps'
import type { WizardSubclass } from './types/character'
import type { Step } from './components/ui/Breadcrumbs'

// Map character sheet tabs to create/edit steps
type Tab = 'stats' | 'cards' | 'inventory' | 'notes'
const TAB_TO_STEP_MAP: Record<Tab, Step> = {
  stats: 'ancestry',
  cards: 'cards',
  inventory: 'equipment',
  notes: 'summary',
}

function App() {
  // Check for query params to show dev tools
  const searchParams = new URLSearchParams(window.location.search)
  const showComponentsLibrary = searchParams.has('components')
  const showCardDesignLab = searchParams.has('cards') || searchParams.has('designlab')
  const showPickerDesignLab = searchParams.has('pickers')
  // Enable cursor-following glow effect on glass elements
  useMouseGlow()

  const [isEditing, setIsEditing] = useState(false)
  const [editEntryStep, setEditEntryStep] = useState<Step | null>(null)
  const { characters, setCurrentCharacter, currentCharacterId, startDraftFromCharacter, getCurrentCharacter } = useCharacterStore()

  // Get the current character from the store (getCurrentCharacter applies migration)
  const currentCharacter = getCurrentCharacter()

  // Auto-select first character if none selected
  useEffect(() => {
    if (characters.length > 0 && !currentCharacterId) {
      setCurrentCharacter(characters[0].id)
    }
  }, [characters, currentCharacterId, setCurrentCharacter])

  // Show create flow if no characters exist OR if editing
  const showCreateFlow = characters.length === 0 || isEditing

  const handleCreateComplete = (characterId: string) => {
    setCurrentCharacter(characterId)
    setIsEditing(false)
  }

  const handleEdit = (context?: { activeTab?: Tab }) => {
    if (currentCharacter) {
      startDraftFromCharacter(currentCharacter)
      // Map the active tab to the appropriate entry step
      const entryStep = context?.activeTab
        ? TAB_TO_STEP_MAP[context.activeTab]
        : 'ancestry'
      setEditEntryStep(entryStep)
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditEntryStep(null)
  }

  // Get the background class based on current character's subclass
  const getBackgroundClass = () => {
    if (currentCharacter && !showCreateFlow) {
      return THEME_CONFIGS[currentCharacter.subclass as WizardSubclass].backgroundClass
    }
    return THEME_CONFIGS.default.backgroundClass
  }

  // Show components library if ?components is in URL
  if (showComponentsLibrary) {
    return <ComponentsLibrary />
  }

  // Show card design lab if ?cards or ?designlab is in URL
  if (showCardDesignLab) {
    return <CardDesignLab onBack={() => window.location.href = window.location.pathname} />
  }

  // Show picker design lab if ?pickers is in URL
  if (showPickerDesignLab) {
    return <PickerDesignLab onBack={() => window.location.href = window.location.pathname} />
  }

  return (
    <ThemeProvider subclass={showCreateFlow ? null : (currentCharacter?.subclass as WizardSubclass | null)}>
      <div className={`h-screen w-screen overflow-hidden font-ios ${getBackgroundClass()}`}>
        {/* Background effect layer for School of Knowledge */}
        {!showCreateFlow && currentCharacter?.subclass === 'School of Knowledge' && (
          <KnowledgeWisps />
        )}

        {/* Safe area top - transparent to show gradient */}
        <div className="h-[env(safe-area-inset-top)]" />

        <div className="h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom))]">
          <AnimatePresence mode="popLayout">
            {showCreateFlow ? (
              <motion.div
                key={isEditing ? 'edit' : 'create'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <CreateCharacter
                  onComplete={handleCreateComplete}
                  onCancel={isEditing ? handleCancelEdit : () => {}}
                  isEditing={isEditing}
                  entryStep={editEntryStep}
                />
              </motion.div>
            ) : currentCharacter ? (
              <motion.div
                key={`sheet-${currentCharacter.id}`}
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="h-full"
              >
                <CharacterSheet character={currentCharacter} onEdit={handleEdit} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Safe area bottom - transparent to show gradient */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </ThemeProvider>
  )
}

export default App
