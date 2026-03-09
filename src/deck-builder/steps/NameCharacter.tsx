import { useDeckStore } from '../../store/deck-store'
import { GameInput } from '../../ui/GameInput'
import { EmberOverlay } from '../../ui/EmberOverlay'
import { typeTitle } from '../../ui/typography'
import { getClassAccentColor } from '../../cards/domain-colors'

export function NameCharacter() {
  const characterName = useDeckStore((s) => s.characterName)
  const setCharacterName = useDeckStore((s) => s.setCharacterName)
  const subclass = useDeckStore((s) => s.subclass)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const accentColor = getClassAccentColor(selectedClass)

  return (
    <>
      <EmberOverlay color={accentColor} rate={6} />
      <div className="flex flex-col items-center justify-center px-4" style={{ minHeight: '100%' }}>
      <div className="w-full max-w-[360px]">
        <GameInput
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Enter name..."
          autoFocus
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontFamily: typeTitle.fontFamily,
            fontWeight: typeTitle.fontWeight,
            padding: '14px 16px',
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
          }}
        />
      </div>

      {/* Fixed-position title preview — always occupies space to prevent layout shift */}
      <div className="mt-6" style={{ minHeight: 36 }}>
        {characterName.trim() && (
          <p
            className="gold-text gold-text-shadow-subtle"
            style={{
              ...typeTitle,
              fontSize: 24,
              letterSpacing: '0.02em',
              textAlign: 'center',
            }}
          >
            {characterName.trim()}, {subclass} {selectedClass}
          </p>
        )}
      </div>
    </div>
    </>
  )
}
