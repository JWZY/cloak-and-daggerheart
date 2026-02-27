import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react'
import { useLevelUpStore } from '../store/level-up-store'
import { useCharacterStore } from '../store/character-store'
import { getProficiency, getAdvancementCost, getAvailableAdvancementTypes } from '../core/rules/advancement'
import { getDomainCardsUpToLevel } from '../data/srd'
import { getClassForSubclass } from '../data/srd'
import { TRAIT_NAMES, formatTraitValue } from '../core/rules/traits'
import type { Character, AdvancementType, TraitName, Advancement } from '../types/character'
import type { LevelUpChoices } from '../core/character/level-up'

export interface LevelUpWizardProps {
  character: Character
  onClose: () => void
}

const STEP_TITLES = [
  'Tier Achievements',
  'Choose Advancements',
  'New Domain Card',
  'Review & Confirm',
]

// Human-readable labels for advancement types
const ADVANCEMENT_LABELS: Record<AdvancementType, string> = {
  increase_traits: 'Increase 2 Traits',
  add_hp: '+1 HP Slot',
  add_stress: '+1 Stress Slot',
  boost_experiences: 'Boost 2 Experiences',
  add_domain_card: '+1 Domain Card',
  increase_evasion: '+1 Evasion',
  upgrade_subclass: 'Upgrade Subclass',
  increase_proficiency: '+1 Proficiency',
}

const ADVANCEMENT_DESCRIPTIONS: Record<AdvancementType, string> = {
  increase_traits: 'Increase 2 unmarked traits by +1 (marks them)',
  add_hp: 'Add 1 HP slot to your maximum',
  add_stress: 'Add 1 Stress slot to your maximum',
  boost_experiences: 'Increase 2 experience bonuses by +1',
  add_domain_card: 'Add a new domain card (level \u2264 2)',
  increase_evasion: 'Increase your evasion score by 1',
  upgrade_subclass: 'Foundation \u2192 Specialization (2 slots)',
  increase_proficiency: 'Increase proficiency bonus by 1 (2 slots)',
}

export function LevelUpWizard({ character, onClose }: LevelUpWizardProps) {
  const store = useLevelUpStore()
  const levelUp = useCharacterStore((s) => s.levelUp)
  const [direction, setDirection] = useState(1)

  // Initialize store on mount
  useEffect(() => {
    store.start(character.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.id])

  const newLevel = character.level + 1
  const newProficiency = getProficiency(newLevel)
  const classData = getClassForSubclass(character.subclass)

  // Calculate how many domain cards to pick: 1 mandatory + add_domain_card advancements
  const domainCardsToPick = useMemo(() => {
    const extraCards = store.advancements.filter(a => a.type === 'add_domain_card').length
    return 1 + extraCards
  }, [store.advancements])

  // Available domain cards for the new domain card step
  const availableDomainCards = useMemo(() => {
    if (!classData) return []
    const srdCards = getDomainCardsUpToLevel(classData.name, newLevel)
    // Filter out cards the character already has
    const existingNames = new Set(character.domainCards.map(c => c.name))
    return srdCards.filter(c => !existingNames.has(c.name))
  }, [classData, newLevel, character.domainCards])

  const handleNext = () => {
    setDirection(1)
    store.nextStep()
  }

  const handlePrev = () => {
    setDirection(-1)
    store.prevStep()
  }

  const canProceedFromStep = (): boolean => {
    switch (store.currentStep) {
      case 0:
        return store.newExperienceText.trim().length > 0
      case 1:
        return store.slotsUsed() === 2
      case 2:
        return store.selectedNewCards.length === domainCardsToPick
      case 3:
        return true
      default:
        return false
    }
  }

  const handleConfirm = () => {
    const selectedCards = availableDomainCards.filter(c => store.selectedNewCards.includes(c.name))
    if (selectedCards.length !== domainCardsToPick) return

    const choices: LevelUpChoices = {
      advancements: store.advancements,
      newDomainCards: selectedCards,
      newExperience: { text: store.newExperienceText },
    }

    levelUp(character.id, choices)
    store.reset()
    onClose()
  }

  // Shared styles
  const goldText = {
    fontFamily: "'EB Garamond', serif",
    fontWeight: 500 as const,
    fontVariant: 'small-caps' as const,
    background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: 'rgba(3, 7, 13, 0.95)',
        backdropFilter: 'blur(20px)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="p-2 rounded-lg" style={{ color: '#e7ba90' }}>
          <X size={20} />
        </button>
        <span style={{ ...goldText, fontSize: 18 }}>
          {STEP_TITLES[store.currentStep]}
        </span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Step indicator dots */}
      <div className="flex justify-center gap-2 pb-4">
        {STEP_TITLES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === store.currentStep ? 24 : 8,
              height: 8,
              background: i <= store.currentStep
                ? 'linear-gradient(90deg, #f9f8f3, #e7ba90)'
                : 'rgba(231, 186, 144, 0.2)',
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={store.currentStep}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.2 }}
          >
            {store.currentStep === 0 && (
              <StepAutoGains
                character={character}
                newProficiency={newProficiency}
                experienceText={store.newExperienceText}
                onExperienceChange={store.setNewExperienceText}
              />
            )}
            {store.currentStep === 1 && (
              <StepAdvancements
                character={character}
                advancements={store.advancements}
                slotsUsed={store.slotsUsed()}
                onAdd={store.addAdvancement}
                onRemove={store.removeAdvancement}
                canAdd={store.canAddAdvancement}
              />
            )}
            {store.currentStep === 2 && (
              <StepDomainCard
                availableCards={availableDomainCards}
                selectedCards={store.selectedNewCards}
                maxCards={domainCardsToPick}
                onToggle={(name) => store.toggleSelectedCard(name, domainCardsToPick)}
              />
            )}
            {store.currentStep === 3 && (
              <StepReview
                character={character}
                advancements={store.advancements}
                newExperience={store.newExperienceText}
                newCards={store.selectedNewCards}
                newProficiency={newProficiency}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between px-4 py-4 gap-3">
        {store.currentStep > 0 ? (
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontWeight: 600,
              fontVariant: 'small-caps',
              letterSpacing: '0.04em',
              fontSize: 15,
              color: '#e7ba90',
              border: '1px solid rgba(231, 186, 144, 0.2)',
              background: 'rgba(231, 186, 144, 0.05)',
            }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
        ) : (
          <div />
        )}

        {store.currentStep < 3 ? (
          <button
            onClick={handleNext}
            disabled={!canProceedFromStep()}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl transition-opacity"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontWeight: 600,
              fontVariant: 'small-caps',
              letterSpacing: '0.04em',
              fontSize: 15,
              color: '#1a1207',
              background: canProceedFromStep()
                ? 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)'
                : 'rgba(231, 186, 144, 0.2)',
              opacity: canProceedFromStep() ? 1 : 0.5,
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontWeight: 600,
              fontVariant: 'small-caps',
              letterSpacing: '0.04em',
              fontSize: 15,
              color: '#1a1207',
              background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
            }}
          >
            <Check size={16} />
            Confirm Level Up
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ==========================================================================
// Step 0: Automatic Gains
// ==========================================================================

function StepAutoGains({
  character,
  newProficiency,
  experienceText,
  onExperienceChange,
}: {
  character: Character
  newProficiency: number
  experienceText: string
  onExperienceChange: (text: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center pb-2">
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: 'rgba(212, 207, 199, 0.7)' }}>
          These upgrades happen automatically at Level {character.level + 1}
        </p>
      </div>

      {/* Automatic gains */}
      <div className="flex flex-col gap-3">
        <GainRow
          label="Proficiency"
          from={`+${character.proficiency}`}
          to={`+${newProficiency}`}
          changed={character.proficiency !== newProficiency}
        />
        <GainRow
          label="Damage Thresholds"
          from={`+${character.level}`}
          to={`+${character.level + 1}`}
          changed={true}
        />
      </div>

      {/* New experience */}
      <div className="flex flex-col gap-2 pt-2">
        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 15,
            fontWeight: 600,
            fontVariant: 'small-caps',
            letterSpacing: '0.04em',
            color: '#e7ba90',
          }}
        >
          New Experience (+2 bonus)
        </span>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: 'rgba(212, 207, 199, 0.5)', lineHeight: 1.4 }}>
          Describe something your character learned or went through
        </p>
        <input
          type="text"
          value={experienceText}
          onChange={(e) => onExperienceChange(e.target.value)}
          placeholder="e.g. Survived the Siege of Thornwall"
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 14,
            background: 'rgba(231, 186, 144, 0.06)',
            border: '1px solid rgba(231, 186, 144, 0.15)',
            color: '#D4CFC7',
          }}
        />
      </div>
    </div>
  )
}

function GainRow({ label, from, to, changed }: { label: string; from: string; to: string; changed: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
      style={{
        background: 'rgba(231, 186, 144, 0.06)',
        border: '1px solid rgba(231, 186, 144, 0.1)',
      }}
    >
      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, fontVariant: 'small-caps', color: 'rgba(212, 207, 199, 0.7)' }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: 'rgba(212, 207, 199, 0.4)' }}>{from}</span>
        {changed && (
          <>
            <ChevronRight size={12} style={{ color: '#e7ba90' }} />
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, fontWeight: 700, color: '#e7ba90' }}>{to}</span>
          </>
        )}
      </div>
    </div>
  )
}

// ==========================================================================
// Step 1: Choose Advancements
// ==========================================================================

function StepAdvancements({
  character,
  advancements,
  slotsUsed,
  onAdd,
  onRemove,
  canAdd,
}: {
  character: Character
  advancements: Advancement[]
  slotsUsed: number
  onAdd: (a: Advancement) => void
  onRemove: (index: number) => void
  canAdd: (cost: number) => boolean
}) {
  const [pickingTraits, setPickingTraits] = useState(false)
  const [pickingExperiences, setPickingExperiences] = useState(false)
  const [selectedTraits, setSelectedTraits] = useState<TraitName[]>([])
  const [selectedExpIndices, setSelectedExpIndices] = useState<number[]>([])

  const newLevel = character.level + 1
  const availableTypes = getAvailableAdvancementTypes(1) // tier 1 for now

  const handleSelectAdvancement = (type: AdvancementType) => {
    const cost = getAdvancementCost(type)
    if (!canAdd(cost)) return

    if (type === 'increase_traits') {
      setSelectedTraits([])
      setPickingTraits(true)
      return
    }

    if (type === 'boost_experiences') {
      setSelectedExpIndices([])
      setPickingExperiences(true)
      return
    }

    onAdd({ level: newLevel, type })
  }

  // Auto-confirm when 2 traits are selected
  useEffect(() => {
    if (selectedTraits.length === 2) {
      onAdd({
        level: newLevel,
        type: 'increase_traits',
        traits: [selectedTraits[0], selectedTraits[1]],
      })
      setPickingTraits(false)
      setSelectedTraits([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTraits])

  const handleConfirmExperiences = () => {
    if (selectedExpIndices.length === 2) {
      onAdd({
        level: newLevel,
        type: 'boost_experiences',
        experienceIndices: [selectedExpIndices[0], selectedExpIndices[1]],
      })
      setPickingExperiences(false)
      setSelectedExpIndices([])
    }
  }

  const toggleTrait = (trait: TraitName) => {
    setSelectedTraits(prev => {
      if (prev.includes(trait)) return prev.filter(t => t !== trait)
      if (prev.length >= 2) return prev
      return [...prev, trait]
    })
  }

  const toggleExpIndex = (idx: number) => {
    setSelectedExpIndices(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx)
      if (prev.length >= 2) return prev
      return [...prev, idx]
    })
  }

  // Traits that are already marked (can't be increased again)
  const markedTraits = new Set(character.markedTraits)

  return (
    <div className="flex flex-col gap-4">
      {/* Slots indicator */}
      <div className="flex items-center justify-center gap-3">
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: 'rgba(212, 207, 199, 0.5)' }}>
          Slots used:
        </span>
        <div className="flex gap-1.5">
          {[0, 1].map(i => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border transition-all"
              style={{
                background: i < slotsUsed
                  ? 'linear-gradient(180deg, #f9f8f3, #e7ba90)'
                  : 'transparent',
                borderColor: i < slotsUsed ? '#e7ba90' : 'rgba(231, 186, 144, 0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Selected advancements */}
      {advancements.length > 0 && (
        <div className="flex flex-col gap-2">
          {advancements.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{
                background: 'rgba(231, 186, 144, 0.1)',
                border: '1px solid rgba(231, 186, 144, 0.25)',
              }}
            >
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: '#e7ba90' }}>
                {ADVANCEMENT_LABELS[a.type]}
                {a.traits && ` (${a.traits.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')})`}
                {a.experienceIndices && ` (Exp ${a.experienceIndices.map(idx => idx + 1).join(', ')})`}
              </span>
              <button
                onClick={() => onRemove(i)}
                className="p-1 rounded"
                style={{ color: 'rgba(231, 186, 144, 0.5)' }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Trait picker — full-width rows matching AssignTraits pattern */}
      {pickingTraits && (
        <div className="flex flex-col gap-3 p-3 rounded-xl" style={{ background: 'rgba(231, 186, 144, 0.06)', border: '1px solid rgba(231, 186, 144, 0.15)' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, fontVariant: 'small-caps', color: '#e7ba90' }}>
              Pick 2 unmarked traits to increase
            </span>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'rgba(231, 186, 144, 0.5)' }}>
              {selectedTraits.length} / 2
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {TRAIT_NAMES.map(trait => {
              const isMarked = markedTraits.has(trait)
              const isSelected = selectedTraits.includes(trait)
              return (
                <button
                  key={trait}
                  onClick={() => !isMarked && toggleTrait(trait)}
                  disabled={isMarked}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    background: isSelected
                      ? 'rgba(231, 186, 144, 0.08)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected
                      ? '1px solid rgba(231, 186, 144, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected
                      ? 'inset 0 1px 1px rgba(249, 248, 243, 0.1), 0 2px 8px rgba(0, 0, 0, 0.15)'
                      : 'none',
                    opacity: isMarked ? 0.35 : 1,
                    cursor: isMarked ? 'default' : 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: 15,
                      fontWeight: 600,
                      fontVariant: 'small-caps',
                      letterSpacing: '0.04em',
                      color: isMarked
                        ? 'rgba(212, 207, 199, 0.4)'
                        : isSelected
                          ? '#e7ba90'
                          : 'rgba(212, 207, 199, 0.7)',
                    }}
                  >
                    {trait}
                    {isMarked && (
                      <span style={{ fontSize: 11, marginLeft: 6, color: 'rgba(212, 207, 199, 0.3)' }}>marked</span>
                    )}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: isMarked
                        ? 'rgba(212, 207, 199, 0.2)'
                        : isSelected
                          ? '#e7ba90'
                          : 'rgba(212, 207, 199, 0.5)',
                      minWidth: 32,
                      textAlign: 'right',
                    }}
                  >
                    {formatTraitValue(character.traits[trait])}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            onClick={() => { setPickingTraits(false); setSelectedTraits([]) }}
            className="self-start px-3 py-1.5 text-sm rounded-lg"
            style={{ color: 'rgba(212, 207, 199, 0.5)' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Experience picker sub-modal */}
      {pickingExperiences && (
        <div className="flex flex-col gap-3 p-3 rounded-xl" style={{ background: 'rgba(231, 186, 144, 0.06)', border: '1px solid rgba(231, 186, 144, 0.15)' }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, fontVariant: 'small-caps', color: '#e7ba90' }}>
            Pick 2 experiences to boost
          </span>
          <div className="flex flex-col gap-2">
            {character.experiences.map((exp, idx) => {
              const isSelected = selectedExpIndices.includes(idx)
              return (
                <button
                  key={idx}
                  onClick={() => toggleExpIndex(idx)}
                  className="px-3 py-2 rounded-lg text-left transition-all"
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 13,
                    background: isSelected ? 'rgba(231, 186, 144, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: isSelected ? '1px solid rgba(231, 186, 144, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: isSelected ? '#e7ba90' : 'rgba(212, 207, 199, 0.6)',
                  }}
                >
                  {exp.text} (+{exp.bonus})
                </button>
              )
            })}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setPickingExperiences(false)} className="px-3 py-1.5 text-sm rounded-lg" style={{ color: 'rgba(212, 207, 199, 0.5)' }}>
              Cancel
            </button>
            <button
              onClick={handleConfirmExperiences}
              disabled={selectedExpIndices.length !== 2}
              className="px-3 py-1.5 text-sm rounded-lg"
              style={{
                background: selectedExpIndices.length === 2 ? 'rgba(231, 186, 144, 0.2)' : 'transparent',
                color: selectedExpIndices.length === 2 ? '#e7ba90' : 'rgba(212, 207, 199, 0.3)',
                border: '1px solid rgba(231, 186, 144, 0.2)',
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Available advancements */}
      {slotsUsed < 2 && !pickingTraits && !pickingExperiences && (
        <div className="flex flex-col gap-2">
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, fontVariant: 'small-caps', color: 'rgba(212, 207, 199, 0.5)' }}>
            Available Advancements
          </span>
          {availableTypes.map(type => {
            const cost = getAdvancementCost(type)
            const canAfford = canAdd(cost)
            return (
              <button
                key={type}
                onClick={() => handleSelectAdvancement(type)}
                disabled={!canAfford}
                className="flex flex-col px-3 py-2.5 rounded-xl text-left transition-all"
                style={{
                  background: canAfford ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                  border: '1px solid rgba(231, 186, 144, 0.1)',
                  opacity: canAfford ? 1 : 0.35,
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, fontWeight: 600, color: '#D4CFC7' }}>
                    {ADVANCEMENT_LABELS[type]}
                  </span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'rgba(231, 186, 144, 0.5)' }}>
                    {cost} {cost === 1 ? 'slot' : 'slots'}
                  </span>
                </div>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'rgba(212, 207, 199, 0.4)', marginTop: 2 }}>
                  {ADVANCEMENT_DESCRIPTIONS[type]}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==========================================================================
// Step 2: Pick Domain Card
// ==========================================================================

interface DomainCardOption {
  name: string
  level: string
  domain: string
  type: string
  text: string
}

function StepDomainCard({
  availableCards,
  selectedCards,
  maxCards,
  onToggle,
}: {
  availableCards: DomainCardOption[]
  selectedCards: string[]
  maxCards: number
  onToggle: (name: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: 'rgba(212, 207, 199, 0.7)', textAlign: 'center' }}>
        {maxCards === 1
          ? 'Choose a new domain card from your class domains'
          : `Choose ${maxCards} domain cards from your class domains`}
      </p>
      <div className="flex justify-center">
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: 'rgba(231, 186, 144, 0.6)' }}>
          {selectedCards.length} of {maxCards} selected
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {availableCards.map(card => {
          const isSelected = selectedCards.includes(card.name)
          const atMax = selectedCards.length >= maxCards
          const dimmed = !isSelected && atMax
          return (
            <button
              key={card.name}
              onClick={() => onToggle(card.name)}
              disabled={dimmed}
              className="flex flex-col px-3 py-3 rounded-xl text-left transition-all"
              style={{
                background: isSelected ? 'rgba(231, 186, 144, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? '1px solid rgba(231, 186, 144, 0.35)' : '1px solid rgba(231, 186, 144, 0.08)',
                opacity: dimmed ? 0.4 : 1,
                cursor: dimmed ? 'default' : 'pointer',
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 600, color: isSelected ? '#e7ba90' : '#D4CFC7' }}>
                  {card.name}
                </span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: 'rgba(212, 207, 199, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.domain} &middot; L{card.level}
                </span>
              </div>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'rgba(212, 207, 199, 0.5)', marginTop: 4, lineHeight: 1.4 }}>
                {card.text.length > 120 ? card.text.slice(0, 120) + '\u2026' : card.text}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ==========================================================================
// Step 3: Review & Confirm
// ==========================================================================

function StepReview({
  character,
  advancements,
  newExperience,
  newCards,
  newProficiency,
}: {
  character: Character
  advancements: Advancement[]
  newExperience: string
  newCards: string[]
  newProficiency: number
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2 pb-2">
        <Sparkles size={16} style={{ color: '#e7ba90' }} />
        <span style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 20,
          fontWeight: 500,
          fontVariant: 'small-caps',
          background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Level {character.level + 1}
        </span>
        <Sparkles size={16} style={{ color: '#e7ba90' }} />
      </div>

      <ReviewSection title="Automatic Gains">
        <ReviewItem label="Proficiency" value={`+${newProficiency}`} />
        <ReviewItem label="Damage Thresholds" value={`+${character.level + 1}`} />
        <ReviewItem label="New Experience" value={`${newExperience} (+2)`} />
      </ReviewSection>

      <ReviewSection title="Advancements">
        {advancements.map((a, i) => (
          <ReviewItem
            key={i}
            label={ADVANCEMENT_LABELS[a.type]}
            value={
              a.traits ? a.traits.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
              : a.experienceIndices ? `Experiences ${a.experienceIndices.map(idx => idx + 1).join(', ')}`
              : ''
            }
          />
        ))}
      </ReviewSection>

      <ReviewSection title={newCards.length === 1 ? 'New Domain Card' : 'New Domain Cards'}>
        {newCards.map(cardName => (
          <ReviewItem key={cardName} label={cardName} value="" />
        ))}
      </ReviewSection>
    </div>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, fontVariant: 'small-caps', letterSpacing: '0.04em', color: '#e7ba90' }}>
        {title}
      </span>
      <div className="flex flex-col gap-1.5 pl-2" style={{ borderLeft: '2px solid rgba(231, 186, 144, 0.15)' }}>
        {children}
      </div>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: 'rgba(212, 207, 199, 0.7)' }}>{label}</span>
      {value && <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, fontWeight: 600, color: '#e7ba90' }}>{value}</span>}
    </div>
  )
}
