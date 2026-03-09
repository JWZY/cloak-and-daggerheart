import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { typeTitle, typeSubtitle, typeBody, goldDarkAlpha } from '../ui/typography'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

interface CharacterSelectProps {
  onCreateNew: () => void
}

export function CharacterSelect({ onCreateNew }: CharacterSelectProps) {
  const characters = useCharacterStore((s) => s.characters)
  const setActiveCharacter = useCharacterStore((s) => s.setActiveCharacter)

  return (
    <div
      className="flex flex-col items-center"
      style={{
        height: '100dvh',
        background: 'var(--bg-page)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Header */}
      <div className="pt-12 pb-8 text-center">
        <h1
          className="gold-text gold-text-shadow"
          style={{ ...typeTitle, fontSize: 28 }}
        >
          Characters
        </h1>
      </div>

      {/* Character list */}
      <div
        className="flex flex-col w-full px-5"
        style={{ gap: 12, maxWidth: 480 }}
      >
        {characters.map((char, i) => (
          <motion.button
            key={char.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveCharacter(char.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: '100%',
              padding: '16px 20px',
              ...warmGlass,
              borderRadius: RADIUS_CARD,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <CharacterAvatar character={char} />
            <div className="flex flex-col min-w-0" style={{ gap: 2 }}>
              <span
                className="gold-text"
                style={{
                  ...typeSubtitle,
                  fontSize: 17,
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {char.name}
              </span>
              <span
                style={{
                  ...typeBody,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.3,
                }}
              >
                {char.ancestry.name} {char.subclass} {char.class}
              </span>
              <span
                style={{
                  ...typeBody,
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  opacity: 0.6,
                  lineHeight: 1.3,
                }}
              >
                Level {char.level}
              </span>
            </div>
          </motion.button>
        ))}

        {/* Create new character */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: characters.length * 0.06, duration: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            padding: '16px 20px',
            background: 'transparent',
            border: `1px dashed ${goldDarkAlpha(0.3)}`,
            borderRadius: RADIUS_CARD,
            cursor: 'pointer',
            color: 'var(--gold)',
            ...typeSubtitle,
            fontSize: 15,
          }}
        >
          <Plus size={16} />
          Create New Character
        </motion.button>
      </div>
    </div>
  )
}

/** Simple initial-based avatar circle */
function CharacterAvatar({ character }: { character: Character }) {
  const initial = character.name.charAt(0).toUpperCase()
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${goldDarkAlpha(0.2)}, ${goldDarkAlpha(0.08)})`,
        border: `1px solid ${goldDarkAlpha(0.2)}`,
      }}
    >
      <span
        className="gold-text"
        style={{ ...typeTitle, fontSize: 20, lineHeight: 1 }}
      >
        {initial}
      </span>
    </div>
  )
}
