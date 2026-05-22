import type { ReactNode } from 'react'
import Pill from './Pill'

type StatusKind = 'success' | 'warning' | 'error'

interface StatusRowProps {
  kind: StatusKind
  pillLabel: string
  text: ReactNode
  counter?: ReactNode
  action?: ReactNode
}

export default function StatusRow({
  kind,
  pillLabel,
  text,
  counter,
  action,
}: StatusRowProps) {
  const pillTone = kind === 'success' ? 'success' : kind === 'warning' ? 'warning' : 'error'

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-44">
        <Pill tone={pillTone}>{pillLabel}</Pill>
      </div>
      <div className="flex-1 text-sm text-gray-800 min-w-0">{text}</div>
      {counter && (
        <div className="flex-shrink-0 text-sm text-gray-500 whitespace-nowrap">{counter}</div>
      )}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
