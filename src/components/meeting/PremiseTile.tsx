import { ArrowUpRight, KeyRound, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Premise } from '../../types/meeting'

interface PremiseTileProps {
  premise: Premise
  onClick: (premise: Premise) => void
}

export default function PremiseTile({ premise, onClick }: PremiseTileProps) {
  const isNonRes = premise.type === 'non_residential'
  const bg =
    premise.status === 'error'
      ? 'bg-rose-50 border-rose-200 hover:bg-rose-100'
      : premise.status === 'warning'
        ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
        : 'bg-white border-gray-200 hover:bg-gray-50'

  const fakeKn = `78:23:0000000:${1000 + Number(premise.number.replace(/\D/g, '')) || 1234}`

  // tile title
  const title = isNonRes ? premise.number : `Кв. №${premise.number}`

  // bottom label per text-diff
  const bottomLabel = !premise.cadastralLinked
    ? 'Нет КН'
    : isNonRes
      ? 'КН'
      : 'КН'
  const bottomTooltip = !premise.cadastralLinked
    ? 'Нет кадастрового номера'
    : `Кадастровый номер: ${fakeKn}`

  return (
    <button
      type="button"
      data-testid={
        isNonRes ? `premise-nr-${premise.number}` : `premise-tile-${premise.number}`
      }
      onClick={() => onClick(premise)}
      className={cn(
        'relative w-full text-left p-3 rounded-xl border transition-colors',
        bg,
      )}
    >
      <ArrowUpRight className="w-4 h-4 text-gray-400 absolute top-2 right-2" />
      {(premise.status === 'error' || premise.status === 'warning') && (
        <AlertCircle
          className={cn(
            'w-4 h-4 absolute top-2 right-7',
            premise.status === 'error' ? 'text-rose-500' : 'text-amber-500',
          )}
        />
      )}
      <div className="text-sm font-semibold text-gray-900 leading-tight pr-6">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{premise.area} м²</div>
      <div
        className={cn(
          'mt-2 inline-flex items-center gap-1 text-xs',
          !premise.cadastralLinked ? 'text-rose-700' : 'text-gray-500',
        )}
        title={bottomTooltip}
      >
        <KeyRound className="w-3 h-3" />
        <span>{bottomLabel}</span>
      </div>
    </button>
  )
}
