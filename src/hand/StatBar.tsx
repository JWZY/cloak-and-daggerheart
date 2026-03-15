import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Shield, Star, Circle, Minus, Plus } from 'lucide-react'
import { typeBody, typeSubtitle, typeMicro, goldAccent } from '../ui/typography'
import { springs } from '../design-system/tokens/animations'
import { STAT_COLORS } from '../cards/domain-colors'
import { GameBadge } from '../ui/GameBadge'
import { GlassPanel } from '../ui/GlassPanel'
import { useCharacterStore } from '../store/character-store'
import { parseThresholds } from '../core/character/armor'
import type { Character } from '../types/character'

export interface StatBarProps {
  character: Character
  accentColor?: string
}

const pipScale = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: [0.5, 1.3, 1],
    opacity: 1,
    transition: { type: 'spring' as const, ...springs.pip },
  },
  exit: { scale: 0.5, opacity: 0 },
  transition: { type: 'spring' as const, ...springs.pipExit },
}

function StatButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center rounded-full transition-colors relative"
      style={{
        width: 28,
        height: 28,
        background: disabled
          ? 'var(--bg-surface)'
          : 'var(--bg-overlay)',
        border: `1px solid ${disabled ? 'var(--gold-muted)' : 'var(--gold-muted)'}`,
        color: disabled ? 'var(--text-muted)' : 'var(--gold)',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {/* Invisible touch target expander for iOS 44px minimum */}
      <span
        className="absolute inset-0"
        style={{ margin: -8, borderRadius: '50%' }}
      />
      {children}
    </button>
  )
}

function StatRow({
  label,
  icon: Icon,
  current,
  max,
  color,
  onDecrease,
  onIncrease,
  showMax = true,
}: {
  label: string
  icon: React.ElementType
  current: number
  max?: number
  color: string
  onDecrease: () => void
  onIncrease: () => void
  showMax?: boolean
}) {
  const displayMax = max ?? current
  const pipCount = showMax ? displayMax : Math.max(current, 6)

  return (
    <div className="flex items-center gap-2">
      {/* Label */}
      <span
        style={{
          ...typeBody,
          fontWeight: 600,
          color: 'var(--gold-secondary)',
          width: 52,
          flexShrink: 0,
        }}
      >
        {label}
      </span>

      {/* Decrease button */}
      <StatButton onClick={onDecrease} disabled={current <= 0}>
        <Minus size={12} />
      </StatButton>

      {/* Pips */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: pipCount }).map((_, i) => {
            const filled = i < current
            return (
              <motion.div
                key={`pip-${i}`}
                {...pipScale}
                layout
              >
                <Icon
                  size={14}
                  fill={filled ? color : 'transparent'}
                  color={filled ? color : 'var(--text-muted)'}
                  strokeWidth={filled ? 0 : 1.5}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Count label */}
      <span
        style={{
          ...typeBody,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          minWidth: 28,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {current}{showMax && max !== undefined ? `/${max}` : ''}
      </span>

      {/* Increase button */}
      <StatButton
        onClick={onIncrease}
        disabled={max !== undefined && current >= max}
      >
        <Plus size={12} />
      </StatButton>
    </div>
  )
}

function DamageThresholdRow({
  major,
  severe,
}: {
  major: number
  severe: number
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const [damage, setDamage] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const maxValue = severe + Math.ceil(severe * 0.5)

  const getThresholdZone = (val: number): 'minor' | 'major' | 'severe' => {
    if (val >= severe) return 'severe'
    if (val >= major) return 'major'
    return 'minor'
  }

  const hpCostMap = { minor: 1, major: 2, severe: 3 } as const
  const labelMap = { minor: 'Minor', major: 'Major', severe: 'Severe' } as const

  const zone = getThresholdZone(damage)

  const clampDamage = useCallback(
    (clientX: number) => {
      const bar = barRef.current
      if (!bar) return
      const rect = bar.getBoundingClientRect()
      const x = clientX - rect.left
      const ratio = Math.max(0, Math.min(1, x / rect.width))
      setDamage(Math.round(ratio * maxValue))
    },
    [maxValue],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsActive(true)
      clampDamage(e.clientX)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [clampDamage],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isActive) return
      clampDamage(e.clientX)
    },
    [isActive, clampDamage],
  )

  const handlePointerUp = useCallback(() => {
    setIsActive(false)
  }, [])

  // Zone boundary percentages
  const majorPct = (major / maxValue) * 100
  const severePct = (severe / maxValue) * 100
  const indicatorPct = (damage / maxValue) * 100

  return (
    <div style={{ position: 'relative' }}>
      {/* Bar track */}
      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={(e) => { if (e.buttons === 0) { setIsActive(true); clampDamage(e.clientX) } }}
        onPointerLeave={(e) => { if (e.buttons === 0) setIsActive(false) }}
        style={{
          position: 'relative',
          height: 14,
          borderRadius: 7,
          background: 'rgba(255,255,255,0.06)',
          cursor: 'pointer',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* Major zone (gold fill) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${majorPct}%`,
            width: `${severePct - majorPct}%`,
            background: 'rgba(212,175,55,0.25)',
          }}
        />
        {/* Severe zone (red accent) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${severePct}%`,
            right: 0,
            background: 'rgba(220,80,80,0.3)',
            borderRadius: '0 7px 7px 0',
          }}
        />

        {/* Threshold boundary lines */}
        <div
          style={{
            position: 'absolute',
            top: 2,
            bottom: 2,
            left: `${majorPct}%`,
            width: 1,
            background: 'rgba(212,175,55,0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 2,
            bottom: 2,
            left: `${severePct}%`,
            width: 1,
            background: 'rgba(220,80,80,0.4)',
          }}
        />

        {/* Threshold labels on the bar */}
        <span style={{ ...typeMicro, fontSize: 9, position: 'absolute', left: `${majorPct / 2}%`, top: '50%', transform: 'translate(-50%,-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
          {major > 1 && `1–${major - 1}`}
        </span>
        <span style={{ ...typeMicro, fontSize: 9, position: 'absolute', left: `${majorPct + (severePct - majorPct) / 2}%`, top: '50%', transform: 'translate(-50%,-50%)', color: 'var(--gold-muted)', pointerEvents: 'none' }}>
          {major}–{severe - 1}
        </span>
        <span style={{ ...typeMicro, fontSize: 9, position: 'absolute', left: `${severePct + (100 - severePct) / 2}%`, top: '50%', transform: 'translate(-50%,-50%)', color: 'rgba(220,80,80,0.7)', pointerEvents: 'none' }}>
          {severe}+
        </span>

        {/* Indicator circle — only visible on hover/drag */}
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ left: `${indicatorPct}%`, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', ...springs.snappy }}
            style={{
              position: 'absolute',
              top: '50%',
              width: 20,
              height: 20,
              marginTop: -10,
              marginLeft: -10,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 8px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Tooltip — appears above the indicator on hover/drag */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: `${indicatorPct}%`,
              transform: 'translateX(-50%)',
              marginBottom: 8,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'var(--bg-surface)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: '6px 12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                ...typeMicro,
                fontSize: 10,
                color:
                  zone === 'severe'
                    ? 'rgba(220,80,80,0.85)'
                    : zone === 'major'
                      ? 'var(--gold)'
                      : 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {labelMap[zone]}
            </span>
            <span
              style={{
                ...typeSubtitle,
                fontSize: 28,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-secondary)',
                lineHeight: 1,
              }}
            >
              {String(damage).padStart(2, '0')}
            </span>
            <span style={{ ...typeBody, fontSize: 12, color: 'var(--text-muted)' }}>
              Mark {hpCostMap[zone]} HP
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function StatBar({ character, accentColor = goldAccent }: StatBarProps) {
  const updateHP = useCharacterStore((s) => s.updateHP)
  const updateArmor = useCharacterStore((s) => s.updateArmor)
  const updateHope = useCharacterStore((s) => s.updateHope)
  const updateStress = useCharacterStore((s) => s.updateStress)

  return (
    <GlassPanel
      className="flex flex-col gap-2"
      style={{
        borderRadius: 12,
        padding: '12px',
        border: '1px solid var(--surface-light)',
      }}
    >
      {/* Armor with Evasion & Thresholds inline */}
      <StatRow
        label="Armor"
        icon={Shield}
        current={character.armorSlots.current}
        max={character.armorSlots.max}
        color={STAT_COLORS.armor}
        onDecrease={() => updateArmor(character.id, -1)}
        onIncrease={() => updateArmor(character.id, 1)}
      />
      <div className="flex items-center gap-2 pl-[54px]">
        <GameBadge color={accentColor}>Evasion {character.evasion}</GameBadge>
      </div>

      {character.equipment?.armor && (() => {
        const thresholds = parseThresholds(character.equipment.armor.base_thresholds)
        const major = thresholds.major + character.level
        const severe = thresholds.severe + character.level
        return (
          <DamageThresholdRow major={major} severe={severe} />
        )
      })()}

      <StatRow
        label="HP"
        icon={Heart}
        current={character.hp.current}
        max={character.hp.max}
        color={STAT_COLORS.hp}
        onDecrease={() => updateHP(character.id, -1)}
        onIncrease={() => updateHP(character.id, 1)}
      />
      <StatRow
        label="Stress"
        icon={Circle}
        current={character.stress.current}
        max={character.stress.max}
        color={STAT_COLORS.stress}
        onDecrease={() => updateStress(character.id, -1)}
        onIncrease={() => updateStress(character.id, 1)}
      />
      <StatRow
        label="Hope"
        icon={Star}
        current={character.hope}
        color={STAT_COLORS.hope}
        onDecrease={() => updateHope(character.id, -1)}
        onIncrease={() => updateHope(character.id, 1)}
        showMax={false}
      />
    </GlassPanel>
  )
}
