import { useDeckStore } from '../../store/deck-store'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { getClassByName } from '../../data/srd'

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(231, 186, 144, 0.15)',
  borderRadius: 8,
  color: '#D4CFC7',
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 13.5,
  lineHeight: 1.4,
  resize: 'vertical',
  minHeight: 80,
  outline: 'none',
  caretColor: '#e7ba90',
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
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13.5,
                lineHeight: 1.4,
                fontStyle: 'italic',
                color: 'rgba(212, 207, 199, 0.9)',
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
                e.currentTarget.style.borderColor = '#e7ba90'
                e.currentTarget.style.boxShadow =
                  '0 0 0 2px rgba(231, 186, 144, 0.15)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  'rgba(231, 186, 144, 0.15)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
