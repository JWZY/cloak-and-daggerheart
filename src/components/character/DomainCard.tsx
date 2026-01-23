import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sheet } from '../ui/Sheet'
import { Markdown } from '../ui/Markdown'
import type { DomainCard as DomainCardType } from '../../types/character'

interface DomainCardProps {
  card: DomainCardType
  onToggleUsed?: () => void
}

export function DomainCard({ card, onToggleUsed }: DomainCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      Codex: 'bg-indigo-500/30 text-indigo-200 border-indigo-400/50',
      Splendor: 'bg-amber-500/30 text-amber-200 border-amber-400/50',
      Arcana: 'bg-purple-500/30 text-purple-200 border-purple-400/50',
      Blade: 'bg-red-500/30 text-red-200 border-red-400/50',
      Bone: 'bg-stone-500/30 text-stone-200 border-stone-400/50',
      Grace: 'bg-pink-500/30 text-pink-200 border-pink-400/50',
      Midnight: 'bg-slate-500/30 text-slate-200 border-slate-400/50',
      Sage: 'bg-green-500/30 text-green-200 border-green-400/50',
      Valor: 'bg-orange-500/30 text-orange-200 border-orange-400/50',
    }
    return colors[domain] || 'bg-white/20 text-white/80 border-white/30'
  }

  return (
    <>
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ translateY: -2 }}
        onClick={() => setShowDetail(true)}
        className={`p-4 rounded-[var(--lg-card-radius)] glass glass-interactive cursor-pointer ${
          card.used ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white">{card.name}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${getDomainColor(
              card.domain
            )}`}
          >
            {card.domain}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{card.type}</span>
          <span>•</span>
          <span>Level {card.level}</span>
          {parseInt(card.recall) > 0 && (
            <>
              <span>•</span>
              <span>Recall {card.recall}</span>
            </>
          )}
        </div>
        {card.used && (
          <div className="mt-2">
            <span className="text-xs text-white/50 italic">Used this session</span>
          </div>
        )}
      </motion.div>

      <Sheet open={showDetail} onOpenChange={setShowDetail} title={card.name}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm px-3 py-1 rounded-full border ${getDomainColor(
                card.domain
              )}`}
            >
              {card.domain}
            </span>
            <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/70">
              {card.type}
            </span>
            <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/70">
              Level {card.level}
            </span>
            {parseInt(card.recall) > 0 && (
              <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/70">
                Recall {card.recall}
              </span>
            )}
          </div>

          <div className="text-white/80">
            <Markdown>{card.text}</Markdown>
          </div>

          {onToggleUsed && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onToggleUsed()
                setShowDetail(false)
              }}
              className={`w-full py-3 rounded-[9999px] font-medium glass glass-interactive ${
                card.used
                  ? 'text-green-200'
                  : 'text-white/70'
              }`}
            >
              {card.used ? 'Mark as Available' : 'Mark as Used'}
            </motion.button>
          )}
        </div>
      </Sheet>
    </>
  )
}
