import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import type { Character } from '../../types/character'

interface PortraitHeaderProps {
  character: Character
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

// Map subclass names to image paths
function getSubclassImage(subclass: string): string {
  const slug = subclass.toLowerCase().replace(/\s+/g, '-')
  const base = import.meta.env.BASE_URL || '/'
  return `${base}images/cards/subclass/${slug}.webp`
}

// Spring transition for smooth snapping
const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
}

export function PortraitHeader({ character, scrollContainerRef }: PortraitHeaderProps) {
  // Binary state: expanded or collapsed
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Track scroll position of the content container
  const { scrollY } = useScroll({
    container: scrollContainerRef,
  })

  // Animation threshold - snap at 60px
  const SCROLL_THRESHOLD = 60

  // Detect when scroll crosses threshold and update state
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const shouldCollapse = latest >= SCROLL_THRESHOLD
    if (shouldCollapse !== isCollapsed) {
      setIsCollapsed(shouldCollapse)
    }
  })

  const subtitle = `${character.ancestry.name} ${character.class} · ${character.subclass}`
  const portraitImage = getSubclassImage(character.subclass)

  return (
    <motion.div
      className="glass-strong overflow-hidden relative"
      animate={{ height: isCollapsed ? 72 : 260 }}
      transition={springTransition}
    >
      {/* Expanded layout - column, centered */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4"
        animate={{
          opacity: isCollapsed ? 0 : 1,
        }}
        transition={springTransition}
        style={{
          pointerEvents: isCollapsed ? 'none' : 'auto',
        }}
      >
        {/* Large portrait */}
        <motion.div
          className="overflow-hidden bg-white/10 flex-shrink-0 rounded-[20px]"
          animate={{
            width: isCollapsed ? 48 : 140,
            height: isCollapsed ? 48 : 140,
          }}
          transition={springTransition}
        >
          <img
            src={portraitImage}
            alt={`${character.name} portrait`}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        </motion.div>

        {/* Centered text */}
        <div className="text-center">
          <motion.h1
            className="font-bold text-white text-xl origin-center"
            animate={{ scale: isCollapsed ? 1 : 1.4 }}
            transition={springTransition}
          >
            {character.name}
          </motion.h1>
          <motion.p
            className="text-white/60 text-sm mt-1"
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>

      {/* Collapsed layout - row, left aligned */}
      <motion.div
        className="absolute inset-0 flex items-center gap-3 px-4"
        animate={{
          opacity: isCollapsed ? 1 : 0,
        }}
        transition={springTransition}
        style={{
          pointerEvents: isCollapsed ? 'auto' : 'none',
        }}
      >
        {/* Small portrait thumbnail */}
        <div className="overflow-hidden bg-white/10 flex-shrink-0 w-12 h-12 rounded-xl">
          <img
            src={portraitImage}
            alt={`${character.name} portrait`}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        </div>

        {/* Left-aligned text */}
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-white text-base truncate">
            {character.name}
          </h1>
          <p className="text-white/60 text-xs truncate">
            {subtitle}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
