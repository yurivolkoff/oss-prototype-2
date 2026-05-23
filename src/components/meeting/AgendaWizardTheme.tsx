import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import Card from '../ui/Card'
import StepPills from '../stepper/StepPills'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'

interface ThemeSection {
  id: string
  title: string
  zhk: string
  defaultOpen: boolean
  placeholder?: string
  rows?: { title: string; isInteractive: boolean }[]
}

const SECTIONS: ThemeSection[] = [
  {
    id: 'fund',
    title: 'Формирование фонда капремонта',
    zhk: 'п. 1.1 ч. 2 ст. 44 ЖК РФ',
    defaultOpen: false,
    placeholder:
      'Содержание темы будет доступно в продакшене. В этом прототипе детально проработана только тема «Проведение и приёмка ремонтных работ».',
  },
  {
    id: 'financing',
    title: 'Финансирование капремонта (кредит/заём)',
    zhk: 'п. 1.2 ч. 2 ст. 44 ЖК РФ',
    defaultOpen: false,
    placeholder:
      'Содержание темы будет доступно в продакшене. В этом прототипе детально проработана только тема «Проведение и приёмка ремонтных работ».',
  },
  {
    id: 'regional',
    title: 'Региональная программа капремонта',
    zhk: 'ст. 168, 189 ЖК РФ',
    defaultOpen: false,
    placeholder:
      'Содержание темы будет доступно в продакшене. В этом прототипе детально проработана только тема «Проведение и приёмка ремонтных работ».',
  },
  {
    id: 'works',
    title: 'Проведение и приёмка ремонтных работ по части дома',
    zhk: 'п. 1 ч. 2 ст. 44 + ст. 189 ЖК РФ',
    defaultOpen: true,
    rows: [
      { title: 'Ремонт крыши', isInteractive: true },
      { title: 'Ремонт фасада', isInteractive: false },
      { title: 'Ремонт фундамента', isInteractive: false },
      { title: 'Ремонт инженерных систем', isInteractive: false },
      { title: 'Ремонт лифтового оборудования', isInteractive: false },
      { title: 'Ремонт подвальных помещений', isInteractive: false },
      { title: 'Другое', isInteractive: false },
    ],
  },
]

function ThemeAccordion({
  section,
  onSelect,
}: {
  section: ThemeSection
  onSelect: (row: { title: string; isInteractive: boolean }) => void
}) {
  const [open, setOpen] = useState(section.defaultOpen)
  const Chevron = open ? ChevronUp : ChevronDown

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 py-3 px-1 text-left hover:bg-gray-50"
      >
        <div className="flex-1">
          <div className="font-medium text-gray-900">{section.title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{section.zhk}</div>
        </div>
        <Chevron className="w-5 h-5 text-gray-400" />
      </button>
      {open && (
        <div className="px-1 pb-3">
          {section.placeholder ? (
            <p className="text-sm text-gray-500 leading-relaxed">{section.placeholder}</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {section.rows?.map((row) => (
                <button
                  key={row.title}
                  type="button"
                  onClick={() => onSelect(row)}
                  className="w-full flex items-center gap-3 py-2 px-2 text-left hover:bg-gray-50 rounded"
                >
                  <span className="flex-1 text-sm text-gray-800">{row.title}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AgendaWizardTheme() {
  const setSubState = useMeetingStore((s) => s.setSubState)

  function handleSelect(row: { title: string; isInteractive: boolean }) {
    if (!row.isInteractive) {
      showComingSoon()
      return
    }
    setSubState('agenda_wizard_questions')
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setSubState('agenda_wizard_type')}
        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        style={{ color: 'var(--color-accent-600)' }}
      >
        ← Назад
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Капитальный ремонт
        </h1>
        <StepPills count={3} activeIndex={1} completedThrough={0} />
      </div>

      <p className="text-sm text-gray-700">Выберите тему вопроса</p>

      <Card className="p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Справочник вопросов</h2>
        <div>
          {SECTIONS.map((s) => (
            <ThemeAccordion key={s.id} section={s} onSelect={handleSelect} />
          ))}
        </div>
      </Card>
    </div>
  )
}
