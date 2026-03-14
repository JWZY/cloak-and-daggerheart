import { FormatText } from '../ui/FormatText'
import { typeSubtitle, typeBody, typeMicro, goldGradientStyle } from '../ui/typography'
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
  /** Whether this feature has been used (dims the panel) */
  used?: boolean
  /** Toggle used/unused — shows indicator when provided */
  onToggleUsed?: () => void
}

/**
 * Warm glass card for any character feature — matches DomainAbilityPanel treatment.
 * Used for hope features, class features, ancestry features, community features.
 */
export function FeaturePanel({ name, source, text, onTap, imageSrc, used, onToggleUsed }: FeaturePanelProps) {
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
        opacity: used ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
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
        {/* Header row with name and usage indicator */}
        <div className="flex items-start justify-between gap-2">
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ ...typeSubtitle, ...goldGradientStyle }}>
              {name}
            </span>
            <div style={{ ...typeBody, color: 'var(--text-muted)', marginTop: 2 }}>
              {source}
            </div>
          </div>

          {/* Usage indicator */}
          {onToggleUsed && (
            <button
              type="button"
              aria-label={used ? `Mark ${name} as available` : `Mark ${name} as used`}
              onClick={(e) => {
                e.stopPropagation()
                onToggleUsed()
              }}
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                marginTop: 2,
              }}
            >
              {used ? (
                /* Filled circle with check */
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" fill="var(--gold-muted)" stroke="var(--gold)" strokeWidth="1" />
                  <path d="M6 10l3 3 5-6" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              ) : (
                /* Empty circle outline */
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="var(--gold-muted)" strokeWidth="1" fill="none" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Used label */}
        {used && onToggleUsed && (
          <span style={{ ...typeMicro, color: 'var(--gold-muted)', marginTop: 4, display: 'block' }}>
            Used
          </span>
        )}

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
