import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

interface WispProps {
  size: number
  initialX: string
  initialY: string
  seed: number
}

// Generate random path based on seed
function generateRandomPath(seed: number) {
  const random = (min: number, max: number) => {
    const x = Math.sin(seed++) * 10000
    return min + (x - Math.floor(x)) * (max - min)
  }

  const points = 6
  const xPath = ['0%']
  const yPath = ['0%']
  const scalePath = [1]

  for (let i = 0; i < points - 1; i++) {
    xPath.push(`${random(-150, 150)}%`)
    yPath.push(`${random(-150, 150)}%`)
    scalePath.push(random(0.8, 1.3))
  }
  xPath.push('0%')
  yPath.push('0%')
  scalePath.push(1)

  return {
    x: xPath,
    y: yPath,
    scale: scalePath,
  }
}

function Wisp({ size, initialX, initialY, seed }: WispProps) {
  const shouldReduceMotion = useReducedMotion()

  const path = useMemo(() => generateRandomPath(seed), [seed])
  const duration = useMemo(() => 15 + (seed % 10), [seed])

  if (shouldReduceMotion) {
    return (
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          left: initialX,
          top: initialY,
          background: `radial-gradient(circle, rgba(120, 200, 255, 0.4) 0%, rgba(80, 160, 220, 0.2) 40%, transparent 70%)`,
          opacity: 0.3,
        }}
      />
    )
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        left: initialX,
        top: initialY,
      }}
      animate={path}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Core - minimal blur */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(150, 220, 255, 0.5) 0%, rgba(100, 180, 240, 0.3) 40%, transparent 70%)`,
          filter: 'blur(2px)',
        }}
        animate={{
          opacity: [0.35, 0.5, 0.3, 0.45, 0.35],
          scale: [1, 1.08, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 3 + (seed % 3),
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

// Small sparkle particles - keeping these as you liked them
function Sparkle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        background: 'rgba(200, 230, 255, 0.8)',
        boxShadow: '0 0 4px 1px rgba(150, 200, 255, 0.6)',
      }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.2, 0],
        y: [0, -25, -50],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: 4 + Math.random() * 5,
        ease: 'easeOut',
      }}
    />
  )
}

export function KnowledgeWisps() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Wisps with random movement */}
      <Wisp size={60} initialX="10%" initialY="20%" seed={1} />
      <Wisp size={45} initialX="80%" initialY="15%" seed={7} />
      <Wisp size={55} initialX="60%" initialY="50%" seed={13} />
      <Wisp size={40} initialX="25%" initialY="65%" seed={19} />
      <Wisp size={50} initialX="75%" initialY="75%" seed={31} />
      <Wisp size={35} initialX="40%" initialY="35%" seed={43} />
      <Wisp size={48} initialX="15%" initialY="85%" seed={61} />

      {/* Sparkle particles */}
      <Sparkle delay={0} x="20%" y="30%" />
      <Sparkle delay={1.5} x="70%" y="20%" />
      <Sparkle delay={3} x="45%" y="75%" />
      <Sparkle delay={0.8} x="85%" y="50%" />
      <Sparkle delay={2.2} x="30%" y="55%" />
      <Sparkle delay={4} x="60%" y="40%" />
      <Sparkle delay={1.2} x="12%" y="45%" />
      <Sparkle delay={2.8} x="90%" y="30%" />
      <Sparkle delay={3.5} x="55%" y="85%" />
    </div>
  )
}
