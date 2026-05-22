import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import { showComingSoon } from '../toast/toastHelpers'

interface HouseInfoCardProps {
  totalArea: number
  apartmentsCount: number
  nonResidentialCount: number
  floorsCount: number
}

export default function HouseInfoCard({
  totalArea,
  apartmentsCount,
  nonResidentialCount,
  floorsCount,
}: HouseInfoCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Информация о доме</h2>
      </div>
      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
        Проверьте, что данные по вашему дому корректны. Если данные расходятся — отправьте
        обращение в УК или Росреестр до начала собрания.
      </p>
      <div className="grid grid-cols-4 gap-4">
        <Metric value={totalArea.toLocaleString('ru-RU')} unit="м²" label="общая площадь" />
        <Metric value={apartmentsCount} label="квартир" />
        <Metric value={nonResidentialCount} label="нежилых" />
        <Metric value={floorsCount} label="этажей" />
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => showComingSoon()}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)]"
        >
          Подробнее о доме <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}

function Metric({
  value,
  unit,
  label,
}: {
  value: number | string
  unit?: string
  label: string
}) {
  return (
    <div>
      <div className="text-2xl font-semibold text-gray-900 leading-tight">
        {value}
        {unit && <span className="ml-1 text-base font-normal text-gray-500">{unit}</span>}
      </div>
      <div className="mt-1 text-xs text-gray-500">{label}</div>
    </div>
  )
}
