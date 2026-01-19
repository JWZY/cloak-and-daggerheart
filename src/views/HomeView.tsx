import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useCharacterStore } from '../stores/characterStore'
import type { Character } from '../types/character'

interface HomeViewProps {
  onCreateNew: () => void
  onSelectCharacter: (character: Character) => void
}

export function HomeView({ onCreateNew, onSelectCharacter }: HomeViewProps) {
  const { characters, deleteCharacter } = useCharacterStore()

  const sortedCharacters = [...characters].sort(
    (a, b) => b.createdAt - a.createdAt
  )

  return (
    <div className="h-full flex flex-col bg-ios-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-ios-separator px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Daggerheart</h1>
        <p className="text-gray-500 text-sm">Character Sheet</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {sortedCharacters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 bg-ios-gray-light rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">⚔️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Characters Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first Wizard to begin your adventure.
            </p>
            <Button onClick={onCreateNew} size="lg">
              Create Character
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Characters
              </h2>
              <Button onClick={onCreateNew} size="sm">
                + New
              </Button>
            </div>

            <div className="space-y-3">
              {sortedCharacters.map((character) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    onTap={() => onSelectCharacter(character)}
                    padding="md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {character.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {character.ancestry.name} {character.class}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {character.subclass}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-red-500">
                            ❤️ {character.hp.max - character.hp.current}/{character.hp.max}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (
                              confirm(
                                `Delete ${character.name}? This cannot be undone.`
                              )
                            ) {
                              deleteCharacter(character.id)
                            }
                          }}
                          className="text-xs text-red-500 px-2 py-1"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex gap-4 mt-3 pt-3 border-t border-ios-separator">
                      <div className="text-xs">
                        <span className="text-gray-500">Hope: </span>
                        <span className="font-medium text-blue-600">
                          {character.hope}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500">Stress: </span>
                        <span className="font-medium text-purple-600">
                          {character.stress.current}/{character.stress.max}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500">Cards: </span>
                        <span className="font-medium">
                          {character.domainCards.filter((c) => !c.used).length}/
                          {character.domainCards.length}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
