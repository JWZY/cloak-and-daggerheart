/**
 * AncestryCard — Renders an ancestry as a full-size InfoCard.
 * Takes raw SRD Ancestry data and handles mapping internally.
 */

import { InfoCard } from './InfoCard'
import { ancestryToInfoCardProps } from '../data/card-mapper'
import type { Ancestry } from '../types/character'

export interface AncestryCardProps {
  ancestry: Ancestry
  scale?: number
  onClick?: () => void
}

export function AncestryCard({ ancestry, scale, onClick }: AncestryCardProps) {
  return <InfoCard {...ancestryToInfoCardProps(ancestry)} scale={scale} onClick={onClick} />
}
