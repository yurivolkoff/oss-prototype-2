import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  error?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className, ...rest }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2 rounded-lg border bg-white text-sm transition-colors appearance-none cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        error ? 'border-rose-400 bg-rose-50' : 'border-gray-300',
        className,
      )}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
)

Select.displayName = 'Select'
export default Select
