import { motion } from 'framer-motion'

export interface CardBackProps {
  variant: 'subclass' | 'domain'
  onClick?: () => void
}

const dimensions = {
  subclass: { width: 260, height: 364, borderRadius: 12 },
  domain: { width: 216, height: 302, borderRadius: 12 },
}

export function CardBack({ variant, onClick }: CardBackProps) {
  const { width, height, borderRadius } = dimensions[variant]

  return (
    <motion.div
      whileHover={onClick ? { y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{
        width,
        height,
        borderRadius,
        background: '#1e201f',
        border: '2px solid #d4af37',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Radial gradient overlay for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative diamond element */}
      <svg
        width={width * 0.3}
        height={width * 0.3}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.3 }}
      >
        {/* Outer diamond */}
        <path
          d="M40 4 L76 40 L40 76 L4 40 Z"
          stroke="#d4af37"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Inner diamond */}
        <path
          d="M40 16 L64 40 L40 64 L16 40 Z"
          stroke="#d4af37"
          strokeWidth="1"
          fill="none"
        />
        {/* Cross lines */}
        <line x1="40" y1="4" x2="40" y2="76" stroke="#d4af37" strokeWidth="0.75" />
        <line x1="4" y1="40" x2="76" y2="40" stroke="#d4af37" strokeWidth="0.75" />
        {/* Center dot */}
        <circle cx="40" cy="40" r="2" fill="#d4af37" />
      </svg>
    </motion.div>
  )
}
