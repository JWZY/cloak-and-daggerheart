import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Rows3, Square, Settings2 } from 'lucide-react'
import { OfficialCard, DOMAIN_COLORS } from '../components/cards/OfficialCard'
import { CardHand } from '../components/cards/CardHand'
import { Card } from '../components/ui/Card'

type DisplayMode = 'individual' | 'rail'
type CardTier = 'Foundation' | 'Specialization' | 'Mastery'

interface SampleCard {
  id: string
  title: string
  subtitle: string
  domain: string
  tier: CardTier
  type: string
  level: number
  recall: string
  text: string
  backgroundImage?: string
}

// Sample cards for testing - based on Wizard domain cards
const SAMPLE_CARDS: SampleCard[] = [
  {
    id: '1',
    title: 'Arcane Insight',
    subtitle: 'School of Knowledge',
    domain: 'Codex',
    tier: 'Foundation',
    type: 'Ability',
    level: 1,
    recall: '0',
    text: 'When you make an action roll using Knowledge, you can spend a Hope to add your Proficiency to the result.\n\n**Spend 2 Stress:** Gain advantage on the roll instead.',
  },
  {
    id: '2',
    title: 'Eldritch Blast',
    subtitle: 'School of War',
    domain: 'Arcana',
    tier: 'Foundation',
    type: 'Spell',
    level: 1,
    recall: '1',
    text: 'Make a Spellcast Roll against a target within far range. On a success, deal 2d8+2 magic damage.\n\n**Spend Hope:** The spell arcs to a second target within close range of the first, dealing 1d8 damage.',
    backgroundImage: '/images/cards/official/school-of-war.webp',
  },
  {
    id: '3',
    title: 'Mystic Ward',
    subtitle: 'School of Knowledge',
    domain: 'Sage',
    tier: 'Specialization',
    type: 'Ability',
    level: 3,
    recall: '2',
    text: 'When an ally within close range would take damage, you can spend a Hope to reduce that damage by your Proficiency + Knowledge modifier.\n\n**Recall:** You can use this ability again this scene.',
    backgroundImage: '/images/cards/official/school-of-knowledge.webp',
  },
  {
    id: '4',
    title: 'Reality Warp',
    subtitle: 'School of Knowledge',
    domain: 'Arcana',
    tier: 'Mastery',
    type: 'Spell',
    level: 7,
    recall: '4',
    text: 'You bend the fabric of reality around you. Choose one:\n• Teleport yourself and up to 5 willing creatures within close range to any location you can see within far range\n• Create an illusory duplicate of yourself that lasts until the end of your next turn\n• Grant yourself and all allies within close range advantage on their next action roll',
  },
]

interface CardDesignLabProps {
  onBack?: () => void
}

export function CardDesignLab({ onBack }: CardDesignLabProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('individual')
  const [selectedCardIndex, setSelectedCardIndex] = useState(0)
  const [cardScale, setCardScale] = useState(1)
  const [showControls, setShowControls] = useState(true)

  const selectedCard = SAMPLE_CARDS[selectedCardIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="glass-strong px-4 py-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 -ml-2 text-white/70 hover:text-white"
            >
              <ArrowLeft size={24} />
            </motion.button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Card Design Lab</h1>
            <p className="text-sm text-white/60">Iterate on card designs</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-lg ${showControls ? 'bg-white/20 text-white' : 'text-white/50'}`}
          >
            <Settings2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Display Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setDisplayMode('individual')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  displayMode === 'individual'
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Square size={16} />
                Individual
              </button>
              <button
                onClick={() => setDisplayMode('rail')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  displayMode === 'rail'
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Rows3 size={16} />
                Rail
              </button>
            </div>

            {/* Scale Slider (Individual mode only) */}
            {displayMode === 'individual' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Scale:</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.1"
                  value={cardScale}
                  onChange={(e) => setCardScale(parseFloat(e.target.value))}
                  className="w-24 accent-white"
                />
                <span className="text-xs text-white/70 w-8">{cardScale}x</span>
              </div>
            )}

            {/* Card Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">Card:</span>
              <select
                value={selectedCardIndex}
                onChange={(e) => setSelectedCardIndex(parseInt(e.target.value))}
                className="bg-white/10 text-white text-sm rounded-lg px-2 py-1 border border-white/20"
              >
                {SAMPLE_CARDS.map((card, index) => (
                  <option key={card.id} value={index} className="bg-gray-800">
                    {card.title} ({card.tier})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {displayMode === 'individual' ? (
          /* Individual Card View */
          <div className="flex flex-col items-center gap-8">
            {/* Card Preview */}
            <div className="flex justify-center py-8">
              <OfficialCard
                title={selectedCard.title}
                subtitle={selectedCard.subtitle}
                domain={selectedCard.domain}
                tier={selectedCard.tier}
                type={selectedCard.type}
                level={selectedCard.level}
                recall={selectedCard.recall}
                scale={cardScale}
                backgroundImage={selectedCard.backgroundImage}
              >
                <CardText text={selectedCard.text} />
              </OfficialCard>
            </div>

            {/* Card Details Panel */}
            <Card variant="glass" padding="md" className="w-full max-w-md">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Card Properties</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Domain</span>
                  <span className="text-white flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: DOMAIN_COLORS[selectedCard.domain] }}
                    />
                    {selectedCard.domain}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Tier</span>
                  <span className="text-white">{selectedCard.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Type</span>
                  <span className="text-white">{selectedCard.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Level</span>
                  <span className="text-white">{selectedCard.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Recall</span>
                  <span className="text-white">{selectedCard.recall}</span>
                </div>
              </div>
            </Card>

            {/* Domain Color Palette */}
            <Card variant="glass" padding="md" className="w-full max-w-md">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Domain Colors</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
                  <div
                    key={domain}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: `${color}30` }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-white/80">{domain}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          /* Rail View */
          <div className="space-y-8">
            {/* Full-size Rail */}
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-3 px-2">Full Size Rail</h3>
              <CardHand>
                {SAMPLE_CARDS.map((card) => (
                  <OfficialCard
                    key={card.id}
                    title={card.title}
                    subtitle={card.subtitle}
                    domain={card.domain}
                    tier={card.tier}
                    type={card.type}
                    level={card.level}
                    recall={card.recall}
                    scale={0.65}
                    backgroundImage={card.backgroundImage}
                    onClick={() => {
                      setSelectedCardIndex(SAMPLE_CARDS.findIndex(c => c.id === card.id))
                      setDisplayMode('individual')
                    }}
                  >
                    <CardText text={card.text} />
                  </OfficialCard>
                ))}
              </CardHand>
            </div>

            {/* Compact Rail */}
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-3 px-2">Compact Rail (0.5x)</h3>
              <CardHand>
                {SAMPLE_CARDS.map((card) => (
                  <OfficialCard
                    key={card.id}
                    title={card.title}
                    subtitle={card.subtitle}
                    domain={card.domain}
                    tier={card.tier}
                    scale={0.5}
                    backgroundImage={card.backgroundImage}
                    onClick={() => {
                      setSelectedCardIndex(SAMPLE_CARDS.findIndex(c => c.id === card.id))
                      setDisplayMode('individual')
                    }}
                  >
                    <CardText text={card.text} />
                  </OfficialCard>
                ))}
              </CardHand>
            </div>

            {/* Grid View */}
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-3 px-2">Grid View</h3>
              <div className="grid grid-cols-2 gap-4 px-2">
                {SAMPLE_CARDS.map((card) => (
                  <OfficialCard
                    key={card.id}
                    title={card.title}
                    subtitle={card.subtitle}
                    domain={card.domain}
                    tier={card.tier}
                    scale={0.45}
                    backgroundImage={card.backgroundImage}
                    onClick={() => {
                      setSelectedCardIndex(SAMPLE_CARDS.findIndex(c => c.id === card.id))
                      setDisplayMode('individual')
                    }}
                  >
                    <CardText text={card.text} />
                  </OfficialCard>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple text parser for card text with bold markers
function CardText({ text }: { text: string }) {
  const lines = text.split('\n')

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return null

        // Parse **bold** markers
        const parts = line.split(/(\*\*[^*]+\*\*)/)

        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={j} className="font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                )
              }
              return part
            })}
          </p>
        )
      })}
    </div>
  )
}
