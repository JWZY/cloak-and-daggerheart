import { useDeckStore } from '../../store/deck-store'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { GameTextarea } from '../../ui/GameTextarea'
import { typeBody } from '../../ui/typography'
import { getClassByName } from '../../data/srd'

export function CreateConnections() {
  const connectionAnswers = useDeckStore((s) => s.connectionAnswers)
  const setConnectionAnswer = useDeckStore((s) => s.setConnectionAnswer)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const classData = selectedClass ? getClassByName(selectedClass) : null

  return (
    <div className="flex flex-col items-center px-4">
      <StepInstruction>
        Establish relationships with other player characters. These are
        optional — skip any that don't apply.
      </StepInstruction>

      <h2 className="w-full max-w-[360px] mb-2 px-4">
        <SectionHeader>Create Connections</SectionHeader>
      </h2>

      <div className="w-full max-w-[360px] flex flex-col gap-5">
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
            <GameTextarea
              value={connectionAnswers[index] ?? ''}
              onChange={(e) => setConnectionAnswer(index, e.target.value)}
              placeholder="Write your answer..."
              style={{ minHeight: 80 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
