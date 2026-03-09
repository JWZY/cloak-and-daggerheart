import { CardZoom } from '../cards/CardZoom'
import { SRDCard } from '../cards/SRDCard'
import { DomainCard } from '../cards/DomainCard'
import { AncestryCard } from '../cards/AncestryCard'
import { CommunityCard } from '../cards/CommunityCard'
import { DomainCardBody } from './DomainCardBody'
import { subclassToCardProps, domainCardToProps } from '../data/card-mapper'
import { getSubclassByName, getClassForSubclass } from '../data/srd'
import type { Character } from '../types/character'

interface CardZoomOverlayProps {
  character: Character
  zoomedCard: string | null
  onClose: () => void
}

/**
 * Renders the zoomed card overlay for all card types:
 * hero (SRD), domain, ancestry, and community.
 */
export function CardZoomOverlay({ character, zoomedCard, onClose }: CardZoomOverlayProps) {
  return (
    <>
      {zoomedCard === 'hero-card' && (() => {
        const sub = getSubclassByName(character.subclass)
        const cls = getClassForSubclass(character.subclass)
        if (!sub || !cls) return null
        return (
          <CardZoom layoutId="hero-card" onClose={onClose}>
            <SRDCard {...subclassToCardProps(sub, cls)} />
          </CardZoom>
        )
      })()}

      {zoomedCard?.startsWith('domain-') && (() => {
        const cardName = zoomedCard.replace('domain-', '')
        const card = character.domainCards.find((c) => c.name === cardName)
        if (!card) return null
        const mapped = domainCardToProps(card)
        return (
          <CardZoom layoutId={zoomedCard} onClose={onClose}>
            <DomainCard {...mapped.props}>
              <DomainCardBody bodyText={mapped.bodyText} />
            </DomainCard>
          </CardZoom>
        )
      })()}

      {zoomedCard === 'ancestry' && (
        <CardZoom layoutId="ancestry" onClose={onClose}>
          <AncestryCard ancestry={character.ancestry} />
        </CardZoom>
      )}

      {zoomedCard === 'community' && (
        <CardZoom layoutId="community" onClose={onClose}>
          <CommunityCard community={character.community} />
        </CardZoom>
      )}
    </>
  )
}
