import { ChevronRight } from 'lucide-react'

interface RadioActionRowProps {
  title: string
  subtitle?: string
  onClick: () => void
}

export default function RadioActionRow({ title, subtitle, onClick }: RadioActionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-1 text-left hover:bg-gray-50 border-b border-gray-100"
    >
      <div className="flex-1">
        <div className="font-medium text-gray-900">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  )
}
