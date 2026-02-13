import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface CardZoomProps {
  layoutId: string
  onClose: () => void
  children: ReactNode
}

export function CardZoom({ layoutId, onClose, children }: CardZoomProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="card-zoom-backdrop"
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
            stiffness: 300,
            damping: 30,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
