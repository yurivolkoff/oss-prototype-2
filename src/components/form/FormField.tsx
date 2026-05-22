import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface FormFieldProps {
  label: ReactNode
  required?: boolean
  helper?: ReactNode
  error?: ReactNode
  children: ReactNode
  className?: string
}

export default function FormField({
  label,
  required,
  helper,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium lowercase text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-rose-600">*</span>}
      </label>
      {children}
      {error ? (
        <div className="text-xs text-rose-700">{error}</div>
      ) : helper ? (
        <div className="text-xs text-gray-500">{helper}</div>
      ) : null}
    </div>
  )
}
