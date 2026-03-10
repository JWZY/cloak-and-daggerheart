import { type ReactNode, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { springs } from '../design-system/tokens/animations'

export interface CardZoomProps {
  layoutId: string
  onClose: () => void
  children: ReactNode
}

export function CardZoom({ layoutId, onClose, children }: CardZoomProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Escape key dismissal + focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    // Move focus into the dialog
    const prev = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      prev?.focus()
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        key="card-zoom-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Card zoom view"
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          outline: 'none',
        }}
      >
        <motion.div
          layoutId={layoutId}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          transition={{
            type: 'spring',
            ...springs.smooth,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
