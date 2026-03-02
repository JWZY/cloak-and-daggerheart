import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { typeSubtitle } from '../../ui/typography'
import { GlassPanel } from '../../ui/GlassPanel'

export interface CollapsiblePanelProps {
  title: string
  icon: React.ElementType
  isOpen: boolean
  onToggle: () => void
  accentColor?: string
  children: ReactNode
}

export function CollapsiblePanel({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  accentColor,
  children,
}: CollapsiblePanelProps) {
  return (
    <GlassPanel
      className="overflow-hidden"
      style={{
        borderRadius: 12,
        padding: 0,
        border: '1px solid var(--surface-light)',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} color={isOpen && accentColor ? `${accentColor}99` : 'var(--gold-secondary)'} />
          <span
            style={{
              ...typeSubtitle,
              color: isOpen ? 'var(--gold)' : 'var(--gold-secondary)',
            }}
          >
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} color="var(--gold-secondary)" />
        </motion.div>
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-3 pb-3"
              style={{ borderTop: '1px solid var(--gold-muted)' }}
            >
              <div className="pt-2">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  )
}
