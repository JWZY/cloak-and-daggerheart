import { useRef, useEffect, useState, useCallback } from 'react'

/**
 * Auto-sizing title that scales down from maxFontSize to fit on one line.
 * Uses ref measurement loop (0.5px steps), white-space: nowrap.
 * Extracted from SRDCard (canonical source).
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
    let size = maxFontSize
    text.style.fontSize = `${size}px`
    while (text.scrollWidth > container.clientWidth && size > 12) {
      size -= 0.5
      text.style.fontSize = `${size}px`
    }
    setFontSize(size)
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
