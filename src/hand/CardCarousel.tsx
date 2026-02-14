import { useState, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { DomainCard } from '../cards/DomainCard'
import { InfoCard } from '../cards/InfoCard'
import { domainCardToProps, parseAbilityText, ancestryToInfoCardProps, communityToInfoCardProps } from '../data/card-mapper'
import type { Character } from '../types/character'

export interface CardCarouselProps {
  character: Character
  onCardTap: (cardName: string) => void
}

export function CardCarousel({ character, onCardTap }: CardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
  })

  const domainCards = character.domainCards

  return (
    <div className="w-full">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 pl-4">
          {domainCards.map((card) => {
            const mapped = domainCardToProps(card)
            const bodyParts = parseAbilityText(mapped.bodyText)

            return (
              <div
                key={card.name}
                className="flex-shrink-0"
                style={{ width: 144 }}
              >
                <div
                  className="relative"
                  style={{
                    width: 144,
                    height: 200,
                    overflow: 'hidden',
                    borderRadius: 10,
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
                </div>
              </div>
            )
          })}

          <div
            key="ancestry"
            className="flex-shrink-0"
          >
            <InfoCard
              {...ancestryToInfoCardProps(character.ancestry)}
              scale={0.4}
              onClick={() => onCardTap('ancestry')}
            />
          </div>

          <div
            key="community"
            className="flex-shrink-0"
          >
            <InfoCard
              {...communityToInfoCardProps(character.community)}
              scale={0.4}
              onClick={() => onCardTap('community')}
            />
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <DotIndicators emblaApi={emblaApi} count={domainCards.length + 2} />
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
