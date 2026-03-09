import { motion } from 'framer-motion'
import { tapFeedback } from '../design-system/tokens/animations'
import { SRDCard } from '../cards/SRDCard'
import { subclassToCardProps } from '../data/card-mapper'
import { getSubclassByName, getClassForSubclass } from '../data/srd'

export interface HeroCardProps {
  onTap: () => void
  subclass: string
}

export function HeroCard({ onTap, subclass }: HeroCardProps) {
  const subclassData = getSubclassByName(subclass)
  const classData = getClassForSubclass(subclass)
  if (!subclassData || !classData) return null
  const cardProps = subclassToCardProps(subclassData, classData)

  return (
    <motion.div
      layoutId="hero-card"
      whileTap={tapFeedback.medium}
      onClick={onTap}
      style={{ cursor: 'pointer' }}
    >
      <SRDCard {...cardProps} />
    </motion.div>
  )
}
