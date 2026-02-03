import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'

export type Step = 'ancestry' | 'community' | 'subclass' | 'cards' | 'traits' | 'equipment' | 'summary'

interface BreadcrumbsProps {
  steps: Step[]
  currentStep: Step
  completedSteps: Set<Step>
  onStepClick: (step: Step) => void
  isEditing: boolean
}

const STEP_LABELS: Record<Step, string> = {
  ancestry: 'Ancestry',
  community: 'Community',
  subclass: 'School',
  cards: 'Cards',
  traits: 'Traits',
  equipment: 'Gear',
  summary: 'Review',
}

export function Breadcrumbs({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  isEditing,
}: BreadcrumbsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const currentStepRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll to current step
  useEffect(() => {
    if (currentStepRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const element = currentStepRef.current
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      // Center the current step in the visible area
      const scrollLeft = element.offsetLeft - containerRect.width / 2 + elementRect.width / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [currentStep])

  const canNavigateToStep = (step: Step): boolean => {
    if (step === currentStep) return false

    // In edit mode, can navigate to any step
    if (isEditing) return true

    // In create mode, can only go back to completed steps
    return completedSteps.has(step)
  }

  const getStepState = (step: Step): 'completed' | 'current' | 'upcoming' => {
    if (step === currentStep) return 'current'
    if (completedSteps.has(step)) return 'completed'
    return 'upcoming'
  }

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto scrollbar-hide -mx-4 px-4"
    >
      <div className="flex items-center gap-1 min-w-max py-1">
        {steps.map((step, index) => {
          const state = getStepState(step)
          const canNavigate = canNavigateToStep(step)
          const isLast = index === steps.length - 1

          return (
            <div key={step} className="flex items-center">
              <motion.button
                ref={step === currentStep ? currentStepRef : undefined}
                onClick={() => canNavigate && onStepClick(step)}
                disabled={!canNavigate}
                className={`
                  relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 min-h-[44px]
                  ${state === 'current' ? 'text-white bg-white/15 font-semibold' : ''}
                  ${state === 'completed' ? 'text-purple-300 cursor-pointer hover:bg-white/10' : ''}
                  ${state === 'upcoming' ? (
                    isEditing
                      ? 'text-white/50 cursor-pointer hover:bg-white/5'
                      : 'text-white/30 cursor-not-allowed'
                  ) : ''}
                `}
                whileTap={canNavigate ? { scale: 0.95 } : undefined}
              >
                {state === 'completed' && (
                  <Check size={14} className="text-emerald-400" />
                )}
                <span>{STEP_LABELS[step]}</span>
              </motion.button>

              {!isLast && (
                <ChevronRight size={14} className="text-white/30 mx-0.5 flex-shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
