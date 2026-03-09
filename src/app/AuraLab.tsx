const BASE_URL = import.meta.env.BASE_URL

const CARD_SRC = `${BASE_URL}images/cards/domains/hold-the-line.avif`

// Shared card thumbnail component
function AuraCard({
  className,
  width,
  height,
  radius,
}: {
  className: string
  width: number
  height: number
  radius: number
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        flexShrink: 0,
      }}
    >
      <img
        src={CARD_SRC}
        alt="Hold the Line"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: radius,
          display: 'block',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  )
}

// A single variant row showing both sizes
function VariantRow({
  label,
  description,
  className,
}: {
  label: string
  description: string
  className: string
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 20,
          fontWeight: 500,
          fontVariant: 'small-caps',
          letterSpacing: '0.04em',
          color: 'var(--gold-light)',
          marginBottom: 4,
        }}
      >
        {label}
      </h2>
      <p
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 24,
          maxWidth: 400,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          gap: 40,
          alignItems: 'flex-end',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <AuraCard className={className} width={80} height={120} radius={10} />
          <span
            style={{
              display: 'block',
              marginTop: 12,
              fontSize: 11,
              color: 'var(--text-muted)',
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            80 x 120
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <AuraCard className={className} width={160} height={240} radius={14} />
          <span
            style={{
              display: 'block',
              marginTop: 12,
              fontSize: 11,
              color: 'var(--text-muted)',
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            160 x 240
          </span>
        </div>
      </div>
    </div>
  )
}

export default function AuraLab() {
  return (
    <div
      className="ios-scroll"
      style={{
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg-page)',
        padding: '48px 24px 80px',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Page header */}
      <h1
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 28,
          fontWeight: 500,
          fontVariant: 'small-caps',
          letterSpacing: '0.04em',
          color: 'var(--gold-light)',
          marginBottom: 8,
        }}
      >
        Aura Glow Lab
      </h1>
      <p
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 14,
          color: 'var(--text-secondary)',
          marginBottom: 48,
          maxWidth: 480,
          lineHeight: 1.5,
        }}
      >
        Prototyping card aura glow effects. Goal: soft, diffuse gold glow that
        hugs the card contour with slowly drifting bright spots — like the
        Legends of Runeterra selected-card effect.
      </p>

      {/* V1 — Current conic-gradient spin */}
      <VariantRow
        label="v1 — Current (conic-gradient spin)"
        description="The existing .aura-glow using counter-rotating conic gradients. Creates visible pie-slice shapes that spin. Used as baseline."
        className="aura-glow"
      />

      {/* V2 — Box-shadow + orbiting spots */}
      <VariantRow
        label="v2 — Box-shadow + orbiting spots"
        description="Static ambient box-shadow glow always present, plus two soft radial-gradient hot spots that slowly orbit the card perimeter on different timings."
        className="aura-v2"
      />

      {/* V3 — Mesh of blurred dots */}
      <VariantRow
        label="v3 — Mesh of blurred dots"
        description="Five absolutely-positioned blurred circles at different sizes, each with a unique slow drift animation (staggered duration and path). Creates an organic, flickering aura."
        className="aura-v3"
      />

      {/* V4 — SVG feTurbulence filter */}
      <VariantRow
        label="v4 — SVG feTurbulence distortion"
        description="Uses an SVG filter with feTurbulence and feDisplacementMap to organically distort a solid glow layer. Animated turbulence seed for a living, breathing feel."
        className="aura-v4"
      />

      {/* Hidden SVG filter definitions for v4 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="aura-turbulence" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
              result="noise"
            >
              <animate
                attributeName="seed"
                from="0"
                to="5"
                dur="12s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
