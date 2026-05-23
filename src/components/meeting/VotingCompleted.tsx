import { useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
import Card from '../ui/Card'
import Pill from '../ui/Pill'
import Button from '../ui/Button'
import InfoBlock from '../ui/InfoBlock'
import ResultBlock from './ResultBlock'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDate, formatDateTime } from '../../lib/format'
import { showComingSoon } from '../toast/toastHelpers'

export default function VotingCompleted() {
  const navigate = useNavigate()
  const meeting = useMeetingStore((s) => s.meeting)
  const setState = useMeetingStore((s) => s.setState)
  const setSubState = useMeetingStore((s) => s.setSubState)
  const archiveMeeting = useMeetingStore((s) => s.archiveMeeting)

  const quorumReached = meeting.voteResults.quorumReached
  const publishedAt = meeting.voting.publishedAt
  const endsAt = meeting.voting.endsAt

  const totalAvail = meeting.voteResults.totalVotesAvailable || 1
  const percent = Math.round((meeting.voteResults.votesCast / totalAvail) * 100)

  const hasCapitalRepair = meeting.agenda.some((b) => b.type === 'capital_repair')

  function handleGoToWorkInfo() {
    setState('work_info_required')
    setSubState(null)
  }

  function handleArchiveAndHome() {
    archiveMeeting()
    navigate('/')
  }

  function handleDownloadProtocol() {
    showComingSoon()
  }

  return (
    <div className="space-y-6">
      {/* H2 + lead */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Завершение голосования
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {quorumReached ? (
            <>
              Голосование завершено. Система автоматически посчитала голоса и сформировала
              протокол. Скачайте копию для архива и при необходимости перейдите к размещению
              информации о работах.
            </>
          ) : (
            <>
              Собрание не состоялось — кворум не набран. Протокол об этом размещён в ГИС ЖКХ
              и направлен в ГЖИ автоматически. Скачайте копию для архива.
            </>
          )}
        </p>
      </div>

      {/* Main result card */}
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
          <Pill tone="neutral">завершилось</Pill>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-gray-100">
          <div className="text-lg font-semibold text-gray-900">
            Проголосовало — {percent}%
          </div>
          {quorumReached ? (
            <Pill tone="success">кворум набран</Pill>
          ) : (
            <Pill tone="error">кворум не набран</Pill>
          )}
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
          {quorumReached ? (
            <>
              Голосование завершено {endsAt ? formatDateTime(endsAt) : '—'}. Протокол
              автоматически направлен в ГЖИ г. Санкт-Петербурга.
            </>
          ) : (
            <>
              Собрание не состоялось из-за недобора кворума. Протокол об этом размещён
              в ГИС ЖКХ и направлен в ГЖИ.
            </>
          )}
        </div>
      </Card>

      {/* Blocks */}
      <div className="space-y-3">
        {meeting.agenda.map((block) => (
          <ResultBlock
            key={block.id}
            block={block}
            meeting={meeting}
            forceNotPassed={!quorumReached}
            defaultOpen={quorumReached && block.type === 'capital_repair'}
          />
        ))}
      </div>

      {/* InfoBlock for no_quorum */}
      {!quorumReached && (
        <InfoBlock>
          <div className="font-semibold mb-2">Протокол несостоявшегося собрания</div>
          <p className="leading-relaxed">
            Собрание не состоялось — на голосовании не набран кворум (в собрании участвовали
            собственники с менее 50% голосов).
          </p>
          <p className="leading-relaxed mt-2">
            Протокол об этом размещён в ГИС ЖКХ автоматически и направлен в ГЖИ. По письму
            Минстроя № 67415-ДН/04 от 05.11.2025 ГЖИ не может отказать в принятии такого
            протокола.
          </p>
          <p className="leading-relaxed mt-2">
            Чтобы повторно вынести вопросы на голосование — запустите новое собрание с дашборда.
          </p>
        </InfoBlock>
      )}

      {/* Download protocol link */}
      <div className="flex items-start gap-4 flex-wrap pt-2">
        <button
          type="button"
          onClick={handleDownloadProtocol}
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: 'var(--color-accent-600)' }}
          title="Скачать копию протокола в PDF"
        >
          <Download className="w-4 h-4" />
          скачать протокол
        </button>
        <div className="text-xs text-gray-500 leading-relaxed flex-1 min-w-[200px]">
          PDF-копия протокола для вашего архива. Оригинал уже размещён в ГИС ЖКХ и направлен в ГЖИ.
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {quorumReached && hasCapitalRepair ? (
          <Button variant="primary" onClick={handleGoToWorkInfo}>
            Перейти к размещению информации
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleArchiveAndHome}>
            Вернуться на главную
          </Button>
        )}
      </div>
    </div>
  )
}
