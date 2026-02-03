import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/Card'
import type { Character } from '../../types/character'
import { wizard } from '../../data/srd'

interface NotesTabProps {
  character: Character
  onNotesChange: (notes: string) => void
  onBackgroundAnswerChange: (index: number, answer: string) => void
  onConnectionAnswerChange: (index: number, answer: string) => void
}

export function NotesTab({
  character,
  onNotesChange,
  onBackgroundAnswerChange,
  onConnectionAnswerChange,
}: NotesTabProps) {
  const [notes, setNotes] = useState(character.notes)
  const [backgroundAnswers, setBackgroundAnswers] = useState(
    character.backgroundAnswers || wizard.backgrounds.map(() => '')
  )
  const [connectionAnswers, setConnectionAnswers] = useState(
    character.connectionAnswers || wizard.connections.map(() => '')
  )

  useEffect(() => {
    setNotes(character.notes)
  }, [character.notes])

  useEffect(() => {
    setBackgroundAnswers(character.backgroundAnswers || wizard.backgrounds.map(() => ''))
  }, [character.backgroundAnswers])

  useEffect(() => {
    setConnectionAnswers(character.connectionAnswers || wizard.connections.map(() => ''))
  }, [character.connectionAnswers])

  const handleNotesChange = (value: string) => {
    setNotes(value)
    onNotesChange(value)
  }

  const handleBackgroundChange = (index: number, value: string) => {
    const newAnswers = [...backgroundAnswers]
    newAnswers[index] = value
    setBackgroundAnswers(newAnswers)
    onBackgroundAnswerChange(index, value)
  }

  const handleConnectionChange = (index: number, value: string) => {
    const newAnswers = [...connectionAnswers]
    newAnswers[index] = value
    setConnectionAnswers(newAnswers)
    onConnectionAnswerChange(index, value)
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Session Notes */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Session Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Write your session notes here..."
          className="glass-input-flat h-48 resize-none"
        />
      </Card>

      {/* Background Questions */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Background Questions</h3>
        <p className="text-sm text-white/50 mb-4">
          Answer these to flesh out your character's backstory:
        </p>
        <div className="space-y-4">
          {wizard.backgrounds.map((bg, i) => (
            <div key={i} className="space-y-2">
              <p className="text-sm font-medium text-white">{bg.question}</p>
              <textarea
                value={backgroundAnswers[i] || ''}
                onChange={(e) => handleBackgroundChange(i, e.target.value)}
                placeholder="Your answer..."
                className="glass-input-flat h-20 text-sm resize-none"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Connection Questions */}
      <Card variant="glass" padding="md">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-4">Party Connections</h3>
        <p className="text-sm text-white/50 mb-4">
          Ask these to another party member:
        </p>
        <div className="space-y-4">
          {wizard.connections.map((conn, i) => (
            <div key={i} className="space-y-2">
              <p className="text-sm font-medium text-white">{conn.question}</p>
              <textarea
                value={connectionAnswers[i] || ''}
                onChange={(e) => handleConnectionChange(i, e.target.value)}
                placeholder="Your answer..."
                className="glass-input-flat h-20 text-sm resize-none"
              />
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
