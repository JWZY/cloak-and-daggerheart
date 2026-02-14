import { motion } from 'framer-motion'
import { SRDCard } from '../cards/SRDCard'
import { subclassToCardProps } from '../data/card-mapper'
import { getSubclass, getClassForSubclass } from '../data/srd'
import type { WizardSubclass } from '../types/character'

export interface HeroCardProps {
  onTap: () => void
  subclass: string
}

export function HeroCard({ onTap, subclass }: HeroCardProps) {
  const subclassData = getSubclass(subclass as WizardSubclass)
  const classData = getClassForSubclass(subclass)!
  const cardProps = subclassToCardProps(subclassData, classData)

  return (
    <motion.div
      layoutId="hero-card"
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      style={{ cursor: 'pointer' }}
    >
      <SRDCard {...cardProps} />
    </motion.div>
  )
}
