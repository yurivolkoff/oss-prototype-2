import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/cn'

interface AccordionProps {
  number?: number
  title: ReactNode
  subtitle?: ReactNode
  defaultOpen?: boolean
  trailing?: ReactNode
  children: ReactNode
}

export default function Accordion({
  number,
  title,
  subtitle,
  defaultOpen = false,
  trailing,
  children,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Chevron = open ? ChevronUp : ChevronDown

  return (
    <div className="border border-gray-200 rounded-xl">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50"
        aria-expanded={open}
      >
        {number !== undefined && (
          <span
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0',
              'text-white',
            )}
            style={{ background: 'var(--color-accent-600)' }}
          >
            {number}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{title}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
        </div>
        {trailing}
        <Chevron className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </button>
      {open && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  )
}
