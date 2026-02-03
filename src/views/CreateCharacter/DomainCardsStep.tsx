import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { DomainCard } from '../../components/cards/DomainCard'
import { Markdown } from '../../components/ui/Markdown'
import { wizardLevel1Cards, getWizardCardCount } from '../../data/srd'
import type { DomainCard as DomainCardType, WizardSubclass } from '../../types/character'

// Scale for full-size cards in horizontal rails
const CARD_SCALE = 0.55

// Horizontal scrolling rail for full-size cards
function HorizontalCardRail({ children }: { children: ReactNode }) {
  return (
    <div
      className="scrollbar-hide -mx-4"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        gap: '12px',
        overflowX: 'auto',
        paddingTop: '8px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  )
}

interface DomainCardsStepProps {
  subclass: WizardSubclass
  selected: DomainCardType[]
  onSelect: (cards: DomainCardType[]) => void
}

// Helper to convert card name to image path
function getDomainCardImage(cardName: string): string {
  const basePath = import.meta.env.BASE_URL || '/'
  const slug = cardName.toLowerCase().replace(/\s+/g, '-')
  return `${basePath}images/cards/domains/${slug}.avif`
}

export function DomainCardsStep({
  subclass,
  selected,
  onSelect,
}: DomainCardsStepProps) {
  const [detailCard, setDetailCard] = useState<DomainCardType | null>(null)
  const requiredCount = getWizardCardCount(subclass)

  const toggleCard = (card: DomainCardType) => {
    const isSelected = selected.some((c) => c.name === card.name)
    if (isSelected) {
      onSelect(selected.filter((c) => c.name !== card.name))
    } else if (selected.length < requiredCount) {
      onSelect([...selected, card])
    }
  }

  const isComplete = selected.length === requiredCount

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-glass-primary">Choose Domain Cards</h2>
        <p className="text-glass-secondary text-sm mt-1">
          Select {requiredCount} level 1 cards from Codex or Splendor domains.
        </p>
      </div>

      {/* Selection counter pill */}
      <div className="mb-4">
        <span
          className={`glass-counter ${
            isComplete ? 'text-emerald-300' : 'text-white'
          }`}
        >
          <span className="font-bold">{selected.length}</span>
          <span className="text-glass-muted">/</span>
          <span>{requiredCount}</span>
          <span className="text-glass-muted ml-1">selected</span>
        </span>
      </div>

      {/* Selected Cards Preview */}
      {selected.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Selected Cards</h3>
          <HorizontalCardRail>
            {selected.map((card) => (
              <DomainCard
                key={card.name}
                title={card.name}
                subtitle={`${card.domain} Domain`}
                domain={card.domain}
                type={card.type}
                level={card.level}
                recall={card.recall}
                artworkSrc={getDomainCardImage(card.name)}
                selected={true}
                scale={CARD_SCALE}
                onClick={() => toggleCard(card)}
              >
                <Markdown>{card.text}</Markdown>
              </DomainCard>
            ))}
          </HorizontalCardRail>
        </div>
      )}

      {/* Available Cards - shown as a grid list for easier selection */}
      <div className="flex-1 overflow-auto space-y-2">
        <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">Available Cards</h3>
        {wizardLevel1Cards
          .filter((card) => !selected.some((c) => c.name === card.name))
          .map((card) => {
            const isDisabled = selected.length >= requiredCount

            return (
              <motion.div
                key={card.name}
                whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                onClick={() => !isDisabled && toggleCard(card)}
                className={`relative rounded-xl p-3 cursor-pointer transition-all ${
                  isDisabled ? 'opacity-40' : ''
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{card.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: card.domain === 'Codex' ? 'rgba(30, 58, 95, 0.5)' : 'rgba(139, 105, 20, 0.5)',
                          color: card.domain === 'Codex' ? '#93c5fd' : '#fcd34d',
                          border: card.domain === 'Codex' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                        }}
                      >
                        {card.domain}
                      </span>
                      <span className="text-xs text-white/50">{card.type}</span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDetailCard(card)
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-full"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Info size={12} className="text-white/70" />
                  </motion.button>
                </div>
                <p className="text-sm text-white/60 line-clamp-2 mt-2">
                  <Markdown>{card.text}</Markdown>
                </p>
              </motion.div>
            )
          })}
      </div>

      {/* Detail Lightbox */}
      <AnimatePresence>
        {detailCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailCard(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '24px',
            }}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setDetailCard(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </motion.button>

            {/* Card display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-4"
            >
              <DomainCard
                title={detailCard.name}
                subtitle={`${detailCard.domain} Domain`}
                domain={detailCard.domain}
                type={detailCard.type}
                level={detailCard.level}
                recall={detailCard.recall}
                artworkSrc={getDomainCardImage(detailCard.name)}
                scale={0.85}
              >
                <Markdown>{detailCard.text}</Markdown>
              </DomainCard>

              <Button
                onClick={() => {
                  toggleCard(detailCard)
                  setDetailCard(null)
                }}
                variant="glass-primary"
                className="w-full max-w-[306px]"
                disabled={
                  !selected.some((c) => c.name === detailCard.name) &&
                  selected.length >= requiredCount
                }
              >
                {selected.some((c) => c.name === detailCard.name)
                  ? 'Remove Card'
                  : 'Select Card'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
