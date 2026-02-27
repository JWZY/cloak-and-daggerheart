import { useState } from 'react'
import { GameButton } from '../ui/GameButton'
import { SectionHeader } from '../ui/SectionHeader'
import { GlassPanel } from '../ui/GlassPanel'
import { GameInput } from '../ui/GameInput'
import { GameBadge } from '../ui/GameBadge'
import { StepInstruction } from '../ui/StepInstruction'
import { SelectableOption } from '../ui/SelectableOption'
import { DOMAIN_COLORS, DOMAIN_COLORS_MUTED } from '../cards/domain-colors'

// ─── Shared styles ───

const PAGE_BG = '#03070d'
const WARM = 'rgb(212, 207, 199)'

const heading: React.CSSProperties = {
  fontFamily: "'EB Garamond', serif",
  fontWeight: 500,
  fontVariant: 'small-caps',
  letterSpacing: '0.04em',
}

const annotation: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 12,
  color: `rgba(212, 207, 199, 0.45)`,
  lineHeight: 1.4,
}

const sectionGap = 64
const subGap = 32

// ─── Nav sections ───

const NAV_ITEMS = [
  { id: 'typography', label: 'Typography' },
  { id: 'colors', label: 'Colors' },
  { id: 'components', label: 'Components' },
  { id: 'consolidation', label: 'Consolidation' },
  { id: 'recommendations', label: 'Architecture' },
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
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      {/* Sticky Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(3, 7, 13, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(231, 186, 144, 0.12)',
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
              fontFamily: "'EB Garamond', serif",
              fontSize: 13,
              fontWeight: 600,
              fontVariant: 'small-caps',
              letterSpacing: '0.06em',
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
              fontSize: 15,
              color: 'rgba(231, 186, 144, 0.5)',
            }}
          >
            Cloak & Daggerheart — Living Style Reference
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1: TYPOGRAPHY
            ═══════════════════════════════════════════════════════ */}
        <section id="typography" style={{ marginBottom: sectionGap, scrollMarginTop: 60 }}>
          <SectionHeader>Typography</SectionHeader>

          {/* Type Spine — 5 tiers */}
          <SubHeading>Type Spine (5 Tiers)</SubHeading>

          <p style={{ ...annotation, marginBottom: 20, color: 'rgba(130, 200, 130, 0.6)' }}>
            Collapsed from ~20 unique sizes to 5 canonical tiers. Display is contextual (24-72px); all others are fixed.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Tier: Display */}
            <div>
              <TierLabel tier="Display" spec="EB Garamond 500, small-caps, contextual 24-72px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                <TypoSpecimen
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 36,
                    fontWeight: 500,
                    fontVariant: 'small-caps',
                    letterSpacing: '0.01em',
                  }}
                  className="gold-text gold-text-shadow"
                  text="Card Title (36px AutoFit)"
                  note="SRDCard, DomainCard titles"
                />
                <TypoSpecimen
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 24,
                    fontWeight: 500,
                    fontVariant: 'small-caps',
                  }}
                  className="gold-text gold-text-shadow"
                  text="Character Name (24px)"
                  note="HandView, DeckPreview, ReviewDeck, NameCharacter"
                />
              </div>
            </div>

            {/* Tier: UI */}
            <div>
              <TierLabel tier="UI" spec="EB Garamond 600, small-caps, 0.04em, 15px" />
              <div style={{ marginTop: 8 }}>
                <TypoSpecimen
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 15,
                    fontWeight: 600,
                    fontVariant: 'small-caps',
                    letterSpacing: '0.04em',
                  }}
                  text="Button Labels, Item Names, Trait Values"
                  note="GameButton, equipment names, list headings"
                />
              </div>
            </div>

            {/* Tier: Subtitle */}
            <div>
              <TierLabel tier="Subtitle" spec="EB Garamond 600, small-caps, 0.06em, 13px" />
              <div style={{ marginTop: 8 }}>
                <TypoSpecimen
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 13,
                    fontWeight: 600,
                    fontVariant: 'small-caps',
                    letterSpacing: '0.06em',
                  }}
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
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                  textColor="rgba(212, 207, 199, 0.9)"
                  text="Card body text with longer content to show line height. You have dedicated your study to the knowledge of the arcane."
                  note="SRDCard, DomainCard, InfoCard, descriptions, notes"
                />
              </div>
            </div>

            {/* Tier: Micro */}
            <div>
              <TierLabel tier="Micro" spec="Source Sans 3 or EB Garamond 600, 11px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                <TypoSpecimen
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                  }}
                  textColor="#e7ba90"
                  text="BADGE TEXT"
                  note="GameBadge, stat labels, pip indicators"
                />
                <TypoSpecimen
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 11,
                    fontWeight: 600,
                    fontVariant: 'small-caps',
                    letterSpacing: '0.04em',
                  }}
                  textColor="rgba(231, 186, 144, 0.4)"
                  text="Micro Label (Garamond)"
                  note="DeckPreview trait names, stat micro labels"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2: COLORS
            ═══════════════════════════════════════════════════════ */}
        <section id="colors" style={{ marginBottom: sectionGap, scrollMarginTop: 60 }}>
          <SectionHeader>Color Palette</SectionHeader>

          {/* 2a. Text Colors */}
          <SubHeading>Text Colors</SubHeading>

          <p style={{ ...annotation, marginBottom: 16 }}>
            Warm text scale — base: <code style={codeStyle}>rgb(212, 207, 199)</code>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color={withAlpha(WARM, 0.9)} label="0.9 — Body text (primary)" />
            <ColorSwatch color={withAlpha(WARM, 0.85)} label="0.85 — Equipment names" />
            <ColorSwatch color={withAlpha(WARM, 0.75)} label="0.75 — InfoCard description" />
            <ColorSwatch color={withAlpha(WARM, 0.7)} label="0.7 — Secondary labels" />
            <ColorSwatch color={withAlpha(WARM, 0.6)} label="0.6 — Metadata text" />
            <ColorSwatch color={withAlpha(WARM, 0.5)} label="0.5 — Muted labels, stats" />
            <ColorSwatch color={withAlpha(WARM, 0.45)} label="0.45 — Equipment details" />
            <ColorSwatch color={withAlpha(WARM, 0.4)} label="0.4 — Dimmed labels, trait names" />
            <ColorSwatch color={withAlpha(WARM, 0.35)} label="0.35 — Weapon group labels" />
            <ColorSwatch color={withAlpha(WARM, 0.3)} label="0.3 — Empty states, disabled" />
            <ColorSwatch color={withAlpha(WARM, 0.2)} label="0.2 — Ghost/placeholder" />
          </div>

          <p style={{ ...annotation, marginBottom: 16, marginTop: 28 }}>
            Gold text scale — base: <code style={codeStyle}>rgb(231, 186, 144)</code> / <code style={codeStyle}>#e7ba90</code>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color="rgba(231, 186, 144, 1)" label="1.0 (#e7ba90) — Primary gold accent" />
            <ColorSwatch color="rgba(231, 186, 144, 0.5)" label="0.5 — Instruction text, muted labels" />
            <ColorSwatch color="rgba(231, 186, 144, 0.4)" label="0.4 — Icons, dimmed gold" />
            <ColorSwatch color="rgba(231, 186, 144, 0.25)" label="0.25 — Step indicator inactive" />
          </div>

          {/* 2b. Background Colors */}
          <SubHeading>Background Colors</SubHeading>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color="#03070d" label="#03070d — Page/card background" border />
            <ColorSwatch color="rgba(3, 7, 13, 0.6)" label="rgba(3, 7, 13, 0.6) — Input backgrounds" border />
            <ColorSwatch color="rgba(3, 7, 13, 0.8)" label="rgba(3, 7, 13, 0.8) — Active button bg" border />
            <ColorSwatch color="rgba(255, 255, 255, 0.05)" label="rgba(255, 255, 255, 0.05) — Glass panel top" border />
            <ColorSwatch color="rgba(255, 255, 255, 0.03)" label="rgba(255, 255, 255, 0.03) — Unselected items" border />
            <ColorSwatch color="rgba(231, 186, 144, 0.08)" label="rgba(231, 186, 144, 0.08) — Selected items" border />
          </div>

          {/* 2c. Domain Colors */}
          <SubHeading>Domain Colors</SubHeading>

          <p style={{ ...annotation, marginBottom: 12 }}>
            Primary (card inner, badges, accents)
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
            Muted (banner outer layer)
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

          {/* 2d. Semantic / Stat Colors */}
          <SubHeading>Semantic / Stat Colors</SubHeading>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ColorSwatch color="#A61118" label="#A61118 — HP Red (also Blade domain)" />
            <ColorSwatch color="#A3A9A8" label="#A3A9A8 — Armor Gray (also Bone domain)" />
            <ColorSwatch color="#BEA228" label="#BEA228 — Hope Gold (also Splendor domain)" />
            <ColorSwatch color="#1E1E1E" label="#1E1E1E — Stress Black (also Midnight domain)" border />
          </div>

          {/* 2e. Gold Variants */}
          <SubHeading>Gold Variants</SubHeading>

          <p style={{ ...annotation, marginBottom: 16, color: 'rgba(231, 186, 144, 0.6)' }}>
            Six gold values are used across the codebase. Some are intentional gradient stops; others are contextual variants.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { color: '#e7ba90', label: 'Primary gold accent' },
              { color: '#f9f8f3', label: 'Gold gradient top' },
              { color: '#d4af37', label: 'CardBack dots fallback' },
              { color: '#DBC593', label: 'Banner stroke top' },
              { color: '#C29734', label: 'Banner stroke bottom' },
              { color: '#BEA228', label: 'Splendor domain' },
            ].map(({ color, label }) => (
              <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, background: color }} />
                <span style={{ ...annotation, fontSize: 10, textAlign: 'center', maxWidth: 72 }}>{label}</span>
                <span style={{ ...annotation, fontSize: 9, fontFamily: 'monospace' }}>{color}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3: COMPONENTS
            ═══════════════════════════════════════════════════════ */}
        <section id="components" style={{ marginBottom: sectionGap, scrollMarginTop: 60 }}>
          <SectionHeader>Components</SectionHeader>

          {/* 3a. Buttons */}
          <SubHeading>Buttons</SubHeading>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <GameButton size="sm">Select</GameButton>
            <GameButton size="md">Continue</GameButton>
            <GameButton size="lg">Begin Adventure</GameButton>
            <GameButton size="md" disabled>Disabled</GameButton>
          </div>

          {/* 3b. Panels */}
          <SubHeading>Panels</SubHeading>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <GlassPanel>
                <p style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                  GlassPanel (default) — Semi-transparent with specular highlight and blur.
                </p>
              </GlassPanel>
              <p style={{ ...annotation, marginTop: 6, color: 'rgba(130, 200, 130, 0.7)' }}>
                Used by StatBar, CollapsiblePanel, and throughout the deck builder
              </p>
            </div>

            <div>
              <GlassPanel variant="gold">
                <p style={{ fontSize: 13.5, lineHeight: 1.4, color: '#e7ba90' }}>
                  GlassPanel (gold) — Gold-bordered variant for important callouts.
                </p>
              </GlassPanel>
              <p style={{ ...annotation, marginTop: 6, color: 'rgba(231, 186, 144, 0.5)' }}>
                UNUSED in any consumer screen
              </p>
            </div>

            <GlassPanel style={{ borderLeft: '3px solid rgba(130, 200, 130, 0.4)', borderRadius: 4, padding: 14 }}>
              <p style={{ ...annotation, color: 'rgba(130, 200, 130, 0.7)' }}>
                <strong>Resolved:</strong> StatBar and CollapsiblePanel now consume GlassPanel
                instead of manually inlining glass styles. The duplication has been eliminated.
              </p>
            </GlassPanel>
          </div>

          {/* 3c. Inputs */}
          <SubHeading>Inputs</SubHeading>

          <div style={{ maxWidth: 360 }}>
            <GameInput
              label="Character Name"
              placeholder="Enter a name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <GlassPanel style={{ borderLeft: '3px solid rgba(231, 186, 144, 0.3)', borderRadius: 4, padding: 14, marginTop: 12 }}>
            <p style={{ ...annotation, color: 'rgba(212, 207, 199, 0.7)' }}>
              <strong>Note:</strong> NotesPanel uses a raw &lt;textarea&gt; with a slightly different border color
              (<code style={codeStyle}>rgba(255,255,255,0.08)</code> vs GameInput&apos;s <code style={codeStyle}>rgba(255,255,255,0.1)</code>).
            </p>
          </GlassPanel>

          {/* 3d. Section Headers */}
          <SubHeading>Section Headers</SubHeading>

          <div style={{ maxWidth: 500 }}>
            <SectionHeader>Choose Your Subclass</SectionHeader>
          </div>

          <GlassPanel style={{ borderLeft: '3px solid rgba(231, 186, 144, 0.3)', borderRadius: 4, padding: 14, marginTop: 12 }}>
            <p style={{ ...annotation, color: 'rgba(212, 207, 199, 0.7)' }}>
              <strong>Note:</strong> SectionHeader is used 16 times in the deck builder but zero times in HandView.
              The hand view has its own heading patterns using CollapsiblePanel titles.
            </p>
          </GlassPanel>

          {/* 3e. Badges */}
          <SubHeading>Badges</SubHeading>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <GameBadge>Evasion 10</GameBadge>
            <GameBadge>Level 1</GameBadge>
            <GameBadge color="#A61118">HP 5/5</GameBadge>
            <GameBadge color="#A3A9A8">Armor 3</GameBadge>
            <GameBadge color={DOMAIN_COLORS.Codex}>Codex</GameBadge>
          </div>

          {/* 3f. Cards — Remaining Duplication */}
          <SubHeading>Card Tokens</SubHeading>

          <GlassPanel style={{ padding: 16 }}>
            <p style={{ ...annotation, color: 'rgba(130, 200, 130, 0.6)', marginBottom: 12 }}>
              Card tokens consolidated into <code style={codeStyle}>src/cards/card-tokens.ts</code> (8 items resolved).
              Two items remain inline:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {([
                ['Atmosphere texture (atmosphere.png)', '3 copies — still inline in each card component'],
                ['Diamond separator', '4 copies (+ SectionHeader) — still inline'],
              ] as const).map(([name, note]) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '4px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span style={{ ...annotation, color: 'rgba(212, 207, 199, 0.7)' }}>
                    {name}
                  </span>
                  <span
                    style={{
                      ...annotation,
                      color: 'rgba(231, 186, 144, 0.5)',
                      fontFamily: 'monospace',
                      fontSize: 11,
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* 3g. Shared UI Primitives (New) */}
          <SubHeading>Shared UI Primitives</SubHeading>

          <p style={{ ...annotation, color: 'rgba(130, 200, 130, 0.6)', marginBottom: 16 }}>
            Extracted during consolidation to eliminate inline style duplication.
          </p>

          {/* StepInstruction demo */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(212, 207, 199, 0.7)',
                marginBottom: 8,
              }}
            >
              StepInstruction
              <span style={{ ...annotation, marginLeft: 8, fontWeight: 400 }}>
                src/ui/StepInstruction.tsx — used in all 6 deck builder steps
              </span>
            </p>
            <GlassPanel style={{ padding: 16 }}>
              <StepInstruction>
                Choose two domain cards to add to your deck.
              </StepInstruction>
              <p style={{ ...annotation, textAlign: 'center', marginTop: -12 }}>
                (live component)
              </p>
            </GlassPanel>
          </div>

          {/* SelectableOption demo */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(212, 207, 199, 0.7)',
                marginBottom: 8,
              }}
            >
              SelectableOption
              <span style={{ ...annotation, marginLeft: 8, fontWeight: 400 }}>
                src/ui/SelectableOption.tsx — used by ArmorOption, WeaponOption, trait slots
              </span>
            </p>
            <GlassPanel style={{ padding: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
                <SelectableOption
                  selected={demoSelected === 'a'}
                  onClick={() => setDemoSelected('a')}
                  layout={false}
                >
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 600, fontVariant: 'small-caps', letterSpacing: '0.04em' }}>
                    Heavy Armor
                  </span>
                  <span style={{ ...annotation, marginLeft: 8 }}>Armor 3, Slots 2</span>
                </SelectableOption>
                <SelectableOption
                  selected={demoSelected === 'b'}
                  onClick={() => setDemoSelected('b')}
                  layout={false}
                >
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 600, fontVariant: 'small-caps', letterSpacing: '0.04em' }}>
                    Light Armor
                  </span>
                  <span style={{ ...annotation, marginLeft: 8 }}>Armor 1, Slots 4</span>
                </SelectableOption>
              </div>
              <p style={{ ...annotation, textAlign: 'center', marginTop: 12 }}>
                (live components — click to toggle selection)
              </p>
            </GlassPanel>
          </div>

          {/* AutoFitTitle note */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(212, 207, 199, 0.7)',
                marginBottom: 8,
              }}
            >
              AutoFitTitle
              <span style={{ ...annotation, marginLeft: 8, fontWeight: 400 }}>
                src/ui/AutoFitTitle.tsx — used by SRDCard and DomainCard
              </span>
            </p>
            <GlassPanel style={{ padding: 14, borderLeft: '3px solid rgba(130, 200, 130, 0.4)', borderRadius: 4 }}>
              <p style={{ ...annotation, color: 'rgba(212, 207, 199, 0.6)' }}>
                Auto-sizing title that scales down from maxFontSize (default 36px) to fit on one line.
                Uses ref measurement loop (0.5px steps) with <code style={codeStyle}>white-space: nowrap</code>.
                Cannot be demoed outside card context.
              </p>
            </GlassPanel>
          </div>

          {/* Wrapper cards note */}
          <div>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(212, 207, 199, 0.7)',
                marginBottom: 8,
              }}
            >
              AncestryCard / CommunityCard
              <span style={{ ...annotation, marginLeft: 8, fontWeight: 400 }}>
                src/cards/ — thin wrappers around InfoCard with data mapping
              </span>
            </p>
            <GlassPanel style={{ padding: 14, borderLeft: '3px solid rgba(130, 200, 130, 0.4)', borderRadius: 4 }}>
              <p style={{ ...annotation, color: 'rgba(212, 207, 199, 0.6)' }}>
                New convenience components that take raw SRD data (Ancestry or Community)
                and render via InfoCard with internal card-mapper transforms.
                Eliminates ad-hoc mapping logic from consumer components.
              </p>
            </GlassPanel>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4: OPEN CONSOLIDATION ITEMS
            ═══════════════════════════════════════════════════════ */}
        <section id="consolidation" style={{ marginBottom: sectionGap, scrollMarginTop: 60 }}>
          <SectionHeader>Open Consolidation Items</SectionHeader>

          <p style={{ ...annotation, color: 'rgba(130, 200, 130, 0.6)', marginBottom: 16, marginTop: 16 }}>
            9 of 10 duplicated patterns have been consolidated. One remains open:
          </p>

          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {([
              {
                num: 10,
                name: 'Scale wrapper pattern',
                locations: '7+ instances with two different approaches (prop vs manual transform)',
              },
            ] as const).map(({ num, name, locations }) => (
              <div
                key={num}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#e7ba90',
                    flexShrink: 0,
                    width: 20,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {`${num}.`}
                </span>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'rgba(212, 207, 199, 0.85)',
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 12,
                      color: 'rgba(212, 207, 199, 0.5)',
                      marginLeft: 8,
                    }}
                  >
                    {locations}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 5: ARCHITECTURE NOTES & RECOMMENDATIONS
            ═══════════════════════════════════════════════════════ */}
        <section id="recommendations" style={{ marginBottom: 40, scrollMarginTop: 60 }}>
          <SectionHeader>Architecture Notes & Recommendations</SectionHeader>

          <div
            style={{
              marginTop: 24,
              border: '1px solid rgba(231, 186, 144, 0.15)',
              borderRadius: 12,
              padding: 24,
              background: 'rgba(231, 186, 144, 0.02)',
            }}
          >
            {/* Opening */}
            <p style={proseStyle}>
              The type spine has been collapsed from ~20 unique font sizes to 5 canonical tiers.
              Card tokens, shared UI primitives, and glass panel usage have all been consolidated.
              The remaining work focuses on structural consolidation (BaseCard, character name display,
              scale wrappers) and enforcing the type spine across all components.
            </p>

            {/* Type Spine — Implemented */}
            <h3
              className="gold-text"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 18,
                fontWeight: 600,
                fontVariant: 'small-caps',
                letterSpacing: '0.04em',
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Type Spine (5 Tiers)
            </h3>

            <p style={proseStyle}>
              The SRDCard is the canonical source. The 5-tier system collapses the original ~20
              sizes down to: <strong style={{ color: '#e7ba90' }}>Display</strong> (contextual 24-72px),{' '}
              <strong style={{ color: '#e7ba90' }}>UI</strong> (15px),{' '}
              <strong style={{ color: '#e7ba90' }}>Subtitle</strong> (13px),{' '}
              <strong style={{ color: '#e7ba90' }}>Body</strong> (13.5px), and{' '}
              <strong style={{ color: '#e7ba90' }}>Micro</strong> (11px).
            </p>

            {/* Type Spine Table */}
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
                        fontFamily: "'EB Garamond', serif",
                        fontVariant: 'small-caps',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: '#e7ba90',
                        borderBottom: '1px solid rgba(231, 186, 144, 0.15)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ['Display', '24-72px (contextual)', 'EB Garamond', '500, small-caps', 'Card titles (AutoFit), character names (24px)'],
                    ['UI', '15px', 'EB Garamond', '600, small-caps, 0.04em', 'Buttons, equipment names, trait values, list headings'],
                    ['Subtitle', '13px', 'EB Garamond', '600, small-caps, 0.06em', 'Section headers, card subtitles, panel titles, footers'],
                    ['Body', '13.5px', 'Source Sans 3', '400, line-height 1.4', 'Card body text, descriptions, notes, helper text'],
                    ['Micro', '11px', 'Source Sans 3 / EB Garamond', '600', 'Badges, stat labels, pip indicators'],
                  ] as const).map(([tier, size, font, spec, uses], i) => (
                    <tr key={tier} style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#e7ba90' }}>{tier}</td>
                      <td style={{ padding: '8px 12px', fontFamily: "'Source Sans 3', monospace", color: 'rgba(212,207,199,0.9)' }}>{size}</td>
                      <td style={{ padding: '8px 12px', color: 'rgba(212,207,199,0.7)' }}>{font}</td>
                      <td style={{ padding: '8px 12px', color: 'rgba(212,207,199,0.6)' }}>{spec}</td>
                      <td style={{ padding: '8px 12px', color: 'rgba(212,207,199,0.6)' }}>{uses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MDS Rule Check */}
            <h3
              className="gold-text"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 18,
                fontWeight: 600,
                fontVariant: 'small-caps',
                letterSpacing: '0.04em',
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              MDS Rule Check: 3 Sizes, 2 Colors
            </h3>

            <h4 style={subProseHeading}>
              Font Sizes: 20 unique values &rarr; 4 tiers + 1 utility
            </h4>

            <p style={proseStyle}>
              The current scale runs from 9px to 72px with 20 stops. The proposed 4-tier spine
              (Display 36, UI 15, Subtitle 13, Body 13.5) plus Micro (11) collapses this to 5
              distinct tokens. MDS says max 3 &mdash; the extra two are: one for interactive
              affordances (buttons need to feel different from labels), and one utility token for
              constrained-space chrome. Both @creative and @ux independently concluded that 3
              sizes cannot bridge the 22.5px gap between card titles and card body text without
              functional regression.
            </p>

            <h4 style={subProseHeading}>
              Colors: 2 base hues + domain palette &check;
            </h4>

            <p style={proseStyle}>
              The app only has 2 base text colors, which aligns cleanly:
            </p>

            <ul style={{ ...proseStyle, paddingLeft: 20, marginBottom: 12 }}>
              <li style={{ marginBottom: 6 }}>
                <strong style={{ color: 'rgba(212, 207, 199, 0.9)' }}>Warm cream</strong>:&nbsp;
                <code style={codeStyle}>rgb(212, 207, 199)</code> &mdash; body text (Source Sans 3)
              </li>
              <li>
                <strong style={{ color: '#e7ba90' }}>Gold</strong>:&nbsp;
                <code style={codeStyle}>#e7ba90</code> &mdash; accent, labels, interactive (EB Garamond)
              </li>
            </ul>

            <p style={proseStyle}>
              But these 2 colors explode into 10+ opacity variants of warm cream and 4+ of gold.
              Recommended semantic levels:
            </p>

            <ul style={{ ...proseStyle, paddingLeft: 20, marginBottom: 12 }}>
              <li style={{ marginBottom: 4 }}>
                <code style={codeStyle}>text-primary</code> (0.9),&nbsp;
                <code style={codeStyle}>text-secondary</code> (0.6),&nbsp;
                <code style={codeStyle}>text-muted</code> (0.4),&nbsp;
                <code style={codeStyle}>text-faint</code> (0.2)
              </li>
              <li>
                <code style={codeStyle}>gold</code> (1.0),&nbsp;
                <code style={codeStyle}>gold-muted</code> (0.5),&nbsp;
                <code style={codeStyle}>gold-subtle</code> (0.25)
              </li>
            </ul>

            {/* Deeper Consolidation */}
            <h3
              className="gold-text"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 18,
                fontWeight: 600,
                fontVariant: 'small-caps',
                letterSpacing: '0.04em',
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Deeper Consolidation (Next Phase)
            </h3>

            <p style={{ ...proseStyle, color: 'rgba(212, 207, 199, 0.6)', fontStyle: 'italic', marginBottom: 16 }}>
              With card-tokens.ts and shared UI primitives in place, the next phase focuses on
              structural consolidation and consistency enforcement.
            </p>

            <ul style={{ ...proseStyle, paddingLeft: 20 }}>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: '#e7ba90' }}>BaseCard component</strong> &mdash;
                SRDCard, DomainCard, and InfoCard share ~150 lines of identical structure
                (container, illustration mask, atmosphere, content gradient, frame overlay, separator).
                A shared BaseCard with slots would eliminate massive duplication.
                <span style={{ ...annotation, display: 'block', marginTop: 4, color: 'rgba(130, 200, 130, 0.5)' }}>
                  Note: card-tokens.ts provides the shared values; BaseCard would share the shared structure.
                </span>
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: '#e7ba90' }}>Unified selection indicator</strong> &mdash;
                DomainCard uses green outline, CardSelector uses gold border.
                Pick one language.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: '#e7ba90' }}>CSS vs JS decision</strong> &mdash;
                Typography classes exist in CSS (<code style={codeStyle}>.type-subtitle</code>,&nbsp;
                <code style={codeStyle}>.type-body</code>) but are barely used.
                Components define the same styles as JS objects. Commit to one approach.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: '#e7ba90' }}>Standardize card scaling</strong> &mdash;
                Two methods coexist (card <code style={codeStyle}>scale</code> prop vs manual CSS
                transform wrapper). Standardize on the prop approach.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong style={{ color: 'rgba(130, 200, 130, 0.7)' }}>Character name display</strong> &mdash;
                <span style={{ color: 'rgba(130, 200, 130, 0.6)' }}>Resolved. Collapsed 3 sizes (28/24/20px) to single 24px
                across HandView, DeckPreview, ReviewDeck, and NameCharacter.</span>
              </li>
              <li>
                <strong style={{ color: '#e7ba90' }}>Diamond separator</strong> &mdash;
                Still duplicated across 4 card components + SectionHeader.
                Could be a tiny shared component or SVG.
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
      <span
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 15,
          fontWeight: 600,
          fontVariant: 'small-caps',
          letterSpacing: '0.04em',
          color: '#e7ba90',
        }}
      >
        {tier}
      </span>
      <span
        style={{
          fontFamily: "'Source Sans 3', monospace",
          fontSize: 11,
          color: 'rgba(212, 207, 199, 0.45)',
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
        fontFamily: "'EB Garamond', serif",
        fontSize: 15,
        fontWeight: 600,
        fontVariant: 'small-caps',
        letterSpacing: '0.04em',
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

function ColorSwatch({ color, label, border }: { color: string; label: string; border?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: color,
          flexShrink: 0,
          border: border ? '1px solid rgba(255,255,255,0.15)' : undefined,
        }}
      />
      <span style={{ ...annotation, fontSize: 12.5 }}>{label}</span>
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
  color: 'rgba(212, 207, 199, 0.7)',
}

const proseStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 13.5,
  lineHeight: 1.6,
  color: 'rgba(212, 207, 199, 0.8)',
  marginBottom: 12,
}

const subProseHeading: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 14,
  fontWeight: 700,
  color: 'rgba(212, 207, 199, 0.9)',
  marginTop: 20,
  marginBottom: 8,
}

// ─── Utilities ───

function withAlpha(rgb: string, alpha: number): string {
  const match = rgb.match(/\d+/g)
  if (!match) return rgb
  return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`
}
