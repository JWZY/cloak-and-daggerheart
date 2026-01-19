import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AncestryStep } from './AncestryStep'
import { CommunityStep } from './CommunityStep'
import { SubclassStep } from './SubclassStep'
import { DomainCardsStep } from './DomainCardsStep'
import { TraitsStep } from './TraitsStep'
import { SummaryStep } from './SummaryStep'
import { useCharacterStore } from '../../stores/characterStore'
import type { Ancestry, Community, DomainCard, Traits, WizardSubclass } from '../../types/character'

type Step = 'ancestry' | 'community' | 'subclass' | 'cards' | 'traits' | 'summary'

const STEPS: Step[] = ['ancestry', 'community', 'subclass', 'cards', 'traits', 'summary']

interface CreateCharacterProps {
  onComplete: (characterId: string) => void
  onCancel: () => void
}

export function CreateCharacter({ onComplete, onCancel }: CreateCharacterProps) {
  const [currentStep, setCurrentStep] = useState<Step>('ancestry')
  const { draftCharacter, startDraft, updateDraft, finalizeDraft, clearDraft } =
    useCharacterStore()

  useEffect(() => {
    startDraft()
    return () => clearDraft()
  }, [startDraft, clearDraft])

  const currentIndex = STEPS.indexOf(currentStep)
  const progress = ((currentIndex + 1) / STEPS.length) * 100

  const goNext = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex])
    }
  }

  const goBack = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
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
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  const [direction, setDirection] = useState(1)

  const goNextWithDirection = () => {
    setDirection(1)
    goNext()
  }

  const goBackWithDirection = () => {
    setDirection(-1)
    goBack()
  }

  return (
    <div className="h-full flex flex-col bg-ios-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-ios-separator px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onCancel}
            className="text-ios-blue font-medium"
          >
            Cancel
          </button>
          <span className="font-semibold">Create Character</span>
          <span className="w-14" />
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ios-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 p-4 overflow-auto"
          >
            {currentStep === 'ancestry' && (
              <AncestryStep
                selected={draftCharacter?.ancestry}
                onSelect={(ancestry: Ancestry) => updateDraft({ ancestry })}
                onNext={goNextWithDirection}
              />
            )}
            {currentStep === 'community' && (
              <CommunityStep
                selected={draftCharacter?.community}
                onSelect={(community: Community) => updateDraft({ community })}
                onNext={goNextWithDirection}
                onBack={goBackWithDirection}
              />
            )}
            {currentStep === 'subclass' && (
              <SubclassStep
                selected={draftCharacter?.subclass}
                onSelect={(subclass: WizardSubclass) =>
                  updateDraft({ subclass, domainCards: [] })
                }
                onNext={goNextWithDirection}
                onBack={goBackWithDirection}
              />
            )}
            {currentStep === 'cards' && draftCharacter?.subclass && (
              <DomainCardsStep
                subclass={draftCharacter.subclass}
                selected={draftCharacter?.domainCards || []}
                onSelect={(cards: DomainCard[]) => updateDraft({ domainCards: cards })}
                onNext={goNextWithDirection}
                onBack={goBackWithDirection}
              />
            )}
            {currentStep === 'traits' && (
              <TraitsStep
                traits={draftCharacter?.traits}
                onSelect={(traits: Traits) => updateDraft({ traits })}
                onNext={goNextWithDirection}
                onBack={goBackWithDirection}
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
                  onComplete={handleComplete}
                  onBack={goBackWithDirection}
                />
              )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
