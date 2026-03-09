import { forwardRef } from 'react'
import { typeSubtitle, typeBody, goldDarkAlpha } from './typography'
import { RADIUS_OPTION } from '../design-system/tokens/surfaces'

export interface GameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Remove all borders, backgrounds, and focus rings */
  borderless?: boolean
}

export const GameInput = forwardRef<HTMLInputElement, GameInputProps>(
  function GameInput({ label, style, ...props }, ref) {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label
            style={{
              display: 'block',
              ...typeSubtitle,
              color: 'var(--gold)',
              marginBottom: 6,
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'linear-gradient(180deg, rgba(45,34,22,0.55), rgba(30,22,14,0.4))',
            border: `1px solid ${goldDarkAlpha(0.15)}`,
            borderRadius: RADIUS_OPTION,
            color: 'var(--text-primary)',
            fontFamily: typeBody.fontFamily,
            fontSize: typeBody.fontSize,
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            caretColor: 'var(--gold)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = goldDarkAlpha(0.4)
            e.currentTarget.style.boxShadow = `0 0 0 2px ${goldDarkAlpha(0.2)}`
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = goldDarkAlpha(0.15)
            e.currentTarget.style.boxShadow = 'none'
            props.onBlur?.(e)
          }}
        />
      </div>
    )
  }
)
