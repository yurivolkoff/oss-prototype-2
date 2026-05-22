import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Info } from 'lucide-react'

interface InfoPopoverProps {
  children: ReactNode
  /** Custom trigger element. Defaults to ⓘ icon button. */
  trigger?: ReactNode
}

export default function InfoPopover({ children, trigger }: InfoPopoverProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e instanceof MouseEvent && rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', handler)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Подробнее"
        className="inline-flex p-0.5 rounded hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {trigger ?? <Info className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute left-0 top-full mt-2 z-40 w-80 p-4 bg-white rounded-xl border border-gray-200 shadow-lg text-sm text-gray-700 leading-relaxed"
        >
          {children}
        </div>
      )}
    </div>
  )
}
