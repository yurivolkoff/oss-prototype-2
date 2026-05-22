import type { ReactNode } from 'react'
import { Info } from 'lucide-react'
import { cn } from '../../lib/cn'

interface InfoBlockProps {
  children: ReactNode
  className?: string
  showIcon?: boolean
}

export default function InfoBlock({ children, className, showIcon = true }: InfoBlockProps) {
  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl text-sm',
        className,
      )}
      style={{ background: 'var(--color-accent-50)', color: 'var(--color-text-primary, #0D1B2A)' }}
    >
      {showIcon && <Info className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-accent-600)' }} />}
      <div className="flex-1">{children}</div>
    </div>
  )
}
