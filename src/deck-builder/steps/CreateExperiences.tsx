import { useDeckStore } from '../../store/deck-store'
import { GameInput } from '../../ui/GameInput'
import { GameBadge } from '../../ui/GameBadge'
import { typeTitle, typeSubtitle, goldGradient } from '../../ui/typography'

const EXPERIENCE_LABELS = ['Experience 1', 'Experience 2'] as const

export function CreateExperiences() {
  const experiences = useDeckStore((s) => s.experiences)
  const setExperience = useDeckStore((s) => s.setExperience)

  return (
    <div className="flex flex-col items-center px-4">
      <h2 style={{
        ...typeTitle,
        fontSize: 28,
        fontWeight: 400,
        background: goldGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        margin: '0 0 8px',
      }}>
        Create Experiences
      </h2>
      <p style={{
        ...typeSubtitle,
        fontStyle: 'italic',
        color: 'var(--gold-secondary)',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        Words or phrases that describe your character's skills and history. Each adds +2 to relevant action rolls.
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
              placeholder="e.g. Arcane Scholar, Survivor of the War"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
