import { useRef, useState } from 'react'
import BackLink from '../layout/BackLink'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Pill from '../ui/Pill'
import InfoPopover from '../popover/InfoPopover'
import PremiseFilters, {
  defaultFilterState,
  applyFilters,
  type PremiseFilterState,
} from './PremiseFilters'
import PremisesGrid from './PremisesGrid'
import ApartmentModal from './ApartmentModal'
import ReadOnlyBanner from './ReadOnlyBanner'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'

interface PreparationPremisesProps {
  readOnly?: boolean
}

export default function PreparationPremises({ readOnly = false }: PreparationPremisesProps = {}) {
  const meeting = useMeetingStore((s) => s.meeting)
  const setSubState = useMeetingStore((s) => s.setSubState)
  const markStep1Completed = useMeetingStore((s) => s.markStep1Completed)
  const goBack = () => setSubState('preparation_house_overview')

  const [filters, setFilters] = useState<PremiseFilterState>(defaultFilterState)
  const [selectedPremiseId, setSelectedPremiseId] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  function handleDuplicateAction() {
    setFilters({ ...filters, issues: filters.issues.includes('duplicate') ? filters.issues : [...filters.issues, 'duplicate'] })
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function handleContinue() {
    markStep1Completed()
    setSubState('agenda_main')
  }

  const filteredPremises = applyFilters(meeting.premises, filters)
  const selectedPremise = meeting.premises.find((p) => p.id === selectedPremiseId) ?? null

  return (
    <div className="space-y-6">
      {readOnly && <ReadOnlyBanner />}
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-600)] hover:underline"
      >
        ← Назад
      </button>
      {/* keep BackLink usage subtle — we don't navigate to a URL, we change subState */}
      <span className="hidden">
        <BackLink />
      </span>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Подготовка данных по дому 2/2
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
          Проверьте, что все помещения в доме связаны с актуальными данными из Росреестра.
          От этого зависит, как система посчитает кворум и учтёт голоса собственников.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Дополнительная информация о доме
        </h2>

        {/* Status row 1 */}
        <div className="flex items-center gap-3 py-3 border-b border-gray-100">
          <div className="w-44 flex-shrink-0">
            <Pill tone="success">хорошая оценка</Pill>
          </div>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-800 min-w-0">
            <span>Кадастровые номера связаны с помещениями в ГИС ЖКХ</span>
            <InfoPopover>
              <strong>Связь КН в ГИС ЖКХ</strong>
              <div className="mt-1 text-xs text-gray-600 leading-relaxed">
                Связь помещения с записью в Росреестре по кадастровому номеру позволяет
                ГИС ЖКХ автоматически определить собственника и его долю в праве. Без этой
                связи голос собственника не учтётся при подсчёте кворума.
                <br />
                <br />
                Если связь не установлена — выберите помещение в шахматке и привяжите
                кадастровый номер вручную.
              </div>
            </InfoPopover>
          </div>
          <div className="flex-shrink-0 text-sm text-gray-500 whitespace-nowrap">
            {meeting.house.cadastralLinkedCount} из {meeting.house.apartmentsCount} помещений
          </div>
          <Button variant="ghost" size="medium" onClick={() => showComingSoon()}>
            Связать кадастровые номера
          </Button>
        </div>

        {/* Status row 2 */}
        <div className="flex items-center gap-3 py-3">
          <div className="w-44 flex-shrink-0">
            <Pill tone="warning">обратите внимание</Pill>
          </div>
          <div className="flex-1 text-sm text-gray-800 min-w-0">
            Задублированные помещения
          </div>
          <div className="flex-shrink-0 text-sm text-gray-500 whitespace-nowrap">
            {meeting.house.duplicatesCount} помещений
          </div>
          <Button variant="ghost" size="medium" onClick={handleDuplicateAction}>
            Внести изменения
          </Button>
        </div>
      </Card>

      <Card className="p-6" >
        <div ref={gridRef} />
        <h2 className="text-base font-semibold text-gray-900 mb-4">Шахматка по дому</h2>
        <div className="mb-5">
          <PremiseFilters state={filters} onChange={setFilters} />
        </div>
        <PremisesGrid premises={filteredPremises} onTileClick={(p) => setSelectedPremiseId(p.id)} />

        {!readOnly && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleContinue}>Продолжить</Button>
          </div>
        )}
      </Card>

      <ApartmentModal
        premise={selectedPremise}
        isOpen={selectedPremise !== null}
        onClose={() => setSelectedPremiseId(null)}
      />
    </div>
  )
}
