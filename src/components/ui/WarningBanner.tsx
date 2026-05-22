import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface WarningBannerProps {
  title: ReactNode
  children: ReactNode
}

export default function WarningBanner({ title, children }: WarningBannerProps) {
  return (
    <div className="flex gap-3 p-4 rounded-xl text-sm bg-amber-50 border border-amber-200">
      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-700" />
      <div className="flex-1">
        <div className="font-semibold text-amber-900 mb-1">{title}</div>
        <div className="text-amber-900">{children}</div>
      </div>
    </div>
  )
}
