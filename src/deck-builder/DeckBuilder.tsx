import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepIndicator } from './components/StepIndicator'
import { DeckPreview } from './components/DeckPreview'
import { PickClass } from './steps/PickClass'
import { PickSubclass } from './steps/PickSubclass'
import { PickDomainCards } from './steps/PickDomainCards'
import { PickAncestry } from './steps/PickAncestry'
import { PickCommunity } from './steps/PickCommunity'
import { PickEquipment } from './steps/PickEquipment'
import { AssignTraits } from './steps/AssignTraits'
import { CreateBackground } from './steps/CreateBackground'
import { CreateExperiences } from './steps/CreateExperiences'
import { NameCharacter } from './steps/NameCharacter'
import { CreateConnections } from './steps/CreateConnections'
import { ReviewDeck } from './steps/ReviewDeck'
import { GameButton } from '../ui/GameButton'
import { useDeckStore } from '../store/deck-store'
import { calculateMaxHP } from '../core/character/hp'
import { getArmorScore } from '../core/character/armor'
import {
  ancestries,
  communities,
  getClassByName,
  getLevel1DomainCards,
  tier1Armors,
  tier1PrimaryWeapons,
  tier1SecondaryWeapons,
} from '../data/srd'
import type { Character, Traits, TraitName } from '../types/character'
import { TRAIT_NAMES } from '../core/rules/traits'

const TOTAL_STEPS = 12
const BASE_PATH = import.meta.env.BASE_URL ?? '/'

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
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

const slideTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

interface DeckBuilderProps {
  onComplete: (character: Character) => void
}

export function DeckBuilder({ onComplete }: DeckBuilderProps) {
  const store = useDeckStore()
  const [direction, setDirection] = useState(0)

  // Track canProceed changes to trigger pulse
  const canProceed = store.canProceed()
  const prevCanProceed = useRef(canProceed)
  const [showPulse, setShowPulse] = useState(false)

  useEffect(() => {
    if (canProceed && !prevCanProceed.current) {
      setShowPulse(true)
      const timer = setTimeout(() => setShowPulse(false), 600)
      return () => clearTimeout(timer)
    }
    prevCanProceed.current = canProceed
  }, [canProceed])

  const handleNext = useCallback(() => {
    if (store.currentStep === 11) {
      // Finalize character
      const character = assembleCharacter(store)
      store.reset()
      onComplete(character)
      return
    }
    setDirection(1)
    store.nextStep()
  }, [store, onComplete])

  const handleBack = useCallback(() => {
    setDirection(-1)
    store.prevStep()
  }, [store])

  const stepComponents = [
    <PickClass key="step-0" />,
    <PickSubclass key="step-1" />,
    <PickDomainCards key="step-2" />,
    <PickAncestry key="step-3" />,
    <PickCommunity key="step-4" />,
    <PickEquipment key="step-5" />,
    <AssignTraits key="step-6" />,
    <CreateExperiences key="step-7" />,
    <CreateBackground key="step-8" />,
    <CreateConnections key="step-9" />,
    <NameCharacter key="step-10" />,
    <ReviewDeck key="step-11" />,
  ]

  const isReview = store.currentStep === 11
  const buttonLabel = isReview ? 'Begin Adventure' : 'Continue'

  return (
    <div
      className="flex relative"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        background: '#03070d',
      }}
    >
      {/* Atmosphere texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${BASE_PATH}images/cards/atmosphere.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
          pointerEvents: 'none',
          transform: 'scaleY(-1)',
          zIndex: 0,
        }}
      />

      {/* Desktop preview panel — hidden on mobile via CSS */}
      <div
        className="deck-preview-panel"
        style={{
          position: 'relative',
          zIndex: 10,
          borderRight: '1px solid rgba(231, 186, 144, 0.08)',
          background: 'rgba(3, 7, 13, 0.5)',
          flexShrink: 0,
        }}
      >
        <DeckPreview />
      </div>

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        {/* Header */}
        <div className="shrink-0">
          <StepIndicator
            currentStep={store.currentStep}
            totalSteps={TOTAL_STEPS}
          />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={store.currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="w-full py-4"
            >
              {stepComponents[store.currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div
          className="shrink-0 flex items-center justify-between px-6 py-4"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          {store.currentStep > 0 ? (
            <GameButton variant="ghost" size="sm" onClick={handleBack}>
              Back
            </GameButton>
          ) : (
            <div />
          )}

          <motion.div
            animate={
              showPulse
                ? {
                    scale: [1, 1.06, 1],
                    transition: { duration: 0.4, ease: 'easeOut' },
                  }
                : { scale: 1 }
            }
          >
            <GameButton
              variant={canProceed ? 'primary' : 'secondary'}
              size={isReview ? 'lg' : 'md'}
              disabled={!canProceed}
              onClick={handleNext}
            >
              {buttonLabel}
            </GameButton>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Assemble Character from draft state
// ---------------------------------------------------------------------------

function assembleCharacter(
  store: ReturnType<typeof useDeckStore.getState>
): Character {
  const subclassName = store.subclass!
  const ancestry = ancestries.find((a) => a.name === store.ancestryName)!
  const community = communities.find((c) => c.name === store.communityName)!
  const classData = getClassByName(store.selectedClass!)

  // Build traits object
  const traits: Traits = { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0 }
  if (store.traits) {
    for (const name of TRAIT_NAMES) {
      traits[name as TraitName] = store.traits[name] ?? 0
    }
  }

  // Calculate HP
  const baseHP = parseInt(classData.hp, 10)
  const maxHP = calculateMaxHP(baseHP, subclassName)

  // Look up selected equipment from SRD data
  const selectedArmor = tier1Armors.find((a) => a.name === store.selectedArmor) ?? tier1Armors.find((a) => a.name === 'Leather Armor')!
  const selectedPrimary = tier1PrimaryWeapons.find((w) => w.name === store.selectedPrimaryWeapon) ?? tier1PrimaryWeapons.find((w) => w.name === 'Greatstaff')!
  const selectedSecondary = store.selectedSecondaryWeapon
    ? tier1SecondaryWeapons.find((w) => w.name === store.selectedSecondaryWeapon) ?? null
    : null

  // Calculate armor score: base_score + level
  const level = 1
  const armorMax = getArmorScore(selectedArmor) + level

  // Calculate evasion with armor modifications
  let evasion = parseInt(classData.evasion, 10)
  const armorFeat = selectedArmor.feat_text ?? ''
  if (armorFeat.includes('+1 to Evasion')) evasion += 1
  if (armorFeat.includes('-1 to Evasion')) evasion -= 1
  if (armorFeat.includes('-2 to Evasion')) evasion -= 2

  // Apply armor trait modifications (e.g. Full Plate: -1 to Agility)
  if (armorFeat.includes('-1 to Agility')) {
    traits.agility -= 1
  }

  // Build domain cards from selection
  const domainCards = getLevel1DomainCards(store.selectedClass!).filter((card) =>
    store.selectedDomainCards.includes(card.name)
  )

  // Build equipment from selections
  const equipment = {
    primaryWeapon: selectedPrimary,
    secondaryWeapon: selectedSecondary,
    armor: selectedArmor,
    items: [],
    consumables: [],
  }

  return {
    id: crypto.randomUUID(),
    name: store.characterName.trim(),
    level,
    ancestry: {
      name: ancestry.name,
      description: ancestry.description,
      feats: ancestry.feats,
    },
    community: {
      name: community.name,
      description: community.description,
      note: community.note,
      feats: community.feats,
    },
    class: store.selectedClass!,
    subclass: subclassName,
    traits,
    hp: { current: maxHP, max: maxHP },
    armorSlots: { current: armorMax, max: armorMax },
    hope: 2,
    stress: { current: 0, max: 6 },
    evasion,
    proficiency: 1,
    domainCards,
    equipment,
    gold: 0,
    notes: '',
    advancements: [],
    markedTraits: [],
    subclassTier: 'foundation',
    backgroundAnswers: store.backgroundAnswers,
    experiences: store.experiences,
    connectionAnswers: store.connectionAnswers,
    createdAt: Date.now(),
  }
}
