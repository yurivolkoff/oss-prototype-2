import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  maxLength?: number
  showCounter?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, maxLength, showCounter, value, ...rest }, ref) => {
    const length = typeof value === 'string' ? value.length : 0
    return (
      <div className="relative">
        <textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={cn(
            'w-full px-3 py-2 rounded-lg border bg-white text-sm transition-colors min-h-[100px]',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            error ? 'border-rose-400 bg-rose-50' : 'border-gray-300',
            className,
          )}
          {...rest}
        />
        {showCounter && maxLength != null && (
          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
            {length}/{maxLength}
          </div>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
export default Textarea
