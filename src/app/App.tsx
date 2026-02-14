import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DeckBuilder } from '../deck-builder/DeckBuilder'
import { HandView } from '../hand/HandView'
import { useCharacterStore } from '../store/character-store'

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
      stiffness: 200,
      damping: 28,
      mass: 1,
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
      stiffness: 260,
      damping: 28,
      mass: 0.8,
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

  // Splash screen: brief branded loading state
  if (!splashDone) {
    return (
      <AnimatePresence onExitComplete={() => setSplashDone(true)}>
        <Splash key="splash" onFinish={() => setSplashDone(true)} />
      </AnimatePresence>
    )
  }

  return (
    <div style={{ height: '100dvh', background: '#03070d', overflow: 'hidden' }}>
      <AnimatePresence mode="popLayout">
        {characters.length === 0 ? (
          <motion.div
            key="builder"
            variants={builderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DeckBuilder onComplete={createCharacter} />
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
        background: '#03070d',
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
          background: 'radial-gradient(circle, rgba(231, 186, 144, 0.3) 0%, transparent 70%)',
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
            fontFamily: "'EB Garamond', serif",
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: '0.08em',
          }}
        >
          C&D
        </span>
      </motion.div>
    </motion.div>
  )
}
