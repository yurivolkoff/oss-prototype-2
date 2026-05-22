import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, ...rest }, ref) => (
    <label
      className={cn(
        'flex items-center gap-3 py-2 cursor-pointer',
        className,
      )}
    >
      <input
        ref={ref}
        type="radio"
        className="w-5 h-5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ accentColor: 'var(--color-accent-600)' }}
        {...rest}
      />
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  ),
)

Radio.displayName = 'Radio'
export default Radio
