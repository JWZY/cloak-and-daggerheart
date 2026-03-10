import { FormatText } from '../ui/FormatText'
import { typeSubtitle, typeBody, goldGradientStyle } from '../ui/typography'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'

export interface FeaturePanelProps {
  /** Feature name — e.g. "No Mercy", "Attack of Opportunity" */
  name: string
  /** Source caption — e.g. "Hope Feature", "Ancestry: Fungril", "Class: Warrior" */
  source: string
  /** Feature description text (supports FormatText markdown) */
  text: string
  /** Optional tap handler — opens the source card */
  onTap?: () => void
  /** Optional background illustration — full bleed behind content */
  imageSrc?: string
}

/**
 * Warm glass card for any character feature — matches DomainAbilityPanel treatment.
 * Used for hope features, class features, ancestry features, community features.
 */
export function FeaturePanel({ name, source, text, onTap, imageSrc }: FeaturePanelProps) {
  const Tag = onTap ? 'button' : 'div'
  return (
    <Tag
      {...(onTap ? { type: 'button' as const, 'aria-label': `${name} — tap to view card` } : {})}
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
      {imageSrc && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', padding: 16 }}>
        <span style={{ ...typeSubtitle, ...goldGradientStyle }}>
          {name}
        </span>
        <div style={{ ...typeBody, color: 'var(--text-muted)', marginTop: 2 }}>
          {source}
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

        {/* Body */}
        <div style={{ ...typeBody, color: 'var(--text-secondary)' }}>
          <FormatText text={text} />
        </div>
      </div>
    </Tag>
  )
}
