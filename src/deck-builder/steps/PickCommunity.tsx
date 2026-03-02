import { CommunityCard } from '../../cards/CommunityCard'
import { communities } from '../../data/srd'
import { CardSelector } from '../../cards/CardSelector'
import { CardHand } from '../../cards/CardHand'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { useDeckStore } from '../../store/deck-store'

export function PickCommunity() {
  const communityName = useDeckStore((s) => s.communityName)
  const setCommunity = useDeckStore((s) => s.setCommunity)

  const handleTap = (name: string) => {
    if (communityName === name) {
      useDeckStore.setState({ communityName: null })
    } else {
      setCommunity(name)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="w-full max-w-[360px] mb-2 px-4">
        <SectionHeader>Choose Your Community</SectionHeader>
      </h2>
      <StepInstruction>Tap to select or deselect</StepInstruction>

      {/* Hand-of-cards layout — 9 communities */}
      <CardHand scale={0.55} overlap={-65} mobileScale={0.42}>
        {communities.map((community) => {
          const isSelected = communityName === community.name
          const isDimmed = communityName !== null && !isSelected

          return (
            <CardSelector
              key={community.name}
              selected={isSelected}
              dimmed={isDimmed}
              onSelect={() => handleTap(community.name)}
            >
              <CommunityCard community={community} />
            </CardSelector>
          )
        })}
      </CardHand>
    </div>
  )
}
