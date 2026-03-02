import { forwardRef } from 'react'
import { typeSubtitle, typeBody } from './typography'

export interface GameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
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
            background: 'var(--bg-surface)',
            border: '1px solid var(--surface-border)',
            borderRadius: 8,
            color: 'var(--text-primary)',
            fontFamily: typeBody.fontFamily,
            fontSize: typeBody.fontSize,
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            caretColor: 'var(--gold)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold)'
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--gold-muted)'
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--surface-border)'
            e.currentTarget.style.boxShadow = 'none'
            props.onBlur?.(e)
          }}
        />
      </div>
    )
  }
)
