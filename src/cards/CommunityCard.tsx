/**
 * CommunityCard — Renders a community as a full-size InfoCard.
 * Takes raw SRD Community data and handles mapping internally.
 */

import { InfoCard } from './InfoCard'
import { communityToInfoCardProps } from '../data/card-mapper'
import type { Community } from '../types/character'

export interface CommunityCardProps {
  community: Community
  scale?: number
  onClick?: () => void
}

export function CommunityCard({ community, scale, onClick }: CommunityCardProps) {
  return <InfoCard {...communityToInfoCardProps(community)} scale={scale} onClick={onClick} />
}
