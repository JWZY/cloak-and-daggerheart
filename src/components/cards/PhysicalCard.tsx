import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Standard card aspect ratio (poker card: 63.5mm x 88.9mm ≈ 5:7)
const CARD_ASPECT_RATIO = 5 / 7

interface PhysicalCardProps {
  title: string
  subtitle?: string
  tier?: 'Foundation' | 'Specialization' | 'Mastery'
  children: ReactNode
  backgroundImage?: string
  accentColor?: string
  onClick?: () => void
  className?: string
}

export function PhysicalCard({
  title,
  subtitle,
  tier,
  children,
  backgroundImage,
  accentColor = 'rgba(99, 102, 241, 0.5)', // Default indigo
  onClick,
  className = '',
}: PhysicalCardProps) {
  const tierColors: Record<string, string> = {
    Foundation: 'rgba(34, 197, 94, 0.8)', // Green
    Specialization: 'rgba(59, 130, 246, 0.8)', // Blue
    Mastery: 'rgba(168, 85, 247, 0.8)', // Purple
  }

  const tierColor = tier ? tierColors[tier] : accentColor

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : {}}
      whileHover={onClick ? { y: -4, rotateY: 2 } : {}}
      onClick={onClick}
      className={`
        relative overflow-hidden
        w-full max-w-[280px]
        cursor-${onClick ? 'pointer' : 'default'}
        ${className}
      `}
      style={{
        aspectRatio: CARD_ASPECT_RATIO,
      }}
    >
      {/* Card frame with Liquid Glass effect */}
      <div
        className="
          absolute inset-0 rounded-xl
          bg-gradient-to-b from-white/10 via-white/5 to-black/20
          backdrop-blur-sm
          shadow-[
            inset_0_1px_1px_rgba(255,255,255,0.4),
            inset_0_-1px_1px_rgba(0,0,0,0.2),
            0_8px_32px_rgba(0,0,0,0.4),
            0_2px_8px_rgba(0,0,0,0.2)
          ]
          border border-white/20
        "
      />

      {/* Background image with gradient overlay */}
      {backgroundImage && (
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90" />
        </div>
      )}

      {/* Card content */}
      <div className="relative h-full flex flex-col p-4 z-10">
        {/* Header */}
        <div className="flex-shrink-0 mb-3">
          {/* Tier badge */}
          {tier && (
            <div
              className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium mb-2"
              style={{
                backgroundColor: tierColor,
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {tier}
            </div>
          )}

          {/* Title */}
          <h3
            className="text-lg font-bold text-white leading-tight"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Divider line with glow */}
        <div
          className="h-px mb-3 flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)`,
            boxShadow: `0 0 8px ${tierColor}`,
          }}
        />

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <div className="text-sm text-white/80 leading-relaxed">
            {children}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-1 mt-3 rounded-full flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, ${tierColor}, transparent)`,
          }}
        />
      </div>

      {/* Corner accents */}
      <div
        className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 rounded-tl-sm"
        style={{ borderColor: tierColor }}
      />
      <div
        className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 rounded-tr-sm"
        style={{ borderColor: tierColor }}
      />
      <div
        className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 rounded-bl-sm"
        style={{ borderColor: tierColor }}
      />
      <div
        className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 rounded-br-sm"
        style={{ borderColor: tierColor }}
      />
    </motion.div>
  )
}

// Subclass-specific card with pre-configured styling
interface SubclassCardProps {
  subclass: 'School of Knowledge' | 'School of War'
  tier: 'Foundation' | 'Specialization' | 'Mastery'
  featureName: string
  featureText: string
  onClick?: () => void
}

export function SubclassCard({
  subclass,
  tier,
  featureName,
  featureText,
  onClick,
}: SubclassCardProps) {
  const subclassConfig = {
    'School of Knowledge': {
      image: '/images/cards/domains/school-of-knowledge.avif',
      color: 'rgba(99, 102, 241, 0.7)', // Indigo
    },
    'School of War': {
      image: '/images/cards/domains/school-of-war.avif',
      color: 'rgba(239, 68, 68, 0.7)', // Red
    },
  }

  const config = subclassConfig[subclass]

  return (
    <PhysicalCard
      title={featureName}
      subtitle={subclass}
      tier={tier}
      backgroundImage={config.image}
      accentColor={config.color}
      onClick={onClick}
    >
      <p>{featureText}</p>
    </PhysicalCard>
  )
}
