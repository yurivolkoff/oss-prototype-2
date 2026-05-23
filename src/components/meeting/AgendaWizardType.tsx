import Card from '../ui/Card'
import StepPills from '../stepper/StepPills'
import RadioActionRow from '../form/RadioActionRow'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'

interface CategoryRow {
  title: string
  zhk: string
  isInteractive: boolean
}

const CATEGORIES: CategoryRow[] = [
  { title: 'Организация общего собрания', zhk: 'ст. 47.1 ЖК РФ', isInteractive: false },
  { title: 'Управление МКД', zhk: 'п. 4 ч. 2 ст. 44 ЖК РФ', isInteractive: false },
  { title: 'Жилищно-коммунальные услуги', zhk: 'п. 4.1, 4.2 ч. 2 ст. 44 ЖК РФ', isInteractive: false },
  { title: 'Капитальный ремонт', zhk: 'п. 1, 1.1, 1.2 ч. 2 ст. 44 ЖК РФ + ст. 189', isInteractive: true },
  { title: 'Управление объектами общего имущества', zhk: 'п. 2, 2.1, 3, 3.1 ч. 2 ст. 44 ЖК РФ', isInteractive: false },
  { title: 'Иное', zhk: 'иные вопросы компетенции ОСС', isInteractive: false },
]

export default function AgendaWizardType() {
  const setSubState = useMeetingStore((s) => s.setSubState)

  function handleClick(row: CategoryRow) {
    if (!row.isInteractive) {
      showComingSoon()
      return
    }
    setSubState('agenda_wizard_theme')
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setSubState('agenda_main')}
        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        style={{ color: 'var(--color-accent-600)' }}
      >
        ← Назад
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Новый блок вопросов
        </h1>
        <StepPills count={3} activeIndex={0} completedThrough={-1} />
      </div>

      <p className="text-sm text-gray-700">Выберите тип вопроса</p>

      <Card className="p-6">
        <div className="divide-y divide-gray-100">
          {CATEGORIES.map((row) => (
            <RadioActionRow
              key={row.title}
              title={row.title}
              subtitle={row.zhk}
              onClick={() => handleClick(row)}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
