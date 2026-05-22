import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** action row at the bottom (typically buttons) */
  footer?: ReactNode
  /** if true, clicking overlay does NOT close (use for destructive confirm) */
  disableOverlayClose?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  disableOverlayClose,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        data-testid="modal-overlay"
        className="absolute inset-0 bg-black/50"
        onClick={disableOverlayClose ? undefined : onClose}
      />
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto w-full',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-2xl',
        )}
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
