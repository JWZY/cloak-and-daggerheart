import { motion } from 'framer-motion'
import { SubclassCard } from '../../components/cards/SubclassCard'
import { schoolOfKnowledge, schoolOfWar, wizard } from '../../data/srd'
import type { WizardSubclass } from '../../types/character'

interface SubclassStepProps {
  selected: WizardSubclass | undefined
  onSelect: (subclass: WizardSubclass) => void
}

// Helper to get subclass image path
function getSubclassImage(subclassName: string): string {
  const basePath = import.meta.env.BASE_URL || '/'
  const slug = subclassName.toLowerCase().replace(/\s+/g, '-')
  return `${basePath}images/cards/subclass/${slug}.webp`
}

export function SubclassStep({ selected, onSelect }: SubclassStepProps) {
  const subclasses = [
    {
      data: schoolOfKnowledge,
      highlight: 'Extra domain card, doubled Experience bonus',
      domainColor: '#4e345b', // Deep purple
      subtitle: 'Arcane Scholar',
    },
    {
      data: schoolOfWar,
      highlight: 'Extra HP slot, bonus magic damage on Fear rolls',
      domainColor: '#8b2942', // Deep red
      subtitle: 'Battle Mage',
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-glass-primary">Subclass</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Choose your school. As a Wizard, you follow one of two magical schools.
        </p>
      </div>

      {/* Class info banner with purple tint */}
      <div className="mb-6 glass rounded-xl p-3 bg-gradient-to-r from-indigo-500/10 to-transparent">
        <h3 className="font-semibold text-glass-primary">Wizard</h3>
        <p className="text-sm text-glass-secondary mt-1">
          Domains: Codex + Splendor &bull; HP: {wizard.hp} &bull; Evasion: {wizard.evasion}
        </p>
      </div>

      {/* Subclass Cards - Horizontal scroll with snap */}
      <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
        <div className="flex gap-4 pb-4">
          {subclasses.map(({ data, highlight, domainColor, subtitle }) => {
            const isSelected = selected === data.name
            const hasSelection = !!selected
            const cardOpacity = hasSelection ? (isSelected ? 1 : 0.5) : 1

            return (
              <motion.div
                key={data.name}
                className="snap-center flex-shrink-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: cardOpacity, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  style={{
                    borderRadius: '24px',
                    padding: '4px',
                    background: isSelected
                      ? `linear-gradient(135deg, ${domainColor}, ${domainColor}80)`
                      : 'transparent',
                    boxShadow: isSelected
                      ? `0 0 20px ${domainColor}60, 0 8px 32px rgba(0,0,0,0.3)`
                      : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <SubclassCard
                    title={data.name}
                    subtitle={subtitle}
                    className="Wizard"
                    domainColor={domainColor}
                    artworkSrc={getSubclassImage(data.name)}
                    scale={0.75}
                    onClick={() => onSelect(data.name as WizardSubclass)}
                  >
                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3">{data.description}</p>

                    {/* Highlight badge */}
                    <div
                      className="mb-3 px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: `${domainColor}15`,
                        border: `1px solid ${domainColor}30`,
                      }}
                    >
                      <span className="text-sm font-medium" style={{ color: domainColor }}>
                        {highlight}
                      </span>
                    </div>

                    {/* Foundations */}
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Foundations
                      </h4>
                      {data.foundations.map((foundation) => (
                        <div
                          key={foundation.name}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${domainColor}08` }}
                        >
                          <h5 className="text-sm font-semibold" style={{ color: domainColor }}>
                            {foundation.name}
                          </h5>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {foundation.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </SubclassCard>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
