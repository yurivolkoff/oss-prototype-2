import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type PillTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'dark'

interface PillProps {
  tone?: PillTone
  children: ReactNode
  className?: string
}

const toneClass: Record<PillTone, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-800',
  error: 'bg-rose-50 text-rose-700',
  info: 'bg-blue-50 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
  dark: 'bg-gray-800 text-white',
}

export default function Pill({ tone = 'neutral', children, className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
