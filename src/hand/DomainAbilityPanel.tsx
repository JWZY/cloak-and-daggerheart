import { FormatText } from '../ui/FormatText'
import { typeSubtitle, typeBody, goldGradientStyle } from '../ui/typography'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import { domainCardToProps, parseAbilityText } from '../data/card-mapper'
import type { DomainCard } from '../types/character'

export interface DomainAbilityPanelProps {
  card: DomainCard
  onTap?: () => void
}

/**
 * Warm glass text panel for displaying a domain card ability inline.
 * Replaces the card carousel for readable, tap-to-zoom domain ability display.
 */
export function DomainAbilityPanel({ card, onTap }: DomainAbilityPanelProps) {
  const mapped = domainCardToProps(card)
  const bodyParts = parseAbilityText(mapped.bodyText)

  const Tag = onTap ? 'button' : 'div'
  return (
    <Tag
      {...(onTap ? { type: 'button' as const, 'aria-label': `${card.name} — tap to zoom` } : {})}
      style={{
        ...warmGlass,
        borderRadius: RADIUS_CARD,
        overflow: 'hidden',
        position: 'relative',
        cursor: onTap ? 'pointer' : undefined,
        ...(onTap ? { border: 'none', width: '100%', textAlign: 'left' as const } : {}),
      }}
      onClick={onTap}
    >
      {/* Background illustration — full bleed, faded */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${mapped.props.artworkSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ ...typeSubtitle, ...goldGradientStyle }}>
            {card.name}
          </span>
          <span style={{ ...typeSubtitle, ...goldGradientStyle, flexShrink: 0, marginLeft: 8 }}>
            Lv {card.level}
          </span>
        </div>
        <div style={{ ...typeBody, color: 'var(--text-muted)', marginTop: 2 }}>
          {card.domain}{card.recall ? ` \u00b7 Recall: ${card.recall}` : ''}
        </div>

        {/* Separator */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
            marginTop: 8,
            marginBottom: 8,
          }}
        />

        {/* Ability body */}
        <div style={{ ...typeBody, color: 'var(--text-secondary)' }}>
          {bodyParts.map((part, i) => (
            <div key={i} className={i > 0 ? 'mt-2' : ''}>
              {part.name && (
                <>
                  <span className="font-bold">{part.name}:</span>{' '}
                </>
              )}
              <FormatText text={part.text} />
            </div>
          ))}
        </div>
      </div>
    </Tag>
  )
}
