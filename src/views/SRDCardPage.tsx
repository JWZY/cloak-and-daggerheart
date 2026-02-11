import { useState } from 'react'
import { SRDCard } from '../components/cards/SRDCard'

export function SRDCardPage() {
  const basePath = import.meta.env.BASE_URL || '/'
  const [lineHeight, setLineHeight] = useState(1.3)

  const cardData = {
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
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#0a0e14',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        padding: '40px 24px',
      }}
    >
      <SRDCard {...cardData} bodyLineHeight={String(lineHeight)} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Line Height</span>
          <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'ui-monospace, monospace' }}>{lineHeight.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={1.0}
          max={2.0}
          step={0.05}
          value={lineHeight}
          onChange={(e) => setLineHeight(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#d4a053' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#4b5563' }}>
          <span>1.0</span>
          <span>2.0</span>
        </div>
      </div>
    </div>
  )
}
