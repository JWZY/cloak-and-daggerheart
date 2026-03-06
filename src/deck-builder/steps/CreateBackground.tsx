import { useDeckStore } from '../../store/deck-store'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { GameTextarea } from '../../ui/GameTextarea'
import { typeBody } from '../../ui/typography'
import { getClassByName } from '../../data/srd'

export function CreateBackground() {
  const backgroundAnswers = useDeckStore((s) => s.backgroundAnswers)
  const setBackgroundAnswer = useDeckStore((s) => s.setBackgroundAnswer)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const classData = selectedClass ? getClassByName(selectedClass) : null

  return (
    <div className="flex flex-col items-center px-4">
      <StepInstruction>
        Answer one or more of these prompts to flesh out your character's past.
        You can leave these open-ended for now.
      </StepInstruction>

      <h2 className="w-full max-w-[360px] mb-2 px-4">
        <SectionHeader>Create Your Background</SectionHeader>
      </h2>

      <div className="w-full max-w-[360px] flex flex-col gap-5">
        {(classData?.backgrounds ?? []).map((bg, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p
              style={{
                ...typeBody,
                fontStyle: 'italic',
                color: 'var(--text-primary)',
              }}
            >
              {bg.question}
            </p>
            <GameTextarea
              value={backgroundAnswers[index] ?? ''}
              onChange={(e) => setBackgroundAnswer(index, e.target.value)}
              placeholder="Write your answer..."
              style={{ minHeight: 80 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
