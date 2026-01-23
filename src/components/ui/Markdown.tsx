import { Fragment } from 'react'

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className = '' }: MarkdownProps) {
  // Parse markdown text into React elements
  // Supports: **bold**, *italic*, and newlines
  const parseMarkdown = (text: string) => {
    const elements: (string | JSX.Element)[] = []
    let key = 0

    // Split by newlines first to handle paragraphs
    const paragraphs = text.split('\n\n')

    paragraphs.forEach((paragraph, pIndex) => {
      if (pIndex > 0) {
        elements.push(<br key={`br-${key++}`} />)
        elements.push(<br key={`br-${key++}`} />)
      }

      // Handle single newlines within paragraphs
      const lines = paragraph.split('\n')
      lines.forEach((line, lIndex) => {
        if (lIndex > 0) {
          elements.push(<br key={`br-${key++}`} />)
        }

        // Parse bold (**text**) and italic (*text*)
        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)

        parts.forEach((part) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            elements.push(
              <strong key={`strong-${key++}`} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            )
          } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            // Italic text
            elements.push(
              <em key={`em-${key++}`}>
                {part.slice(1, -1)}
              </em>
            )
          } else if (part) {
            elements.push(<Fragment key={`text-${key++}`}>{part}</Fragment>)
          }
        })
      })
    })

    return elements
  }

  return <span className={className}>{parseMarkdown(children)}</span>
}
