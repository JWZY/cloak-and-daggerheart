import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AncestryStep } from './AncestryStep'
import { CommunityStep } from './CommunityStep'
import { SubclassStep } from './SubclassStep'
import { DomainCardsStep } from './DomainCardsStep'
import { TraitsStep } from './TraitsStep'
import { EquipmentStep } from './EquipmentStep'
import { SummaryStep } from './SummaryStep'
import { useCharacterStore } from '../../stores/characterStore'
import { Button } from '../../components/ui/Button'
import { Breadcrumbs, type Step } from '../../components/ui/Breadcrumbs'
import type { Ancestry, Community, DomainCard, Traits, WizardSubclass, Equipment } from '../../types/character'

const STEPS: Step[] = ['ancestry', 'community', 'subclass', 'cards', 'traits', 'equipment', 'summary']

interface CreateCharacterProps {
  onComplete: (characterId: string) => void
  onCancel: () => void
  isEditing?: boolean
  entryStep?: Step | null
}

export function CreateCharacter({ onComplete, onCancel, isEditing = false, entryStep }: CreateCharacterProps) {
  // Initialize to entry step if editing and entryStep is provided, otherwise start at ancestry
  const [currentStep, setCurrentStep] = useState<Step>(() => {
    if (isEditing && entryStep) return entryStep
    return 'ancestry'
  })
  const { draftCharacter, startDraft, updateDraft, finalizeDraft } =
    useCharacterStore()

  // Use ref to track if we've initialized to avoid StrictMode double-invoke issues
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    // Only start fresh draft if not editing (editing mode already initialized the draft via startDraftFromCharacter)
    // Also skip if we've already initialized (handles StrictMode double-invoke)
    if (!isEditing && !hasInitializedRef.current) {
      startDraft()
      hasInitializedRef.current = true
    }

    // Don't clear draft in cleanup - this prevents StrictMode from clearing
    // the pre-populated draft during its simulated unmount cycle.
    // The draft will be:
    // - Cleared by finalizeDraft() when completing
    // - Overwritten by startDraft() when creating a new character
    // - Overwritten by startDraftFromCharacter() when editing another character
  }, [startDraft, isEditing])

  const currentIndex = STEPS.indexOf(currentStep)
  const [direction, setDirection] = useState(1)

  // Check if a specific step is complete based on draft data
  const isStepComplete = (step: Step): boolean => {
    switch (step) {
      case 'ancestry':
        return !!draftCharacter?.ancestry
      case 'community':
        return !!draftCharacter?.community
      case 'subclass':
        return !!draftCharacter?.subclass
      case 'cards':
        return (draftCharacter?.domainCards?.length ?? 0) >= 2
      case 'traits':
        return draftCharacter?.traits ? Object.values(draftCharacter.traits).every(v => v !== null) : false
      case 'equipment':
        return true // Equipment has defaults
      case 'summary':
        return !!draftCharacter?.name?.trim()
      default:
        return false
    }
  }

  // Compute completed steps based on current draft state
  const completedSteps = useMemo(() => {
    const completed = new Set<Step>()
    for (const step of STEPS) {
      if (isStepComplete(step)) {
        completed.add(step)
      }
    }
    return completed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftCharacter])

  // Navigate to a step (used by breadcrumbs)
  const navigateToStep = (targetStep: Step) => {
    const targetIndex = STEPS.indexOf(targetStep)
    setDirection(targetIndex > currentIndex ? 1 : -1)
    setCurrentStep(targetStep)
  }

  const goNext = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < STEPS.length) {
      setDirection(1)
      setCurrentStep(STEPS[nextIndex])
    }
  }

  const goBack = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setDirection(-1)
      setCurrentStep(STEPS[prevIndex])
    } else {
      onCancel()
    }
  }

  const handleComplete = () => {
    const characterId = finalizeDraft()
    if (characterId) {
      onComplete(characterId)
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  // Check if can continue based on current step
  const canContinue = isStepComplete(currentStep)

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient">
      {/* Glass Header */}
      <div className="glass-dark px-4 py-3 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onCancel}
            className="text-white/70 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <span className="font-semibold text-glass-primary">
            {isEditing ? 'Edit Character' : 'Create Character'}
          </span>
          <span className="w-14" />
        </div>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={navigateToStep}
          isEditing={isEditing}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative z-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 p-4 overflow-auto pb-24"
          >
            {currentStep === 'ancestry' && (
              <AncestryStep
                selected={draftCharacter?.ancestry}
                onSelect={(ancestry: Ancestry) => updateDraft({ ancestry })}
              />
            )}
            {currentStep === 'community' && (
              <CommunityStep
                selected={draftCharacter?.community}
                onSelect={(community: Community) => updateDraft({ community })}
              />
            )}
            {currentStep === 'subclass' && (
              <SubclassStep
                selected={draftCharacter?.subclass}
                onSelect={(subclass: WizardSubclass) =>
                  updateDraft({ subclass, domainCards: [] })
                }
              />
            )}
            {currentStep === 'cards' && draftCharacter?.subclass && (
              <DomainCardsStep
                subclass={draftCharacter.subclass}
                selected={draftCharacter?.domainCards || []}
                onSelect={(cards: DomainCard[]) => updateDraft({ domainCards: cards })}
              />
            )}
            {currentStep === 'traits' && (
              <TraitsStep
                traits={draftCharacter?.traits}
                onSelect={(traits: Traits) => updateDraft({ traits })}
              />
            )}
            {currentStep === 'equipment' && (
              <EquipmentStep
                equipment={draftCharacter?.equipment}
                onSelect={(equipment: Partial<Equipment>) => updateDraft({ equipment })}
              />
            )}
            {currentStep === 'summary' &&
              draftCharacter?.ancestry &&
              draftCharacter?.community &&
              draftCharacter?.subclass &&
              draftCharacter?.domainCards &&
              draftCharacter?.traits && (
                <SummaryStep
                  ancestry={draftCharacter.ancestry}
                  community={draftCharacter.community}
                  subclass={draftCharacter.subclass}
                  domainCards={draftCharacter.domainCards}
                  traits={draftCharacter.traits}
                  onNameChange={(name: string) => updateDraft({ name })}
                  initialName={draftCharacter.name}
                />
              )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Glass Bottom Navigation */}
      <div className="glass fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex gap-3 z-20">
        {currentIndex > 0 && (
          <Button onClick={goBack} variant="glass" className="flex-1">
            Back
          </Button>
        )}
        {currentStep === 'summary' ? (
          <Button
            onClick={handleComplete}
            disabled={!canContinue}
            variant="glass-primary"
            className="flex-1"
          >
            {isEditing ? 'Save Changes' : 'Create Character'}
          </Button>
        ) : (
          <Button
            onClick={goNext}
            disabled={!canContinue}
            variant="glass-primary"
            className="flex-1"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}
