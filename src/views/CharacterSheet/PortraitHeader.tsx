import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Character } from '../../types/character'

interface PortraitHeaderProps {
  character: Character
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

// Map subclass names to image paths
function getSubclassImage(subclass: string): string {
  const slug = subclass.toLowerCase().replace(/\s+/g, '-')
  return `/images/cards/subclass/${slug}.webp`
}

export function PortraitHeader({ character, scrollContainerRef }: PortraitHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)

  // Track scroll position of the content container
  const { scrollY } = useScroll({
    container: scrollContainerRef,
  })

  // Animation ranges - transition over 150px of scroll
  const SCROLL_THRESHOLD = 150

  // Portrait size: 160px -> 48px
  const portraitSize = useTransform(scrollY, [0, SCROLL_THRESHOLD], [160, 48])

  // Portrait border radius: 24px -> 24px (stays rounded)
  const portraitBorderRadius = useTransform(scrollY, [0, SCROLL_THRESHOLD], [24, 24])

  // Header height: 240px -> 70px
  const headerHeight = useTransform(scrollY, [0, SCROLL_THRESHOLD], [240, 70])

  // Header padding: 24px -> 12px
  const headerPadding = useTransform(scrollY, [0, SCROLL_THRESHOLD], [24, 12])

  // Text transforms - scale and position
  // Name: large centered -> small left
  const nameScale = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1.5, 1]) // 1.5rem -> 1rem equivalent
  const nameX = useTransform(scrollY, [0, SCROLL_THRESHOLD], [0, 0])

  // Subtitle: normal centered -> smaller
  const subtitleScale = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1, 0.85])

  // Content layout transition
  // In expanded: centered column layout
  // In collapsed: left-aligned row layout
  const justifyContent = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD],
    ['center', 'flex-start']
  )

  const flexDirection = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD],
    ['column', 'row']
  )

  // Text container positioning
  const textAlignItems = useTransform(
    scrollY,
    [0, SCROLL_THRESHOLD],
    ['center', 'flex-start']
  )

  // Gap between portrait and text
  const contentGap = useTransform(scrollY, [0, SCROLL_THRESHOLD], [16, 12])

  // Text margin when collapsed (to account for row layout)
  const textMarginLeft = useTransform(scrollY, [0, SCROLL_THRESHOLD], [0, 0])

  const subtitle = `${character.ancestry.name} ${character.class} · ${character.subclass}`
  const portraitImage = getSubclassImage(character.subclass)

  return (
    <motion.div
      ref={headerRef}
      className="glass-strong overflow-hidden relative"
      style={{
        height: headerHeight,
        padding: headerPadding,
      }}
    >
      {/* Layout container */}
      <motion.div
        className="h-full flex items-center"
        style={{
          justifyContent,
          flexDirection,
          gap: contentGap,
        }}
      >
        {/* Portrait container */}
        <motion.div
          className="relative flex-shrink-0"
          style={{
            width: portraitSize,
            height: portraitSize,
          }}
        >
          <motion.div
            className="w-full h-full overflow-hidden bg-white/10"
            style={{
              borderRadius: portraitBorderRadius,
            }}
          >
            <img
              src={portraitImage}
              alt={`${character.name} portrait`}
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          </motion.div>
        </motion.div>

        {/* Text container - single set of elements that animate */}
        <motion.div
          className="flex flex-col justify-center min-w-0"
          style={{
            alignItems: textAlignItems,
            marginLeft: textMarginLeft,
          }}
        >
          <motion.h1
            className="font-bold text-white truncate text-base origin-left"
            style={{
              scale: nameScale,
              x: nameX,
            }}
          >
            {character.name}
          </motion.h1>
          <motion.p
            className="text-white/60 truncate text-xs origin-left"
            style={{
              scale: subtitleScale,
            }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
