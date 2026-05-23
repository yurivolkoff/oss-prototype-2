import { useMemo, useRef, useState } from 'react'
import BackLink from '../layout/BackLink'
import Card from '../ui/Card'
import Button from '../ui/Button'
import FormField from '../form/FormField'
import Select from '../form/Select'
import TextInput from '../form/TextInput'
import Textarea from '../form/Textarea'
import FileUploadArea from '../form/FileUploadArea'
import FileCard from '../form/FileCard'
import InfoPopover from '../popover/InfoPopover'
import AgendaBlockCard from './AgendaBlockCard'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'
import { formatDate } from '../../lib/format'

const DURATION_OPTIONS = [
  { value: '7', label: '7 дней' },
  { value: '14', label: '14 дней' },
  { value: '30', label: '30 дней' },
  { value: '45', label: '45 дней' },
  { value: '60', label: '60 дней' },
]

const INTRO_PLACEHOLDER =
  'Например: уважаемые соседи, наш дом нуждается в ремонте кровли после зимних протечек. На собрании выберем подрядчика и утвердим смету. Голосование займёт 60 дней — пожалуйста, не пропустите.'

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

interface FormState {
  durationDays: number
  paperReceiptPlace: string
  introductionText: string
  introductionVideo: File | null
  videoError: string | null
  placeError: string | null
  introError: string | null
}

export default function NotificationForm() {
  const meeting = useMeetingStore((s) => s.meeting)
  const setState = useMeetingStore((s) => s.setState)
  const setSubState = useMeetingStore((s) => s.setSubState)

  const placeRef = useRef<HTMLInputElement>(null)
  const introRef = useRef<HTMLTextAreaElement>(null)

  const [form, setForm] = useState<FormState>(() => ({
    durationDays: meeting.voting.durationDays ?? 60,
    paperReceiptPlace: meeting.voting.paperReceiptPlace,
    introductionText: meeting.voting.introductionText,
    introductionVideo: meeting.voting.introductionVideo,
    videoError: null,
    placeError: null,
    introError: null,
  }))

  const dates = useMemo(() => {
    const today = new Date()
    const startsAt = addDays(today, 10)
    const endsAt = addDays(startsAt, form.durationDays)
    return {
      publishedAt: formatDate(today),
      startsAt: formatDate(startsAt),
      endsAt: formatDate(endsAt),
    }
  }, [form.durationDays])

  function handleVideoFiles(files: FileList) {
    const file = files[0]
    if (!file) return
    if (file.type && file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
      setForm((s) => ({
        ...s,
        introductionVideo: null,
        videoError: 'Используйте формат MP4. Другие форматы пока не поддерживаются.',
      }))
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setForm((s) => ({
        ...s,
        introductionVideo: null,
        videoError: 'Размер файла превышает 50 МБ. Сократите длительность или степень сжатия.',
      }))
      return
    }
    setForm((s) => ({ ...s, introductionVideo: file, videoError: null }))
  }

  function handleContinue() {
    const placeError = form.paperReceiptPlace.trim().length === 0
      ? 'Поле обязательно для заполнения'
      : null
    const introError =
      form.introductionText.trim().length < 100
        ? 'Опишите контекст: минимум 100 символов. Это поможет собственникам понять, о чём собрание.'
        : null

    if (placeError || introError) {
      setForm((s) => ({ ...s, placeError, introError }))
      // Scroll to first error
      if (placeError) {
        placeRef.current?.focus()
        placeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (introError) {
        introRef.current?.focus()
        introRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Persist to store
    useMeetingStore.setState((store) => ({
      meeting: {
        ...store.meeting,
        voting: {
          ...store.meeting.voting,
          durationDays: form.durationDays,
          paperReceiptPlace: form.paperReceiptPlace,
          introductionText: form.introductionText,
          introductionVideo: form.introductionVideo,
        },
      },
    }))
    setState('draft_ready')
    setSubState('notification_preview')
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
            Старт общего собрания
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Заполните условия собрания и проверьте повестку. На следующем экране вы увидите
            проект уведомления, который будет отправлен собственникам.
          </p>
        </div>
        <button
          type="button"
          onClick={() => showComingSoon()}
          className="text-sm font-medium hover:underline mt-1"
          style={{ color: 'var(--color-accent-600)' }}
        >
          ссылки на доп. материалы &gt;
        </button>
      </div>

      {/* Карточка 1 — сроки голосования */}
      <Card className="p-6 space-y-3">
        <FormField
          label={
            <span className="inline-flex items-center gap-1">
              укажите сроки голосования
              <InfoPopover>
                <strong>Сроки голосования</strong>
                <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Минимум — 7 дней, максимум — 60 дней (ст. 47.1 ч. 5 ЖК РФ).
                  Дата начала голосования рассчитывается автоматически: не ранее чем
                  через 10 дней после публикации уведомления (ст. 45 ч. 4 ЖК РФ).
                  <br />
                  <br />
                  Раньше 10 дней голосование запустить нельзя — это сделано, чтобы
                  собственники успели ознакомиться с повесткой.
                </div>
              </InfoPopover>
            </span>
          }
          helper="Срок может быть выбран от 7 до 60 дней. Голосование начнётся не ранее чем через 10 дней после публикации уведомления."
        >
          <Select
            value={String(form.durationDays)}
            options={DURATION_OPTIONS}
            onChange={(e) =>
              setForm((s) => ({ ...s, durationDays: Number(e.target.value) }))
            }
          />
        </FormField>

        <div className="rounded-lg bg-gray-50 p-3 space-y-1 text-xs">
          <DateRow label="Публикация уведомления:" value={`сегодня, ${dates.publishedAt}`} />
          <DateRow
            label="Голосование начнётся:"
            value={`${dates.startsAt} (через 10 дней)`}
          />
          <DateRow
            label="Голосование завершится:"
            value={`${dates.endsAt} (через ${form.durationDays} дней после старта)`}
          />
        </div>
      </Card>

      {/* Карточка 2 — формат собрания */}
      <Card className="p-6">
        <FormField
          label="формат собрания"
          helper="Заочное собрание проходит онлайн в ГИС ЖКХ. Собственники голосуют через личный кабинет Госуслуг. Бумажные бюллетени принимаются по адресу администратора."
        >
          <Select
            value="electronic_remote"
            disabled
            options={[
              {
                value: 'electronic_remote',
                label: 'Заочное с использованием системы',
              },
            ]}
          />
        </FormField>
      </Card>

      {/* Карточка 3 — место и срок приёма письменных решений */}
      <Card className="p-6">
        <FormField
          label={
            <span className="inline-flex items-center gap-1">
              место и срок приёма письменных решений собственников по вопросам, поставленным на голосование
              <InfoPopover>
                <strong>Место и срок приёма письменных решений</strong>
                <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Адрес, по которому собственники могут передать бумажный бюллетень,
                  обязателен в уведомлении о собрании в форме заочного голосования
                  с использованием системы (ст. 47.1 ч. 4 и ч. 11 ЖК РФ).
                  <br />
                  <br />
                  Бумажные решения принимаются не позднее чем за 48 часов до конца
                  голосования. Скан-копию каждого бумажного бюллетеня администратор
                  загружает в ГИС ЖКХ в течение 24 часов с момента получения.
                </div>
              </InfoPopover>
            </span>
          }
          helper={
            !form.placeError
              ? 'Адрес офиса УО или иное место, где собственник может передать бумажный бюллетень. Не позднее 48 часов до конца голосования.'
              : undefined
          }
          error={form.placeError}
        >
          <TextInput
            ref={placeRef}
            aria-label="Место и срок приёма письменных решений собственников по вопросам, поставленным на голосование"
            value={form.paperReceiptPlace}
            error={!!form.placeError}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                paperReceiptPlace: e.target.value,
                placeError: e.target.value.trim().length === 0 ? s.placeError : null,
              }))
            }
            onBlur={() => {
              if (form.paperReceiptPlace.trim().length === 0) {
                setForm((s) => ({ ...s, placeError: 'Поле обязательно для заполнения' }))
              }
            }}
          />
        </FormField>
      </Card>

      {/* Карточка 4 — вступительное слово */}
      <Card className="p-6">
        <FormField
          label={
            <span className="inline-flex items-center gap-1">
              вступительное слово
              <InfoPopover>
                <strong>Вступительное слово</strong>
                <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Произвольный текст, который увидят все собственники в личных кабинетах
                  Госуслуг при получении уведомления.
                  <br />
                  <br />
                  Полезно объяснить: почему созвали собрание, какое решение важно для дома,
                  что произойдёт, если кворум не будет набран.
                  <br />
                  <br />
                  Тон — нейтральный, без оценочных суждений и обещаний.
                </div>
              </InfoPopover>
            </span>
          }
          helper={
            !form.introError
              ? 'Опишите контекст собрания: почему созываете, какие решения важны для дома. Этот текст увидят все собственники в личных кабинетах Госуслуг.'
              : undefined
          }
          error={form.introError}
        >
          <Textarea
            ref={introRef}
            aria-label="Вступительное слово"
            value={form.introductionText}
            placeholder={INTRO_PLACEHOLDER}
            maxLength={4000}
            showCounter
            error={!!form.introError}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                introductionText: e.target.value,
                introError: e.target.value.trim().length >= 100 ? null : s.introError,
              }))
            }
            onBlur={() => {
              if (form.introductionText.trim().length > 0 && form.introductionText.trim().length < 100) {
                setForm((s) => ({
                  ...s,
                  introError:
                    'Опишите контекст: минимум 100 символов. Это поможет собственникам понять, о чём собрание.',
                }))
              }
            }}
          />
        </FormField>
      </Card>

      {/* Карточка 5 — видео-приветствие */}
      <Card className="p-6">
        <FormField
          label={
            <span className="inline-flex items-center gap-2">
              видео-приветствие
              <span className="text-xs font-normal text-gray-500 normal-case">опционально</span>
            </span>
          }
          helper={
            !form.videoError
              ? 'До 60 секунд, до 50 МБ, формат MP4. Видео помогает собственникам понять контекст.'
              : undefined
          }
          error={form.videoError}
        >
          {form.introductionVideo ? (
            <FileCard
              name={form.introductionVideo.name}
              sizeBytes={form.introductionVideo.size}
              onRemove={() =>
                setForm((s) => ({ ...s, introductionVideo: null, videoError: null }))
              }
            />
          ) : (
            <FileUploadArea
              accept="video/mp4"
              onFiles={handleVideoFiles}
              error={!!form.videoError}
            />
          )}
        </FormField>
      </Card>

      {/* Карточка 6 — контакты администратора */}
      <Card className="p-6 space-y-3">
        <div>
          <div className="text-sm font-medium text-gray-700">Контакты администратора</div>
          <div className="text-xs text-gray-500 mt-1">
            Контакты администратора будут указаны в уведомлении и видны собственникам.
          </div>
        </div>
        <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50">
          <div className="text-sm text-gray-800 space-y-0.5">
            <div>email: {meeting.administrator.email}</div>
            <div>телефон: {meeting.administrator.phone}</div>
          </div>
          <button
            type="button"
            onClick={() => showComingSoon()}
            className="text-sm font-medium hover:underline whitespace-nowrap"
            style={{ color: 'var(--color-accent-600)' }}
          >
            Изменить в профиле →
          </button>
        </div>
      </Card>

      {/* Карточка 7 — повестка собрания */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-gray-900">Повестка собрания</h2>
          <button
            type="button"
            onClick={() => setSubState('agenda_main')}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-accent-600)' }}
          >
            Редактировать повестку →
          </button>
        </div>
        <div className="space-y-3">
          {meeting.agenda.map((block, idx) => (
            <AgendaBlockCard
              key={block.id}
              block={block}
              defaultOpen={idx === 1}
              disableQuestionToggle
            />
          ))}
        </div>
      </Card>

      {/* CTA */}
      <div className="flex flex-col items-center pt-2 gap-2">
        <Button onClick={handleContinue}>Продолжить</Button>
        <div className="text-xs text-gray-500 text-center max-w-md">
          На следующем экране вы увидите проект уведомления, который будет отправлен собственникам.
        </div>
      </div>
    </div>
  )
}

function DateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-gray-600 min-w-[180px]">{label}</span>
      <span className="font-mono text-gray-900">{value}</span>
    </div>
  )
}
