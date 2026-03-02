import { useDeckStore } from '../../store/deck-store'
import { GameInput } from '../../ui/GameInput'
import { SectionHeader } from '../../ui/SectionHeader'
import { typeSubtitle, typeTitle } from '../../ui/typography'

const BASE_PATH = import.meta.env.BASE_URL ?? '/'

export function NameCharacter() {
  const characterName = useDeckStore((s) => s.characterName)
  const setCharacterName = useDeckStore((s) => s.setCharacterName)
  const subclass = useDeckStore((s) => s.subclass)
  const selectedClass = useDeckStore((s) => s.selectedClass)

  return (
    <div className="flex flex-col items-center justify-center px-6 min-h-[400px] relative">
      {/* Atmosphere texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${BASE_PATH}images/cards/atmosphere.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.04,
          pointerEvents: 'none',
          transform: 'scaleY(-1)',
        }}
      />

      {/* Subtle background label */}
      <p
        style={{
          ...typeSubtitle,
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {subclass ?? selectedClass ?? ''}
      </p>

      <h2 className="w-full max-w-[360px] mb-8">
        <SectionHeader>Name Your Character</SectionHeader>
      </h2>

      <div className="w-full max-w-[360px] relative z-10">
        <GameInput
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Enter name..."
          autoFocus
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontFamily: typeTitle.fontFamily,
            fontWeight: typeTitle.fontWeight,
            padding: '14px 16px',
          }}
        />
      </div>

      {characterName.trim() && (
        <div className="gold-text-shadow-subtle mt-6 relative z-10">
          <p
            className="gold-text"
            style={{
              ...typeTitle,
              fontSize: 24,
              letterSpacing: '0.02em',
              textAlign: 'center',
            }}
          >
            {characterName.trim()}, {subclass} {selectedClass}
          </p>
        </div>
      )}
    </div>
  )
}
