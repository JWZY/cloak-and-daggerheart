import { Drawer } from 'vaul'
import { ReactNode } from 'react'
import './Sheet.css'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  title?: string
}

export default function Sheet({ open, onOpenChange, children, title }: SheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-overlay" />
        <Drawer.Content className="sheet-content">
          {/* iOS-style handle */}
          <div className="sheet-handle-container">
            <div className="sheet-handle" />
          </div>
          
          {title && (
            <div className="sheet-header">
              <h2 className="sheet-title">{title}</h2>
            </div>
          )}
          
          <div className="sheet-body">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

