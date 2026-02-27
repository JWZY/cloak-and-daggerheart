import { type ReactNode } from 'react'

export interface StepInstructionProps {
  children: ReactNode
  style?: React.CSSProperties
}

export function StepInstruction({ children, style }: StepInstructionProps) {
  return (
    <p
      style={{
        fontFamily: "'EB Garamond', serif",
        fontStyle: 'italic',
        fontSize: 13,
        color: 'rgba(231, 186, 144, 0.5)',
        textAlign: 'center',
        marginBottom: 24,
        ...style,
      }}
    >
      {children}
    </p>
  )
}
