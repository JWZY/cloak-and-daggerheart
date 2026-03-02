import { useDeckStore } from '../../store/deck-store'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { typeBody } from '../../ui/typography'
import { getClassByName } from '../../data/srd'

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  background: 'var(--surface-light)',
  border: '1px solid var(--gold-muted)',
  borderRadius: 8,
  color: '#D4CFC7',
  ...typeBody,
  resize: 'vertical',
  minHeight: 80,
  outline: 'none',
  caretColor: 'var(--gold)',
}

export function CreateBackground() {
  const backgroundAnswers = useDeckStore((s) => s.backgroundAnswers)
  const setBackgroundAnswer = useDeckStore((s) => s.setBackgroundAnswer)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const classData = selectedClass ? getClassByName(selectedClass) : null

  return (
    <div className="flex flex-col items-center px-6">
      <StepInstruction>
        Answer one or more of these prompts to flesh out your character's past.
        You can leave these open-ended for now.
      </StepInstruction>

      <div className="w-full max-w-md mb-6">
        <SectionHeader>Create Your Background</SectionHeader>
      </div>

      <div className="w-full max-w-md flex flex-col gap-5">
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
            <textarea
              value={backgroundAnswers[index] ?? ''}
              onChange={(e) => setBackgroundAnswer(index, e.target.value)}
              placeholder="Write your answer..."
              style={textareaStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)'
                e.currentTarget.style.boxShadow =
                  '0 0 0 2px var(--gold-muted)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  'var(--gold-muted)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
