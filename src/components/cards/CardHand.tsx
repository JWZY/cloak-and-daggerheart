import { motion, AnimatePresence } from 'framer-motion'
import { useState, Children } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface CardHandProps {
  children: ReactNode
  className?: string
}

export function CardHand({ children, className = '' }: CardHandProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const childArray = Children.toArray(children)

  return (
    <div className={className}>
      {/* Horizontal scroll rail */}
      <div
        className="scrollbar-hide"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'flex-end',
          gap: '12px',
          overflowX: 'auto',
          paddingTop: '16px',
          paddingBottom: '16px',
          paddingLeft: '4px',
          paddingRight: '16px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {childArray.map((child, index) => {
          const isActive = activeIndex === index

          return (
            <motion.div
              key={index}
              style={{
                flexShrink: 0,
                flexGrow: 0,
                scrollSnapAlign: 'start',
                zIndex: isActive ? 10 : 1,
                cursor: 'pointer',
                transformOrigin: 'bottom center',
              }}
              initial={false}
              animate={{
                scale: isActive ? 1.08 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              }}
              onHoverStart={() => setActiveIndex(index)}
              onHoverEnd={() => setActiveIndex(null)}
              onTouchStart={() => setActiveIndex(index)}
              onTouchEnd={() => setActiveIndex(null)}
            >
              {child}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Card sized for hand display (140px wide, 5:7 aspect ratio)
interface HandCardProps {
  title: string
  subtitle?: string
  tier?: 'Foundation' | 'Specialization' | 'Mastery'
  children: ReactNode
  backgroundImage?: string
  onClick?: () => void
}

export function HandCard({
  title,
  subtitle,
  tier,
  children,
  backgroundImage,
  onClick,
}: HandCardProps) {
  const tierColors: Record<string, string> = {
    Foundation: 'rgba(34, 197, 94, 0.8)',
    Specialization: 'rgba(59, 130, 246, 0.8)',
    Mastery: 'rgba(168, 85, 247, 0.8)',
  }

  const tierColor = tier ? tierColors[tier] : 'rgba(99, 102, 241, 0.5)'

  // Card dimensions: 140px wide, 5:7 aspect ratio = 196px tall
  const cardWidth = 140
  const cardHeight = cardWidth * (7 / 5)

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: cardWidth,
        minWidth: cardWidth,
        maxWidth: cardWidth,
        height: cardHeight,
        borderRadius: '8px',
        userSelect: 'none',
      }}
    >
      {/* Card frame */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '8px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.2) 100%)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: `
            inset 0 1px 1px rgba(255,255,255,0.4),
            inset 0 -1px 1px rgba(0,0,0,0.2),
            0 8px 32px rgba(0,0,0,0.4),
            0 2px 8px rgba(0,0,0,0.2)
          `,
        }}
      />

      {/* Background image */}
      {backgroundImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)',
            }}
          />
        </div>
      )}

      {/* Card content */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0, marginBottom: '8px' }}>
          {tier && (
            <div
              style={{
                display: 'inline-block',
                padding: '2px 6px',
                borderRadius: '9999px',
                fontSize: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 500,
                marginBottom: '4px',
                backgroundColor: tierColor,
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {tier}
            </div>
          )}

          <h3
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              margin: 0,
            }}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '2px',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            marginBottom: '8px',
            flexShrink: 0,
            background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)`,
            boxShadow: `0 0 6px ${tierColor}`,
          }}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            height: '2px',
            marginTop: '8px',
            borderRadius: '9999px',
            flexShrink: 0,
            background: `linear-gradient(90deg, ${tierColor}, transparent)`,
          }}
        />
      </div>

      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          width: '8px',
          height: '8px',
          borderLeft: `1px solid ${tierColor}`,
          borderTop: `1px solid ${tierColor}`,
          borderTopLeftRadius: '2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '8px',
          height: '8px',
          borderRight: `1px solid ${tierColor}`,
          borderTop: `1px solid ${tierColor}`,
          borderTopRightRadius: '2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          left: '6px',
          width: '8px',
          height: '8px',
          borderLeft: `1px solid ${tierColor}`,
          borderBottom: `1px solid ${tierColor}`,
          borderBottomLeftRadius: '2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '6px',
          width: '8px',
          height: '8px',
          borderRight: `1px solid ${tierColor}`,
          borderBottom: `1px solid ${tierColor}`,
          borderBottomRightRadius: '2px',
        }}
      />
    </div>
  )
}

// Lightbox for viewing card at full size
interface CardLightboxProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  tier?: 'Foundation' | 'Specialization' | 'Mastery'
  children: ReactNode
  backgroundImage?: string
}

export function CardLightbox({
  isOpen,
  onClose,
  title,
  subtitle,
  tier,
  children,
  backgroundImage,
}: CardLightboxProps) {
  const tierColors: Record<string, string> = {
    Foundation: 'rgba(34, 197, 94, 0.8)',
    Specialization: 'rgba(59, 130, 246, 0.8)',
    Mastery: 'rgba(168, 85, 247, 0.8)',
  }

  const tierColor = tier ? tierColors[tier] : 'rgba(99, 102, 241, 0.5)'

  // Larger card size for lightbox (280px wide, 5:7 ratio)
  const cardWidth = 280
  const cardHeight = cardWidth * (7 / 5)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '24px',
          }}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </motion.button>

          {/* Expanded card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: cardWidth,
              height: cardHeight,
              borderRadius: '16px',
              userSelect: 'none',
            }}
          >
            {/* Card frame */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.2) 100%)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.5),
                  inset 0 -1px 2px rgba(0,0,0,0.2),
                  0 16px 64px rgba(0,0,0,0.5),
                  0 4px 16px rgba(0,0,0,0.3)
                `,
              }}
            />

            {/* Background image */}
            {backgroundImage && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.85) 100%)',
                  }}
                />
              </div>
            )}

            {/* Card content */}
            <div
              style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                zIndex: 10,
              }}
            >
              {/* Header */}
              <div style={{ flexShrink: 0, marginBottom: '16px' }}>
                {tier && (
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 600,
                      marginBottom: '8px',
                      backgroundColor: tierColor,
                      color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {tier}
                  </div>
                )}

                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'white',
                    lineHeight: 1.2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>

                {subtitle && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '4px',
                      margin: 0,
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '2px',
                  marginBottom: '16px',
                  flexShrink: 0,
                  background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)`,
                  boxShadow: `0 0 8px ${tierColor}`,
                }}
              />

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.6,
                  }}
                >
                  {children}
                </div>
              </div>

              {/* Bottom accent */}
              <div
                style={{
                  height: '3px',
                  marginTop: '16px',
                  borderRadius: '9999px',
                  flexShrink: 0,
                  background: `linear-gradient(90deg, ${tierColor}, transparent)`,
                }}
              />
            </div>

            {/* Corner accents */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                width: '16px',
                height: '16px',
                borderLeft: `2px solid ${tierColor}`,
                borderTop: `2px solid ${tierColor}`,
                borderTopLeftRadius: '4px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '16px',
                height: '16px',
                borderRight: `2px solid ${tierColor}`,
                borderTop: `2px solid ${tierColor}`,
                borderTopRightRadius: '4px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                width: '16px',
                height: '16px',
                borderLeft: `2px solid ${tierColor}`,
                borderBottom: `2px solid ${tierColor}`,
                borderBottomLeftRadius: '4px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                width: '16px',
                height: '16px',
                borderRight: `2px solid ${tierColor}`,
                borderBottom: `2px solid ${tierColor}`,
                borderBottomRightRadius: '4px',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
