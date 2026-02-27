import { useDeckStore } from '../../store/deck-store'
import { GameInput } from '../../ui/GameInput'
import { GameBadge } from '../../ui/GameBadge'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'

const EXPERIENCE_LABELS = ['Experience 1', 'Experience 2'] as const

export function CreateExperiences() {
  const experiences = useDeckStore((s) => s.experiences)
  const setExperience = useDeckStore((s) => s.setExperience)

  return (
    <div className="flex flex-col items-center px-6">
      <StepInstruction>
        Create two Experiences — words or phrases that describe your
        character's skills and history. Each adds +2 to relevant action rolls.
      </StepInstruction>

      <div className="w-full max-w-md mb-6">
        <SectionHeader>Create Experiences</SectionHeader>
      </div>

      <div className="w-full max-w-md flex flex-col gap-5">
        {EXPERIENCE_LABELS.map((label, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  fontVariant: 'small-caps',
                  color: '#e7ba90',
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
