import { useState } from 'react'
import {
  typeTitle,
  typeSubtitle,
  typeBody,
  typeMicro,
  goldDark,
  goldDarkAlpha,
  goldLightAlpha,
  goldGradientStyle,
} from '../ui/typography'

// ─── Warm Base Colors ───────────────────────────────────────────────────────
// Solid warm-tinted fills — these survive backdrop-filter blur on the cold #03070d page bg.
// HSB ~30°, shifted to deep brown territory so glass surfaces read warm, not blue.

const WARM_FILL_MID = 'rgba(45, 34, 22, 0.55)'    // warm brown, medium
const WARM_FILL_LO  = 'rgba(30, 22, 14, 0.4)'     // warm brown, subtle
const WARM_BORDER   = goldDarkAlpha(0.15)           // gold-tinted border
const WARM_SPEC     = goldLightAlpha(0.18)          // specular highlight, warm cream

// ─── Style Definitions ─────────────────────────────────────────────────────

interface SurfaceStyle {
  background: string
  backdropFilter: string
  WebkitBackdropFilter: string
  border: string
  borderRadius: number
  boxShadow: string
}

interface SelectedBorder {
  border: string
}

interface ProposalDef {
  label: string
  subtitle: string
  characterCard: SurfaceStyle
  option: SurfaceStyle
  optionSelected: SelectedBorder
  glassContainer: SurfaceStyle
  pill: SurfaceStyle
  menu: SurfaceStyle
}

// ─── Unified Glass: A's consistent treatment + B's lighter fill ─────────────

const GLASS_BG      = `linear-gradient(180deg, ${WARM_FILL_MID}, ${WARM_FILL_LO})`
const GLASS_BLUR    = 'blur(12px) saturate(1.4)'
const GLASS_SHADOW  = `inset 0 1px 1px ${WARM_SPEC}, inset 0 -1px 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.3)`

const unifiedGlass: ProposalDef = {
  label: 'Unified Glass',
  subtitle: 'Same warm glass treatment everywhere — only border-radius varies',
  characterCard: {
    background: GLASS_BG,
    backdropFilter: GLASS_BLUR,
    WebkitBackdropFilter: GLASS_BLUR,
    border: `1px solid ${WARM_BORDER}`,
    borderRadius: 16,
    boxShadow: GLASS_SHADOW,
  },
  option: {
    background: GLASS_BG,
    backdropFilter: GLASS_BLUR,
    WebkitBackdropFilter: GLASS_BLUR,
    border: `1px solid ${WARM_BORDER}`,
    borderRadius: 12,
    boxShadow: GLASS_SHADOW,
  },
  optionSelected: { border: `1px solid ${goldDarkAlpha(0.4)}` },
  glassContainer: {
    background: GLASS_BG,
    backdropFilter: GLASS_BLUR,
    WebkitBackdropFilter: GLASS_BLUR,
    border: `1px solid ${WARM_BORDER}`,
    borderRadius: 16,
    boxShadow: GLASS_SHADOW,
  },
  pill: {
    background: GLASS_BG,
    backdropFilter: GLASS_BLUR,
    WebkitBackdropFilter: GLASS_BLUR,
    border: `1px solid ${WARM_BORDER}`,
    borderRadius: 9999,
    boxShadow: GLASS_SHADOW,
  },
  menu: {
    background: GLASS_BG,
    backdropFilter: GLASS_BLUR,
    WebkitBackdropFilter: GLASS_BLUR,
    border: `1px solid ${WARM_BORDER}`,
    borderRadius: 20,
    boxShadow: GLASS_SHADOW,
  },
}

// ─── Mock Components ────────────────────────────────────────────────────────

function MockCharacterCard({ style }: { style: SurfaceStyle }) {
  return (
    <div style={{ ...style, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* Avatar circle */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${goldDarkAlpha(0.2)}, ${goldDarkAlpha(0.06)})`,
          border: `1px solid ${goldDarkAlpha(0.2)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ ...typeSubtitle, fontSize: 20, ...goldGradientStyle }}>K</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...typeSubtitle, fontSize: 16, color: 'var(--text-primary)' }}>
          Kaelen Duskwalker
        </div>
        <div style={{ ...typeBody, fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          Nightstalker Ranger
        </div>
      </div>
      <div
        style={{
          ...typeMicro,
          fontSize: 10,
          color: goldDark,
          background: goldDarkAlpha(0.1),
          padding: '3px 8px',
          borderRadius: 8,
          border: `1px solid ${goldDarkAlpha(0.15)}`,
        }}
      >
        Lvl 3
      </div>
    </div>
  )
}

function MockSelectableOption({
  style,
  selectedStyle,
  selected,
  label,
  value,
}: {
  style: SurfaceStyle
  selectedStyle: SelectedBorder
  selected: boolean
  label: string
  value: string
}) {
  return (
    <div
      style={{
        ...style,
        ...(selected ? selectedStyle : {}),
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <span style={{ ...typeBody, color: 'var(--text-primary)' }}>{label}</span>
      <span
        style={{
          ...typeMicro,
          fontSize: 12,
          color: selected ? goldDark : 'var(--text-muted)',
          transition: 'color 0.2s',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function MockGlassContainer({ style }: { style: SurfaceStyle }) {
  return (
    <div style={{ ...style, padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ ...typeMicro, color: 'var(--gold-secondary)' }}>Armor</span>
        <span style={{ ...typeBody, fontWeight: 600, color: 'var(--text-secondary)' }}>3/5</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: i <= 3 ? '#B8A48E' : 'transparent',
              border: `1.5px solid ${i <= 3 ? '#B8A48E' : 'var(--text-muted)'}`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          gap: 6,
        }}
      >
        <span
          style={{
            ...typeMicro,
            fontSize: 10,
            color: goldDark,
            background: goldDarkAlpha(0.1),
            padding: '2px 7px',
            borderRadius: 6,
            border: `1px solid ${goldDarkAlpha(0.12)}`,
          }}
        >
          Evasion 11
        </span>
        <span
          style={{
            ...typeMicro,
            fontSize: 10,
            color: goldDark,
            background: goldDarkAlpha(0.1),
            padding: '2px 7px',
            borderRadius: 6,
            border: `1px solid ${goldDarkAlpha(0.12)}`,
          }}
        >
          Major 4
        </span>
      </div>
    </div>
  )
}

function MockFloatingPill({ style }: { style: SurfaceStyle }) {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['Cards', 'Actions', 'Info']

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          ...style,
          height: 44,
          padding: '0 6px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              ...typeMicro,
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === i ? goldDark : 'var(--text-muted)',
              background: activeTab === i ? goldDarkAlpha(0.12) : 'transparent',
              border: 'none',
              borderRadius: 9999,
              padding: '6px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

function MockMenuDropdown({ style }: { style: SurfaceStyle }) {
  const items = ['Edit Character', 'Level Up', 'Export Deck', 'Reset']

  return (
    <div style={{ ...style, padding: '6px 0', width: 180 }}>
      {items.map((item, i) => (
        <div
          key={item}
          style={{
            ...typeBody,
            fontSize: 14,
            color: i === items.length - 1 ? 'rgba(200, 80, 70, 0.85)' : 'var(--text-primary)',
            padding: '9px 16px',
            cursor: 'pointer',
            borderBottom:
              i < items.length - 1
                ? `1px solid ${goldDarkAlpha(0.06)}`
                : 'none',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

// ─── Preview Column ─────────────────────────────────────────────────────────

function PreviewColumn() {
  const p = unifiedGlass

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...typeSubtitle, fontSize: 15, ...goldGradientStyle, marginBottom: 4 }}>
          {p.label}
        </div>
        <div style={{ ...typeBody, fontSize: 12, color: 'var(--text-muted)' }}>
          {p.subtitle}
        </div>
      </div>

      {/* Stack of mock components */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 1. Character Card */}
        <ComponentLabel label="Character Card" />
        <MockCharacterCard style={p.characterCard} />

        {/* 2. Selectable Option (pair) */}
        <ComponentLabel label="Selectable Options" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MockSelectableOption
            style={p.option}
            selectedStyle={p.optionSelected}
            selected
            label="Agility"
            value="+2"
          />
          <MockSelectableOption
            style={p.option}
            selectedStyle={p.optionSelected}
            selected={false}
            label="Strength"
            value="+1"
          />
        </div>

        {/* 3. Glass Container */}
        <ComponentLabel label="Stat Container" />
        <MockGlassContainer style={p.glassContainer} />

        {/* 4. Floating Pill */}
        <ComponentLabel label="Navigation Pill" />
        <MockFloatingPill style={p.pill} />

        {/* 5. Menu Dropdown */}
        <ComponentLabel label="Menu Dropdown" />
        <MockMenuDropdown style={p.menu} />
      </div>
    </div>
  )
}

function ComponentLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        ...typeMicro,
        fontSize: 9,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: -8,
      }}
    >
      {label}
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CardStyleLab() {
  return (
    <div
      style={{
        background: 'var(--bg-page)',
        height: '100dvh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        color: 'var(--text-primary)',
        padding: '24px 16px 48px',
      }}
    >
      {/* Page Title */}
      <div style={{ maxWidth: 420, margin: '0 auto', marginBottom: 28 }}>
        <h1 style={{ ...typeTitle, fontSize: 28, ...goldGradientStyle, marginBottom: 6 }}>
          Surface Style Lab
        </h1>
        <p style={{ ...typeBody, fontSize: 14, color: 'var(--text-secondary)' }}>
          Unified warm glass — same treatment everywhere, only border-radius varies.
        </p>
      </div>

      <PreviewColumn />

      {/* Spec reference */}
      <div style={{ maxWidth: 420, margin: '40px auto 0' }}>
        <SpecReference />
      </div>
    </div>
  )
}

// ─── Spec Reference Table ───────────────────────────────────────────────────

function SpecReference() {
  const rows = [
    { component: 'Character Card', radius: '16', blur: '12', specular: '0.18' },
    { component: 'Selectable Option', radius: '12', blur: '12', specular: '0.18' },
    { component: 'Glass Container', radius: '16', blur: '12', specular: '0.18' },
    { component: 'Navigation Pill', radius: '9999', blur: '12', specular: '0.18' },
    { component: 'Menu Dropdown', radius: '20', blur: '12', specular: '0.18' },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ ...typeMicro, fontSize: 10, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Unified Glass Spec
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          ...typeBody,
          fontSize: 12,
        }}
      >
        <thead>
          <tr>
            {['Component', 'Radius', 'Blur', 'Specular'].map((h) => (
              <th
                key={h}
                style={{
                  ...typeMicro,
                  fontSize: 10,
                  color: goldDark,
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderBottom: `1px solid ${goldDarkAlpha(0.12)}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.component}>
              <td style={{ padding: '5px 10px', color: 'var(--text-secondary)', borderBottom: `1px solid ${goldDarkAlpha(0.06)}` }}>
                {r.component}
              </td>
              <td style={{ padding: '5px 10px', color: 'var(--text-muted)', borderBottom: `1px solid ${goldDarkAlpha(0.06)}`, fontVariantNumeric: 'tabular-nums' }}>
                {r.radius}
              </td>
              <td style={{ padding: '5px 10px', color: 'var(--text-muted)', borderBottom: `1px solid ${goldDarkAlpha(0.06)}`, fontVariantNumeric: 'tabular-nums' }}>
                {r.blur}px
              </td>
              <td style={{ padding: '5px 10px', color: 'var(--text-muted)', borderBottom: `1px solid ${goldDarkAlpha(0.06)}`, fontVariantNumeric: 'tabular-nums' }}>
                {r.specular}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
