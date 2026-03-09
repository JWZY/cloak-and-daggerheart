import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepCarousel } from './components/StepCarousel'
import { PickClass } from './steps/PickClass'
import { PickSubclass } from './steps/PickSubclass'
import { PickDomainCards } from './steps/PickDomainCards'
import { PickAncestry } from './steps/PickAncestry'
import { PickCommunity } from './steps/PickCommunity'
import { PickEquipment } from './steps/PickEquipment'
import { AssignTraits } from './steps/AssignTraits'
import { CreateExperiences } from './steps/CreateExperiences'
import { NameCharacter } from './steps/NameCharacter'
import { FatesButton } from '../ui/FatesButton'
import { EmberOverlay } from '../ui/EmberOverlay'
import { getClassAccentColor } from '../cards/domain-colors'
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

const BASE_PATH = import.meta.env.BASE_URL ?? '/'

/** All steps crossfade — stable layout, no sliding */
const fadeVariants = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({ opacity: 0 }),
}

const fadeTransition = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }

interface DeckBuilderProps {
  onComplete: (character: Character) => void
  onExit?: () => void
}

export function DeckBuilder({ onComplete, onExit }: DeckBuilderProps) {
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
    if (store.currentStep === 8) {
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

  // Track the highest step reached so carousel knows what's clickable
  const [maxReached, setMaxReached] = useState(store.currentStep)
  useEffect(() => {
    setMaxReached((prev) => Math.max(prev, store.currentStep))
  }, [store.currentStep])

  // The next step is reachable if canProceed is true
  const maxReachableStep = canProceed ? Math.max(maxReached, store.currentStep + 1) : maxReached

  const handleGoToStep = useCallback((step: number) => {
    setDirection(step > store.currentStep ? 1 : -1)
    store.goToStep(step)
  }, [store])

  const handleExit = useCallback(() => {
    store.reset()
    onExit?.()
  }, [store, onExit])

  const handleSkip = useCallback(() => {
    const dummy: Character = {
      id: crypto.randomUUID(),
      name: 'Theron Ashvale',
      level: 1,
      ancestry: { name: 'Elf', description: 'Graceful and long-lived.', feats: [] },
      community: { name: 'Highborne', description: 'Noble and refined.', feats: [] },
      class: 'Warrior',
      subclass: 'Call of the Brave',
      traits: { agility: 1, strength: 2, finesse: 0, instinct: -1, presence: 1, knowledge: 0 },
      hp: { current: 18, max: 18 },
      armorSlots: { current: 3, max: 3 },
      hope: 2,
      stress: { current: 0, max: 6 },
      evasion: 8,
      proficiency: 1,
      domainCards: [],
      equipment: { primaryWeapon: null, secondaryWeapon: null, armor: null, items: [], consumables: [] },
      gold: 10,
      notes: '',
      advancements: [],
      markedTraits: [],
      subclassTier: 'foundation',
      backgroundAnswers: [],
      experiences: [{ text: 'Survived the Siege of Ashvale', bonus: 0 }],
      connectionAnswers: [],
      createdAt: Date.now(),
    }
    store.reset()
    onComplete(dummy)
  }, [store, onComplete])

  // Steps that use FullBleedPicker and provide their own nav chrome.
  // Add step indices here as they are converted: 0, 1, 2, 3, 4
  const FULL_BLEED_STEPS = new Set<number>([0, 1, 2, 3, 4])
  const isFullBleed = FULL_BLEED_STEPS.has(store.currentStep)

  const stepComponents = [
    <PickClass key="step-0" onBack={handleBack} onNext={handleNext} />,
    <PickSubclass key="step-1" onBack={handleBack} onNext={handleNext} />,
    <PickDomainCards key="step-2" onBack={handleBack} onNext={handleNext} />,
    <PickAncestry key="step-3" onBack={handleBack} onNext={handleNext} />,
    <PickCommunity key="step-4" onBack={handleBack} onNext={handleNext} />,
    <PickEquipment key="step-5" />,
    <AssignTraits key="step-6" />,
    <CreateExperiences key="step-7" />,
    <NameCharacter key="step-8" />,
  ]

  const isReview = store.currentStep === 8

  // Progress badge for traits step (step 6) — show "3 / 6" when incomplete
  const getButtonLabel = () => {
    if (isReview) return 'Begin Adventure'
    if (store.currentStep === 6 && !canProceed) {
      const assigned = store.traits
        ? Object.values(store.traits).filter((v) => v !== null && v !== undefined).length
        : 0
      return `${assigned} / 6`
    }
    if (store.currentStep === 7 && !canProceed) {
      const filled = (store.experiences || []).filter((e) => e?.text?.trim()).length
      return `${filled} / 2`
    }
    return 'Next'
  }
  const buttonLabel = getButtonLabel()

  return (
    <div
      className="flex relative"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        background: 'var(--bg-page)',
      }}
    >
      {/* Persistent ember particles — outside AnimatePresence so they survive step transitions */}
      {!isFullBleed && store.selectedClass && (
        <EmberOverlay color={getClassAccentColor(store.selectedClass)} rate={6} />
      )}

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

      {/* Main content column — stable layout, no shifts between modes */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        {/* Persistent step carousel — always absolute so it never shifts layout */}
        <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 20,
          filter: isFullBleed ? 'drop-shadow(0px 4px 4px rgba(0,0,0,0.75))' : undefined,
        }}>
          <StepCarousel
            currentStep={store.currentStep}
            onGoToStep={handleGoToStep}
            maxReachableStep={maxReachableStep}
          />
        </div>

        {/* Step content — always fills available space */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={store.currentStep}
              custom={direction}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={fadeTransition}
              className="w-full h-full absolute inset-0"
            >
              {isFullBleed ? (
                stepComponents[store.currentStep]
              ) : (
                <div className={`h-full overflow-x-hidden ${store.currentStep === 8 ? 'overflow-hidden' : 'overflow-y-auto'}`}
                  style={{ paddingTop: 64, paddingBottom: 80, overscrollBehavior: 'none' }}
                >
                  <div className="py-4">
                    {stepComponents[store.currentStep]}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav — always rendered, fades based on mode */}
        <motion.div
          className="shrink-0 flex items-center justify-between px-6 py-4"
          style={{
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            pointerEvents: isFullBleed ? 'none' : 'auto',
          }}
          animate={{ opacity: isFullBleed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {store.currentStep > 0 ? (
            <FatesButton variant="dark" onClick={handleBack}>
              Back
            </FatesButton>
          ) : onExit ? (
            <FatesButton variant="dark" onClick={handleExit}>
              Exit
            </FatesButton>
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
            <FatesButton
              variant="light"
              disabled={!canProceed}
              onClick={handleNext}
            >
              {buttonLabel}
            </FatesButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Dev skip button */}
      {import.meta.env.DEV && (
        <button
          onClick={handleSkip}
          style={{
            position: 'fixed',
            bottom: 12,
            left: 12,
            zIndex: 9999,
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: 11,
            fontFamily: 'system-ui, sans-serif',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Skip →
        </button>
      )}
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
    backgroundAnswers: store.backgroundAnswers || [],
    experiences: (store.experiences || []).filter((e) => e?.text),
    connectionAnswers: store.connectionAnswers || [],
    createdAt: Date.now(),
  }
}
