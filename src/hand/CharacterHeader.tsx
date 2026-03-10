import { typeTitle, typeSubtitle, goldGradientStyle } from '../ui/typography'
import type { Character } from '../types/character'

interface CharacterHeaderProps {
  character: Character
  variant: 'desktop' | 'mobile'
  onTap?: () => void
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

export function CharacterHeader({ character, variant, onTap }: CharacterHeaderProps) {
  const Tag = onTap ? 'button' : 'div'
  return (
    <Tag
      className={`flex flex-col items-center ${variant === 'desktop' ? 'pb-4' : 'pt-2 pb-1'}`}
      onClick={onTap}
      {...(onTap ? { type: 'button' as const, 'aria-label': `${character.name}, ${character.subclass} ${character.class}` } : {})}
      style={onTap ? { cursor: 'pointer', background: 'none', border: 'none', width: '100%' } : undefined}
    >
      <span style={titleStyle}>
        {character.name}
      </span>
      <span style={subtitleStyleBase}>
        {character.subclass} {character.class}
      </span>
    </Tag>
  )
}
