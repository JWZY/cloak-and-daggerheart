import { Layers } from 'lucide-react'
import { goldDarkAlpha } from '../../ui/typography'

interface CardPreviewButtonProps {
  onClick: () => void
}

/** Small circular button with a card/layers icon — opens card preview overlay */
export function CardPreviewButton({ onClick }: CardPreviewButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: `1.5px solid ${goldDarkAlpha(0.3)}`,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Layers size={14} color={goldDarkAlpha(0.7)} />
    </button>
  )
}
