import { Eye } from 'lucide-react'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDate } from '../../lib/format'

/**
 * Sticky info-banner shown on stages 1-4 when the meeting has progressed past them.
 * Spec: docs/oss-prototype/spec/05-completion.md § Read-only режим шагов 1–4.
 */
export default function ReadOnlyBanner() {
  const meeting = useMeetingStore((s) => s.meeting)
  const endsAt = meeting.voting.endsAt
  const dateStr = endsAt ? formatDate(endsAt) : '—'
  return (
    <div
      className="rounded-xl flex items-center gap-3 px-4 py-3 text-sm border"
      style={{
        background: 'var(--color-accent-50)',
        borderColor: 'var(--color-accent-200, #cfe1ff)',
      }}
    >
      <Eye className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-accent-600)' }} />
      <div>
        <strong>Собрание завершено {dateStr}.</strong>{' '}
        <span className="text-gray-700">Данные доступны только для просмотра.</span>
      </div>
    </div>
  )
}
