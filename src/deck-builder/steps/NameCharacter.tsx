import { useDeckStore } from '../../store/deck-store'
import { GameInput } from '../../ui/GameInput'
import { SectionHeader } from '../../ui/SectionHeader'

const BASE_PATH = import.meta.env.BASE_URL ?? '/'

export function NameCharacter() {
  const characterName = useDeckStore((s) => s.characterName)
  const setCharacterName = useDeckStore((s) => s.setCharacterName)
  const subclass = useDeckStore((s) => s.subclass)

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
          fontFamily: "'EB Garamond', serif",
          fontSize: 12,
          color: 'rgba(212, 207, 199, 0.3)',
          textAlign: 'center',
          marginBottom: 8,
          fontVariant: 'small-caps',
          letterSpacing: '0.06em',
        }}
      >
        {subclass ?? 'Wizard'}
      </p>

      <h2 className="w-full max-w-xs mb-8">
        <SectionHeader>Name Your Character</SectionHeader>
      </h2>

      <div className="w-full max-w-xs relative z-10">
        <GameInput
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Enter name..."
          autoFocus
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontFamily: "'EB Garamond', serif",
            fontWeight: 500,
            padding: '14px 16px',
          }}
        />
      </div>

      {characterName.trim() && (
        <div className="gold-text-shadow-subtle mt-6 relative z-10">
          <p
            className="gold-text"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 20,
              fontWeight: 500,
              fontVariant: 'small-caps',
              letterSpacing: '0.02em',
              textAlign: 'center',
            }}
          >
            {characterName.trim()}, {subclass} Wizard
          </p>
        </div>
      )}
    </div>
  )
}
