import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { typeTitle, typeSubtitle, typeBody } from '../ui/typography'
import { FlatDomainCard } from '../cards/FlatDomainCard'
import { DomainCard } from '../cards/DomainCard'
import { CardZoom } from '../cards/CardZoom'
import { useCardZoom } from '../cards/useCardZoom'
import { getDomainCards, parseAbilityText } from '../data/card-mapper'
import { SectionHeader } from '../ui/SectionHeader'
import { GameBadge } from '../ui/GameBadge'
import { GameButton } from '../ui/GameButton'
import { DOMAIN_COLORS } from '../cards/domain-colors'

// ---------------------------------------------------------------------------
// PickerLab — Design lab page for exploring the "flattened card" picker
// Accessible at ?pickers
// ---------------------------------------------------------------------------

const PAGE_BG = 'var(--bg-page)'
const WARM = 'var(--text-primary)'
const MAX_CARDS = 2
const DEMO_CLASS = 'Wizard' // Codex + Splendor domains

type ViewMode = 'flat' | 'full' | 'split'

export default function PickerLab() {
  const [selected, setSelected] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('flat')
  const { zoomedCard, openZoom, closeZoom } = useCardZoom()

  const domainCards = getDomainCards(DEMO_CLASS)
  const maxSelected = selected.length >= MAX_CARDS

  const handleTap = (name: string) => {
    if (selected.includes(name)) {
      // Already selected — expand into full card
      openZoom(`domain-${name}`)
    } else if (selected.length < MAX_CARDS) {
      // Not selected yet — select it
      setSelected((prev) => [...prev, name])
    }
  }

  return (
    <div
      style={{
        height: '100dvh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: PAGE_BG,
        color: WARM,
        fontFamily: typeBody.fontFamily,
      }}
    >
      {/* Sticky header */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--gold-muted)',
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
            ...typeSubtitle,
            color: 'var(--gold)',
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
                ...typeSubtitle,
                fontSize: 12,
                padding: '4px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background:
                  viewMode === mode
                    ? 'var(--gold-muted)'
                    : 'var(--surface-faint)',
                color:
                  viewMode === mode
                    ? 'var(--gold)'
                    : 'var(--text-muted)',
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
              ...typeTitle,
              fontSize: 28,
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            Domain Card Picker
          </h1>
          <p
            style={{
              fontFamily: typeBody.fontFamily,
              fontSize: 13,
              color: 'var(--gold-secondary)',
              lineHeight: 1.5,
              maxWidth: 420,
              margin: '0 auto',
            }}
          >
            Exploring compact "flattened" card layouts for mobile-friendly
            domain card selection. Demo uses{' '}
            <strong style={{ color: 'var(--gold)' }}>{DEMO_CLASS}</strong>{' '}
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
                onToggle={handleTap}
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
                onToggle={handleTap}
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
                onToggle={handleTap}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card zoom overlay */}
        <AnimatePresence>
          {zoomedCard && (
            <CardZoom layoutId={zoomedCard} onClose={closeZoom}>
              {domainCards
                .filter((c) => `domain-${c.props.title}` === zoomedCard)
                .map(({ props, bodyText }) => (
                  <DomainCard key={props.title} {...props}>
                    {parseAbilityText(bodyText).map((ability, i) => (
                      <p key={i} className="mb-1">
                        {ability.name && <strong>{ability.name}: </strong>}
                        {ability.text}
                      </p>
                    ))}
                  </DomainCard>
                ))}
            </CardZoom>
          )}
        </AnimatePresence>

        {/* Design notes */}
        <div
          style={{
            marginTop: 48,
            padding: 20,
            borderRadius: 12,
            border: '1px solid var(--gold-muted)',
            background: 'var(--gold-muted)',
          }}
        >
          <h3
            style={{
              ...typeSubtitle,
              color: 'var(--gold)',
              marginBottom: 12,
            }}
          >
            Design Notes
          </h3>
          <ul
            style={{
              fontSize: 12.5,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              paddingLeft: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>
                Artwork bleed with gradient fade:
              </strong>{' '}
              ~130px artwork bleeds from the left with a smooth rightward
              gradient dissolve into the page background, replacing the old
              80px hard-edged thumbnail.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>
                Pennant banner:
              </strong>{' '}
              The full DomainCard banner (level + domain icon) is scaled to
              0.55 and positioned top-left within the artwork area.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>
                Name-only text:
              </strong>{' '}
              EB Garamond 16px small-caps for fast scanning. Gold on
              selected, warm on unselected. No metadata or ability text.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>
                Tap to select, tap again to expand:
              </strong>{' '}
              First tap selects the card. Tapping an already-selected card
              opens it as a full-size DomainCard in a zoom overlay.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>
                Selection state:
              </strong>{' '}
              Gold glow + gold border + checkmark circle. Unchanged from
              previous design.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>
                Split view:
              </strong>{' '}
              Still shows flat cards on left and full cards on right for
              side-by-side comparison.
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
      {domainCards.map(({ props }) => {
        const isSelected = selected.includes(props.title)
        const isDimmed = maxSelected && !isSelected

        return (
          <FlatDomainCard
            key={props.title}
            title={props.title}
            domain={props.domain}
            level={props.level}
            recall={props.recall}
            artworkSrc={props.artworkSrc}
            layoutId={`domain-${props.title}`}
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
            ...typeSubtitle,
            color: 'var(--gold-secondary)',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Flat Cards (proposed)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {domainCards.map(({ props }) => {
            const isSelected = selected.includes(props.title)
            const isDimmed = maxSelected && !isSelected

            return (
              <FlatDomainCard
                key={props.title}
                title={props.title}
                domain={props.domain}
                level={props.level}
                recall={props.recall}
                artworkSrc={props.artworkSrc}
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
            ...typeSubtitle,
            color: 'var(--gold-secondary)',
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
