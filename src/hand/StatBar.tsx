import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Shield, Star, Circle, Minus, Plus } from 'lucide-react'
import { typeMicro, typeBody } from '../ui/typography'
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
    transition: { type: 'spring' as const, stiffness: 500, damping: 15, mass: 0.6 },
  },
  exit: { scale: 0.5, opacity: 0 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
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
          ...typeMicro,
          color: 'var(--gold-secondary)',
          width: 46,
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
          fontFamily: typeBody.fontFamily,
          fontSize: typeMicro.fontSize,
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

export function StatBar({ character, accentColor = '#d4af37' }: StatBarProps) {
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
      {/* Row 1: HP and Armor */}
      <div className="grid grid-cols-2 gap-3">
        <StatRow
          label="HP"
          icon={Heart}
          current={character.hp.current}
          max={character.hp.max}
          color="#A61118"
          onDecrease={() => updateHP(character.id, -1)}
          onIncrease={() => updateHP(character.id, 1)}
        />
        <StatRow
          label="Armor"
          icon={Shield}
          current={character.armorSlots.current}
          max={character.armorSlots.max}
          color="#A3A9A8"
          onDecrease={() => updateArmor(character.id, -1)}
          onIncrease={() => updateArmor(character.id, 1)}
        />
      </div>

      {/* Row 2: Hope and Stress */}
      <div className="grid grid-cols-2 gap-3">
        <StatRow
          label="Hope"
          icon={Star}
          current={character.hope}
          color="#BEA228"
          onDecrease={() => updateHope(character.id, -1)}
          onIncrease={() => updateHope(character.id, 1)}
          showMax={false}
        />
        <StatRow
          label="Stress"
          icon={Circle}
          current={character.stress.current}
          max={character.stress.max}
          color="#1E1E1E"
          onDecrease={() => updateStress(character.id, -1)}
          onIncrease={() => updateStress(character.id, 1)}
        />
      </div>

      {/* Evasion & Thresholds */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <GameBadge color={accentColor}>Evasion {character.evasion}</GameBadge>
        {character.equipment?.armor && (() => {
          const thresholds = parseThresholds(character.equipment.armor.base_thresholds)
          return (
            <>
              <GameBadge color={accentColor}>Major {thresholds.major + character.level}</GameBadge>
              <GameBadge color={accentColor}>Severe {thresholds.severe + character.level}</GameBadge>
            </>
          )
        })()}
      </div>
    </GlassPanel>
  )
}
