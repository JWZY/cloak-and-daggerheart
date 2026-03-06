import { useState, useEffect, useRef, useCallback } from 'react'
import { GameTextarea } from '../../ui/GameTextarea'
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
      <GameTextarea
        value={localNotes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Session notes, reminders, backstory details..."
        rows={5}
        style={{ resize: 'none', fontSize: 13, lineHeight: '1.5' }}
      />
    </div>
  )
}
