import { parseAbilityText } from '../data/card-mapper'
import { FormatText } from '../ui/FormatText'

interface DomainCardBodyProps {
  bodyText: string
}

/**
 * Renders parsed ability text paragraphs for a domain card.
 * Shared between the domain cards grid and the zoom overlay.
 */
export function DomainCardBody({ bodyText }: DomainCardBodyProps) {
  const bodyParts = parseAbilityText(bodyText)
  return (
    <>
      {bodyParts.map((part, i) => (
        <div key={i} className={i > 0 ? 'mt-2' : ''}>
          {part.name && (
            <>
              <span className="font-bold">{part.name}:</span>{' '}
            </>
          )}
          <FormatText text={part.text} />
        </div>
      ))}
    </>
  )
}
