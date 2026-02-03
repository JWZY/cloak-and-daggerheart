import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Card } from './Card'

interface HorizontalCardRailProps<T> {
  items: T[]
  selectedId?: string
  onSelect: (item: T) => void
  getId: (item: T) => string
  renderContent: (item: T, isSelected: boolean) => ReactNode
  renderActions?: (item: T) => ReactNode
  cardWidth?: 'sm' | 'md' | 'lg'
  className?: string
}

export function HorizontalCardRail<T>({
  items,
  selectedId,
  onSelect,
  getId,
  renderContent,
  renderActions,
  cardWidth = 'md',
  className = '',
}: HorizontalCardRailProps<T>) {
  const widthClasses = {
    sm: 'w-[120px]',
    md: 'w-[140px]',
    lg: 'w-[180px]',
  }

  return (
    <div className={`overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 ${className}`}>
      <div className="flex gap-3 pb-2">
        {items.map((item) => {
          const id = getId(item)
          const isSelected = selectedId === id

          return (
            <motion.div
              key={id}
              className={`snap-center flex-shrink-0 ${widthClasses[cardWidth]}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card
                variant="glass"
                selected={isSelected}
                onTap={() => onSelect(item)}
                padding="sm"
                className={`h-full ${isSelected ? 'glass-selected' : ''}`}
              >
                <div className="flex flex-col h-full">
                  {renderContent(item, isSelected)}
                  {renderActions && (
                    <div className="mt-auto pt-2">
                      {renderActions(item)}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
