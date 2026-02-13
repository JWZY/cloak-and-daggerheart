import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { DomainCard } from '../cards/DomainCard'
import { domainCardToProps, parseAbilityText } from '../data/card-mapper'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

export interface CardCarouselProps {
  character: Character
  onCardTap: (cardName: string) => void
}

export function CardCarousel({ character, onCardTap }: CardCarouselProps) {
  const toggleCardUsed = useCharacterStore((s) => s.toggleCardUsed)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
  })

  const handleToggleUsed = useCallback(
    (cardName: string) => {
      toggleCardUsed(character.id, cardName)
    },
    [character.id, toggleCardUsed]
  )

  const domainCards = character.domainCards

  return (
    <div className="w-full">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 pl-4">
          {domainCards.map((card) => {
            const mapped = domainCardToProps(card)
            const bodyParts = parseAbilityText(mapped.bodyText)
            const isUsed = card.used === true

            return (
              <div
                key={card.name}
                className="flex-shrink-0"
                style={{ width: 144 }}
              >
                {/* Sized wrapper to contain the scaled card in layout */}
                <div
                  className="relative"
                  style={{
                    width: 144,
                    height: 134,
                    overflow: 'hidden',
                    borderRadius: 10,
                    opacity: isUsed ? 0.5 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left' }}>
                    <DomainCard
                      {...mapped.props}
                      scale={1}
                      onClick={() => onCardTap(card.name)}
                    >
                      {bodyParts.map((part, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {part.name && (
                            <>
                              <span className="font-bold">{part.name}:</span>{' '}
                            </>
                          )}
                          {part.text}
                        </p>
                      ))}
                    </DomainCard>
                  </div>

                  {/* Used badge */}
                  {isUsed && (
                    <div className="absolute top-1 right-1 z-50">
                      <span
                        className="px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: '#94a3b8',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          fontSize: 9,
                        }}
                      >
                        Used
                      </span>
                    </div>
                  )}

                  {/* Tap to toggle used */}
                  <button
                    className="absolute bottom-0 left-0 right-0 z-50 text-center py-1"
                    style={{
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: isUsed ? '#d4af37' : 'rgba(212, 207, 199, 0.6)',
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleUsed(card.name)
                    }}
                  >
                    {isUsed ? 'Restore' : 'Mark Used'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <DotIndicators emblaApi={emblaApi} count={domainCards.length} />
    </div>
  )
}

function DotIndicators({
  emblaApi,
  count,
}: {
  emblaApi: ReturnType<typeof useEmblaCarousel>[1]
  count: number
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  if (count <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 mt-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className="flex items-center justify-center"
          style={{ padding: '8px 4px', cursor: 'pointer' }}
          onClick={() => emblaApi?.scrollTo(i)}
        >
          <span
            className="block rounded-full transition-all duration-200"
            style={{
              width: i === selectedIndex ? 8 : 5,
              height: 5,
              background:
                i === selectedIndex
                  ? '#d4af37'
                  : 'rgba(212, 207, 199, 0.3)',
              borderRadius: i === selectedIndex ? 3 : '50%',
            }}
          />
        </button>
      ))}
    </div>
  )
}
