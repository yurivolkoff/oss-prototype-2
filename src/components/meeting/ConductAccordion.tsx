import { useNavigate } from 'react-router-dom'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import Accordion from '../ui/Accordion'
import Pill from '../ui/Pill'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'
import { formatDate } from '../../lib/format'
import { cn } from '../../lib/cn'

const SUB_STEPS = [
  'Формирование повестки',
  'Уведомление о начале собрания',
  'Сбор голосов',
  'Завершение голосования',
  'Размещение информации',
]

function daysUntil(iso: string): number {
  const target = new Date(iso)
  target.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diffMs = target.getTime() - now.getTime()
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
}

export default function ConductAccordion() {
  const meeting = useMeetingStore((s) => s.meeting)
  const state = meeting.state
  const navigate = useNavigate()
  const isInactive = state === 'none'
  const isPublished = state === 'notification_published'

  return (
    <Accordion number={2} title="Проведение общего собрания" defaultOpen={isPublished}>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        Пять шагов от подготовки данных до публикации решений. Собрание длится 7–60 дней
        в зависимости от выбранного срока голосования.
      </p>
      <div className="space-y-2">
        {SUB_STEPS.map((title, i) => {
          // i = 0..4 corresponds to subSteps 1..5
          // Step 3 = «Уведомление о начале собрания» = index 1
          // Step 4 = «Сбор голосов» = index 2
          if (isPublished && i === 1) {
            return <CompletedStep key={i} index={i + 1} title={title} />
          }
          if (isPublished && i === 2) {
            return (
              <CollectVotesStep
                key={i}
                index={i + 1}
                title={title}
                startsAt={meeting.voting.startsAt!}
                meetingId={meeting.id}
                onNavigate={() => navigate(`/oss/${meeting.id}`)}
              />
            )
          }
          return (
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
          )
        })}
      </div>
    </Accordion>
  )
}

function CompletedStep({ index, title }: { index: number; title: string }) {
  return (
    <div
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50',
      )}
    >
      <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
        <Check className="w-4 h-4" />
      </span>
      <span className="text-sm text-gray-700 flex-1">
        {index}. {title}
      </span>
      <Pill tone="success">завершено</Pill>
    </div>
  )
}

function CollectVotesStep({
  index,
  title,
  startsAt,
  onNavigate,
}: {
  index: number
  title: string
  startsAt: string
  meetingId: string
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(true)
  const Chevron = open ? ChevronUp : ChevronDown
  const days = daysUntil(startsAt)
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50"
        aria-expanded={open}
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 text-white"
          style={{ background: 'var(--color-accent-600)' }}
        >
          {index}
        </span>
        <span className="text-sm font-medium text-gray-800 flex-1">{title}</span>
        <Chevron className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
          <div className="text-sm text-gray-700">
            Голосование начнётся <strong>{formatDate(startsAt)}</strong>, осталось {days}{' '}
            {pluralDays(days)}.
          </div>
          <button
            type="button"
            onClick={onNavigate}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-accent-600)' }}
          >
            Подробнее →
          </button>
        </div>
      )}
    </div>
  )
}

function pluralDays(n: number): string {
  const last2 = n % 100
  if (last2 >= 11 && last2 <= 14) return 'дней'
  const last = n % 10
  if (last === 1) return 'день'
  if (last >= 2 && last <= 4) return 'дня'
  return 'дней'
}
