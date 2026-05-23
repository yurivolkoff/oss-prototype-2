import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/cn'
import Pill from '../ui/Pill'
import Checkbox from '../form/Checkbox'

interface AgendaQuestionRowProps {
  code: string
  title: string
  description?: string
  checked: boolean
  disabled?: boolean
  /** When true, hovering disabled checkbox shows tooltip */
  disabledTooltip?: string
  /** Pill shown on the right (e.g., "свой вопрос" or alert) */
  badge?: { label: ReactNode; tone: 'success' | 'warning' | 'error' | 'info' | 'neutral' }
  /** When set, dimmed visually (for the "—" placeholder row 2.6+) */
  dimmed?: boolean
  onToggle?: () => void
}

export default function AgendaQuestionRow({
  code,
  title,
  description,
  checked,
  disabled,
  disabledTooltip,
  badge,
  dimmed,
  onToggle,
}: AgendaQuestionRowProps) {
  const [open, setOpen] = useState(false)
  const Chevron = open ? ChevronUp : ChevronDown

  return (
    <div
      className={cn(
        'rounded-lg transition-colors',
        dimmed && 'opacity-60',
      )}
    >
      <div className="flex items-start gap-3 py-2">
        <div
          className="pt-0.5"
          title={disabled ? disabledTooltip : undefined}
        >
          <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={() => onToggle && onToggle()}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-gray-500 w-9 flex-shrink-0">{code}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-900 font-medium leading-snug">{title}</span>
                {badge && <Pill tone={badge.tone}>{badge.label}</Pill>}
              </div>
              {open && description && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        {description && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Свернуть' : 'Развернуть'}
            className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
          >
            <Chevron className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}
