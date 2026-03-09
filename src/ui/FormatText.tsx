import { type ReactNode } from 'react'

/**
 * Converts simple markdown in SRD text to React elements.
 * Handles: **bold**, ***bold italic***, bullet lists (- item), and newlines.
 */
export function FormatText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }): ReactNode {
  // Split by double newlines into paragraphs
  const paragraphs = text.split(/\n\n+/)

  return (
    <>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim()
        if (!trimmed) return null

        // Check if this paragraph is a bullet list
        const lines = trimmed.split('\n')
        const isList = lines.every(l => l.trim().startsWith('- ') || l.trim() === '')

        if (isList) {
          return (
            <ul key={i} className={className} style={{ margin: '4px 0', paddingLeft: 16, ...style }}>
              {lines.filter(l => l.trim().startsWith('- ')).map((line, j) => (
                <li key={j} style={{ marginBottom: 2 }}>
                  {formatInline(line.trim().slice(2))}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={i} className={className} style={{ margin: i > 0 ? '8px 0 0' : 0, ...style }}>
            {formatInline(trimmed.replace(/\n/g, ' '))}
          </p>
        )
      })}
    </>
  )
}

/** Convert **bold** and ***bold italic*** markers to elements */
function formatInline(text: string): ReactNode {
  // Match ***text*** or **text** patterns
  const parts = text.split(/(\*{2,3}.*?\*{2,3})/g)
  return parts.map((part, i) => {
    if (part.startsWith('***') && part.endsWith('***')) {
      return <strong key={i}><em>{part.slice(3, -3)}</em></strong>
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
