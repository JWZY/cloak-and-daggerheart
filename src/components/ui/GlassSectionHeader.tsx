import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface GlassSectionHeaderProps {
  title: string
  icon?: LucideIcon
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function GlassSectionHeader({
  title,
  icon: Icon,
  subtitle,
  action,
  className = '',
}: GlassSectionHeaderProps) {
  return (
    <div className={`flex items-center gap-2 mb-3 ${className}`}>
      {Icon && (
        <div className="lg-button w-8 h-8 flex-shrink-0">
          <Icon size={16} className="text-white/80" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-glass-primary font-semibold truncate">{title}</h3>
        {subtitle && (
          <p className="text-glass-muted text-xs truncate">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
