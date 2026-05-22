import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export type StepStatus = 'pending' | 'active' | 'completed'

interface StepperStep {
  label: string
  status: StepStatus
  onClick?: () => void
}

interface StepperProps {
  steps: StepperStep[]
}

export const STEPPER_LABELS = [
  'Подготовка данных по дому',
  'Формирование повестки',
  'Уведомление о начале собрания',
  'Сбор голосов',
  'Завершение голосования',
  'Размещение информации',
] as const

export default function Stepper({ steps }: StepperProps) {
  return (
    <nav aria-label="Прогресс собрания" className="w-full">
      <ol className="flex items-start justify-between gap-2">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <li key={i} className={cn('flex-1 flex flex-col items-center', !isLast && 'relative')}>
              <button
                type="button"
                onClick={step.onClick}
                disabled={!step.onClick}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                  step.status === 'completed' && 'text-white',
                  step.status === 'active' && 'border-[var(--color-accent-600)] bg-white',
                  step.status === 'pending' && 'border-gray-300 bg-white text-gray-400',
                  step.onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
                )}
                style={
                  step.status === 'completed'
                    ? {
                        background: 'var(--color-accent-600)',
                        borderColor: 'var(--color-accent-600)',
                      }
                    : undefined
                }
                aria-current={step.status === 'active' ? 'step' : undefined}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : step.status === 'active' ? (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--color-accent-600)' }}
                  />
                ) : (
                  i + 1
                )}
              </button>
              <span className="mt-2 text-xs text-center text-gray-700 leading-tight max-w-[100px]">
                {step.label}
              </span>
              {!isLast && (
                <div
                  className={cn(
                    'absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5',
                    step.status === 'completed' ? 'bg-[var(--color-accent-600)]' : 'bg-gray-200',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
