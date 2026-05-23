import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, FileText } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import KeyValueRow from '../ui/KeyValueRow'
import InfoBlock from '../ui/InfoBlock'
import Pill from '../ui/Pill'
import PublishConfirmModal from './PublishConfirmModal'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDate, formatDateTime } from '../../lib/format'
import { showComingSoon } from '../toast/toastHelpers'

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function subHours(date: Date, hours: number): Date {
  const d = new Date(date)
  d.setHours(d.getHours() - hours)
  return d
}

export default function NotificationPreview() {
  const meeting = useMeetingStore((s) => s.meeting)
  const setSubState = useMeetingStore((s) => s.setSubState)
  const publishNotification = useMeetingStore((s) => s.publishNotification)
  const navigate = useNavigate()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editMenuOpen, setEditMenuOpen] = useState(false)
  const [agendaExpanded, setAgendaExpanded] = useState(false)
  const editMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (editMenuRef.current && !editMenuRef.current.contains(e.target as Node)) {
        setEditMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [editMenuOpen])

  const durationDays = meeting.voting.durationDays ?? 60
  const today = new Date()
  const startsAt = addDays(today, 10)
  const endsAt = addDays(startsAt, durationDays)
  const paperDeadline = subHours(endsAt, 48)

  function handlePublish() {
    publishNotification(durationDays)
    setConfirmOpen(false)
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setSubState('notification_form')}
        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        style={{ color: 'var(--color-accent-600)' }}
      >
        ← Назад
      </button>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Подтверждение голосования
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Так уведомление увидят собственники в личных кабинетах Госуслуг. Если что-то нужно
          поправить — нажмите «Редактировать». После «Отправить» повестка и условия фиксируются
          — изменить их будет нельзя до конца собрания.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="text-base font-semibold text-gray-900">Проект уведомления</div>

        {/* Текст сообщения */}
        <section className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-gray-500">Текст сообщения</div>
          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {`Здравствуйте! В вашем доме по адресу ${meeting.house.address} проводится общее собрание собственников в заочной форме с использованием ГИС ЖКХ.`}
            {meeting.voting.introductionText && (
              <>
                {'\n\n'}
                {meeting.voting.introductionText}
              </>
            )}
          </div>
        </section>

        {/* Сведения о собрании */}
        <section className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-gray-500">Сведения о собрании</div>
          <div className="space-y-1">
            <KeyValueRow label="Адрес дома" value={meeting.house.address} />
            <KeyValueRow
              label="Форма проведения"
              value="Заочное с использованием системы (ГИС ЖКХ)"
            />
            <KeyValueRow label="Дата начала собрания" value={formatDate(startsAt)} />
            <KeyValueRow label="Дата окончания собрания" value={formatDate(endsAt)} />
            <KeyValueRow label="Продолжительность" value={`${durationDays} дней`} />
            <KeyValueRow
              label="Место приёма бумажных бюллетеней"
              value={
                <span className="text-right block">
                  {meeting.voting.paperReceiptPlace}
                  <br />
                  <span className="text-xs text-gray-500">
                    не позднее {formatDateTime(paperDeadline)}
                  </span>
                </span>
              }
            />
          </div>
        </section>

        {/* Администратор собрания */}
        <section className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Администратор собрания
          </div>
          <div className="text-sm text-gray-800 space-y-0.5">
            <div className="font-medium">{meeting.administrator.organizationName}</div>
            <div>Email: {meeting.administrator.email}</div>
            <div>Телефон: {meeting.administrator.phone}</div>
          </div>
        </section>

        {/* Повестка собрания */}
        <section className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-gray-500">Повестка собрания</div>
          <ol className="space-y-2">
            {meeting.agenda.map((block, idx) => (
              <li key={block.id} className="text-sm text-gray-800">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-medium">
                    {idx + 1}. {block.themeTitle}
                  </span>
                  {idx === 0 && <Pill tone="dark">Обязательный</Pill>}
                </div>
                {agendaExpanded && (
                  <ul className="ml-5 mt-2 space-y-1 text-xs text-gray-600 list-disc">
                    {block.questions
                      .filter((q) => q.isChecked)
                      .map((q) => (
                        <li key={q.code}>
                          <span className="font-medium">{q.code}.</span> {q.title}
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setAgendaExpanded((v) => !v)}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-accent-600)' }}
          >
            {agendaExpanded ? 'Свернуть повестку ✕' : 'Изучить повестку →'}
          </button>
        </section>

        {/* Документы */}
        <section className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-gray-500">Документы</div>
          <div className="flex items-center gap-2 flex-wrap">
            <DocumentChip name="Смета на капитальный ремонт кровли.pdf" />
            <button
              type="button"
              onClick={() => showComingSoon()}
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--color-accent-600)' }}
            >
              скачать всё
            </button>
          </div>
        </section>
      </Card>

      {/* InfoBlock про автоматическую рассылку */}
      <InfoBlock>
        <strong>Как собственники получат уведомление</strong>
        <div className="mt-1 text-xs leading-relaxed">
          Уведомление автоматически отправится через личный кабинет Госуслуг всем собственникам
          с подтверждённой учётной записью — это засчитывается как второй канал уведомления
          по 463-ФЗ.
          <br />
          <br />
          Для остальных собственников разместите объявление на доске или направьте заказным
          письмом, как принято в вашем доме. Сохраните фото или акт о размещении — на случай
          оспаривания.
        </div>
      </InfoBlock>

      {/* Action row */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 relative" ref={editMenuRef}>
          <Button
            variant="secondary"
            onClick={() => setEditMenuOpen((v) => !v)}
            aria-expanded={editMenuOpen}
          >
            Редактировать
            <ChevronDown className="w-4 h-4" />
          </Button>
          {editMenuOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1">
              <EditMenuItem
                label="Редактировать повестку"
                onClick={() => {
                  setEditMenuOpen(false)
                  setSubState('agenda_main')
                }}
              />
              <EditMenuItem
                label="Редактировать условия собрания"
                onClick={() => {
                  setEditMenuOpen(false)
                  setSubState('notification_form')
                }}
              />
              <EditMenuItem
                label="Редактировать вступительное слово"
                onClick={() => {
                  setEditMenuOpen(false)
                  setSubState('notification_form')
                }}
              />
            </div>
          )}
          <Button onClick={() => setConfirmOpen(true)}>Отправить</Button>
        </div>
        <div className="text-xs text-gray-500 text-center">
          После публикации повестка и условия не редактируются.
        </div>
      </div>

      <PublishConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handlePublish}
      />
    </div>
  )
}

function DocumentChip({ name }: { name: string }) {
  return (
    <button
      type="button"
      onClick={() => showComingSoon()}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-700"
    >
      <FileText className="w-3.5 h-3.5 text-gray-500" />
      {name}
    </button>
  )
}

function EditMenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
    >
      {label}
    </button>
  )
}
