import { useRef, useEffect, useState, useCallback } from 'react'

const MIN_FONT_SIZE = 12
const STEP = 0.5

/**
 * Auto-sizing title that scales down from maxFontSize to fit on one line.
 * Uses binary search over font sizes to minimize forced reflows (~6 vs ~50).
 */
export function AutoFitTitle({ children, maxFontSize = 36, style }: {
  children: React.ReactNode
  maxFontSize?: number
  style?: React.CSSProperties
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const [fontSize, setFontSize] = useState(maxFontSize)

  const fit = useCallback(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    // Quick check: does it fit at max size?
    text.style.fontSize = `${maxFontSize}px`
    if (text.scrollWidth <= container.clientWidth) {
      setFontSize(maxFontSize)
      return
    }

    // Binary search for the largest size that fits (snapped to 0.5px grid)
    let lo = MIN_FONT_SIZE
    let hi = maxFontSize

    while (hi - lo > STEP) {
      const mid = Math.floor((lo + hi) / 2 / STEP) * STEP
      text.style.fontSize = `${mid}px`
      if (text.scrollWidth > container.clientWidth) {
        hi = mid
      } else {
        lo = mid
      }
    }

    setFontSize(lo)
  }, [maxFontSize])

  useEffect(() => { fit() }, [fit, children])

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden' }}>
      <h1 ref={textRef} style={{ ...style, fontSize, whiteSpace: 'nowrap' }}>
        {children}
      </h1>
    </div>
  )
}
