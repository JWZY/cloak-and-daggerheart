import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sheet } from '../ui/Sheet'
import type { DomainCard as DomainCardType } from '../../types/character'

interface DomainCardProps {
  card: DomainCardType
  onToggleUsed?: () => void
}

export function DomainCard({ card, onToggleUsed }: DomainCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      Codex: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Splendor: 'bg-amber-100 text-amber-800 border-amber-200',
      Arcana: 'bg-purple-100 text-purple-800 border-purple-200',
      Blade: 'bg-red-100 text-red-800 border-red-200',
      Bone: 'bg-stone-100 text-stone-800 border-stone-200',
      Grace: 'bg-pink-100 text-pink-800 border-pink-200',
      Midnight: 'bg-slate-100 text-slate-800 border-slate-200',
      Sage: 'bg-green-100 text-green-800 border-green-200',
      Valor: 'bg-orange-100 text-orange-800 border-orange-200',
    }
    return colors[domain] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDetail(true)}
        className={`p-4 rounded-xl border-2 ${
          card.used ? 'opacity-50 bg-gray-50' : 'bg-white'
        } cursor-pointer`}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{card.name}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${getDomainColor(
              card.domain
            )}`}
          >
            {card.domain}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
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
            <span className="text-xs text-gray-500 italic">Used this session</span>
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
            <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {card.type}
            </span>
            <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              Level {card.level}
            </span>
            {parseInt(card.recall) > 0 && (
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Recall {card.recall}
              </span>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{card.text}</p>
          </div>

          {onToggleUsed && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onToggleUsed()
                setShowDetail(false)
              }}
              className={`w-full py-3 rounded-xl font-medium ${
                card.used
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
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
