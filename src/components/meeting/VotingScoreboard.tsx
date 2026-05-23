import { useMemo, useState } from 'react'
import { KeyRound, FileText, User, Pencil } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Meeting, Premise } from '../../types/meeting'
import Select from '../form/Select'
import InfoPopover from '../popover/InfoPopover'
import { showComingSoon } from '../toast/toastHelpers'
import {
  buildVotingMap,
  countByStatus,
  getTileMeta,
  type VotingTileMeta,
  type VotingTileStatus,
} from '../../lib/votingDistribution'

interface VotingScoreboardProps {
  meeting: Meeting
  onTileClick: (premise: Premise, meta: VotingTileMeta) => void
}

type StatusFilter = 'all' | VotingTileStatus
type RoomFilter = 'all' | 'apartment' | 'non_residential'

export default function VotingScoreboard({ meeting, onTileClick }: VotingScoreboardProps) {
  const votingMap = useMemo(() => buildVotingMap(meeting), [meeting])
  const counts = useMemo(() => countByStatus(votingMap), [votingMap])

  const [filterRoom, setFilterRoom] = useState<RoomFilter>('all')
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all')
  const [filterFloor, setFilterFloor] = useState<string>('all')
  const [filterEntrance, setFilterEntrance] = useState<string>('all')

  const floors = useMemo(() => {
    const set = new Set<number>()
    meeting.premises.forEach((p) => set.add(p.floor))
    return [...set].sort((a, b) => a - b)
  }, [meeting.premises])

  const entrances = useMemo(() => {
    const set = new Set<number>()
    meeting.premises.forEach((p) => set.add(p.entrance))
    return [...set].sort((a, b) => a - b)
  }, [meeting.premises])

  const filtered = useMemo(() => {
    return meeting.premises.filter((p) => {
      if (filterRoom !== 'all' && p.type !== filterRoom) return false
      if (filterStatus !== 'all') {
        const meta = getTileMeta(votingMap, p)
        if (meta.status !== filterStatus) return false
      }
      if (filterFloor !== 'all' && String(p.floor) !== filterFloor) return false
      if (filterEntrance !== 'all' && String(p.entrance) !== filterEntrance) return false
      return true
    })
  }, [meeting.premises, filterRoom, filterStatus, filterFloor, filterEntrance, votingMap])

  const apartments = filtered.filter((p) => p.type === 'apartment')
  const nonRes = filtered.filter((p) => p.type === 'non_residential')

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
    return bf - af
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-base font-semibold text-gray-900">Шахматная ведомость</div>
        <InfoPopover
          trigger={
            <span
              className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: 'var(--color-accent-600)' }}
            >
              <Pencil className="w-4 h-4" />
              Как заполнять
            </span>
          }
        >
          <div className="font-semibold mb-1">Как читать шахматную ведомость</div>
          <p className="text-xs leading-relaxed">Каждая плитка — одно помещение в доме. Цвет показывает, как собственник голосует:</p>
          <ul className="text-xs leading-relaxed mt-2 space-y-1">
            <li><span className="inline-block w-3 h-3 rounded bg-emerald-200 mr-1.5 align-middle" />Зелёная — проголосовал онлайн через Госуслуги</li>
            <li><span className="inline-block w-3 h-3 rounded bg-amber-200 mr-1.5 align-middle" />Бежевая — принёс бумажный бюллетень</li>
            <li><span className="inline-block w-3 h-3 rounded bg-rose-200 mr-1.5 align-middle" />Розовая — не будет голосовать (нет аккаунта / отказ)</li>
            <li><span className="inline-block w-3 h-3 rounded border border-gray-300 bg-white mr-1.5 align-middle" />Белая — ещё не определился</li>
          </ul>
          <p className="text-xs leading-relaxed mt-2">
            Кликните по плитке, чтобы посмотреть подробности или ввести бумажный бюллетень.
          </p>
        </InfoPopover>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select
          aria-label="Помещения"
          value={filterRoom}
          onChange={(e) => setFilterRoom(e.target.value as RoomFilter)}
          options={[
            { value: 'all', label: 'Помещения: все' },
            { value: 'apartment', label: 'Помещения: жилые' },
            { value: 'non_residential', label: 'Помещения: нежилые' },
          ]}
        />
        <Select
          aria-label="Проголосовал"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
          options={[
            { value: 'all', label: 'Проголосовал: все' },
            { value: 'voted_online', label: 'Проголосовал: онлайн' },
            { value: 'paper_entered', label: 'Проголосовал: бумажный' },
            { value: 'refused', label: 'Проголосовал: не будет' },
            { value: 'undecided', label: 'Проголосовал: не определился' },
          ]}
        />
        <Select
          aria-label="Этаж"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
          options={[
            { value: 'all', label: 'Этаж: все' },
            ...floors.map((f) => ({ value: String(f), label: `Этаж: ${f}` })),
          ]}
        />
        <Select
          aria-label="Подъезд"
          value={filterEntrance}
          onChange={(e) => setFilterEntrance(e.target.value)}
          options={[
            { value: 'all', label: 'Подъезд: все' },
            ...entrances.map((e) => ({ value: String(e), label: `Подъезд: ${e}` })),
          ]}
        />
      </div>

      {/* Stats line */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <StatItem label="Проголосовали онлайн" value={counts.voted_online} />
        <StatItem label="Получили бумажные бюллетени" value={counts.paper_entered} />
        <StatItem label="Не будут голосовать" value={counts.refused} />
        <StatItem label="Не определились" value={counts.undecided} />
      </div>

      {/* Tiles */}
      <div className="space-y-5">
        {sortedKeys.map((key) => {
          const [entrance, floor] = key.split('|')
          const list = groups.get(key) ?? []
          return (
            <div key={key}>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Подъезд {entrance}, этаж {floor}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {list.map((p) => {
                  const meta = getTileMeta(votingMap, p)
                  return (
                    <VotingTile
                      key={p.id}
                      premise={p}
                      meta={meta}
                      onClick={() => onTileClick(p, meta)}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}

        {nonRes.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Нежилые помещения</div>
            <div className="grid grid-cols-4 gap-3">
              {nonRes.map((p) => {
                const meta = getTileMeta(votingMap, p)
                return (
                  <VotingTile
                    key={p.id}
                    premise={p}
                    meta={meta}
                    onClick={() => onTileClick(p, meta)}
                  />
                )
              })}
            </div>
          </div>
        )}

        {apartments.length === 0 && nonRes.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            Ничего не найдено по выбранным фильтрам.
          </div>
        )}
      </div>

      {/* Footer link */}
      <div>
        <button
          type="button"
          onClick={() => showComingSoon()}
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--color-accent-600)' }}
        >
          Посмотреть весь список →
        </button>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
      <div className="text-gray-600">{label}</div>
      <div className="mt-1 text-lg font-semibold text-gray-900">
        {value} <span className="text-xs font-normal text-gray-500">квартир</span>
      </div>
    </div>
  )
}

function VotingTile({
  premise,
  meta,
  onClick,
}: {
  premise: Premise
  meta: VotingTileMeta
  onClick: () => void
}) {
  const bg = (() => {
    switch (meta.status) {
      case 'voted_online':
        return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
      case 'paper_entered':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100'
      case 'refused':
        return 'bg-rose-50 border-rose-200 hover:bg-rose-100'
      default:
        return 'bg-white border-gray-200 hover:bg-gray-50'
    }
  })()

  return (
    <button
      type="button"
      data-testid={`voting-tile-${premise.number}`}
      data-status={meta.status}
      onClick={onClick}
      className={cn(
        'relative w-full text-left p-3 rounded-xl border transition-colors min-h-[88px]',
        bg,
      )}
    >
      <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
        {meta.status === 'voted_online' && <KeyRound className="w-3.5 h-3.5 text-emerald-700" />}
        {meta.status === 'paper_entered' && <FileText className="w-3.5 h-3.5 text-amber-700" />}
        <span>№ {premise.number}</span>
      </div>
      <div className="mt-1 text-xs text-gray-600 leading-snug">
        {meta.status === 'voted_online' && (
          <span className="inline-flex items-center gap-1">
            <User className="w-3 h-3" /> проголосовал онлайн
          </span>
        )}
        {meta.status === 'paper_entered' && <span>получили бюллетени · проголосовал</span>}
        {meta.status === 'refused' && <span>{meta.refusalReason ?? 'не будет голосовать'}</span>}
        {meta.status === 'undecided' && <span className="text-gray-400">—</span>}
      </div>
      {meta.status === 'voted_online' && (
        <div className="mt-2 flex gap-1">
          <span className="block flex-1 h-1 bg-emerald-400 rounded" />
          <span className="block flex-1 h-1 bg-emerald-400 rounded" />
          <span className="block flex-1 h-1 bg-emerald-400 rounded" />
        </div>
      )}
    </button>
  )
}
