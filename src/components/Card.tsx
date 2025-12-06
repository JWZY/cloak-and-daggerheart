import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export default function Card({ children, onClick, className = '' }: CardProps) {
  return (
    <motion.div
      className={`ios-card ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}

