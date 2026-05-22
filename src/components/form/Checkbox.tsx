import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, disabled, ...rest }, ref) => (
    <label
      className={cn(
        'inline-flex items-start gap-2 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-70',
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className="mt-0.5 w-5 h-5 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ accentColor: 'var(--color-accent-600)' }}
        {...rest}
      />
      {label && <span className="text-sm text-gray-800 leading-snug">{label}</span>}
    </label>
  ),
)

Checkbox.displayName = 'Checkbox'
export default Checkbox
