import { useState } from 'react'
import { GameButton } from '../ui/GameButton'
import { SectionHeader } from '../ui/SectionHeader'
import { GlassPanel } from '../ui/GlassPanel'
import { GameInput } from '../ui/GameInput'
import { GameBadge } from '../ui/GameBadge'
import { StepInstruction } from '../ui/StepInstruction'
import { SelectableOption } from '../ui/SelectableOption'
import { typeTitle, typeSubtitle, typeBody, typeMicro } from '../ui/typography'
import { DOMAIN_COLORS, DOMAIN_COLORS_MUTED } from '../cards/domain-colors'

// ─── Shared styles ───
// Typography tokens imported from src/ui/typography.ts:
//   typeTitle    — EB Garamond 500, small-caps, 0.01em (no fontSize — contextual)
//   typeSubtitle — EB Garamond 600, small-caps, 0.06em, 13px
//   typeBody     — Source Sans 3 400, 13.5px, line-height 1.4
//   typeMicro    — EB Garamond 600, 11px, small-caps, 0.06em

const PAGE_BG = 'var(--bg-page)'
const WARM = 'rgb(212, 207, 199)'

const heading: React.CSSProperties = {
  ...typeTitle,
  letterSpacing: '0.06em',
}

const annotation: React.CSSProperties = {
  fontFamily: typeBody.fontFamily,
  fontSize: 12,
  color: 'var(--text-muted)',
  lineHeight: typeBody.lineHeight,
}

const sectionGap = 64
const subGap = 32

// ─── Nav sections ───

const NAV_ITEMS = [
  { id: 'typography', label: 'Typography' },
  { id: 'colors', label: 'Colors' },
  { id: 'components', label: 'Components' },
  { id: 'architecture', label: 'Architecture' },
]

// ─── Main Component ───

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState('')
  const [demoSelected, setDemoSelected] = useState<'a' | 'b' | null>('a')

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: PAGE_BG,
        color: WARM,
        fontFamily: typeBody.fontFamily,
      }}
    >
      {/* Sticky Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--gold-muted)',
          padding: '10px 24px',
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              ...typeSubtitle,
              color: '#e7ba90',
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Page content */}
      <div
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: '48px 24px 120px',
        }}
      >
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1
            className="gold-text gold-text-shadow"
            style={{ ...heading, fontSize: 36, marginBottom: 8 }}
          >
            Design System
          </h1>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: 13,
              color: 'var(--gold-secondary)',
            }}
          >
            Cloak & Daggerheart — Living Style Reference
          </p>
        </div>

        {/* ================================================================
            SECTION 1: TYPOGRAPHY
            ================================================================ */}
        <section id="typography" style={{ marginBottom: sectionGap, scrollMarginTop: 60 }}>
          <SectionHeader>Typography</SectionHeader>

          <p style={{ ...annotation, marginTop: 16, marginBottom: 4 }}>
            Canonical source: <code style={codeStyle}>src/ui/typography.ts</code>
          </p>
          <p style={{ ...annotation, marginBottom: 20 }}>
            Import: <code style={codeStyle}>{`import { typeTitle, typeSubtitle, typeBody, typeMicro } from '../ui'`}</code>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Tier: Display */}
            <div>
              <TierLabel tier="Display" spec="EB Garamond 500, small-caps, 0.01em, contextual 24-72px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                <TypoSpecimen
                  style={{ ...typeTitle, fontSize: 36 }}
                  className="gold-text gold-text-shadow"
                  text="Card Title (36px AutoFit)"
                  note="SRDCard, DomainCard titles"
                />
                <TypoSpecimen
                  style={{ ...typeTitle, fontSize: 24 }}
                  className="gold-text gold-text-shadow"
                  text="Character Name (24px)"
                  note="HandView, DeckPreview, ReviewDeck, NameCharacter"
                />
              </div>
            </div>

            {/* Tier: Subtitle */}
            <div>
              <TierLabel tier="Subtitle" spec="EB Garamond 600, small-caps, 0.06em, 13px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                <TypoSpecimen
                  style={{ ...typeSubtitle }}
                  className="gold-text"
                  text="Buttons, Equipment Names, Trait Labels"
                  note="GameButton, ArmorOption, WeaponOption, AssignTraits"
                />
                <TypoSpecimen
                  style={{ ...typeSubtitle }}
                  className="gold-text"
                  text="Section Headers, Card Subtitles, Panel Titles"
                  note="SectionHeader, CollapsiblePanel, card footers"
                />
              </div>
            </div>

            {/* Tier: Body */}
            <div>
              <TierLabel tier="Body" spec="Source Sans 3 400, line-height 1.4, 13.5px" />
              <div style={{ marginTop: 8 }}>
                <TypoSpecimen
                  style={{ ...typeBody }}
                  textColor="var(--text-primary)"
                  text="Card body text with longer content to show line height. You have dedicated your study to the knowledge of the arcane."
                  note="SRDCard, DomainCard, InfoCard, descriptions, notes"
                />
              </div>
            </div>

            {/* Tier: Micro */}
            <div>
              <TierLabel tier="Micro" spec="EB Garamond 600, 11px, small-caps, 0.06em" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                <TypoSpecimen
                  style={{ ...typeMicro }}
                  textColor="#e7ba90"
                  text="Micro Label"
                  note="GameBadge, stat labels, equipment labels, DeckPreview trait names"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: COLORS
            ================================================================ */}
        <section id="colors" style={{ marginBottom: sectionGap, scrollMarginTop: 60 }}>
          <SectionHeader>Color Palette</SectionHeader>

          <p style={{ ...annotation, marginTop: 16, marginBottom: 4 }}>
            Canonical source: CSS custom properties in <code style={codeStyle}>src/index.css</code> (<code style={codeStyle}>:root</code>)
          </p>

          {/* 2a. Text Colors — Warm Cream Scale */}
          <SubHeading>Text Colors — Warm Cream Scale</SubHeading>

          <p style={{ ...annotation, marginBottom: 16 }}>
            Base: <code style={codeStyle}>rgb(212, 207, 199)</code> at varying opacities.
            Three canonical CSS vars are defined; components should prefer these.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color="rgba(212, 207, 199, 0.9)" label="--text-primary (0.9) — Body text, primary content" varName="--text-primary" />
            <ColorSwatch color="rgba(212, 207, 199, 0.6)" label="--text-secondary (0.6) — Secondary labels, metadata" varName="--text-secondary" />
            <ColorSwatch color="rgba(212, 207, 199, 0.35)" label="--text-muted (0.35) — Weapon labels, dimmed text" varName="--text-muted" />
          </div>

          <p style={{ ...annotation, marginTop: 16, marginBottom: 8, fontStyle: 'italic' }}>
            Additional inline opacity levels used by components (candidates for future CSS vars):
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 12 }}>
            <ColorSwatch color={withAlpha(WARM, 0.5)} label="0.5 — Stat labels, muted counts" small />
            <ColorSwatch color={withAlpha(WARM, 0.3)} label="0.3 — Empty states, disabled text" small />
          </div>

          {/* 2b. Gold Palette */}
          <SubHeading>Gold Palette</SubHeading>

          <p style={{ ...annotation, marginBottom: 16 }}>
            Gold accent scale used for interactive elements, labels, and gradients.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color="#f9f8f3" label="--gold-light: #f9f8f3 — Gold gradient top" varName="--gold-light" />
            <ColorSwatch color="#e7ba90" label="--gold: #e7ba90 — Primary gold accent" varName="--gold" />
            <ColorSwatch color="rgba(231, 186, 144, 0.5)" label="--gold-secondary — Labels, instruction text" varName="--gold-secondary" />
            <ColorSwatch color="rgba(231, 186, 144, 0.25)" label="--gold-muted — Borders, step indicator inactive" varName="--gold-muted" />
          </div>

          <p style={{ ...annotation, marginTop: 16, marginBottom: 8, fontStyle: 'italic' }}>
            Card-specific gold values (used in banners and card frame strokes):
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingLeft: 12 }}>
            {[
              { color: '#d4af37', label: '--gold-solid', note: 'Fallback accent' },
              { color: '#DBC593', label: '--gold-border', note: 'Banner stroke top' },
              { color: '#C29734', label: '--gold-border-dark', note: 'Banner stroke bottom' },
            ].map(({ color, label, note }) => (
              <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: color }} />
                <span style={{ ...annotation, fontSize: 10, textAlign: 'center' }}>{label}</span>
                <span style={{ ...annotation, fontSize: 9, fontFamily: 'monospace' }}>{color}</span>
                <span style={{ ...annotation, fontSize: 9 }}>{note}</span>
              </div>
            ))}
          </div>

          {/* 2c. Backgrounds & Surfaces */}
          <SubHeading>Backgrounds & Surfaces</SubHeading>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color="#03070d" label="--bg-page: #03070d — Page background" varName="--bg-page" border />
            <ColorSwatch color="rgba(3, 7, 13, 0.6)" label="--bg-surface — Input backgrounds, overlays" varName="--bg-surface" border />
            <ColorSwatch color="rgba(3, 7, 13, 0.92)" label="--bg-overlay — Nav bar, modal backdrops" varName="--bg-overlay" border />
            <ColorSwatch color="rgba(255, 255, 255, 0.03)" label="--surface-faint — Unselected items" varName="--surface-faint" border />
            <ColorSwatch color="rgba(255, 255, 255, 0.06)" label="--surface-light — Subtle borders" varName="--surface-light" border />
            <ColorSwatch color="rgba(255, 255, 255, 0.1)" label="--surface-border — Input/panel borders" varName="--surface-border" border />
          </div>

          {/* 2d. Domain Colors */}
          <SubHeading>Domain Colors (9)</SubHeading>

          <p style={{ ...annotation, marginBottom: 4 }}>
            Source: <code style={codeStyle}>src/cards/domain-colors.ts</code>
          </p>
          <p style={{ ...annotation, marginBottom: 12 }}>
            Primary (card inner fill, badges, accents)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {Object.entries(DOMAIN_COLORS).map(([name, color]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    background: color,
                    border: name === 'Midnight' ? '1px solid rgba(255,255,255,0.15)' : undefined,
                  }}
                />
                <span style={{ ...annotation, fontSize: 10, textAlign: 'center' }}>{name}</span>
                <span style={{ ...annotation, fontSize: 9, fontFamily: 'monospace' }}>{color}</span>
              </div>
            ))}
          </div>

          <p style={{ ...annotation, marginTop: 20, marginBottom: 12 }}>
            Muted (banner outer layer, darker saturated variants)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {Object.entries(DOMAIN_COLORS_MUTED).map(([name, color]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    background: color,
                    border: name === 'Midnight' ? '1px solid rgba(255,255,255,0.15)' : undefined,
                  }}
                />
                <span style={{ ...annotation, fontSize: 10, textAlign: 'center' }}>{name}</span>
                <span style={{ ...annotation, fontSize: 9, fontFamily: 'monospace' }}>{color}</span>
              </div>
            ))}
          </div>

          {/* 2e. Semantic / Stat Colors */}
          <SubHeading>Semantic / Stat Colors</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            Stats reuse domain colors for thematic consistency (see <code style={codeStyle}>src/hand/StatBar.tsx</code>).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color="#A61118" label="HP — #A61118 (reuses Blade domain)" />
            <ColorSwatch color="#A3A9A8" label="Armor — #A3A9A8 (reuses Bone domain)" />
            <ColorSwatch color="#BEA228" label="Hope — #BEA228 (reuses Splendor domain)" />
            <ColorSwatch color="#1E1E1E" label="Stress — #1E1E1E (reuses Midnight domain)" border />
          </div>
        </section>

        {/* ================================================================
            SECTION 3: COMPONENTS
            ================================================================ */}
        <section id="components" style={{ marginBottom: sectionGap, scrollMarginTop: 60 }}>
          <SectionHeader>Components</SectionHeader>

          {/* 3a. Buttons */}
          <SubHeading>GameButton</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/GameButton.tsx</code> — 3 variants: primary (steel + engraved text), secondary (lighter steel), ghost (transparent + gold underline).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ ...annotation, marginBottom: 8, color: 'var(--text-secondary)' }}>Primary</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <GameButton size="sm">Select</GameButton>
                <GameButton size="md">Continue</GameButton>
                <GameButton size="lg">Begin Adventure</GameButton>
                <GameButton size="md" disabled>Disabled</GameButton>
              </div>
            </div>
            <div>
              <p style={{ ...annotation, marginBottom: 8, color: 'var(--text-secondary)' }}>Secondary</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <GameButton variant="secondary" size="sm">Back</GameButton>
                <GameButton variant="secondary" size="md">Cancel</GameButton>
              </div>
            </div>
            <div>
              <p style={{ ...annotation, marginBottom: 8, color: 'var(--text-secondary)' }}>Ghost</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <GameButton variant="ghost" size="sm">Skip</GameButton>
                <GameButton variant="ghost" size="md">Reset</GameButton>
              </div>
            </div>
          </div>

          {/* 3b. Panels */}
          <SubHeading>GlassPanel</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/GlassPanel.tsx</code> — 3 variants: default, gold, domain.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <GlassPanel>
                <p style={{ ...typeBody, color: 'var(--text-primary)' }}>
                  Default — Semi-transparent with specular highlight and blur. Used by StatBar, CollapsiblePanel, and throughout the deck builder.
                </p>
              </GlassPanel>
            </div>
            <div>
              <GlassPanel variant="gold">
                <p style={{ ...typeBody, color: '#e7ba90' }}>
                  Gold — Gold-bordered variant for callouts and emphasis.
                </p>
              </GlassPanel>
            </div>
            <div>
              <GlassPanel variant="domain" domainColor={DOMAIN_COLORS.Codex}>
                <p style={{ ...typeBody, color: 'var(--text-primary)' }}>
                  Domain — Top border colored by domain. Used for domain-keyed content.
                </p>
              </GlassPanel>
            </div>
          </div>

          {/* 3c. Inputs */}
          <SubHeading>GameInput</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/GameInput.tsx</code> — Gold-accented focus ring, body font for content, subtitle font for label.
          </p>

          <div style={{ maxWidth: 360 }}>
            <GameInput
              label="Character Name"
              placeholder="Enter a name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {/* 3d. Section Headers */}
          <SubHeading>SectionHeader</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/SectionHeader.tsx</code> — Diamond-and-line ornament with gold gradient text. Used throughout the deck builder.
          </p>

          <div style={{ maxWidth: 500 }}>
            <SectionHeader>Choose Your Subclass</SectionHeader>
          </div>

          {/* 3e. Badges */}
          <SubHeading>GameBadge</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/GameBadge.tsx</code> — Pill badge with optional color override (defaults to gold). Uses <code style={codeStyle}>typeMicro</code> for text.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <GameBadge>Evasion 10</GameBadge>
            <GameBadge>Level 1</GameBadge>
            <GameBadge color="#A61118">HP 5/5</GameBadge>
            <GameBadge color="#A3A9A8">Armor 3</GameBadge>
            <GameBadge color={DOMAIN_COLORS.Codex}>Codex</GameBadge>
            <GameBadge color={DOMAIN_COLORS.Arcana}>Arcana</GameBadge>
            <GameBadge color={DOMAIN_COLORS.Grace}>Grace</GameBadge>
          </div>

          {/* 3f. StepInstruction */}
          <SubHeading>StepInstruction</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/StepInstruction.tsx</code> — Italic centered instruction text, used in all deck builder steps.
          </p>

          <GlassPanel style={{ padding: 16 }}>
            <StepInstruction>
              Choose two domain cards to add to your deck.
            </StepInstruction>
          </GlassPanel>

          {/* 3g. SelectableOption */}
          <SubHeading>SelectableOption</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/SelectableOption.tsx</code> — Tappable option with gold highlight on selection. Used by ArmorOption, WeaponOption, trait slots.
          </p>

          <GlassPanel style={{ padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
              <SelectableOption
                selected={demoSelected === 'a'}
                onClick={() => setDemoSelected('a')}
                layout={false}
              >
                <span style={{ ...typeSubtitle }}>
                  Heavy Armor
                </span>
                <span style={{ ...annotation, marginLeft: 8 }}>Armor 3, Slots 2</span>
              </SelectableOption>
              <SelectableOption
                selected={demoSelected === 'b'}
                onClick={() => setDemoSelected('b')}
                layout={false}
              >
                <span style={{ ...typeSubtitle }}>
                  Light Armor
                </span>
                <span style={{ ...annotation, marginLeft: 8 }}>Armor 1, Slots 4</span>
              </SelectableOption>
            </div>
          </GlassPanel>

          {/* 3h. AutoFitTitle */}
          <SubHeading>AutoFitTitle</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/ui/AutoFitTitle.tsx</code> — Auto-sizing title that scales down from maxFontSize (default 36px)
            to fit on one line. Uses ref measurement loop (0.5px steps)
            with <code style={codeStyle}>white-space: nowrap</code>. Used by SRDCard and DomainCard.
          </p>

          {/* 3i. Card Tokens */}
          <SubHeading>Card Tokens</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            <code style={codeStyle}>src/cards/card-tokens.ts</code> — Shared card design tokens: dimensions (360x508), gold gradient style, subtitle style, drop shadow, frame opacity, content overlay, illustration mask.
          </p>
        </section>

        {/* ================================================================
            SECTION 4: ARCHITECTURE NOTES
            ================================================================ */}
        <section id="architecture" style={{ marginBottom: 40, scrollMarginTop: 60 }}>
          <SectionHeader>Architecture Notes</SectionHeader>

          <div
            style={{
              marginTop: 24,
              border: '1px solid rgba(231, 186, 144, 0.15)',
              borderRadius: 12,
              padding: 24,
              background: 'rgba(231, 186, 144, 0.02)',
            }}
          >
            {/* Token Sources */}
            <h3
              className="gold-text"
              style={{
                ...typeSubtitle,
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Token Sources
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 20 }}>
              <thead>
                <tr style={{ background: 'rgba(231, 186, 144, 0.08)' }}>
                  {['Token Area', 'Canonical Source', 'Notes'].map((h) => (
                    <th key={h} style={{
                      padding: '8px 12px',
                      textAlign: 'left',
                      ...typeSubtitle,
                      color: '#e7ba90',
                      borderBottom: '1px solid rgba(231, 186, 144, 0.15)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ['Colors & surfaces', 'src/index.css (:root)', 'CSS custom properties; --gold, --bg-page, --text-primary, etc.'],
                  ['Typography', 'src/ui/typography.ts', '4 tiers: typeTitle, typeSubtitle, typeBody, typeMicro'],
                  ['Gold values', 'src/ui/typography.ts', 'goldLight, goldDark, goldGradient'],
                  ['Domain colors', 'src/cards/domain-colors.ts', '9 domains, primary + muted variants'],
                  ['Card tokens', 'src/cards/card-tokens.ts', 'Dimensions, gold gradient style, frame opacity, masks'],
                  ['Liquid Glass', 'src/index.css (.glass)', 'CSS classes: .glass, .glass-strong, .glass-dark, .glass-interactive'],
                ] as const).map(([area, source, notes], i) => (
                  <tr key={area} style={{
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{area}</td>
                    <td style={{ padding: '8px 12px', fontFamily: "'Source Sans 3', monospace", fontSize: 12, color: 'var(--text-secondary)' }}>{source}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Type Spine */}
            <h3
              className="gold-text"
              style={{
                ...typeSubtitle,
                fontSize: 18,
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Type Spine (4 Tiers)
            </h3>

            <div style={{
              border: '1px solid rgba(231, 186, 144, 0.2)',
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 20,
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(231, 186, 144, 0.08)' }}>
                    {['Tier', 'Size', 'Font', 'Weight / Variant', 'Use Cases'].map((h) => (
                      <th key={h} style={{
                        padding: '8px 12px',
                        textAlign: 'left',
                        ...typeSubtitle,
                        color: '#e7ba90',
                        borderBottom: '1px solid rgba(231, 186, 144, 0.15)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ['Display', '24-72px (contextual)', 'EB Garamond', '500, small-caps, 0.01em', 'Card titles (AutoFit), character names'],
                    ['Subtitle', '13px', 'EB Garamond', '600, small-caps, 0.06em', 'Buttons, equipment, headers, card subtitles, footers'],
                    ['Body', '13.5px', 'Source Sans 3', '400, line-height 1.4', 'Card descriptions, notes, helper text'],
                    ['Micro', '11px', 'EB Garamond', '600, small-caps, 0.06em', 'Badges, stat labels, pip indicators'],
                  ] as const).map(([tier, size, font, spec, uses], i) => (
                    <tr key={tier} style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#e7ba90' }}>{tier}</td>
                      <td style={{ padding: '8px 12px', fontFamily: "'Source Sans 3', monospace", color: 'var(--text-primary)' }}>{size}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{font}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{spec}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{uses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Color System */}
            <h3
              className="gold-text"
              style={{
                ...typeSubtitle,
                fontSize: 18,
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Color System
            </h3>

            <p style={proseStyle}>
              The app uses 2 base text hues:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>warm cream</strong> (<code style={codeStyle}>rgb(212, 207, 199)</code>) for body content and{' '}
              <strong style={{ color: '#e7ba90' }}>gold</strong> (<code style={codeStyle}>#e7ba90</code>) for accents and interactive elements.
              These are expressed via CSS custom properties at 3 and 4 semantic levels respectively.
              Domain colors provide 9 additional hues for game content.
              Stat colors reuse domain colors for thematic consistency.
            </p>

            {/* Future Consolidation */}
            <h3
              className="gold-text"
              style={{
                ...typeSubtitle,
                fontSize: 18,
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Future Consolidation
            </h3>

            <ul style={{ ...proseStyle, paddingLeft: 20 }}>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: '#e7ba90' }}>BaseCard component</strong> —
                SRDCard, DomainCard, and InfoCard share ~150 lines of identical structure.
                A shared BaseCard with slots would eliminate duplication.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: '#e7ba90' }}>CSS vs JS typography</strong> —
                Typography classes exist in CSS (<code style={codeStyle}>.type-subtitle</code>,{' '}
                <code style={codeStyle}>.type-body</code>) but are barely used.
                Components use the JS token objects. Commit to one approach.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: '#e7ba90' }}>Diamond separator</strong> —
                Still duplicated across 4 card components + SectionHeader.
                Could be a shared component or SVG.
              </li>
              <li>
                <strong style={{ color: '#e7ba90' }}>Scale wrapper standardization</strong> —
                Two methods coexist (card <code style={codeStyle}>scale</code> prop vs manual CSS transform wrapper). Standardize on the prop approach.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

// ─── Helper Components ───

function TierLabel({ tier, spec }: { tier: string; spec: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
      <span style={{ ...typeSubtitle, color: '#e7ba90' }}>
        {tier}
      </span>
      <span
        style={{
          fontFamily: "'Source Sans 3', monospace",
          fontSize: 11,
          color: 'var(--text-muted)',
        }}
      >
        {spec}
      </span>
    </div>
  )
}

function SubHeading({ children }: { children: string }) {
  return (
    <h3
      style={{
        ...typeSubtitle,
        color: 'rgba(231, 186, 144, 0.7)',
        marginTop: subGap,
        marginBottom: 16,
      }}
    >
      {children}
    </h3>
  )
}

interface TypoSpecimenProps {
  style: React.CSSProperties
  text: string
  note: string
  className?: string
  textColor?: string
}

function TypoSpecimen({ style: specimenStyle, text, note, className, textColor }: TypoSpecimenProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 20,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
        <span
          className={className}
          style={{
            ...specimenStyle,
            color: textColor,
            display: 'block',
          }}
        >
          {text}
        </span>
      </div>
      <div style={{ flex: '0 1 300px' }}>
        <span style={annotation}>{note}</span>
      </div>
    </div>
  )
}

function ColorSwatch({ color, label, border, varName, small }: {
  color: string
  label: string
  border?: boolean
  varName?: string
  small?: boolean
}) {
  const size = small ? 24 : 32
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          background: color,
          flexShrink: 0,
          border: border ? '1px solid rgba(255,255,255,0.15)' : undefined,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ ...annotation, fontSize: small ? 11 : 12.5 }}>{label}</span>
        {varName && (
          <span style={{ fontFamily: "'Source Sans 3', monospace", fontSize: 10, color: 'var(--text-muted)' }}>
            {varName}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Shared Styles ───

const codeStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', monospace",
  fontSize: 11.5,
  background: 'rgba(255, 255, 255, 0.06)',
  padding: '1px 6px',
  borderRadius: 3,
  color: 'var(--text-secondary)',
}

const proseStyle: React.CSSProperties = {
  fontFamily: typeBody.fontFamily,
  fontSize: 13.5,
  lineHeight: 1.6,
  color: 'var(--text-primary)',
  marginBottom: 12,
}

// ─── Utilities ───

function withAlpha(rgb: string, alpha: number): string {
  const match = rgb.match(/\d+/g)
  if (!match) return rgb
  return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`
}
