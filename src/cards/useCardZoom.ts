import { useState, useCallback } from 'react'

export function useCardZoom() {
  const [zoomedCard, setZoomedCard] = useState<string | null>(null)

  const openZoom = useCallback((layoutId: string) => setZoomedCard(layoutId), [])
  const closeZoom = useCallback(() => setZoomedCard(null), [])
  const isZoomed = useCallback((layoutId: string) => zoomedCard === layoutId, [zoomedCard])

  return {
    zoomedCard,
    openZoom,
    closeZoom,
    isZoomed,
  }
}
