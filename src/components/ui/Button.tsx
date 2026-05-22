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
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-600)]',
        size === 'large' && 'px-5 py-3 text-sm rounded-xl',
        size === 'medium' && 'px-4 py-2 text-sm rounded-lg',
        variant === 'primary' &&
          'text-white bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-700)] active:bg-[var(--color-accent-800)] disabled:hover:bg-[var(--color-accent-600)]',
        variant === 'secondary' &&
          'bg-white border-2 border-[var(--color-accent-600)] text-[var(--color-accent-600)] hover:bg-[var(--color-accent-50)] active:bg-[var(--color-accent-100)]',
        variant === 'ghost' &&
          'bg-transparent text-[var(--color-accent-600)] hover:bg-[var(--color-accent-50)] active:bg-[var(--color-accent-100)]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
