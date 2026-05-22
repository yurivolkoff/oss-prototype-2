import { X, FileText } from 'lucide-react'
import Pill from '../ui/Pill'

interface FileCardProps {
  name: string
  sizeBytes: number
  onRemove: () => void
  badge?: { label: string; tone: 'success' | 'warning' | 'error' | 'neutral' }
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`
  return `${(bytes / 1024 / 1024).toFixed(2)} МБ`
}

export default function FileCard({ name, sizeBytes, onRemove, badge }: FileCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
      <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate" title={name}>
          {name}
        </div>
        <div className="text-xs text-gray-500">{formatSize(sizeBytes)}</div>
      </div>
      {badge && <Pill tone={badge.tone}>{badge.label}</Pill>}
      <button
        onClick={onRemove}
        className="p-1 rounded hover:bg-gray-100"
        aria-label="Удалить файл"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}
