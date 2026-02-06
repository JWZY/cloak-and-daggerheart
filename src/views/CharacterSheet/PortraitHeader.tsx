import { motion, useScroll, useTransform } from 'framer-motion'
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

export function PortraitHeader({ character, scrollContainerRef }: PortraitHeaderProps) {
  // Track scroll position of the content container
  const { scrollY } = useScroll({
    container: scrollContainerRef,
  })

  // Animation threshold
  const SCROLL_THRESHOLD = 150

  // Scroll progress: 0 = expanded (top), 1 = collapsed (scrolled)
  const progress = useTransform(scrollY, [0, SCROLL_THRESHOLD], [0, 1])

  // Header height: 260px (expanded) -> 72px (collapsed)
  const headerHeight = useTransform(scrollY, [0, SCROLL_THRESHOLD], [260, 72])

  // Portrait size: 140px -> 48px
  const portraitSize = useTransform(scrollY, [0, SCROLL_THRESHOLD], [140, 48])

  // Portrait border radius
  const portraitRadius = useTransform(scrollY, [0, SCROLL_THRESHOLD], [20, 24])

  // Text scale
  const nameScale = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1.4, 1])
  const subtitleScale = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1, 0.9])

  // Text opacity for smooth transition
  const textOpacity = useTransform(scrollY, [0, 50], [1, 1])

  const subtitle = `${character.ancestry.name} ${character.class} · ${character.subclass}`
  const portraitImage = getSubclassImage(character.subclass)

  return (
    <motion.div
      className="glass-strong overflow-hidden relative"
      style={{ height: headerHeight }}
    >
      {/* Expanded layout - column, centered */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4"
        style={{
          opacity: useTransform(progress, [0, 0.5], [1, 0]),
          pointerEvents: useTransform(progress, p => p > 0.5 ? 'none' : 'auto'),
        }}
      >
        {/* Large portrait */}
        <motion.div
          className="overflow-hidden bg-white/10 flex-shrink-0"
          style={{
            width: portraitSize,
            height: portraitSize,
            borderRadius: portraitRadius,
          }}
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
            className="font-bold text-white text-xl"
            style={{ scale: nameScale, opacity: textOpacity }}
          >
            {character.name}
          </motion.h1>
          <motion.p
            className="text-white/60 text-sm mt-1"
            style={{ scale: subtitleScale }}
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>

      {/* Collapsed layout - row, left aligned */}
      <motion.div
        className="absolute inset-0 flex items-center gap-3 px-4"
        style={{
          opacity: useTransform(progress, [0.5, 1], [0, 1]),
          pointerEvents: useTransform(progress, p => p < 0.5 ? 'none' : 'auto'),
        }}
      >
        {/* Small portrait thumbnail */}
        <motion.div
          className="overflow-hidden bg-white/10 flex-shrink-0 w-12 h-12 rounded-xl"
        >
          <img
            src={portraitImage}
            alt={`${character.name} portrait`}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        </motion.div>

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
