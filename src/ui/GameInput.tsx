import { forwardRef } from 'react'

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
              fontFamily: "'EB Garamond', serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.06em',
              fontVariant: 'small-caps',
              color: '#e7ba90',
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
            background: 'rgba(3, 7, 13, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
            color: 'rgba(212, 207, 199, 0.9)',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            caretColor: '#e7ba90',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#e7ba90'
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(231, 186, 144, 0.15)'
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.boxShadow = 'none'
            props.onBlur?.(e)
          }}
        />
      </div>
    )
  }
)
