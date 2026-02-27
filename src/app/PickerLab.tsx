import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlatDomainCard } from '../cards/FlatDomainCard'
import { DomainCard } from '../cards/DomainCard'
import { getDomainCards, parseAbilityText } from '../data/card-mapper'
import { SectionHeader } from '../ui/SectionHeader'
import { GameBadge } from '../ui/GameBadge'
import { GameButton } from '../ui/GameButton'
import { DOMAIN_COLORS } from '../cards/domain-colors'

// ---------------------------------------------------------------------------
// PickerLab — Design lab page for exploring the "flattened card" picker
// Accessible at ?pickers
// ---------------------------------------------------------------------------

const PAGE_BG = '#03070d'
const WARM = 'rgba(212, 207, 199, 0.8)'
const MAX_CARDS = 2
const DEMO_CLASS = 'Wizard' // Codex + Splendor domains

type ViewMode = 'flat' | 'full' | 'split'

export default function PickerLab() {
  const [selected, setSelected] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('flat')

  const domainCards = getDomainCards(DEMO_CLASS)
  const maxSelected = selected.length >= MAX_CARDS

  const toggleCard = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : prev.length < MAX_CARDS
          ? [...prev, name]
          : prev,
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        color: WARM,
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      {/* Sticky header */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(3, 7, 13, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(231, 186, 144, 0.12)',
          padding: '10px 24px',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 13,
            fontWeight: 600,
            fontVariant: 'small-caps',
            letterSpacing: '0.06em',
            color: '#e7ba90',
          }}
        >
          Picker Lab
        </span>

        <div style={{ display: 'flex', gap: 4 }}>
          {(['flat', 'full', 'split'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 12,
                fontWeight: 600,
                fontVariant: 'small-caps',
                letterSpacing: '0.04em',
                padding: '4px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background:
                  viewMode === mode
                    ? 'rgba(231, 186, 144, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                color:
                  viewMode === mode
                    ? '#e7ba90'
                    : 'rgba(212, 207, 199, 0.5)',
                transition: 'all 0.15s ease',
              }}
            >
              {mode === 'flat'
                ? 'Flat Cards'
                : mode === 'full'
                  ? 'Full Cards'
                  : 'Side by Side'}
            </button>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 16px 120px' }}>
        {/* Title & description */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1
            className="gold-text gold-text-shadow"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 28,
              fontWeight: 500,
              fontVariant: 'small-caps',
              letterSpacing: '0.04em',
              marginBottom: 8,
            }}
          >
            Domain Card Picker
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 13,
              color: 'rgba(231, 186, 144, 0.5)',
              lineHeight: 1.5,
              maxWidth: 420,
              margin: '0 auto',
            }}
          >
            Exploring compact "flattened" card layouts for mobile-friendly
            domain card selection. Demo uses{' '}
            <strong style={{ color: 'rgba(231, 186, 144, 0.7)' }}>{DEMO_CLASS}</strong>{' '}
            ({domainCards.length} cards from{' '}
            <GameBadge color={DOMAIN_COLORS.Codex}>Codex</GameBadge>{' '}
            <GameBadge color={DOMAIN_COLORS.Splendor}>Splendor</GameBadge>)
          </p>
        </div>

        {/* Selection counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div className="w-full max-w-xs">
            <SectionHeader>Choose Your Domain Cards</SectionHeader>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <GameBadge>
              {selected.length} of {MAX_CARDS} selected
            </GameBadge>
            {selected.length > 0 && (
              <GameButton
                variant="ghost"
                size="sm"
                onClick={() => setSelected([])}
              >
                Clear
              </GameButton>
            )}
          </div>
        </div>

        {/* View modes */}
        <AnimatePresence mode="wait">
          {viewMode === 'flat' && (
            <motion.div
              key="flat"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <FlatCardList
                domainCards={domainCards}
                selected={selected}
                maxSelected={maxSelected}
                onToggle={toggleCard}
              />
            </motion.div>
          )}

          {viewMode === 'full' && (
            <motion.div
              key="full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <FullCardGrid
                domainCards={domainCards}
                selected={selected}
                maxSelected={maxSelected}
                onToggle={toggleCard}
              />
            </motion.div>
          )}

          {viewMode === 'split' && (
            <motion.div
              key="split"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SplitView
                domainCards={domainCards}
                selected={selected}
                maxSelected={maxSelected}
                onToggle={toggleCard}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Design notes */}
        <div
          style={{
            marginTop: 48,
            padding: 20,
            borderRadius: 12,
            border: '1px solid rgba(231, 186, 144, 0.1)',
            background: 'rgba(231, 186, 144, 0.02)',
          }}
        >
          <h3
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 15,
              fontWeight: 600,
              fontVariant: 'small-caps',
              letterSpacing: '0.04em',
              color: '#e7ba90',
              marginBottom: 12,
            }}
          >
            Design Notes
          </h3>
          <ul
            style={{
              fontSize: 12.5,
              lineHeight: 1.6,
              color: 'rgba(212, 207, 199, 0.6)',
              paddingLeft: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <li>
              <strong style={{ color: 'rgba(212, 207, 199, 0.8)' }}>
                Domain color stripe:
              </strong>{' '}
              3px left border in the domain's color serves as a quick visual
              grouping cue (Codex = navy, Splendor = gold).
            </li>
            <li>
              <strong style={{ color: 'rgba(212, 207, 199, 0.8)' }}>
                Artwork thumbnail (80px):
              </strong>{' '}
              Small enough to not dominate, large enough to show card art.
              Level number top-left, domain icon bottom-right.
            </li>
            <li>
              <strong style={{ color: 'rgba(212, 207, 199, 0.8)' }}>
                Body text clamped to 3 lines:
              </strong>{' '}
              Users can scan quickly without being overwhelmed. Full card can
              be viewed on tap in a future expansion.
            </li>
            <li>
              <strong style={{ color: 'rgba(212, 207, 199, 0.8)' }}>
                Recall badge:
              </strong>{' '}
              Square badge on the right edge with domain-tinted background.
              Recall 0 cards (Grimoires) omit it entirely.
            </li>
            <li>
              <strong style={{ color: 'rgba(212, 207, 199, 0.8)' }}>
                Selected state:
              </strong>{' '}
              Gold border + gold tinted background + checkmark circle. Matches
              the app's gold accent language rather than green outlines.
            </li>
            <li>
              <strong style={{ color: 'rgba(212, 207, 199, 0.8)' }}>
                Comparison:
              </strong>{' '}
              Toggle between flat, full-size, and split views to compare
              scannability. Flat cards show ~6 options in the viewport where
              full cards show ~1.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-views
// ---------------------------------------------------------------------------

interface CardListProps {
  domainCards: ReturnType<typeof getDomainCards>
  selected: string[]
  maxSelected: boolean
  onToggle: (name: string) => void
}

function FlatCardList({
  domainCards,
  selected,
  maxSelected,
  onToggle,
}: CardListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {domainCards.map(({ props, bodyText }) => {
        const isSelected = selected.includes(props.title)
        const isDimmed = maxSelected && !isSelected

        return (
          <FlatDomainCard
            key={props.title}
            title={props.title}
            domain={props.domain}
            type={props.type}
            level={props.level}
            recall={props.recall}
            artworkSrc={props.artworkSrc}
            abilities={parseAbilityText(bodyText)}
            selected={isSelected}
            dimmed={isDimmed}
            onClick={() => onToggle(props.title)}
          />
        )
      })}
    </div>
  )
}

function FullCardGrid({
  domainCards,
  selected,
  maxSelected,
  onToggle,
}: CardListProps) {
  return (
    <div
      className="flex gap-3 overflow-x-auto w-full pb-4 snap-x snap-mandatory"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {domainCards.map(({ props, bodyText }) => {
        const isSelected = selected.includes(props.title)
        const isDimmed = maxSelected && !isSelected

        return (
          <div
            key={props.title}
            className="snap-center shrink-0"
            style={{ width: 360 * 0.52, height: 508 * 0.52 }}
          >
            <div
              style={{
                transform: 'scale(0.52)',
                transformOrigin: 'top left',
                opacity: isDimmed ? 0.4 : 1,
                cursor: 'pointer',
              }}
              onClick={() => onToggle(props.title)}
            >
              <DomainCard {...props} selected={isSelected}>
                {parseAbilityText(bodyText).map((ability, i) => (
                  <p key={i} className="mb-1">
                    {ability.name && <strong>{ability.name}: </strong>}
                    {ability.text}
                  </p>
                ))}
              </DomainCard>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SplitView({
  domainCards,
  selected,
  maxSelected,
  onToggle,
}: CardListProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        alignItems: 'start',
      }}
    >
      {/* Left: Flat cards */}
      <div>
        <h3
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 13,
            fontWeight: 600,
            fontVariant: 'small-caps',
            letterSpacing: '0.06em',
            color: 'rgba(231, 186, 144, 0.6)',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Flat Cards (proposed)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {domainCards.map(({ props, bodyText }) => {
            const isSelected = selected.includes(props.title)
            const isDimmed = maxSelected && !isSelected

            return (
              <FlatDomainCard
                key={props.title}
                title={props.title}
                domain={props.domain}
                type={props.type}
                level={props.level}
                recall={props.recall}
                artworkSrc={props.artworkSrc}
                abilities={parseAbilityText(bodyText)}
                selected={isSelected}
                dimmed={isDimmed}
                onClick={() => onToggle(props.title)}
              />
            )
          })}
        </div>
      </div>

      {/* Right: Full cards (scrollable) */}
      <div>
        <h3
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 13,
            fontWeight: 600,
            fontVariant: 'small-caps',
            letterSpacing: '0.06em',
            color: 'rgba(231, 186, 144, 0.6)',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Full Cards (current)
        </h3>
        <div
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {domainCards.map(({ props, bodyText }) => {
            const isSelected = selected.includes(props.title)
            const isDimmed = maxSelected && !isSelected

            return (
              <div
                key={props.title}
                className="snap-center shrink-0"
                style={{ width: 360 * 0.44, height: 508 * 0.44 }}
              >
                <div
                  style={{
                    transform: 'scale(0.44)',
                    transformOrigin: 'top left',
                    opacity: isDimmed ? 0.4 : 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => onToggle(props.title)}
                >
                  <DomainCard {...props} selected={isSelected}>
                    {parseAbilityText(bodyText).map((ability, i) => (
                      <p key={i} className="mb-1">
                        {ability.name && <strong>{ability.name}: </strong>}
                        {ability.text}
                      </p>
                    ))}
                  </DomainCard>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
