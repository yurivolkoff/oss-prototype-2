import type { ReactNode } from 'react'
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
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
  const Icon = kind === 'success' ? CheckCircle : kind === 'warning' ? AlertTriangle : AlertCircle
  const iconColor =
    kind === 'success' ? 'text-emerald-600' : kind === 'warning' ? 'text-amber-600' : 'text-rose-600'
  const pillTone = kind === 'success' ? 'success' : kind === 'warning' ? 'warning' : 'error'

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
      <Pill tone={pillTone}>{pillLabel}</Pill>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <div className="flex-1 text-sm text-gray-800">{text}</div>
      {counter && <div className="text-sm text-gray-500">{counter}</div>}
      {action}
    </div>
  )
}
