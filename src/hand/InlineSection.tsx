import { typeSubtitle } from '../ui/typography'

interface InlineSectionProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}

/**
 * A section with a gold-bordered header containing an icon and title.
 * Used for Traits, Equipment, and Notes panels in the hand view.
 */
export function InlineSection({ title, icon: Icon, children }: InlineSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 pb-2 mb-2" style={{ borderBottom: '1px solid var(--gold-muted)' }}>
        <Icon size={14} color="var(--gold-secondary)" />
        <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}
