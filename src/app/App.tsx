import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { typeTitle, typeSubtitle, goldDarkAlpha } from '../ui/typography'
import { springs } from '../design-system/tokens/animations'
import { DeckBuilder } from '../deck-builder/DeckBuilder'
import { HandView } from '../hand/HandView'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

const splashVariants = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const builderVariants = {
  initial: { opacity: 0, y: '40%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      ...springs.entrance,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  },
}

const handVariants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      ...springs.entranceFast,
      delay: 0.15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

export default function App() {
  const characters = useCharacterStore((s) => s.characters)
  const createCharacter = useCharacterStore((s) => s.createCharacter)
  const [splashDone, setSplashDone] = useState(false)
  const [welcomeChar, setWelcomeChar] = useState<Character | null>(null)

  const handleComplete = useCallback((character: Character) => {
    setWelcomeChar(character)
    createCharacter(character)
    // After 2.5s, dismiss the welcome screen
    setTimeout(() => setWelcomeChar(null), 4500)
  }, [createCharacter])

  // Splash screen: brief branded loading state
  if (!splashDone) {
    return (
      <AnimatePresence onExitComplete={() => setSplashDone(true)}>
        <Splash key="splash" onFinish={() => setSplashDone(true)} />
      </AnimatePresence>
    )
  }

  // Welcome interstitial after character creation
  if (welcomeChar) {
    return (
      <WelcomeScreen character={welcomeChar} />
    )
  }

  return (
    <div style={{ height: '100dvh', background: 'var(--bg-page)', overflow: 'hidden' }}>
      <AnimatePresence mode="popLayout">
        {characters.length === 0 ? (
          <motion.div
            key="builder"
            variants={builderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DeckBuilder onComplete={handleComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="hand"
            variants={handVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <HandView character={characters[0]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Welcome Screen — 2.5s interstitial after character creation
// ---------------------------------------------------------------------------

function WelcomeScreen({ character }: { character: Character }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)',
        zIndex: 9999,
        gap: 12,
      }}
    >
      {/* Golden glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: [0, 0.5, 0.3],
          scale: [0.6, 1.3, 1.1],
          transition: { duration: 2, ease: 'easeOut' },
        }}
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${goldDarkAlpha(0.35)} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* "Welcome," */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
        style={{
          ...typeSubtitle,
          color: 'rgba(212,207,199,0.7)',
          letterSpacing: '0.1em',
        }}
      >
        Welcome,
      </motion.span>

      {/* Character name */}
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 1.2, ease: 'easeOut' }}
        className="gold-text gold-text-shadow"
        style={{
          ...typeTitle,
          fontSize: 36,
          letterSpacing: '0.03em',
        }}
      >
        {character.name}
      </motion.span>

      {/* Ancestry Subclass Class */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1.2, ease: 'easeOut' }}
        style={{
          ...typeSubtitle,
          color: 'rgba(212,207,199,0.6)',
          letterSpacing: '0.06em',
        }}
      >
        {character.ancestry.name} {character.subclass} {character.class}
      </motion.span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Splash Screen
// ---------------------------------------------------------------------------

const glowPulse = {
  initial: { opacity: 0.3, scale: 0.8 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

function Splash({ onFinish }: { onFinish: () => void }) {
  // Reliable timer fallback — onAnimationComplete may not fire when
  // initial and animate are the same variant (no actual animation).
  useEffect(() => {
    const timer = setTimeout(onFinish, 1000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <motion.div
      variants={splashVariants}
      initial="initial"
      animate="initial"
      exit="exit"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)',
        zIndex: 9999,
      }}
    >
      {/* Golden glow behind text */}
      <motion.div
        variants={glowPulse}
        initial="initial"
        animate="animate"
        style={{
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${goldDarkAlpha(0.3)} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.4, ease: 'easeOut' },
        }}
        className="gold-text-shadow"
      >
        <span
          className="gold-text"
          style={{
            ...typeTitle,
            fontSize: 32,
            letterSpacing: '0.08em',
          }}
        >
          C&D
        </span>
      </motion.div>
    </motion.div>
  )
}
