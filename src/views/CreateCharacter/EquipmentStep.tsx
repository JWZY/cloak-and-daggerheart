import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Shield, Check, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import type { Equipment, Weapon, Armor } from '../../types/character'
import {
  tier1PrimaryWeapons,
  tier1SecondaryWeapons,
  tier1Armors,
  quarterstaff,
  leatherArmor,
} from '../../data/srd'

type SectionId = 'primary' | 'secondary' | 'armor'

interface EquipmentStepProps {
  equipment: Partial<Equipment> | undefined
  onSelect: (equipment: Partial<Equipment>) => void
}

// Helper to format weapon summary
function formatWeaponSummary(weapon: Weapon | null): string {
  if (!weapon) return 'None'
  return `${weapon.name} · ${weapon.damage}`
}

// Helper to format armor summary
function formatArmorSummary(armor: Armor | null): string {
  if (!armor) return 'Unarmored · Score 3'
  return `${armor.name} · Score ${armor.base_score}`
}

// Accordion section header component
function AccordionHeader({
  title,
  icon: Icon,
  isExpanded,
  isSelected,
  summary,
  onClick,
}: {
  title: string
  icon: LucideIcon
  isExpanded: boolean
  isSelected: boolean
  summary: string
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full glass rounded-[var(--lg-card-radius)] p-4 flex items-center gap-3 cursor-pointer"
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="lg-button w-8 h-8 flex-shrink-0">
        <Icon size={16} className="text-white/80" />
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2">
          {isSelected && <Check size={14} className="text-emerald-300 flex-shrink-0" />}
          <span className="font-semibold text-glass-primary uppercase text-sm tracking-wide">
            {title}
          </span>
        </div>
        {!isExpanded && (
          <p className="text-glass-secondary text-sm mt-0.5 truncate">{summary}</p>
        )}
      </div>
      <div className="flex-shrink-0 text-glass-muted">
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </motion.button>
  )
}

export function EquipmentStep({ equipment, onSelect }: EquipmentStepProps) {
  const [primaryWeapon, setPrimaryWeapon] = useState<Weapon | null>(
    equipment?.primaryWeapon ?? quarterstaff
  )
  const [secondaryWeapon, setSecondaryWeapon] = useState<Weapon | null>(
    equipment?.secondaryWeapon ?? null
  )
  const [armor, setArmor] = useState<Armor | null>(
    equipment?.armor ?? leatherArmor
  )

  // Track which section is expanded (null = all collapsed)
  const [expandedSection, setExpandedSection] = useState<SectionId | null>('primary')

  // Track if each section has been "visited" (for initial flow)
  const [visitedSections, setVisitedSections] = useState<Set<SectionId>>(new Set(['primary']))

  // Use ref to avoid onSelect in dependency array (prevents infinite loop)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Stable callback for updating parent
  const updateEquipment = useCallback((
    primary: Weapon | null,
    secondary: Weapon | null,
    arm: Armor | null
  ) => {
    onSelectRef.current({
      primaryWeapon: primary,
      secondaryWeapon: secondary,
      armor: arm,
      items: equipment?.items ?? [],
      consumables: equipment?.consumables ?? [],
    })
  }, [equipment?.items, equipment?.consumables])

  // Update parent on mount and when equipment changes
  useEffect(() => {
    updateEquipment(primaryWeapon, secondaryWeapon, armor)
  }, [primaryWeapon, secondaryWeapon, armor, updateEquipment])

  // Handle selection and auto-advance
  const handlePrimarySelect = (weapon: Weapon) => {
    setPrimaryWeapon(weapon)
    setExpandedSection('secondary')
    setVisitedSections(prev => new Set([...prev, 'secondary']))
  }

  const handleSecondarySelect = (weapon: Weapon | null) => {
    setSecondaryWeapon(weapon)
    setExpandedSection('armor')
    setVisitedSections(prev => new Set([...prev, 'armor']))
  }

  const handleArmorSelect = (a: Armor | null) => {
    setArmor(a)
    setExpandedSection(null) // All collapse after final selection
  }

  const toggleSection = (section: SectionId) => {
    setExpandedSection(prev => prev === section ? null : section)
    setVisitedSections(prev => new Set([...prev, section]))
  }

  // Animation variants for accordion content
  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.2 }
      }
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    },
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-glass-primary">Choose Your Equipment</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Select your starting weapons and armor
        </p>
      </div>

      <div className="flex-1 overflow-auto space-y-3">
        {/* Primary Weapon Section */}
        <div>
          <AccordionHeader
            title="Primary Weapon"
            icon={Swords}
            isExpanded={expandedSection === 'primary'}
            isSelected={primaryWeapon !== null}
            summary={formatWeaponSummary(primaryWeapon)}
            onClick={() => toggleSection('primary')}
          />
          <AnimatePresence initial={false}>
            {expandedSection === 'primary' && (
              <motion.div
                key="primary-content"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="overflow-hidden"
              >
                <div className="pt-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
                  <div className="flex gap-3 pb-2">
                    {tier1PrimaryWeapons.map((weapon) => {
                      const isSelected = primaryWeapon?.name === weapon.name
                      return (
                        <motion.div
                          key={weapon.name}
                          className="snap-center flex-shrink-0 w-[200px]"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Card
                            variant={isSelected ? 'glass-strong' : 'glass'}
                            selected={false}
                            onTap={() => handlePrimarySelect(weapon)}
                            padding="md"
                            className={`h-full ${isSelected ? 'glass-selected' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-glass-primary truncate">{weapon.name}</h4>
                              {isSelected && <Check size={16} className="text-emerald-300 flex-shrink-0" />}
                            </div>
                            <div className="flex gap-2 mt-1 text-xs text-glass-muted flex-wrap">
                              <span>{weapon.damage} dmg</span>
                              <span>&bull;</span>
                              <span>{weapon.range}</span>
                            </div>
                            <div className="text-xs text-glass-muted mt-1">{weapon.trait}</div>
                            {weapon.feat_text && (
                              <p className="text-xs text-amber-300/80 mt-2 line-clamp-2">{weapon.feat_text}</p>
                            )}
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secondary Weapon Section */}
        <div>
          <AccordionHeader
            title="Secondary Weapon"
            icon={Swords}
            isExpanded={expandedSection === 'secondary'}
            isSelected={visitedSections.has('secondary')}
            summary={formatWeaponSummary(secondaryWeapon)}
            onClick={() => toggleSection('secondary')}
          />
          <AnimatePresence initial={false}>
            {expandedSection === 'secondary' && (
              <motion.div
                key="secondary-content"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="overflow-hidden"
              >
                <div className="pt-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
                  <div className="flex gap-3 pb-2">
                    {/* None option */}
                    <motion.div
                      className="snap-center flex-shrink-0 w-[140px]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card
                        variant={secondaryWeapon === null ? 'glass-strong' : 'glass'}
                        selected={false}
                        onTap={() => handleSecondarySelect(null)}
                        padding="md"
                        className={`h-full ${secondaryWeapon === null ? 'glass-selected' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-glass-muted italic">None</h4>
                          {secondaryWeapon === null && <Check size={16} className="text-emerald-300" />}
                        </div>
                      </Card>
                    </motion.div>

                    {tier1SecondaryWeapons.map((weapon) => {
                      const isSelected = secondaryWeapon?.name === weapon.name
                      return (
                        <motion.div
                          key={weapon.name}
                          className="snap-center flex-shrink-0 w-[200px]"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Card
                            variant={isSelected ? 'glass-strong' : 'glass'}
                            selected={false}
                            onTap={() => handleSecondarySelect(weapon)}
                            padding="md"
                            className={`h-full ${isSelected ? 'glass-selected' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-glass-primary truncate">{weapon.name}</h4>
                              {isSelected && <Check size={16} className="text-emerald-300 flex-shrink-0" />}
                            </div>
                            <div className="flex gap-2 mt-1 text-xs text-glass-muted flex-wrap">
                              <span>{weapon.damage} dmg</span>
                              <span>&bull;</span>
                              <span>{weapon.range}</span>
                            </div>
                            <div className="text-xs text-glass-muted mt-1">{weapon.trait}</div>
                            {weapon.feat_text && (
                              <p className="text-xs text-amber-300/80 mt-2 line-clamp-2">{weapon.feat_text}</p>
                            )}
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Armor Section */}
        <div>
          <AccordionHeader
            title="Armor"
            icon={Shield}
            isExpanded={expandedSection === 'armor'}
            isSelected={visitedSections.has('armor')}
            summary={formatArmorSummary(armor)}
            onClick={() => toggleSection('armor')}
          />
          <AnimatePresence initial={false}>
            {expandedSection === 'armor' && (
              <motion.div
                key="armor-content"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="overflow-hidden"
              >
                <div className="pt-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
                  <div className="flex gap-3 pb-2">
                    {/* Unarmored option */}
                    <motion.div
                      className="snap-center flex-shrink-0 w-[160px]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card
                        variant={armor === null ? 'glass-strong' : 'glass'}
                        selected={false}
                        onTap={() => handleArmorSelect(null)}
                        padding="md"
                        className={`h-full ${armor === null ? 'glass-selected' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-glass-muted italic">Unarmored</h4>
                          {armor === null && <Check size={16} className="text-emerald-300" />}
                        </div>
                        <div className="flex gap-2 mt-1 text-xs text-glass-muted">
                          <span>Score: 3</span>
                        </div>
                        <div className="text-xs text-glass-muted mt-1">Thresholds: Default</div>
                      </Card>
                    </motion.div>

                    {tier1Armors.map((a) => {
                      const isSelected = armor?.name === a.name
                      return (
                        <motion.div
                          key={a.name}
                          className="snap-center flex-shrink-0 w-[180px]"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Card
                            variant={isSelected ? 'glass-strong' : 'glass'}
                            selected={false}
                            onTap={() => handleArmorSelect(a)}
                            padding="md"
                            className={`h-full ${isSelected ? 'glass-selected' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-glass-primary truncate">{a.name}</h4>
                              {isSelected && <Check size={16} className="text-emerald-300 flex-shrink-0" />}
                            </div>
                            <div className="flex gap-2 mt-1 text-xs text-glass-muted flex-wrap">
                              <span>Score: {a.base_score}</span>
                              <span>&bull;</span>
                              <span>{a.base_thresholds}</span>
                            </div>
                            {a.feat_text && (
                              <p className="text-xs text-amber-300/80 mt-2 line-clamp-2">{a.feat_text}</p>
                            )}
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
