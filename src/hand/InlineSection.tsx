import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { typeSubtitle } from '../ui/typography'

interface InlineSectionProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  /** When true, section can be collapsed/expanded by tapping the header */
  collapsible?: boolean
  /** Initial collapsed state (only used when collapsible is true) */
  defaultCollapsed?: boolean
}

function GradientDivider() {
  return (
    <div
      style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
      }}
    />
  )
}

/**
 * A section with a gold-bordered header containing an icon and title.
 * Used for Traits, Equipment, and Notes panels in the hand view.
 *
 * When `collapsible` is true, the header becomes tappable and a chevron
 * rotates to indicate expand/collapse state. Body animates with height transition.
 */
export function InlineSection({
  title,
  icon: Icon,
  children,
  collapsible = false,
  defaultCollapsed = false,
}: InlineSectionProps) {
  const [collapsed, setCollapsed] = useState(collapsible ? defaultCollapsed : false)
  const expanded = !collapsed
  const contentId = useId()

  const headerContent = (
    <>
      {collapsible && (
        <motion.span
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center' }}
          aria-hidden="true"
        >
          <ChevronRight size={14} color="var(--gold-secondary)" />
        </motion.span>
      )}
      <Icon size={14} color="var(--gold-secondary)" aria-hidden="true" />
      <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
        {title}
      </span>
    </>
  )

  const header = collapsible ? (
    <button
      type="button"
      className="flex items-center gap-2 w-full"
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        paddingBottom: 8,
        marginBottom: 8,
      }}
      onClick={() => setCollapsed(c => !c)}
      aria-expanded={expanded}
      aria-controls={contentId}
    >
      {headerContent}
    </button>
  ) : (
    <div
      className="flex items-center gap-2"
      style={{ paddingBottom: 8, marginBottom: 8 }}
    >
      {headerContent}
    </div>
  )

  if (!collapsible) {
    return (
      <div>
        {header}
        <GradientDivider />
        <div style={{ marginTop: 8 }}>{children}</div>
      </div>
    )
  }

  return (
    <div>
      {header}
      <GradientDivider />
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', marginTop: 8 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
