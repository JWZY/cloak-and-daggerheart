import { useDeckStore } from '../../store/deck-store'
import { GameInput } from '../../ui/GameInput'
import { GameBadge } from '../../ui/GameBadge'
import { EmberOverlay } from '../../ui/EmberOverlay'
import { typeSubtitle, typeBody } from '../../ui/typography'
import { getClassAccentColor } from '../../cards/domain-colors'

const EXPERIENCE_LABELS = ['Experience 1', 'Experience 2'] as const

const EXPERIENCE_PLACEHOLDERS = [
  'e.g. Exiled Prince of a Kingdom, Arcane Scholar',
  'e.g. Honourable Bounty Hunter, Drunk Sailor',
]

export function CreateExperiences() {
  const experiences = useDeckStore((s) => s.experiences)
  const setExperience = useDeckStore((s) => s.setExperience)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const accentColor = getClassAccentColor(selectedClass)

  return (
    <>
      <EmberOverlay color={accentColor} rate={6} />
      <div className="flex flex-col items-center px-4" style={{ paddingTop: '20%' }}>
      <p className="max-w-[360px]" style={{
        ...typeBody,
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        When relevant to an action roll, you can spend a Hope to add the Experience's modifier to the roll's result.
      </p>

      <div className="w-full max-w-[360px] flex flex-col gap-5">
        {EXPERIENCE_LABELS.map((label, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span
                style={{
                  ...typeSubtitle,
                  color: 'var(--gold)',
                }}
              >
                {label}
              </span>
              <GameBadge>+2</GameBadge>
            </div>
            <GameInput
              type="text"
              value={experiences[index]?.text ?? ''}
              onChange={(e) => setExperience(index, e.target.value)}
              placeholder={EXPERIENCE_PLACEHOLDERS[index % EXPERIENCE_PLACEHOLDERS.length]}
            />
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
