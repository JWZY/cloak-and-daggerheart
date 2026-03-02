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

export function CreateConnections() {
  const connectionAnswers = useDeckStore((s) => s.connectionAnswers)
  const setConnectionAnswer = useDeckStore((s) => s.setConnectionAnswer)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const classData = selectedClass ? getClassByName(selectedClass) : null

  return (
    <div className="flex flex-col items-center px-6">
      <StepInstruction>
        Establish relationships with other player characters. These are
        optional — skip any that don't apply.
      </StepInstruction>

      <div className="w-full max-w-md mb-6">
        <SectionHeader>Create Connections</SectionHeader>
      </div>

      <div className="w-full max-w-md flex flex-col gap-5">
        {(classData?.connections ?? []).map((conn, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p
              style={{
                ...typeBody,
                fontStyle: 'italic',
                color: 'var(--text-primary)',
              }}
            >
              {conn.question}
            </p>
            <textarea
              value={connectionAnswers[index] ?? ''}
              onChange={(e) => setConnectionAnswer(index, e.target.value)}
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
