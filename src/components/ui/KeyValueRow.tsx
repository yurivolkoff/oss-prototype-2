import type { ReactNode } from 'react'

interface KeyValueRowProps {
  label: ReactNode
  value: ReactNode
  /** if true, the value uses monospace font (КН, ИНН, codes) */
  mono?: boolean
}

export default function KeyValueRow({ label, value, mono }: KeyValueRowProps) {
  return (
    <div className="flex items-baseline gap-2 py-1 border-b border-dotted border-gray-200">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="flex-1 border-b border-dotted border-gray-300 mb-1" aria-hidden />
      <span className={mono ? 'font-mono text-sm text-gray-800' : 'text-sm text-gray-800'}>
        {value}
      </span>
    </div>
  )
}
