import { Drawer } from 'vaul'
import type { ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  title?: string
  variant?: 'solid' | 'glass'
  /** Use 'full' for long scrollable lists like item selection */
  size?: 'auto' | 'full'
}

export function Sheet({ open, onOpenChange, children, title, variant = 'glass', size = 'auto' }: SheetProps) {
  const isGlass = variant === 'glass'

  // Liquid Glass styling for sheet content
  const glassStyles = isGlass
    ? `
      bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_50%,rgba(0,0,0,0.02)_100%)]
      backdrop-blur-[4px]
      [backdrop-filter:blur(4px)_saturate(160%)]
      [-webkit-backdrop-filter:blur(4px)_saturate(160%)]
      shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_2px_4px_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.12),inset_0_-2px_4px_rgba(0,0,0,0.06),0_-4px_20px_rgba(0,0,0,0.4)]
    `
    : 'bg-white'

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} snapPoints={size === 'full' ? [0.9] : undefined}>
      <Drawer.Portal>
        <Drawer.Overlay
          className={`fixed inset-0 z-40 ${
            isGlass ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/40'
          }`}
        />
        <Drawer.Content
          className={`flex flex-col rounded-t-[24px] fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] ${glassStyles}`}
        >
          <div
            className={`p-4 rounded-t-[24px] flex-shrink-0 relative z-10 ${
              isGlass ? '' : 'bg-white'
            }`}
          >
            {/* Handle with Liquid Glass specular highlight */}
            <div
              className={`mx-auto w-12 h-1.5 flex-shrink-0 rounded-full mb-4 ${
                isGlass
                  ? 'bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]'
                  : 'bg-gray-300'
              }`}
            />
            {title && (
              <Drawer.Title
                className={`text-lg font-semibold text-center mb-2 ${
                  isGlass ? 'text-white' : ''
                }`}
              >
                {title}
              </Drawer.Title>
            )}
          </div>
          <div className="p-4 pt-0 overflow-auto flex-1 relative z-10">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

interface SheetTriggerProps {
  children: ReactNode
  asChild?: boolean
}

export function SheetTrigger({ children, asChild }: SheetTriggerProps) {
  return <Drawer.Trigger asChild={asChild}>{children}</Drawer.Trigger>
}
