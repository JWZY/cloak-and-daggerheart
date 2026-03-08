import { useRef, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FatesButton } from '../../ui/FatesButton'
import { typeTitle, typeMicro, typeBody, goldGradient, goldDark } from '../../ui/typography'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PickerItem {
  id: string
  name: string
  illustrationSrc: string
}

export interface FullBleedPickerProps {
  /** Step title shown at top (e.g. "Class", "Subclass") */
  title: string
  /** All items to choose from */
  items: PickerItem[]
  /** Currently focused item ID (whose illustration is shown as hero) */
  focusedId: string | null
  /** Array of selected item IDs (for multi-select; single-select = array of 0-1) */
  selectedIds: string[]
  /** Called when a thumbnail is tapped */
  onFocus: (id: string) => void
  /** Navigation callbacks */
  onBack?: () => void
  onConfirm: () => void
  /** Whether the confirm/select button is enabled */
  canConfirm: boolean
  /** Label for confirm button (default: "Select") */
  confirmLabel?: string
  /** Label for back button (default: "Cancel") */
  backLabel?: string
  /** Badge text shown above thumbnails (e.g. "2 of 4 selected") */
  badge?: string
  /** Label for the previous step (shown left of title) */
  prevStepLabel?: string
  /** Label for the next step (shown right of title) */
  nextStepLabel?: string
  /** Info content rendered over the gradient, above thumbnails */
  children: ReactNode
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const titleStyle: React.CSSProperties = {
  ...typeTitle,
  fontSize: 36,
  fontWeight: 400,
  margin: 0,
  lineHeight: 1,
}

const badgeStyle: React.CSSProperties = {
  ...typeBody,
  fontSize: 12,
  color: goldDark,
  textAlign: 'center',
  marginBottom: 8,
}

// ─── Component ──────────────────────────────────────────────────────────────

export function FullBleedPicker({
  title,
  items,
  focusedId,
  selectedIds,
  onFocus,
  onBack,
  onConfirm,
  canConfirm,
  confirmLabel = 'Next',
  backLabel = 'Back',
  badge,
  prevStepLabel,
  nextStepLabel,
  children,
}: FullBleedPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll thumbnail carousel to center the focused item
  useEffect(() => {
    if (!focusedId || !scrollRef.current) return
    const container = scrollRef.current
    const index = items.findIndex((item) => item.id === focusedId)
    if (index < 0) return

    const thumb = container.children[index] as HTMLElement | undefined
    if (!thumb) return

    const scrollLeft =
      thumb.offsetLeft - container.clientWidth / 2 + thumb.clientWidth / 2
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }, [focusedId, items])

  const focusedItem = items.find((item) => item.id === focusedId)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'black',
      }}
    >
      {/* Hero illustration — crossfades on focus change */}
      <AnimatePresence mode="wait">
        {focusedItem && (
          <motion.img
            key={focusedId}
            src={focusedItem.illustrationSrc}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Top gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          opacity: 0.6,
          background:
            'linear-gradient(180deg, rgba(3,7,13,0.81) 33%, rgba(31,58,96,0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '55%',
          background:
            'linear-gradient(0deg, rgba(3,7,13,0.9) 0%, rgba(3,7,13,0.81) 40%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Breadcrumb step navigation — prev · CURRENT · next */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          whiteSpace: 'nowrap',
          filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.75))',
        }}
      >
        {prevStepLabel && (
          <>
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.92 }}
              style={{
                ...typeMicro,
                color: 'rgba(231,186,144,0.5)',
                background: 'none',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {prevStepLabel}
            </motion.button>
            <span
              style={{
                ...typeMicro,
                color: 'rgba(231,186,144,0.35)',
                padding: '0 8px',
              }}
            >
              &middot;
            </span>
          </>
        )}
        <span
          style={{
            ...titleStyle,
            background: goldGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </span>
        {nextStepLabel && (
          <>
            <span
              style={{
                ...typeMicro,
                color: 'rgba(231,186,144,0.35)',
                padding: '0 8px',
              }}
            >
              &middot;
            </span>
            <motion.button
              onClick={canConfirm ? onConfirm : undefined}
              whileTap={canConfirm ? { scale: 0.92 } : undefined}
              style={{
                ...typeMicro,
                color: 'rgba(231,186,144,0.5)',
                opacity: canConfirm ? 1 : 0.5,
                background: 'none',
                border: 'none',
                padding: '4px 0',
                cursor: canConfirm ? 'pointer' : 'default',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {nextStepLabel}
            </motion.button>
          </>
        )}
      </div>

      {/* Content overlay — stacks info, badge, thumbnails, buttons at bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Info area (children from parent step) */}
        <div style={{ padding: '0 24px', marginBottom: 8 }}>{children}</div>

        {/* Badge */}
        {badge && <div style={badgeStyle}>{badge}</div>}

        {/* Thumbnail carousel — drum picker: focused item always centered */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            /* 50% - half thumb width so first/last items can center */
            padding: '0 calc(50% - 40px) 12px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {items.map((item) => {
            const isFocused = item.id === focusedId
            const isSelected = selectedIds.includes(item.id)

            return (
              <motion.button
                key={item.id}
                animate={{
                  scale: isFocused ? 1 : 0.85,
                  opacity: isFocused ? 1 : 0.55,
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={() => onFocus(item.id)}
                style={{
                  position: 'relative',
                  width: 80,
                  height: 120,
                  borderRadius: 10,
                  overflow: 'hidden',
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  border: isFocused
                    ? '3px solid rgba(249,248,243,0.9)'
                    : '2px solid rgba(249,248,243,0.3)',
                  boxShadow: isFocused
                    ? '0 0 12px rgba(231,186,144,0.4)'
                    : 'none',
                  padding: 0,
                  background: 'none',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                <img
                  src={item.illustrationSrc}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />

                {/* Selected indicator — gold dot at top-right */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: goldDark,
                      border: '1.5px solid rgba(249,248,243,0.9)',
                      boxShadow: '0 0 6px rgba(231,186,144,0.6)',
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '8px 24px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            justifyContent: onBack ? 'space-between' : 'center',
          }}
        >
          {onBack && (
            <div style={{ flex: 1 }}>
              <FatesButton variant="dark" onClick={onBack}>
                {backLabel}
              </FatesButton>
            </div>
          )}
          <div style={{ flex: onBack ? 1 : undefined, display: 'flex', justifyContent: onBack ? 'flex-end' : 'center' }}>
            <FatesButton
              variant="light"
              onClick={onConfirm}
              disabled={!canConfirm}
            >
              {confirmLabel}
            </FatesButton>
          </div>
        </div>
      </div>
    </div>
  )
}
