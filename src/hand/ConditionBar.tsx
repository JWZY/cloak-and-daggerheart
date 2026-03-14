import { typeMicro } from '../ui/typography'
import { STANDARD_CONDITIONS } from '../core/rules/conditions'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

export interface ConditionBarProps {
  character: Character
}

export function ConditionBar({ character }: ConditionBarProps) {
  const addCondition = useCharacterStore((s) => s.addCondition)
  const removeCondition = useCharacterStore((s) => s.removeCondition)

  return (
    <div
      className="flex items-center gap-2"
      style={{ minHeight: 36 }}
    >
      {STANDARD_CONDITIONS.map((condition) => {
        const isActive = character.conditions.includes(condition.name)

        return (
          <button
            key={condition.name}
            type="button"
            aria-label={`${condition.name}${isActive ? ' (active)' : ''}: ${condition.description}`}
            aria-pressed={isActive}
            onClick={() =>
              isActive
                ? removeCondition(character.id, condition.name)
                : addCondition(character.id, condition.name)
            }
            style={{
              ...typeMicro,
              fontSize: 11,
              padding: '6px 12px',
              borderRadius: 9999,
              border: isActive
                ? '1px solid var(--gold-muted)'
                : '1px solid rgba(255,255,255,0.08)',
              background: isActive
                ? 'rgba(231,186,144,0.15)'
                : 'transparent',
              color: isActive
                ? 'var(--gold)'
                : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              lineHeight: 1,
            }}
          >
            {condition.name}
          </button>
        )
      })}
    </div>
  )
}
