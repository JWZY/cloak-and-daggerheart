import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { goldAccent, typeSubtitle, typeBody } from '../ui/typography'
import { ChevronLeft, Settings } from 'lucide-react'
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
}: {
  open: boolean
  onClose: () => void
  onLevelUp: () => void
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
    { label: 'Edit Character', action: () => console.log('Edit Character') },
    { label: 'Export', action: () => console.log('Export') },
    { label: 'Level Up', action: onLevelUp },
    { label: 'Short Rest', action: () => console.log('Short Rest') },
    { label: 'Long Rest', action: () => console.log('Long Rest') },
  ]

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        bottom: '100%',
        right: 0,
        marginBottom: 8,
        minWidth: 160,
        background: 'rgba(30, 28, 24, 0.95)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        border: '1px solid var(--gold-muted)',
        borderRadius: 12,
        padding: '4px 0',
        zIndex: 60,
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
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: typeBody.fontFamily,
            fontSize: 14,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-overlay)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function HandView({ character }: HandViewProps) {
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter)
  const { zoomedCard, openZoom, closeZoom } = useCardZoom()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('cards')
  const [showGearMenu, setShowGearMenu] = useState(false)
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
          paddingBottom: 72,
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

      {/* Floating bottom bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          background: 'rgba(20, 18, 15, 0.85)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          borderTop: '1px solid var(--gold-muted)',
          zIndex: 50,
        }}
      >
        {/* Back button */}
        <button
          data-testid="delete-character"
          onClick={() => deleteCharacter(character.id)}
          className="flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'transparent',
            border: '1px solid var(--gold-muted)',
            color: 'var(--gold)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Center tabs */}
        <div
          className="flex items-center relative"
          style={{ gap: 24 }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...typeSubtitle,
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                padding: '8px 4px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 4,
                    right: 4,
                    height: 2,
                    borderRadius: 1,
                    background: 'var(--gold)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Gear button */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setShowGearMenu((prev) => !prev)}
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'transparent',
              border: '1px solid var(--gold-muted)',
              color: 'var(--gold)',
              cursor: 'pointer',
            }}
          >
            <Settings size={18} />
          </button>
          <GearMenu
            open={showGearMenu}
            onClose={() => setShowGearMenu(false)}
            onLevelUp={handleLevelUp}
          />
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
    </div>
  )
}
