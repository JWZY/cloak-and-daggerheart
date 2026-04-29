import { useState } from 'react'
import { createPortal } from 'react-dom'
import { typeTitle, typeSubtitle, goldGradientStyle } from '../ui/typography'
import { DomainBanner } from '../cards/DomainBanner'
import { DOMAIN_COLORS, DOMAIN_COLORS_MUTED } from '../cards/domain-colors'
import { getClassForSubclass } from '../data/srd'
import { PortraitModal } from './PortraitModal'
import type { Character } from '../types/character'

interface CharacterHeaderProps {
  character: Character
  variant: 'desktop' | 'mobile'
  onTap?: () => void
  /** Fallback image when no portrait is set (e.g. subclass art) */
  fallbackImage?: string
}

const portraitSize = { mobile: 56, desktop: 64 }

export function CharacterHeader({ character, variant, onTap, fallbackImage }: CharacterHeaderProps) {
  const Tag = onTap ? 'button' : 'div'
  const size = portraitSize[variant]
  const imgSrc = character.portrait || fallbackImage
  const classData = getClassForSubclass(character.subclass)
  const isDesktop = variant === 'desktop'
  const [showPortraitModal, setShowPortraitModal] = useState(false)

  return (
    <div className="relative" style={{ marginBottom: isDesktop ? 20 : 0 }}>
      {/* Gold gradient line — flush with top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
        }}
      />

      <Tag
        className={`flex items-center gap-4 ${isDesktop ? '' : 'px-4 pt-2 pb-1'}`}
        onClick={onTap}
        {...(onTap ? { type: 'button' as const, 'aria-label': `${character.name}, level ${character.level} ${character.subclass} ${character.class}` } : {})}
        style={{
          cursor: onTap ? 'pointer' : undefined,
          background: 'none',
          border: 'none',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: isDesktop ? 0 : undefined,
        }}
      >
        {/* Portrait — square with rounded corners, opens portrait modal on click */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Change portrait"
          onClick={(e) => {
            e.stopPropagation()
            setShowPortraitModal(true)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              e.preventDefault()
              setShowPortraitModal(true)
            }
          }}
          style={{
            width: size,
            height: size,
            borderRadius: 8,
            border: '1px solid var(--gold-muted)',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-surface)',
            cursor: 'pointer',
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

        {/* Name + L# subclass class */}
        <div className="flex flex-col items-start" style={{ flex: 1, minWidth: 0 }}>
          <span style={{ ...typeTitle, fontSize: isDesktop ? 28 : 24, ...goldGradientStyle }}>
            {character.name}
          </span>
          <span style={{ ...typeSubtitle, color: 'var(--gold-secondary)' }}>
            L{character.level} {character.subclass} {character.class}
          </span>
        </div>

        {/* Domain pennant — right side for visual balance */}
        {classData && (
          <div className="relative" style={{ width: 44, height: 80, flexShrink: 0 }}>
            <DomainBanner
              outerColor={DOMAIN_COLORS_MUTED[classData.domain_2] ?? '#626565'}
              innerColor={DOMAIN_COLORS[classData.domain_1] ?? DOMAIN_COLORS.Blade}
              uid={`header-${variant}`}
              domain={classData.domain_1}
              domain2={classData.domain_2}
              basePath={import.meta.env.BASE_URL}
              scale={1}
            />
          </div>
        )}
      </Tag>

      {/* Portrait modal — rendered via portal above everything */}
      {showPortraitModal &&
        createPortal(
          <PortraitModal
            character={character}
            fallbackImage={fallbackImage}
            onClose={() => setShowPortraitModal(false)}
          />,
          document.body
        )}
    </div>
  )
}
