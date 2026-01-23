import { useEffect, useRef, useCallback } from 'react'

export function useMouseGlow() {
  const rafRef = useRef<number>()

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    // Use requestAnimationFrame for smooth updates
    rafRef.current = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    })
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${touch.clientX}px`)
        document.documentElement.style.setProperty('--mouse-y', `${touch.clientY}px`)
      })
    }
  }, [])

  useEffect(() => {
    // Set initial position to center
    document.documentElement.style.setProperty('--mouse-x', '50%')
    document.documentElement.style.setProperty('--mouse-y', '50%')

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleMouseMove, handleTouchMove])
}
