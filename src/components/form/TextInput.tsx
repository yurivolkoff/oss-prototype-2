import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 rounded-lg border bg-white text-sm transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        error ? 'border-rose-400 bg-rose-50' : 'border-gray-300',
        className,
      )}
      {...rest}
    />
  ),
)

TextInput.displayName = 'TextInput'
export default TextInput
