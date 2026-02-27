import { AncestryCard } from '../../cards/AncestryCard'
import { ancestries } from '../../data/srd'
import { CardSelector } from '../../cards/CardSelector'
import { CardHand } from '../../cards/CardHand'
import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { useDeckStore } from '../../store/deck-store'

export function PickAncestry() {
  const ancestryName = useDeckStore((s) => s.ancestryName)
  const setAncestry = useDeckStore((s) => s.setAncestry)

  const handleTap = (name: string) => {
    if (ancestryName === name) {
      useDeckStore.setState({ ancestryName: null })
    } else {
      setAncestry(name)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="w-full max-w-xs mb-2 px-4">
        <SectionHeader>Choose Your Ancestry</SectionHeader>
      </h2>
      <StepInstruction>Tap to select or deselect</StepInstruction>

      {/* Hand-of-cards layout — 18 ancestries need tighter overlap and smaller scale */}
      <CardHand scale={0.48} overlap={-90} mobileScale={0.38}>
        {ancestries.map((ancestry) => {
          const isSelected = ancestryName === ancestry.name
          const isDimmed = ancestryName !== null && !isSelected

          return (
            <CardSelector
              key={ancestry.name}
              selected={isSelected}
              dimmed={isDimmed}
              onSelect={() => handleTap(ancestry.name)}
            >
              <AncestryCard ancestry={ancestry} />
            </CardSelector>
          )
        })}
      </CardHand>
    </div>
  )
}
