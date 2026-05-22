import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CardProps {
  children: ReactNode
  variant?: 'base' | 'accent'
  className?: string
}

export default function Card({ children, variant = 'base', className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl shadow-sm',
        variant === 'base' && 'bg-white',
        variant === 'accent' && 'text-white',
        className,
      )}
      style={
        variant === 'accent'
          ? {
              background:
                'linear-gradient(135deg, var(--color-accent-600), var(--color-accent-800))',
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
