import { typeTitle, typeSubtitle, goldGradientStyle } from '../ui/typography'
import type { Character } from '../types/character'

interface CharacterHeaderProps {
  character: Character
  variant: 'desktop' | 'mobile'
}

const titleStyle = {
  ...typeTitle,
  fontSize: 24,
  ...goldGradientStyle,
  textAlign: 'center' as const,
}

const subtitleStyleBase = {
  ...typeSubtitle,
  color: 'var(--gold)',
  textAlign: 'center' as const,
}

export function CharacterHeader({ character, variant }: CharacterHeaderProps) {
  return (
    <div className={`flex flex-col items-center ${variant === 'desktop' ? 'pb-4' : 'pt-2 pb-1'}`}>
      <span style={titleStyle}>
        {character.name}
      </span>
      <span style={subtitleStyleBase}>
        {character.subclass} {character.class}
      </span>
    </div>
  )
}
