import { motion } from 'framer-motion'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCurrent = i === currentStep
        const isCompleted = i < currentStep

        return (
          <motion.div
            key={i}
            animate={{
              scale: isCurrent ? 1.25 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isCurrent
                ? 'var(--gold)'
                : isCompleted
                  ? 'var(--gold)'
                  : 'var(--gold-muted)',
              boxShadow: isCurrent
                ? '0 0 6px var(--gold-secondary)'
                : 'none',
              transition: 'background 0.2s ease, box-shadow 0.2s ease',
            }}
          />
        )
      })}
    </div>
  )
}
