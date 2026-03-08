import { useDeckStore } from '../../store/deck-store'
import { GameTextarea } from '../../ui/GameTextarea'
import { typeTitle, typeSubtitle, typeBody, goldGradient } from '../../ui/typography'
import { getClassByName } from '../../data/srd'

export function CreateConnections() {
  const connectionAnswers = useDeckStore((s) => s.connectionAnswers)
  const setConnectionAnswer = useDeckStore((s) => s.setConnectionAnswer)
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const classData = selectedClass ? getClassByName(selectedClass) : null

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
        Create Connections
      </h2>
      <p style={{
        ...typeSubtitle,
        fontStyle: 'italic',
        color: 'var(--gold-secondary)',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        Establish relationships with other player characters
      </p>

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
