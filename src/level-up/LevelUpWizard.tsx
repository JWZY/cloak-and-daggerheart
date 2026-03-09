import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FormatText } from '../ui/FormatText'
import { typeTitle, typeSubtitle, typeBody, typeMicro, goldGradient, goldGradientStyle, goldGradientH } from '../ui/typography'
import { SelectableOption } from '../ui/SelectableOption'
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react'
import { useLevelUpStore } from '../store/level-up-store'
import { useCharacterStore } from '../store/character-store'
import { getProficiency, getTier, getAdvancementCost, getAvailableAdvancementTypes, getAdvancementPickLimit } from '../core/rules/advancement'
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
    ...typeTitle,
    ...goldGradientStyle,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(20px)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="p-2 rounded-lg" style={{ color: 'var(--gold)' }}>
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
                ? goldGradientH
                : 'var(--gold-muted)',
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
            className="max-w-[360px] mx-auto"
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
              ...typeSubtitle,
              color: 'var(--gold)',
              border: '1px solid var(--gold-muted)',
              background: 'var(--gold-muted)',
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
              ...typeSubtitle,
              color: '#1a1207',
              background: canProceedFromStep()
                ? goldGradient
                : 'var(--gold-muted)',
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
              ...typeSubtitle,
              color: '#1a1207',
              background: goldGradient,
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
        <p style={{ fontFamily: typeBody.fontFamily, fontSize: 14, color: 'var(--text-secondary)' }}>
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
            ...typeSubtitle,
            color: 'var(--gold)',
          }}
        >
          New Experience (+2 bonus)
        </span>
        <p style={{ fontFamily: typeBody.fontFamily, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Describe something your character learned or went through
        </p>
        <input
          type="text"
          value={experienceText}
          onChange={(e) => onExperienceChange(e.target.value)}
          placeholder="e.g. Survived the Siege of Thornwall"
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{
            fontFamily: typeBody.fontFamily,
            fontSize: 14,
            background: 'var(--gold-muted)',
            border: '1px solid var(--gold-muted)',
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
        background: 'var(--gold-muted)',
        border: '1px solid var(--gold-muted)',
      }}
    >
      <span style={{ ...typeSubtitle, fontSize: 14, color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: typeBody.fontFamily, fontSize: 14, color: 'var(--text-muted)' }}>{from}</span>
        {changed && (
          <>
            <ChevronRight size={12} style={{ color: 'var(--gold)' }} />
            <span style={{ fontFamily: typeBody.fontFamily, fontSize: 14, fontWeight: 700, color: 'var(--gold)' }}>{to}</span>
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
  const [expandedType, setExpandedType] = useState<AdvancementType | null>(null)
  const [selectedTraits, setSelectedTraits] = useState<TraitName[]>([])
  const [selectedExpIndices, setSelectedExpIndices] = useState<number[]>([])

  const newLevel = character.level + 1
  const tier = getTier(newLevel)
  const availableTypes = getAvailableAdvancementTypes(tier)

  // Count past-tier picks (advancements from previous levels in this tier)
  const pastTierPickCounts = useMemo(() => {
    const counts: Partial<Record<AdvancementType, number>> = {}
    for (const a of character.advancements) {
      if (getTier(a.level) === tier) {
        counts[a.type] = (counts[a.type] ?? 0) + 1
      }
    }
    return counts
  }, [character.advancements, tier])

  // Count current level-up picks per type
  const currentPickCounts = useMemo(() => {
    const counts: Partial<Record<AdvancementType, number>> = {}
    for (const a of advancements) {
      counts[a.type] = (counts[a.type] ?? 0) + 1
    }
    return counts
  }, [advancements])

  // Combined tier pick counts (past + current)
  const tierPickCounts = useMemo(() => {
    const counts: Partial<Record<AdvancementType, number>> = {}
    for (const type of availableTypes) {
      counts[type] = (pastTierPickCounts[type] ?? 0) + (currentPickCounts[type] ?? 0)
    }
    return counts
  }, [pastTierPickCounts, currentPickCounts, availableTypes])

  const handleCheckboxTap = (type: AdvancementType, checkboxIndex: number) => {
    const pastCount = pastTierPickCounts[type] ?? 0
    const currentCount = currentPickCounts[type] ?? 0

    // If tapping a filled checkbox that belongs to a current pick, undo it
    if (checkboxIndex >= pastCount && checkboxIndex < pastCount + currentCount) {
      // Find the index of the nth current pick for this type
      const currentPickOffset = checkboxIndex - pastCount
      let found = 0
      for (let i = 0; i < advancements.length; i++) {
        if (advancements[i].type === type) {
          if (found === currentPickOffset) {
            // Also collapse if this type's expansion is open
            if (expandedType === type) {
              setExpandedType(null)
              setSelectedTraits([])
              setSelectedExpIndices([])
            }
            onRemove(i)
            return
          }
          found++
        }
      }
      return
    }

    // If tapping a past-filled checkbox, do nothing
    if (checkboxIndex < pastCount) return

    // Tapping an empty checkbox — try to add
    const cost = getAdvancementCost(type)
    if (!canAdd(cost)) return
    const picksUsed = tierPickCounts[type] ?? 0
    if (picksUsed >= getAdvancementPickLimit(type)) return

    if (type === 'increase_traits') {
      setSelectedTraits([])
      setSelectedExpIndices([])
      setExpandedType(type)
      return
    }

    if (type === 'boost_experiences') {
      setSelectedExpIndices([])
      setSelectedTraits([])
      setExpandedType(type)
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
      setExpandedType(null)
      setSelectedTraits([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTraits])

  // Auto-confirm when 2 experiences are selected
  useEffect(() => {
    if (selectedExpIndices.length === 2) {
      onAdd({
        level: newLevel,
        type: 'boost_experiences',
        experienceIndices: [selectedExpIndices[0], selectedExpIndices[1]],
      })
      setExpandedType(null)
      setSelectedExpIndices([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpIndices])

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
        <span style={{ fontFamily: typeBody.fontFamily, fontSize: 13, color: 'var(--text-muted)' }}>
          Slots used:
        </span>
        <div className="flex gap-1.5">
          {[0, 1].map(i => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border transition-all"
              style={{
                background: i < slotsUsed
                  ? goldGradient
                  : 'transparent',
                borderColor: i < slotsUsed ? 'var(--gold)' : 'var(--gold-muted)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Advancement rows */}
      <div className="flex flex-col gap-2">
        {availableTypes.map(type => {
          const cost = getAdvancementCost(type)
          const canAfford = canAdd(cost)
          const pickLimit = getAdvancementPickLimit(type)
          const pastCount = pastTierPickCounts[type] ?? 0
          const currentCount = currentPickCounts[type] ?? 0
          const totalPicked = tierPickCounts[type] ?? 0
          const atTierLimit = totalPicked >= pickLimit
          const isDisabled = (!canAfford && currentCount === 0) || (atTierLimit && currentCount === 0)
          const isTwoSlot = cost === 2

          return (
            <div key={type}>
              {/* Checkbox row */}
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: currentCount > 0 ? 'var(--gold-muted)' : 'var(--surface-faint)',
                  border: currentCount > 0 ? '1px solid var(--gold-muted)' : '1px solid var(--gold-muted)',
                  opacity: isDisabled ? 0.35 : 1,
                }}
              >
                {/* Tier pick-limit checkboxes */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pickLimit }).map((_, i) => {
                    const isFilled = i < totalPicked
                    const isPastPick = i < pastCount
                    const isCurrentPick = isFilled && !isPastPick
                    const isTappable = isCurrentPick || (!isFilled && canAfford && !atTierLimit)
                    return (
                      <button
                        key={i}
                        onClick={() => isTappable && handleCheckboxTap(type, i)}
                        disabled={!isTappable}
                        className="rounded-sm"
                        style={{
                          width: 12,
                          height: 12,
                          background: isFilled
                            ? goldGradient
                            : 'transparent',
                          border: isFilled
                            ? '1px solid var(--gold)'
                            : '1px solid var(--gold-muted)',
                          boxShadow: isFilled
                            ? '0 0 4px var(--gold-muted)'
                            : 'none',
                          cursor: isTappable ? 'pointer' : 'default',
                          opacity: isPastPick ? 0.6 : 1,
                          padding: 0,
                        }}
                      />
                    )
                  })}
                </div>

                {/* Label */}
                <span
                  className="flex-1"
                  style={{
                    fontFamily: typeBody.fontFamily,
                    fontSize: 14,
                    fontWeight: 600,
                    color: currentCount > 0 ? 'var(--gold)' : '#D4CFC7',
                  }}
                >
                  {ADVANCEMENT_LABELS[type]}
                </span>

                {/* Slot cost for 2-slot types */}
                {isTwoSlot && (
                  <span style={{ fontFamily: typeBody.fontFamily, fontSize: 12, color: 'var(--gold-secondary)' }}>
                    2 slots
                  </span>
                )}
              </div>

              {/* Inline trait picker */}
              <AnimatePresence initial={false}>
                {expandedType === type && type === 'increase_traits' && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="flex flex-col gap-2 pt-2 pb-1">
                      <div className="flex items-center justify-between px-1">
                        <span style={{ ...typeSubtitle, fontSize: 13, color: 'var(--gold)' }}>
                          Pick 2 unmarked traits
                        </span>
                        <span style={{ fontFamily: typeBody.fontFamily, fontSize: 12, color: 'var(--gold-secondary)' }}>
                          {selectedTraits.length} / 2
                        </span>
                      </div>
                      {TRAIT_NAMES.map(trait => {
                        const isMarked = markedTraits.has(trait)
                        const isSelected = selectedTraits.includes(trait)
                        const isDimmed = !isMarked && !isSelected && selectedTraits.length >= 2
                        return (
                          <SelectableOption
                            key={trait}
                            selected={isSelected}
                            dimmed={isDimmed}
                            disabled={isMarked}
                            onClick={() => toggleTrait(trait)}
                            layout={false}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                style={{
                                  ...typeSubtitle,
                                  color: isMarked
                                    ? 'var(--text-muted)'
                                    : isSelected
                                      ? 'var(--gold)'
                                      : 'var(--text-secondary)',
                                }}
                              >
                                {trait}
                                {isMarked && (
                                  <span style={{ fontSize: 11, marginLeft: 6, color: 'var(--text-muted)' }}>marked</span>
                                )}
                              </span>
                              <span
                                style={{
                                  fontFamily: typeBody.fontFamily,
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: isMarked
                                    ? 'var(--text-muted)'
                                    : isSelected
                                      ? 'var(--gold)'
                                      : 'var(--text-muted)',
                                  minWidth: 32,
                                  textAlign: 'right',
                                }}
                              >
                                {formatTraitValue(character.traits[trait])}
                              </span>
                            </div>
                          </SelectableOption>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inline experience picker */}
              <AnimatePresence initial={false}>
                {expandedType === type && type === 'boost_experiences' && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="flex flex-col gap-2 pt-2 pb-1">
                      <div className="flex items-center justify-between px-1">
                        <span style={{ ...typeSubtitle, fontSize: 13, color: 'var(--gold)' }}>
                          Pick 2 experiences to boost
                        </span>
                        <span style={{ fontFamily: typeBody.fontFamily, fontSize: 12, color: 'var(--gold-secondary)' }}>
                          {selectedExpIndices.length} / 2
                        </span>
                      </div>
                      {(character.experiences || []).map((exp, idx) => {
                        if (!exp?.text) return null
                        const isSelected = selectedExpIndices.includes(idx)
                        const isDimmed = !isSelected && selectedExpIndices.length >= 2
                        return (
                          <SelectableOption
                            key={idx}
                            selected={isSelected}
                            dimmed={isDimmed}
                            disabled={false}
                            onClick={() => toggleExpIndex(idx)}
                            layout={false}
                          >
                            <span
                              style={{
                                fontFamily: typeBody.fontFamily,
                                fontSize: 13,
                                color: isSelected ? 'var(--gold)' : 'var(--text-secondary)',
                              }}
                            >
                              {exp.text} (+{exp.bonus})
                            </span>
                          </SelectableOption>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
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
      <p style={{ fontFamily: typeBody.fontFamily, fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
        {maxCards === 1
          ? 'Choose a new domain card from your class domains'
          : `Choose ${maxCards} domain cards from your class domains`}
      </p>
      <div className="flex justify-center">
        <span style={{ fontFamily: typeBody.fontFamily, fontSize: 13, color: 'var(--gold-secondary)' }}>
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
                background: isSelected ? 'var(--gold-muted)' : 'var(--surface-faint)',
                border: isSelected ? '1px solid var(--gold-secondary)' : '1px solid var(--gold-muted)',
                opacity: dimmed ? 0.4 : 1,
                cursor: dimmed ? 'default' : 'pointer',
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span style={{ fontFamily: typeSubtitle.fontFamily, fontSize: typeSubtitle.fontSize, fontWeight: typeSubtitle.fontWeight, color: isSelected ? 'var(--gold)' : '#D4CFC7' }}>
                  {card.name}
                </span>
                <span style={{ ...typeMicro, color: 'var(--text-muted)' }}>
                  {card.domain} &middot; L{card.level}
                </span>
              </div>
              <div style={{ fontFamily: typeBody.fontFamily, fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                <FormatText text={card.text.length > 120 ? card.text.slice(0, 120) + '\u2026' : card.text} />
              </div>
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
        <Sparkles size={16} style={{ color: 'var(--gold)' }} />
        <span style={{
          ...typeTitle,
          fontSize: 20,
          ...goldGradientStyle,
        }}>
          Level {character.level + 1}
        </span>
        <Sparkles size={16} style={{ color: 'var(--gold)' }} />
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
      <span style={{ ...typeSubtitle, fontSize: 14, color: 'var(--gold)' }}>
        {title}
      </span>
      <div className="flex flex-col gap-1.5 pl-2" style={{ borderLeft: '2px solid var(--gold-muted)' }}>
        {children}
      </div>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontFamily: typeBody.fontFamily, fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      {value && <span style={{ fontFamily: typeBody.fontFamily, fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>{value}</span>}
    </div>
  )
}
