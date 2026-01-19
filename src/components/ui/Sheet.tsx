import { Drawer } from 'vaul'
import type { ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  title?: string
}

export function Sheet({ open, onOpenChange, children, title }: SheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-3xl fixed bottom-0 left-0 right-0 z-50 max-h-[90vh]">
          <div className="p-4 bg-white rounded-t-3xl flex-shrink-0">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
            {title && (
              <Drawer.Title className="text-lg font-semibold text-center mb-2">
                {title}
              </Drawer.Title>
            )}
          </div>
          <div className="p-4 pt-0 overflow-auto flex-1">{children}</div>
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
