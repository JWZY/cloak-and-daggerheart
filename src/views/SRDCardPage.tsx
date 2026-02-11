import { useState } from 'react'
import { SRDCard } from '../components/cards/SRDCard'

interface Delta {
  id: string
  number: string
  name: string
  category: 'typography' | 'shadows' | 'layout' | 'structural'
  currentValue: string
  figmaValue: string
  infoOnly?: boolean
  infoNote?: string
}

const DELTAS: Delta[] = [
  // Typography
  {
    id: 'titleLetterSpacing',
    number: '#4',
    name: 'Title Letter Spacing',
    category: 'typography',
    currentValue: '0.02em',
    figmaValue: '0em',
  },
  {
    id: 'titleSmallCaps',
    number: '#5',
    name: 'Title Small Caps',
    category: 'typography',
    currentValue: 'true',
    figmaValue: 'false',
  },
  {
    id: 'classNameLetterSpacing',
    number: '#7',
    name: 'Class Name Letter Spacing',
    category: 'typography',
    currentValue: '0.08em',
    figmaValue: '0em',
  },
  {
    id: 'classNameSmallCaps',
    number: '#8',
    name: 'Class Name Small Caps',
    category: 'typography',
    currentValue: 'true',
    figmaValue: 'false',
  },
  {
    id: 'footerSmallCaps',
    number: '#13',
    name: 'Footer Small Caps',
    category: 'typography',
    currentValue: 'true',
    figmaValue: 'false',
  },
  // Shadows
  {
    id: 'titleShadowStyle',
    number: '#6',
    name: 'Title Text Shadow',
    category: 'shadows',
    currentValue: 'heavy (double drop-shadow)',
    figmaValue: 'subtle (single drop-shadow)',
  },
  {
    id: 'bodyTextShadow',
    number: '#10',
    name: 'Body Text Shadow',
    category: 'shadows',
    currentValue: 'none',
    figmaValue: '0px 1px 1px #4d381e',
  },
  // Layout
  {
    id: 'separatorStyle',
    number: '#9',
    name: 'Separator Dimensions',
    category: 'layout',
    currentValue: 'diamond 5x5, line 1px',
    figmaValue: 'diamond 4x4, line 2px',
  },
  {
    id: 'contentLayout',
    number: '#12',
    name: 'Content Layout Gap',
    category: 'layout',
    currentValue: 'Tailwind margins (mt-1, mb-3, mt-2, py-3)',
    figmaValue: 'gap: 12px, pad: 24/24/18/24',
  },
  // Structural
  {
    id: 'showCardFrame',
    number: '#14',
    name: 'Card Frame Overlay',
    category: 'structural',
    currentValue: 'card-frame.svg at 40%',
    figmaValue: 'none (uses border instead)',
  },
  {
    id: 'showIllustrationOverlay',
    number: '#15',
    name: 'Illustration Dark Overlay',
    category: 'structural',
    currentValue: 'gradient 30%-70%',
    figmaValue: 'none (content gradient handles it)',
  },
  {
    id: 'illustrationMask',
    number: '#2',
    name: 'Illustration Masking',
    category: 'structural',
    currentValue: 'rectangular (no mask)',
    figmaValue: 'custom mask shape',
    infoOnly: true,
    infoNote: 'Requires mask asset',
  },
  {
    id: 'atmosphereLayer',
    number: '#3',
    name: 'Background Atmosphere Layer',
    category: 'structural',
    currentValue: 'none',
    figmaValue: 'vertically-flipped bg image',
    infoOnly: true,
    infoNote: 'Requires atmosphere asset',
  },
]

const CATEGORIES = [
  { key: 'typography' as const, label: 'Typography' },
  { key: 'shadows' as const, label: 'Shadows' },
  { key: 'layout' as const, label: 'Layout' },
  { key: 'structural' as const, label: 'Structural' },
]

function DeltaToggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative flex-shrink-0"
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: enabled ? '#3b82f6' : '#d1d5db',
        transition: 'background 150ms ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: enabled ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: '#fff',
          transition: 'left 150ms ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

function DeltaRow({ delta, enabled, onChange }: {
  delta: Delta
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            color: '#9ca3af',
            flexShrink: 0,
          }}>
            {delta.number}
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#1f2937',
          }}>
            {delta.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, fontFamily: 'ui-monospace, monospace' }}>
          <span style={{ color: delta.infoOnly ? '#9ca3af' : (enabled ? '#9ca3af' : '#1f2937') }}>
            {delta.currentValue}
          </span>
          <span style={{ color: '#d1d5db' }}>&rarr;</span>
          <span style={{ color: delta.infoOnly ? '#9ca3af' : (enabled ? '#3b82f6' : '#9ca3af') }}>
            {delta.figmaValue}
          </span>
        </div>
      </div>
      {delta.infoOnly ? (
        <span style={{
          fontSize: 10,
          color: '#9ca3af',
          fontStyle: 'italic',
          flexShrink: 0,
          textAlign: 'right',
          width: 36,
          lineHeight: '1.3',
        }}>
          {delta.infoNote}
        </span>
      ) : (
        <DeltaToggle enabled={enabled} onChange={onChange} />
      )}
    </div>
  )
}

export function SRDCardPage() {
  const basePath = import.meta.env.BASE_URL || '/'

  const [toggles, setToggles] = useState<Record<string, boolean>>({})

  const toggle = (id: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: value }))
  }

  const isOn = (id: string) => toggles[id] ?? false

  const allOn = DELTAS.filter((d) => !d.infoOnly).every((d) => isOn(d.id))
  const allOff = DELTAS.filter((d) => !d.infoOnly).every((d) => !isOn(d.id))

  const setAll = (value: boolean) => {
    const next: Record<string, boolean> = {}
    for (const d of DELTAS) {
      if (!d.infoOnly) next[d.id] = value
    }
    setToggles(next)
  }

  // Build card props from toggle state
  const cardProps = {
    name: 'School of Knowledge',
    className: 'Wizard',
    tier: 'Foundation',
    spellcastTrait: 'Knowledge',
    bannerColor: '#BEA228',
    domainIcons: ['codex', 'splendor'] as ['codex', 'splendor'],
    feats: [
      { name: 'Prepared', text: 'Take an additional domain card of your level or lower from a domain you have access to.' },
      { name: 'Adept', text: 'When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.' },
    ],
    illustrationSrc: `${basePath}images/cards/subclass/school-of-knowledge.png`,
    // Delta-controlled props
    titleLetterSpacing: isOn('titleLetterSpacing') ? '0em' : '0.02em',
    titleSmallCaps: isOn('titleSmallCaps') ? false : true,
    classNameLetterSpacing: isOn('classNameLetterSpacing') ? '0em' : '0.08em',
    classNameSmallCaps: isOn('classNameSmallCaps') ? false : true,
    footerSmallCaps: isOn('footerSmallCaps') ? false : true,
    titleShadowStyle: (isOn('titleShadowStyle') ? 'subtle' : 'heavy') as 'subtle' | 'heavy',
    bodyTextShadow: isOn('bodyTextShadow'),
    separatorStyle: (isOn('separatorStyle') ? 'figma' : 'code') as 'figma' | 'code',
    contentLayout: (isOn('contentLayout') ? 'figma' : 'code') as 'figma' | 'code',
    showCardFrame: isOn('showCardFrame') ? false : true,
    showIllustrationOverlay: isOn('showIllustrationOverlay') ? false : true,
  }

  const activeCount = DELTAS.filter((d) => !d.infoOnly && isOn(d.id)).length
  const totalToggleable = DELTAS.filter((d) => !d.infoOnly).length

  const [copied, setCopied] = useState(false)
  const copyConfig = () => {
    const config: Record<string, string> = {}
    for (const d of DELTAS) {
      if (d.infoOnly) continue
      config[d.id] = isOn(d.id) ? 'figma' : 'code'
    }
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        background: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Left: Card preview */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
          padding: '40px 60px',
          background: '#0a0e14',
          borderRight: '1px solid #e5e7eb',
        }}
      >
        <SRDCard {...cardProps} />
      </div>

      {/* Right: Delta comparison panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', margin: 0 }}>
                Code vs Figma Deltas
              </h1>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>
                {activeCount}/{totalToggleable} Figma values active
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setAll(false)}
                disabled={allOff}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: '1px solid #e5e7eb',
                  background: allOff ? '#f9fafb' : '#fff',
                  color: allOff ? '#d1d5db' : '#6b7280',
                  cursor: allOff ? 'default' : 'pointer',
                }}
              >
                All Code
              </button>
              <button
                onClick={() => setAll(true)}
                disabled={allOn}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: '1px solid #e5e7eb',
                  background: allOn ? '#f9fafb' : '#fff',
                  color: allOn ? '#d1d5db' : '#6b7280',
                  cursor: allOn ? 'default' : 'pointer',
                }}
              >
                All Figma
              </button>
              <button
                onClick={copyConfig}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: '1px solid #e5e7eb',
                  background: copied ? '#ecfdf5' : '#fff',
                  color: copied ? '#059669' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {copied ? 'Copied!' : 'Copy Config'}
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable delta list */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 24px 24px',
          }}
        >
          {CATEGORIES.map((cat) => {
            const deltas = DELTAS.filter((d) => d.category === cat.key)
            if (deltas.length === 0) return null
            return (
              <div key={cat.key}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#9ca3af',
                    padding: '16px 0 4px',
                  }}
                >
                  {cat.label}
                </div>
                {deltas.map((delta) => (
                  <DeltaRow
                    key={delta.id}
                    delta={delta}
                    enabled={isOn(delta.id)}
                    onChange={(v) => toggle(delta.id, v)}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
