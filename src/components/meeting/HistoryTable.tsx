import { useState } from 'react'
import Card from '../ui/Card'
import Pill from '../ui/Pill'
import Select from '../form/Select'
import { showComingSoon } from '../toast/toastHelpers'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDate } from '../../lib/format'

interface HistoryRow {
  id: string
  type: string
  initiator: string
  dateRange: string
  status: 'decision_made' | 'active' | 'not_held'
}

// en-dash with spaces per text-diff
const ROWS: HistoryRow[] = [
  {
    id: 'h-1',
    type: 'Заочное собрание',
    initiator: 'ООО «Уют и комфорт»',
    dateRange: '05.03.2023 – 31.03.2023',
    status: 'decision_made',
  },
  {
    id: 'h-2',
    type: 'Заочное собрание',
    initiator: 'ООО «Уют и комфорт»',
    dateRange: '12.09.2024 – 11.11.2024',
    status: 'active',
  },
]

export default function HistoryTable() {
  const [filter, setFilter] = useState('premises')
  const meeting = useMeetingStore((s) => s.meeting)

  const dynamicRows: HistoryRow[] = [...ROWS]
  if (meeting.state === 'archived' && meeting.voting.publishedAt && meeting.voting.endsAt) {
    dynamicRows.push({
      id: meeting.id,
      type: 'Заочное собрание',
      initiator: 'ООО «Уют и комфорт»',
      dateRange: `${formatDate(meeting.voting.publishedAt)} – ${formatDate(meeting.voting.endsAt)}`,
      status: meeting.voteResults.quorumReached ? 'decision_made' : 'not_held',
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">История ОСС по дому</h3>
        <div className="w-44">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'premises', label: 'помещения' },
              { value: 'past', label: 'прошедшие' },
              { value: 'active', label: 'активные' },
            ]}
          />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {dynamicRows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => showComingSoon()}
            className="w-full grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 py-3 text-left hover:bg-gray-50 px-2 -mx-2 rounded-lg"
          >
            <div className="text-sm font-medium text-gray-900">{row.type}</div>
            <div className="text-sm text-gray-600">{row.initiator}</div>
            <div className="text-sm text-gray-500 whitespace-nowrap">{row.dateRange}</div>
            <div>
              {row.status === 'decision_made' ? (
                <Pill tone="neutral">Решение принято</Pill>
              ) : row.status === 'not_held' ? (
                <Pill tone="error">Не состоялось</Pill>
              ) : (
                <Pill tone="success">Активно</Pill>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
