import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { StepStatus } from './Stepper'

interface StepPillsProps {
  count: number
  activeIndex: number
  completedThrough: number
}

export default function StepPills({ count, activeIndex, completedThrough }: StepPillsProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {Array.from({ length: count }, (_, i) => {
        const status: StepStatus =
          i <= completedThrough ? 'completed' : i === activeIndex ? 'active' : 'pending'
        return (
          <div
            key={i}
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium',
              status === 'completed' && 'text-white',
              status === 'active' && 'text-white',
              status === 'pending' && 'bg-gray-200 text-gray-500',
            )}
            style={
              status === 'completed' || status === 'active'
                ? { background: 'var(--color-accent-600)' }
                : undefined
            }
          >
            {status === 'completed' ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
        )
      })}
    </div>
  )
}
