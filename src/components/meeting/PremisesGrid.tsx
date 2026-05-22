import type { Premise } from '../../types/meeting'
import PremiseTile from './PremiseTile'

interface PremisesGridProps {
  premises: Premise[]
  onTileClick: (premise: Premise) => void
}

export default function PremisesGrid({ premises, onTileClick }: PremisesGridProps) {
  const apartments = premises.filter((p) => p.type === 'apartment')
  const nonRes = premises.filter((p) => p.type === 'non_residential')

  // group apartments by entrance, floor
  const groups = new Map<string, Premise[]>()
  for (const p of apartments) {
    const key = `${p.entrance}|${p.floor}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(p)
  }
  const sortedKeys = [...groups.keys()].sort((a, b) => {
    const [ae, af] = a.split('|').map(Number)
    const [be, bf] = b.split('|').map(Number)
    if (ae !== be) return ae - be
    return bf - af // higher floor first inside entrance
  })

  return (
    <div className="space-y-6">
      {sortedKeys.map((key) => {
        const [entrance, floor] = key.split('|')
        const list = groups.get(key) ?? []
        return (
          <div key={key}>
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Подъезд {entrance}, этаж {floor}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {list.map((p) => (
                <PremiseTile key={p.id} premise={p} onClick={onTileClick} />
              ))}
            </div>
          </div>
        )
      })}

      {nonRes.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">Нежилые помещения</div>
          <div className="grid grid-cols-4 gap-3">
            {nonRes.map((p) => (
              <PremiseTile key={p.id} premise={p} onClick={onTileClick} />
            ))}
          </div>
        </div>
      )}

      {apartments.length === 0 && nonRes.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          Ничего не найдено по выбранным фильтрам.
        </div>
      )}
    </div>
  )
}
