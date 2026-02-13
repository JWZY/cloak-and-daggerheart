import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

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
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0.02) 50%,
          rgba(0, 0, 0, 0.01) 100%
        )`,
        backdropFilter: 'blur(2px) saturate(150%)',
        WebkitBackdropFilter: 'blur(2px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.375), inset 0 -1px 1px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} color={isOpen && accentColor ? `${accentColor}99` : 'rgba(231, 186, 144, 0.4)'} />
          <span
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 13,
              fontWeight: 600,
              fontVariant: 'small-caps',
              letterSpacing: '0.04em',
              color: isOpen ? '#e7ba90' : 'rgba(231, 186, 144, 0.5)',
            }}
          >
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} color="#e7ba90" style={{ opacity: 0.4 }} />
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
              style={{ borderTop: '1px solid rgba(231, 186, 144, 0.06)' }}
            >
              <div className="pt-2">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
