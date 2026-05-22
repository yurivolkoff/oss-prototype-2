import Accordion from '../ui/Accordion'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'

const SUB_STEPS = [
  'Формирование повестки',
  'Уведомление о начале собрания',
  'Сбор голосов',
  'Завершение голосования',
  'Размещение информации',
]

export default function ConductAccordion() {
  const state = useMeetingStore((s) => s.meeting.state)
  const isInactive = state === 'none'

  return (
    <Accordion number={2} title="Проведение общего собрания">
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        Пять шагов от подготовки данных до публикации решений. Собрание длится 7–60 дней
        в зависимости от выбранного срока голосования.
      </p>
      <div className="space-y-2">
        {SUB_STEPS.map((title, i) => (
          <button
            key={i}
            type="button"
            onClick={() => showComingSoon()}
            disabled={!isInactive && state !== 'draft_preparation'}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-left"
          >
            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-medium flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-gray-700">{title}</span>
          </button>
        ))}
      </div>
    </Accordion>
  )
}
