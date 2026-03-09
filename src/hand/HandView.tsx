import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { goldAccent, typeSubtitle, typeBody } from '../ui/typography'
import { warmGlass, RADIUS_MENU, RADIUS_PILL } from '../design-system/tokens/surfaces'
import { LevelUpWizard } from '../level-up/LevelUpWizard'
import { CardZoomOverlay } from './CardZoomOverlay'
import { DesktopLayout } from './DesktopLayout'
import { MobileLayout } from './MobileLayout'
import { useIsDesktop } from './useIsDesktop'
import { useCardZoom } from '../cards/useCardZoom'
import { DOMAIN_COLORS } from '../cards/domain-colors'
import { getClassForSubclass } from '../data/srd'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

export interface HandViewProps {
  character: Character
  onEditCharacter?: () => void
}

/**
 * Derive a subtle accent color from the character's primary domain.
 * School of Knowledge -> Codex blue, School of War -> Splendor gold.
 */
function getAccentColor(character: Character): string {
  const classData = getClassForSubclass(character.subclass)
  if (!classData) return goldAccent // fallback gold
  return DOMAIN_COLORS[classData.domain_1] ?? goldAccent
}

type TabId = 'cards' | 'actions'

const TABS: { id: TabId; label: string }[] = [
  { id: 'cards', label: 'Cards' },
  { id: 'actions', label: 'Actions' },
]

function GearMenu({
  open,
  onClose,
  onLevelUp,
  onEditCharacter,
  onRequestDelete,
}: {
  open: boolean
  onClose: () => void
  onLevelUp: () => void
  onEditCharacter: () => void
  onRequestDelete: () => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  if (!open) return null

  const items = [
    { label: 'Short Rest', action: () => {} },
    { label: 'Long Rest', action: () => {} },
    { label: 'Level Up', action: onLevelUp },
    { label: 'Edit Character', action: onEditCharacter },
  ]

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
      style={{
        ...floatingPillStyle,
        position: 'absolute',
        bottom: '100%',
        right: 0,
        marginBottom: 10,
        minWidth: 180,
        borderRadius: RADIUS_MENU,
        padding: '6px',
        zIndex: 60,
        height: 'auto',
        flexDirection: 'column' as const,
        transformOrigin: 'bottom right',
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.action()
            onClose()
          }}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            background: 'transparent',
            border: 'none',
            borderRadius: 14,
            color: 'var(--text-primary)',
            textAlign: 'left',
            cursor: 'pointer',
            ...typeSubtitle,
            fontSize: 15,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {item.label}
        </button>
      ))}

      {/* Delete Character — distinct destructive style */}
      <button
        onClick={() => {
          onClose()
          onRequestDelete()
        }}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          borderRadius: 14,
          color: 'rgba(220, 80, 80, 0.85)',
          textAlign: 'left',
          cursor: 'pointer',
          ...typeSubtitle,
          fontSize: 15,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(220, 80, 80, 0.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        Delete Character
      </button>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Hold-to-Delete Confirmation Modal
// ---------------------------------------------------------------------------

const HOLD_DURATION_MS = 1500

function DeleteConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const holdStart = useRef<number>(0)
  const rafRef = useRef<number>(0)

  const startHold = useCallback(() => {
    setHolding(true)
    holdStart.current = Date.now()

    const tick = () => {
      const elapsed = Date.now() - holdStart.current
      const pct = Math.min(elapsed / HOLD_DURATION_MS, 1)
      setProgress(pct)
      if (pct >= 1) {
        onConfirm()
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [onConfirm])

  const cancelHold = useCallback(() => {
    setHolding(false)
    setProgress(0)
    cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...floatingPillStyle,
          height: 'auto',
          flexDirection: 'column' as const,
          borderRadius: RADIUS_MENU,
          padding: '24px',
          width: 280,
          gap: 16,
          textAlign: 'center',
        }}
      >
        <span
          className="gold-text"
          style={{ ...typeSubtitle, fontSize: 17 }}
        >
          Delete Character?
        </span>
        <span style={{ ...typeBody, color: 'var(--text-muted)', fontSize: 13 }}>
          This cannot be undone. Hold the button below to confirm.
        </span>

        {/* Hold-to-delete button */}
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          onTouchCancel={cancelHold}
          style={{
            position: 'relative',
            width: '100%',
            height: 44,
            borderRadius: 12,
            border: '1px solid rgba(220, 80, 80, 0.3)',
            background: 'transparent',
            overflow: 'hidden',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {/* Progress fill */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(220, 80, 80, 0.25)',
              transformOrigin: 'left',
              transform: `scaleX(${progress})`,
              transition: holding ? 'none' : 'transform 0.2s ease-out',
              borderRadius: 11,
            }}
          />
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              ...typeSubtitle,
              fontSize: 14,
              color: 'rgba(220, 80, 80, 0.9)',
            }}
          >
            {holding ? 'Deleting…' : 'Hold to Delete'}
          </span>
        </button>

        {/* Cancel */}
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            ...typeSubtitle,
            fontSize: 14,
            color: 'var(--text-muted)',
            padding: '4px 0',
          }}
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )
}

const floatingPillStyle = {
  height: 52,
  display: 'flex' as const,
  alignItems: 'center' as const,
  ...warmGlass,
  borderRadius: RADIUS_PILL,
}

function pillBtnStyle(active: boolean) {
  return {
    position: 'relative' as const,
    height: 40,
    padding: '0 16px',
    borderRadius: 9999,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    opacity: active ? 1 : 0.7,
  }
}

function pillLabelStyle(active: boolean) {
  return {
    ...typeSubtitle,
    fontSize: 15,
    position: 'relative' as const,
    zIndex: 1,
    color: active ? 'var(--gold)' : 'var(--text-muted)',
  }
}

export function HandView({ character, onEditCharacter }: HandViewProps) {
  const setActiveCharacter = useCharacterStore((s) => s.setActiveCharacter)
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter)
  const { zoomedCard, openZoom, closeZoom } = useCardZoom()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('cards')
  const [showGearMenu, setShowGearMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isDesktop = useIsDesktop()

  const accentColor = useMemo(() => getAccentColor(character), [character])

  const handleHeroTap = useCallback(() => {
    openZoom('hero-card')
  }, [openZoom])

  const handleCardTap = useCallback(
    (cardName: string) => {
      if (cardName === 'ancestry' || cardName === 'community') {
        openZoom(cardName)
      } else {
        openZoom(`domain-${cardName}`)
      }
    },
    [openZoom]
  )

  const handleLevelUp = useCallback(() => {
    setShowGearMenu(false)
    setShowLevelUp(true)
  }, [])

  return (
    <div
      className="relative flex flex-col"
      style={{
        height: '100dvh',
        background: 'var(--bg-page)',
        paddingTop: 'env(safe-area-inset-top)',
        ['--accent-color' as string]: accentColor,
        ['--accent-color-15' as string]: `${accentColor}26`,
        ['--accent-color-30' as string]: `${accentColor}4D`,
      }}
    >
      {/* Scrollable tab content */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 88,
        }}
      >
        {activeTab === 'cards' ? (
          isDesktop ? (
            <DesktopLayout
              character={character}
              accentColor={accentColor}
              onHeroTap={handleHeroTap}
              onCardTap={handleCardTap}
              onLevelUp={handleLevelUp}
            />
          ) : (
            <MobileLayout
              character={character}
              accentColor={accentColor}
              onHeroTap={handleHeroTap}
              onCardTap={handleCardTap}
              onLevelUp={handleLevelUp}
            />
          )
        ) : (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: '60vh' }}
          >
            <p style={{ ...typeBody, color: 'var(--text-muted)' }}>
              Actions panel coming soon
            </p>
          </div>
        )}
      </div>

      {/* Floating bottom bar — [Back] [Cards · Actions] [Menu] */}
      <div
        className="flex items-center justify-center"
        style={{
          position: 'fixed',
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          left: 0,
          right: 0,
          zIndex: 50,
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {/* Back */}
        <button
          data-testid="back-to-select"
          onClick={() => setActiveCharacter(null)}
          style={{ ...floatingPillStyle, pointerEvents: 'auto', padding: '0 16px' }}
        >
          <span style={pillLabelStyle(false)}>Back</span>
        </button>

        {/* Center tabs */}
        <div
          className="flex items-center"
          style={{ ...floatingPillStyle, pointerEvents: 'auto', padding: '0 6px', gap: 2 }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={pillBtnStyle(active)}
              >
                {active && (
                  <motion.div
                    layoutId="pill-active-bg"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 9999,
                      background: 'rgba(255,255,255,0.08)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span style={pillLabelStyle(active)}>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Menu */}
        <div style={{ position: 'relative', pointerEvents: 'auto' }}>
          <div style={{ ...floatingPillStyle, padding: '0 16px' }}>
            <button
              onClick={() => setShowGearMenu((prev) => !prev)}
              style={{
                ...pillBtnStyle(false),
                padding: 0,
              }}
            >
              <span style={pillLabelStyle(false)}>Menu</span>
            </button>
          </div>
          <AnimatePresence>
            {showGearMenu && (
              <GearMenu
                open={showGearMenu}
                onClose={() => setShowGearMenu(false)}
                onLevelUp={handleLevelUp}
                onEditCharacter={() => {
                  setShowGearMenu(false)
                  onEditCharacter?.()
                }}
                onRequestDelete={() => setShowDeleteConfirm(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Zoom Overlays */}
      <CardZoomOverlay
        character={character}
        zoomedCard={zoomedCard}
        onClose={closeZoom}
      />

      {/* Level Up Wizard Overlay */}
      {showLevelUp && (
        <LevelUpWizard
          character={character}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() => {
            deleteCharacter(character.id)
            setActiveCharacter(null)
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}
