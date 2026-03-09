import { useEffect, useRef } from 'react'

interface EmberOverlayProps {
  /** Primary accent color as hex (e.g. "#EB5B00") */
  color?: string
  /** Particles per second (default: 8 — subtle, not overwhelming) */
  rate?: number
  /** Whether the effect is active (default: true) */
  active?: boolean
}

/**
 * Fixed-position ember particle overlay that covers the full viewport.
 * Uses position:fixed so it never scrolls or gets clipped by parent containers.
 * Place anywhere in the component tree — it renders at viewport level.
 */
export function EmberOverlay({ color = '#e7ba90', rate = 8, active = true }: EmberOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return
    const container = containerRef.current

    // Parse hex color to RGB for rgba() usage
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    // Lighter variant for ember center
    const lr = Math.min(255, r + 80)
    const lg = Math.min(255, g + 60)
    const lb = Math.min(255, b + 30)

    function createEmber() {
      const el = document.createElement('div')
      // Use viewport dimensions directly — container is fixed to viewport
      const width = window.innerWidth
      const height = window.innerHeight
      if (width === 0 || height === 0) return

      // Depth: 0 = far, 1 = close
      const depthRand = Math.random()
      const depth = depthRand < 0.5 ? depthRand * 0.6 : 0.3 + depthRand * 0.7

      const isGlow = Math.random() < 0.65
      const size = isGlow ? 5 + depth * 8 + Math.random() * 4 : 3 + Math.random() * 2

      el.style.position = 'absolute'
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.borderRadius = '50%'
      el.style.pointerEvents = 'none'
      el.style.willChange = 'transform, opacity'

      if (isGlow) {
        el.style.background = `radial-gradient(circle, rgba(${lr},${lg},${lb},1) 0%, rgba(${r},${g},${b},0.8) 50%, transparent 100%)`
        el.style.boxShadow = `0 0 ${4 + depth * 4}px rgba(${r},${g},${b},0.6), 0 0 ${8 + depth * 6}px rgba(${r},${g},${b},0.3)`
      } else {
        el.style.background = `rgba(${lr},${lg},${lb},0.8)`
        el.style.boxShadow = `0 0 3px rgba(${r},${g},${b},0.5)`
      }

      // Blur background particles
      const blur = depth < 0.4 ? (0.4 - depth) * 3 : 0
      if (blur > 0.5) el.style.filter = `blur(${blur}px)`

      // Start position: random X, bottom of viewport
      el.style.left = `${Math.random() * width}px`
      el.style.top = `${height + 5}px`

      container.appendChild(el)

      // Animation: float upward with drift and wobble
      const baseOpacity = 0.5 + depth * 0.4
      const driftX = (Math.random() - 0.5) * 60
      const wobble = (Math.random() - 0.5) * 25
      const duration = 5000 + (1 - depth) * 3000 + Math.random() * 2000

      el.animate(
        [
          { transform: 'translate(0, 0) scale(0.4)', opacity: 0 },
          {
            transform: `translate(${driftX * 0.3 + wobble}px, -${height * 0.3}px) scale(1)`,
            opacity: baseOpacity,
            offset: 0.2,
          },
          {
            transform: `translate(${driftX * 0.6 - wobble}px, -${height * 0.6}px) scale(0.85)`,
            opacity: baseOpacity * 0.85,
            offset: 0.5,
          },
          {
            transform: `translate(${driftX * 0.8 + wobble}px, -${height * 0.85}px) scale(0.5)`,
            opacity: baseOpacity * 0.5,
            offset: 0.8,
          },
          { transform: `translate(${driftX}px, -${height + 30}px) scale(0.15)`, opacity: 0 },
        ],
        {
          duration,
          easing: 'ease-out',
        }
      ).onfinish = () => el.remove()
    }

    // Pre-spawn a few for immediate visibility
    for (let i = 0; i < 4; i++) createEmber()

    // Continuous spawn
    const spawnInterval = 1000 / rate
    intervalRef.current = setInterval(createEmber, spawnInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      container.innerHTML = ''
    }
  }, [color, rate, active])

  // Parse color for the glow
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  return (
    <>
      {/* Faint accent radial glow at bottom edge — fixed to viewport */}
      <div
        style={{
          position: 'fixed',
          bottom: -40,
          left: 0,
          right: 0,
          height: 200,
          background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(${r},${g},${b},0.25) 0%, rgba(${r},${g},${b},0.08) 40%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Particle container — fixed to viewport, never scrolls */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </>
  )
}
