import { type ReactNode } from 'react'
import { typeSubtitle } from './typography'

export interface StepInstructionProps {
  children: ReactNode
  style?: React.CSSProperties
}

export function StepInstruction({ children, style }: StepInstructionProps) {
  return (
    <p
      style={{
        fontFamily: typeSubtitle.fontFamily,
        fontStyle: 'italic',
        fontSize: typeSubtitle.fontSize,
        color: 'var(--gold-secondary)',
        textAlign: 'center',
        marginBottom: 24,
        ...style,
      }}
    >
      {children}
    </p>
  )
}
