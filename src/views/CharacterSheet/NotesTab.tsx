import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/Card'
import type { Character } from '../../types/character'
import { wizard } from '../../data/srd'

interface NotesTabProps {
  character: Character
  onNotesChange: (notes: string) => void
}

export function NotesTab({ character, onNotesChange }: NotesTabProps) {
  const [notes, setNotes] = useState(character.notes)

  useEffect(() => {
    setNotes(character.notes)
  }, [character.notes])

  const handleChange = (value: string) => {
    setNotes(value)
    onNotesChange(value)
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Session Notes */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Session Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your session notes here..."
          className="w-full h-48 p-3 rounded-xl border border-ios-separator focus:outline-none focus:ring-2 focus:ring-ios-blue resize-none text-gray-700"
        />
      </Card>

      {/* Background Questions */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Background Questions</h3>
        <p className="text-sm text-gray-500 mb-3">
          Answer these to flesh out your character's backstory:
        </p>
        <div className="space-y-3">
          {wizard.backgrounds.map((bg, i) => (
            <div key={i} className="p-3 bg-ios-gray-light rounded-xl">
              <p className="text-sm text-gray-700">{bg.question}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Connection Questions */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Party Connections</h3>
        <p className="text-sm text-gray-500 mb-3">
          Ask these to another party member:
        </p>
        <div className="space-y-3">
          {wizard.connections.map((conn, i) => (
            <div key={i} className="p-3 bg-ios-gray-light rounded-xl">
              <p className="text-sm text-gray-700">{conn.question}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Reference */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Reference</h3>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-blue-50 rounded-lg">
            <span className="font-medium text-blue-800">Roll with Hope:</span>
            <span className="text-blue-700 ml-2">Hope die {'>'} Fear die</span>
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <span className="font-medium text-red-800">Roll with Fear:</span>
            <span className="text-red-700 ml-2">Fear die {'>'} Hope die</span>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg">
            <span className="font-medium text-amber-800">Critical:</span>
            <span className="text-amber-700 ml-2">Hope die = Fear die</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
