import { motion } from 'framer-motion'
import { SRDCard } from '../cards/SRDCard'
import { subclassToCardProps } from '../data/card-mapper'
import { getSubclass, getClassForSubclass } from '../data/srd'
import type { Character } from '../types/character'

export interface HeroCardProps {
  character: Character
  onTap: () => void
}

export function HeroCard({ character, onTap }: HeroCardProps) {
  const subclass = getSubclass(character.subclass)
  const classData = getClassForSubclass(character.subclass)!
  const cardProps = subclassToCardProps(subclass, classData)

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        layoutId="hero-card"
        whileTap={{ scale: 0.97 }}
        onClick={onTap}
        style={{ cursor: 'pointer' }}
      >
        <SRDCard {...cardProps} />
      </motion.div>

      {/* Character name overlay pill */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          <span
            className="text-sm font-medium tracking-wide"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '0.04em',
              background: 'linear-gradient(180deg, #f9f8f3 0%, #e7ba90 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {character.name}
          </span>
        </div>
      </div>
    </div>
  )
}
