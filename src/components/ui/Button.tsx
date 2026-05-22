import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'medium' | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'large',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2',
        size === 'large' && 'px-5 py-3 text-sm rounded-xl',
        size === 'medium' && 'px-4 py-2 text-sm rounded-lg',
        variant === 'primary' && 'text-white',
        variant === 'secondary' && 'border-2 bg-white',
        variant === 'ghost' && 'bg-transparent',
        className,
      )}
      style={
        variant === 'primary'
          ? { background: 'var(--color-accent-600)' }
          : variant === 'secondary'
            ? { color: 'var(--color-accent-600)', borderColor: 'var(--color-accent-600)' }
            : { color: 'var(--color-accent-600)' }
      }
      {...rest}
    >
      {children}
    </button>
  )
}
