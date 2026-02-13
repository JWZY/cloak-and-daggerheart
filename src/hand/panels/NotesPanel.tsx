import { useState, useEffect, useRef, useCallback } from 'react'
import { useCharacterStore } from '../../store/character-store'
import type { Character } from '../../types/character'

export interface NotesPanelProps {
  character: Character
}

export function NotesPanel({ character }: NotesPanelProps) {
  const updateNotes = useCharacterStore((s) => s.updateNotes)
  const [localNotes, setLocalNotes] = useState(character.notes)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync from store if it changes externally
  useEffect(() => {
    setLocalNotes(character.notes)
  }, [character.notes])

  const handleChange = useCallback(
    (value: string) => {
      setLocalNotes(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        updateNotes(character.id, value)
      }, 500)
    },
    [character.id, updateNotes]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div>
      <textarea
        value={localNotes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Session notes, reminders, backstory details..."
        rows={5}
        className="w-full resize-none rounded-lg px-3 py-2.5 outline-none"
        style={{
          background: 'rgba(3, 7, 13, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'rgba(212, 207, 199, 0.85)',
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 13,
          lineHeight: '1.5',
          caretColor: '#e7ba90',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#e7ba90'
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(231, 186, 144, 0.15)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}
