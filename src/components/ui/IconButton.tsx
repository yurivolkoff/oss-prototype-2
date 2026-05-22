import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  'aria-label': string
}

export default function IconButton({ className, children, ...rest }: IconButtonProps) {
  return (
    <button
      className={cn(
        'p-2 rounded-lg hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
