import { typeTitle, typeSubtitle, goldGradientStyle } from '../ui/typography'
import type { Character } from '../types/character'

interface CharacterHeaderProps {
  character: Character
  variant: 'desktop' | 'mobile'
  onTap?: () => void
  /** Fallback image when no portrait is set (e.g. subclass art) */
  fallbackImage?: string
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

const portraitSize = { mobile: 40, desktop: 48 }

export function CharacterHeader({ character, variant, onTap, fallbackImage }: CharacterHeaderProps) {
  const Tag = onTap ? 'button' : 'div'
  const size = portraitSize[variant]
  const imgSrc = character.portrait || fallbackImage

  return (
    <Tag
      className={`flex items-center gap-3 ${variant === 'desktop' ? 'pb-4' : 'pt-2 pb-1'}`}
      onClick={onTap}
      {...(onTap ? { type: 'button' as const, 'aria-label': `${character.name}, ${character.subclass} ${character.class}` } : {})}
      style={onTap ? { cursor: 'pointer', background: 'none', border: 'none', width: '100%', justifyContent: 'center' } : { justifyContent: 'center' }}
    >
      {/* Portrait circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '1px solid var(--gold-muted)',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'var(--bg-surface)',
        }}
      >
        {imgSrc && (
          <img
            src={imgSrc}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>

      {/* Name + subtitle */}
      <div className="flex flex-col items-center">
        <span style={titleStyle}>
          {character.name}
        </span>
        <span style={subtitleStyleBase}>
          {character.subclass} {character.class}
        </span>
      </div>
    </Tag>
  )
}
