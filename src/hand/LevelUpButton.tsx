import { typeSubtitle, goldGradientSubtle, goldDark, goldDarkAlpha } from '../ui/typography'

interface LevelUpButtonProps {
  onClick: () => void
  variant: 'desktop' | 'mobile'
}

const desktopStyle = {
  ...typeSubtitle,
  background: goldGradientSubtle,
  border: '1px solid var(--gold-muted)',
  color: 'var(--gold)',
}

const mobileStyle = {
  ...typeSubtitle,
  background: goldGradientSubtle,
  border: `1px solid ${goldDarkAlpha(0.3)}`,
  color: goldDark,
}

export function LevelUpButton({ onClick, variant }: LevelUpButtonProps) {
  return (
    <div className={`flex justify-center ${variant === 'desktop' ? 'pb-4' : 'pb-2'}`}>
      <button
        onClick={onClick}
        className="px-4 py-1.5 rounded-full text-sm transition-all"
        style={variant === 'desktop' ? desktopStyle : mobileStyle}
      >
        Level Up
      </button>
    </div>
  )
}
