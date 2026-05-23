import { useMemo, useState } from 'react'
import { FileText, Clock } from 'lucide-react'
import Card from '../ui/Card'
import Pill from '../ui/Pill'
import WarningBanner from '../ui/WarningBanner'
import InfoPopover from '../popover/InfoPopover'
import Modal from '../modal/Modal'
import VotingProgressBar from './VotingProgressBar'
import VotingScoreboard from './VotingScoreboard'
import ApartmentModal, { type ApartmentModalMode } from './ApartmentModal'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDate, formatDateTime } from '../../lib/format'
import { showComingSoon } from '../toast/toastHelpers'
import type { Premise } from '../../types/meeting'
import type { VotingTileMeta } from '../../lib/votingDistribution'

function daysBetween(fromIso: string | null, toMs: number): number {
  if (!fromIso) return 0
  const ms = new Date(fromIso).getTime() - toMs
  return Math.max(0, Math.ceil(ms / 86400000))
}

function subHours(date: Date, hours: number): Date {
  const d = new Date(date)
  d.setHours(d.getHours() - hours)
  return d
}

function tileMetaToModalMode(meta: VotingTileMeta): ApartmentModalMode {
  switch (meta.status) {
    case 'voted_online':
      return 'preview_voted_online'
    case 'paper_entered':
      return 'preview_paper_entered'
    case 'refused':
      return 'refused'
    default:
      return 'paper_ballot'
  }
}

export default function VotingActive() {
  const meeting = useMeetingStore((s) => s.meeting)
  const [agendaModalOpen, setAgendaModalOpen] = useState(false)
  const [selectedPremise, setSelectedPremise] = useState<Premise | null>(null)
  const [modalMode, setModalMode] = useState<ApartmentModalMode>('paper_ballot')
  const [selectedMeta, setSelectedMeta] = useState<VotingTileMeta | null>(null)

  const now = Date.now()
  const endsAt = meeting.voting.endsAt
  const publishedAt = meeting.voting.publishedAt
  const daysLeft = useMemo(() => daysBetween(endsAt, now), [endsAt, now])
  const paperDeadline = endsAt ? subHours(new Date(endsAt), 48) : null
  const isLowQuorum = meeting._demoVariant === 'voting_active_low_quorum'

  const totalAvail = meeting.voteResults.totalVotesAvailable || 1
  const percent = (meeting.voteResults.votesCast / totalAvail) * 100

  function handleTileClick(premise: Premise, meta: VotingTileMeta) {
    setSelectedPremise(premise)
    setSelectedMeta(meta)
    setModalMode(tileMetaToModalMode(meta))
  }

  function handleModalClose() {
    setSelectedPremise(null)
    setSelectedMeta(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
            Активное голосование
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Собрание идёт. Следите за прогрессом, вводите бумажные бюллетени и помогайте соседям
            успеть проголосовать. Подробные результаты по вопросам появятся после завершения
            голосования.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAgendaModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline mt-1"
          style={{ color: 'var(--color-accent-600)' }}
        >
          <FileText className="w-4 h-4" />
          Повестка собрания
        </button>
      </div>

      {/* Warning banner — only in low-quorum variant */}
      {isLowQuorum && (
        <WarningBanner title="Голосование может не состояться">
          <p className="leading-relaxed">
            Кворум пока не набран: голосов собрано меньше, чем нужно для признания собрания
            правомочным. Напомните соседям о важности принятия решения, чтобы успеть набрать
            кворум до конца голосования.
          </p>
          <button
            type="button"
            onClick={() => showComingSoon()}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
            style={{ color: 'var(--color-accent-700)' }}
          >
            Пригласить соседей →
          </button>
        </WarningBanner>
      )}

      {/* Online voting card */}
      <Card className="p-6 space-y-4 border border-gray-100">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-base font-semibold text-gray-900">
              Онлайн-голосование от {publishedAt ? formatDate(publishedAt) : '—'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Инициатор — ООО «Уют и комфорт»
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1.5"
            title={endsAt ? `Завершается ${formatDateTime(endsAt)}` : undefined}
          >
            <Pill tone="warning">
              <Clock className="w-3 h-3 mr-1" />
              осталось {daysLeft} {daysLeft === 1 ? 'день' : daysLeft >= 2 && daysLeft <= 4 ? 'дня' : 'дней'}
            </Pill>
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
          <span>
            Приём бумажных решений: до {paperDeadline ? formatDateTime(paperDeadline) : '—'} (за
            48 часов до конца голосования)
          </span>
          <InfoPopover>
            <div className="font-semibold mb-1">Дедлайн приёма бумажных бюллетеней</div>
            <p className="text-xs leading-relaxed">
              Собственник передаёт администратору бумажный бюллетень не позднее чем за 48 часов
              до окончания голосования. Скан-копию администратор загружает в ГИС ЖКХ в течение
              24 часов с момента получения.
            </p>
            {paperDeadline && endsAt && (
              <p className="text-xs leading-relaxed mt-2">
                После {formatDateTime(paperDeadline)} ввод бумажных бюллетеней прекращается.
                Голосование завершится {formatDate(endsAt)}.
              </p>
            )}
            <p className="text-xs leading-relaxed mt-2 text-gray-500">Основание: ст. 47.1 ч. 10 ЖК РФ.</p>
          </InfoPopover>
        </div>

        <VotingProgressBar percent={percent} />
      </Card>

      {/* Scoreboard card */}
      <Card className="p-6 border border-gray-100">
        <VotingScoreboard meeting={meeting} onTileClick={handleTileClick} />
      </Card>

      {/* Agenda preview modal */}
      <Modal
        isOpen={agendaModalOpen}
        onClose={() => setAgendaModalOpen(false)}
        title="Повестка собрания"
        size="lg"
      >
        <ol className="space-y-4">
          {meeting.agenda.map((block, idx) => (
            <li key={block.id} className="text-sm text-gray-800">
              <div className="font-medium">
                {idx + 1}. {block.themeTitle}
              </div>
              <ul className="ml-5 mt-1 space-y-1 text-xs text-gray-600 list-disc">
                {block.questions
                  .filter((q) => q.isChecked)
                  .map((q) => (
                    <li key={q.code}>
                      <span className="font-medium">{q.code}.</span> {q.title}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
      </Modal>

      <ApartmentModal
        premise={selectedPremise}
        isOpen={!!selectedPremise}
        onClose={handleModalClose}
        mode={modalMode}
        votingMeta={selectedMeta}
        meeting={meeting}
      />
    </div>
  )
}
