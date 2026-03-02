import { useState, useEffect, useRef, useCallback } from 'react'
import { typeBody } from '../../ui/typography'
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
          background: 'var(--bg-surface)',
          border: '1px solid var(--surface-light)',
          color: 'var(--text-primary)',
          fontFamily: typeBody.fontFamily,
          fontSize: 13,
          lineHeight: '1.5',
          caretColor: 'var(--gold)',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--gold)'
          e.currentTarget.style.boxShadow = '0 0 0 2px var(--gold-muted)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--surface-light)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}
