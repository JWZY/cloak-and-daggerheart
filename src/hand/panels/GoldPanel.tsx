import { Minus, Plus } from 'lucide-react'
import { typeBody } from '../../ui/typography'
import { useCharacterStore } from '../../store/character-store'
import type { Character } from '../../types/character'

const HANDFULS_MAX = 10
const BAGS_MAX = 10

function GoldPipRow({
  label,
  count,
  max,
  renderPip,
}: {
  label: string
  count: number
  max: number
  renderPip: (filled: boolean, i: number) => React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        style={{
          ...typeBody,
          fontWeight: 600,
          color: 'var(--gold-secondary)',
          width: 72,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: max }).map((_, i) => renderPip(i < count, i))}
      </div>
    </div>
  )
}

function CirclePip({ filled }: { filled: boolean }) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16">
      <circle
        cx={8}
        cy={8}
        r={6.5}
        fill={filled ? 'var(--gold)' : 'transparent'}
        stroke={filled ? 'var(--gold)' : 'var(--text-muted)'}
        strokeWidth={1}
      />
    </svg>
  )
}

function BagPip({ filled }: { filled: boolean }) {
  return (
    <svg width={16} height={20} viewBox="0 0 16 20">
      {/* Simple bag/pouch shape */}
      <path
        d="M5 3C5 1.5 6.5 1 8 1C9.5 1 11 1.5 11 3L12 6C14 8 14 10 14 12C14 16 11.5 18 8 18C4.5 18 2 16 2 12C2 10 2 8 4 6L5 3Z"
        fill={filled ? 'var(--gold)' : 'transparent'}
        stroke={filled ? 'var(--gold)' : 'var(--text-muted)'}
        strokeWidth={1}
      />
    </svg>
  )
}

export function GoldPanel({ character }: { character: Character }) {
  const updateGold = useCharacterStore((s) => s.updateGold)
  const total = character.gold
  const handfuls = Math.min(total, HANDFULS_MAX)
  const bags = Math.min(Math.max(0, total - HANDFULS_MAX), BAGS_MAX)

  return (
    <div className="flex flex-col gap-2">
      {/* +/- controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateGold(character.id, -1)}
          disabled={total <= 0}
          className="flex items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            background: total <= 0 ? 'var(--bg-surface)' : 'var(--bg-overlay)',
            border: '1px solid var(--gold-muted)',
            color: total <= 0 ? 'var(--text-muted)' : 'var(--gold)',
            cursor: total <= 0 ? 'default' : 'pointer',
          }}
        >
          <Minus size={12} />
        </button>
        <span style={{ ...typeBody, fontWeight: 700, color: 'var(--gold)', fontVariantNumeric: 'tabular-nums' }}>
          {total}
        </span>
        <button
          onClick={() => updateGold(character.id, 1)}
          disabled={total >= HANDFULS_MAX + BAGS_MAX}
          className="flex items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            background: 'var(--bg-overlay)',
            border: '1px solid var(--gold-muted)',
            color: 'var(--gold)',
            cursor: 'pointer',
          }}
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Handfuls row — circles */}
      <GoldPipRow
        label="Handfuls"
        count={handfuls}
        max={HANDFULS_MAX}
        renderPip={(filled, i) => <CirclePip key={i} filled={filled} />}
      />

      {/* Bags row — bag shapes */}
      <GoldPipRow
        label="Bags"
        count={bags}
        max={BAGS_MAX}
        renderPip={(filled, i) => <BagPip key={i} filled={filled} />}
      />
    </div>
  )
}
