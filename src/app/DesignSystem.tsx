import { useState } from 'react'
import { Heart, Shield, Star, BookOpen } from 'lucide-react'
import { GameButton } from '../ui/GameButton'
import { SectionHeader } from '../ui/SectionHeader'
import { GlassPanel } from '../ui/GlassPanel'
import { GameInput } from '../ui/GameInput'
import { GameBadge } from '../ui/GameBadge'
import { DOMAIN_COLORS } from '../cards/domain-colors'

const DOMAIN_NAMES = Object.keys(DOMAIN_COLORS)

export default function DesignSystem() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#03070d',
        color: '#D4CFC7',
        fontFamily: "'Source Sans 3', sans-serif",
        padding: '40px 24px 80px',
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      {/* Page title */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1
          className="gold-text gold-text-shadow"
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}
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
          Cloak & Daggerheart UI Primitives
        </p>
      </div>

      {/* ─── Color Palette ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Color Palette</SectionHeader>

        <div style={{ marginTop: 20 }}>
          <Label>Core Gold Gradient</Label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Swatch color="#f9f8f3" label="Gold Light" />
            <Swatch color="#e7ba90" label="Gold Mid" />
            <Swatch color="#C29734" label="Gold Solid" />
            <Swatch color="#4d381e" label="Gold Dark" />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Domain Colors</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {DOMAIN_NAMES.map((name) => (
              <Swatch key={name} color={DOMAIN_COLORS[name]} label={name} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Surface & Text</Label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Swatch color="#03070d" label="Background" border />
            <Swatch color="#D4CFC7" label="Body Text" />
            <Swatch color="rgba(231, 186, 144, 0.5)" label="Muted Gold" />
            <Swatch color="#A61118" label="HP Red" />
          </div>
        </div>
      </section>

      {/* ─── Typography ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Typography</SectionHeader>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <Label>Display — EB Garamond 36px</Label>
            <p
              className="gold-text gold-text-shadow"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 36,
                fontWeight: 500,
                letterSpacing: '0.01em',
                fontVariant: 'small-caps',
                marginTop: 4,
              }}
            >
              School of Knowledge
            </p>
          </div>

          <div>
            <Label>Subtitle — EB Garamond 13px small-caps</Label>
            <p
              className="gold-text"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.06em',
                fontVariant: 'small-caps',
                marginTop: 4,
              }}
            >
              Wizard &middot; Codex &middot; Splendor
            </p>
          </div>

          <div>
            <Label>Body — Source Sans 3, 13.5px</Label>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13.5,
                lineHeight: 1.4,
                color: 'rgba(212, 207, 199, 0.9)',
                marginTop: 4,
                maxWidth: 400,
              }}
            >
              You have dedicated your study to the knowledge of the arcane.
              Your deep understanding of magical theory allows you to recall
              spells with ease and precision.
            </p>
          </div>

          <div>
            <Label>UI Label — EB Garamond 11px small-caps</Label>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
                fontVariant: 'small-caps',
                color: 'rgba(231, 186, 144, 0.5)',
                marginTop: 4,
              }}
            >
              Hit Points &middot; Armor &middot; Hope &middot; Stress
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section Headers ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Section Headers</SectionHeader>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionHeader>Choose Your Subclass</SectionHeader>
          <SectionHeader>Draft Domain Cards</SectionHeader>
          <SectionHeader>Assign Traits</SectionHeader>
        </div>
      </section>

      {/* ─── Buttons ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Buttons</SectionHeader>

        <div style={{ marginTop: 20 }}>
          <Label>Primary (Gold Gradient, Engraved Text)</Label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <GameButton size="lg">Begin Adventure</GameButton>
            <GameButton size="md">Continue</GameButton>
            <GameButton size="sm">Select</GameButton>
            <GameButton size="md" disabled>Disabled</GameButton>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Secondary (Dark, Gold Border)</Label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <GameButton variant="secondary" size="lg">Back</GameButton>
            <GameButton variant="secondary" size="md">Cancel</GameButton>
            <GameButton variant="secondary" size="sm">Skip</GameButton>
            <GameButton variant="secondary" disabled>Disabled</GameButton>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Label>Ghost (Transparent, Gold Underline on Hover)</Label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <GameButton variant="ghost">Tap to zoom</GameButton>
            <GameButton variant="ghost">View details</GameButton>
          </div>
        </div>
      </section>

      {/* ─── Glass Panels ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Glass Panels</SectionHeader>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Label>Default</Label>
            <GlassPanel style={{ marginTop: 8 }}>
              <p style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                Semi-transparent panel with specular highlight and subtle blur.
                Used for stat blocks, equipment lists, and note panels.
              </p>
            </GlassPanel>
          </div>

          <div>
            <Label>Gold Accent</Label>
            <GlassPanel variant="gold" style={{ marginTop: 8 }}>
              <p style={{ fontSize: 13.5, lineHeight: 1.4, color: '#e7ba90' }}>
                Gold-bordered variant for important callouts and selected states.
              </p>
            </GlassPanel>
          </div>

          <div>
            <Label>Domain Accent (Codex Blue)</Label>
            <GlassPanel variant="domain" domainColor={DOMAIN_COLORS.Codex} style={{ marginTop: 8 }}>
              <p style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                Domain-colored top border. Color matches the character's primary domain.
              </p>
            </GlassPanel>
          </div>

          <div>
            <Label>Domain Accent (Splendor Gold)</Label>
            <GlassPanel variant="domain" domainColor={DOMAIN_COLORS.Splendor} style={{ marginTop: 8 }}>
              <p style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                Each domain has a signature color used across cards, badges, and panels.
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* ─── Inputs ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Inputs</SectionHeader>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
          <GameInput
            label="Character Name"
            placeholder="Enter a name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <GameInput
            placeholder="Without label..."
          />
          <GameInput
            label="Disabled Input"
            placeholder="Can't type here"
            disabled
            style={{ opacity: 0.5 }}
          />
        </div>
      </section>

      {/* ─── Badges ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Badges</SectionHeader>

        <div style={{ marginTop: 20 }}>
          <Label>Default (Gold)</Label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <GameBadge>Evasion 10</GameBadge>
            <GameBadge>Level 1</GameBadge>
            <GameBadge>Proficiency +1</GameBadge>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Label>Domain Colors</Label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {DOMAIN_NAMES.map((name) => (
              <GameBadge key={name} color={DOMAIN_COLORS[name]}>{name}</GameBadge>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Label>With Icons</Label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <GameBadge color="#A61118">
              <Heart size={10} fill="#A61118" style={{ marginRight: 4 }} />
              HP 5/5
            </GameBadge>
            <GameBadge color="#A3A9A8">
              <Shield size={10} fill="#A3A9A8" style={{ marginRight: 4 }} />
              Armor 3
            </GameBadge>
            <GameBadge color="#BEA228">
              <Star size={10} fill="#BEA228" style={{ marginRight: 4 }} />
              Hope 2
            </GameBadge>
          </div>
        </div>
      </section>

      {/* ─── Composition ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Composition Example</SectionHeader>

        <GlassPanel variant="gold" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1D3B61, #2d4a3e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={24} color="#e7ba90" />
              </div>
              <div>
                <p
                  className="gold-text"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 18,
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    fontVariant: 'small-caps',
                  }}
                >
                  School of Knowledge
                </p>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <GameBadge color={DOMAIN_COLORS.Codex}>Codex</GameBadge>
                  <GameBadge color={DOMAIN_COLORS.Splendor}>Splendor</GameBadge>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13.5, lineHeight: 1.4, color: 'rgba(212, 207, 199, 0.9)' }}>
              You have dedicated your study to the knowledge of the arcane. Your deep understanding
              of magical theory allows you to recall spells with ease and precision.
            </p>

            <div style={{ display: 'flex', gap: 8 }}>
              <GameBadge color="#A61118">
                <Heart size={10} fill="#A61118" style={{ marginRight: 4 }} />5 HP
              </GameBadge>
              <GameBadge color="#A3A9A8">
                <Shield size={10} fill="#A3A9A8" style={{ marginRight: 4 }} />3 Armor
              </GameBadge>
              <GameBadge>Evasion 10</GameBadge>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <GameButton size="sm">Select</GameButton>
              <GameButton variant="ghost" size="sm">View Card</GameButton>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* ─── Tokens Reference ─── */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader>Design Tokens</SectionHeader>

        <GlassPanel style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
            <TokenRow label="Background" value="#03070d" />
            <TokenRow label="Gold Light" value="#f9f8f3" />
            <TokenRow label="Gold Mid" value="#e7ba90" />
            <TokenRow label="Gold Solid / Border" value="#C29734" />
            <TokenRow label="Gold Dark / Shadow" value="#4d381e" />
            <TokenRow label="Body Text" value="#D4CFC7 @ 90%" />
            <TokenRow label="Display Font" value="EB Garamond, serif" />
            <TokenRow label="Body Font" value="Source Sans 3, sans-serif" />
            <TokenRow label="Gold Gradient" value="180deg, #f9f8f3 → #e7ba90" />
            <TokenRow label="Text Shadow" value="0px 1px 1px #4d381e" />
            <TokenRow label="Specular Highlight" value="inset 0 1px 1px rgba(255,255,255,0.375)" />
            <TokenRow label="Drop Shadow" value="0 4px 16px rgba(0,0,0,0.25)" />
            <TokenRow label="Spring (buttons)" value="stiffness: 400, damping: 30, mass: 0.8" />
          </div>
        </GlassPanel>
      </section>
    </div>
  )
}

// ─── Helper Components ───

function Label({ children }: { children: string }) {
  return (
    <p
      style={{
        fontFamily: "'EB Garamond', serif",
        fontSize: 11,
        fontWeight: 600,
        fontVariant: 'small-caps',
        letterSpacing: '0.06em',
        color: 'rgba(231, 186, 144, 0.4)',
        textTransform: 'lowercase',
      }}
    >
      {children}
    </p>
  )
}

function Swatch({ color, label, border }: { color: string; label: string; border?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: color,
          border: border ? '1px solid rgba(255,255,255,0.15)' : undefined,
        }}
      />
      <span
        style={{
          fontSize: 9,
          color: 'rgba(212, 207, 199, 0.5)',
          textAlign: 'center',
          maxWidth: 56,
        }}
      >
        {label}
      </span>
    </div>
  )
}

function TokenRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'rgba(231, 186, 144, 0.6)', fontWeight: 600 }}>{label}</span>
      <code
        style={{
          fontFamily: "'Source Sans 3', monospace",
          fontSize: 11,
          color: 'rgba(212, 207, 199, 0.7)',
          background: 'rgba(255,255,255,0.05)',
          padding: '2px 8px',
          borderRadius: 4,
        }}
      >
        {value}
      </code>
    </div>
  )
}
