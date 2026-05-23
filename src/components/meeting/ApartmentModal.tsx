import { useEffect, useMemo, useState } from 'react'
import Modal from '../modal/Modal'
import Button from '../ui/Button'
import FormField from '../form/FormField'
import TextInput from '../form/TextInput'
import Textarea from '../form/Textarea'
import Radio from '../form/Radio'
import FileUploadArea from '../form/FileUploadArea'
import FileCard from '../form/FileCard'
import { Clock, Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Meeting, Premise, PremiseOwner } from '../../types/meeting'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDateTime } from '../../lib/format'
import { showComingSoon } from '../toast/toastHelpers'
import type { VotingTileMeta } from '../../lib/votingDistribution'

export type ApartmentModalMode =
  | 'preparation' // existing module 1 path
  | 'paper_ballot' // M1 full entry
  | 'preview_voted_online' // green tile — read-only, secret vote
  | 'preview_paper_entered' // beige tile — read-only entered data
  | 'refused' // pink tile — refusal explanation

interface ApartmentModalProps {
  premise: Premise | null
  isOpen: boolean
  onClose: () => void
  mode?: ApartmentModalMode
  /** voting meta — required for preview_voted_online / refused modes */
  votingMeta?: VotingTileMeta | null
  /** meeting object — required for paper_ballot mode to render agenda questions */
  meeting?: Meeting
}

function getOwners(premise: Premise): PremiseOwner[] {
  if (premise.number === '15') {
    const overridden: PremiseOwner = {
      fullName: 'Иванов Сергей Александрович',
      email: 'ivanov.s@example.ru',
      phone: '+7 921 111-22-33',
      ownedArea: 26.15,
      ownershipShare: '1/2',
      ownershipDocNumber: '78-78-001/001/2020-1234',
      state: 'verified',
    }
    const second: PremiseOwner = {
      fullName: 'Иванова Мария Петровна',
      email: 'ivanova.m@example.ru',
      phone: '+7 921 222-33-44',
      ownedArea: 26.15,
      ownershipShare: '1/2',
      ownershipDocNumber: '78-78-001/002/2020-1235',
      state: 'pending',
    }
    return [overridden, second]
  }
  if (premise.owners.length > 0) return premise.owners
  // synthesize one owner for demo
  return [
    {
      fullName: `Собственник кв. ${premise.number}`,
      email: '',
      phone: '',
      ownedArea: premise.area,
      ownershipShare: '1/1',
      ownershipDocNumber: `78-78-01/123/2018-${premise.number}`,
      state: 'verified',
    },
  ]
}

interface OwnerFormState {
  fullName: string
  email: string
  phone: string
  ownedArea: string
  ownershipShare: string
  ownershipDocNumber: string
}

interface OwnerErrors {
  fullName?: string
  email?: string
  phone?: string
  ownershipShare?: string
}

function ownerToFormState(o: PremiseOwner): OwnerFormState {
  return {
    fullName: o.fullName,
    email: o.email,
    phone: o.phone,
    ownedArea: String(o.ownedArea),
    ownershipShare: o.ownershipShare,
    ownershipDocNumber: o.ownershipDocNumber,
  }
}

function isSnilsValid(value: string): boolean {
  return /^\d{3}-\d{3}-\d{3} \d{2}$/.test(value.trim())
}

function isPassportValid(value: string): boolean {
  if (!value.trim()) return true // optional
  return /^\d{2} \d{2} \d{6}$/.test(value.trim())
}

export default function ApartmentModal({
  premise,
  isOpen,
  onClose,
  mode = 'preparation',
  votingMeta,
  meeting,
}: ApartmentModalProps) {
  const owners = useMemo<PremiseOwner[]>(() => (premise ? getOwners(premise) : []), [premise])
  const registerPaperBallot = useMeetingStore((s) => s.registerPaperBallot)

  // Preparation mode state
  const [activeTab, setActiveTab] = useState(0)
  const [ownerFormStates, setOwnerFormStates] = useState<OwnerFormState[]>([])
  const [ownerErrors, setOwnerErrors] = useState<OwnerErrors[]>([])
  const [comment, setComment] = useState('')

  // Paper ballot mode state
  const [snils, setSnils] = useState('')
  const [snilsError, setSnilsError] = useState<string>()
  const [passport, setPassport] = useState('')
  const [passportError, setPassportError] = useState<string>()
  const [answers, setAnswers] = useState<Record<string, 'for' | 'against' | 'abstain'>>({})
  const [answersError, setAnswersError] = useState(false)
  const [ballotFile, setBallotFile] = useState<File | null>(null)
  const [ballotError, setBallotError] = useState<string>()

  useEffect(() => {
    if (premise) {
      setActiveTab(0)
      setOwnerFormStates(owners.map(ownerToFormState))
      setOwnerErrors(owners.map(() => ({})))
      setComment('')
      setSnils('')
      setSnilsError(undefined)
      setPassport('')
      setPassportError(undefined)
      setAnswers({})
      setAnswersError(false)
      setBallotFile(null)
      setBallotError(undefined)
    }
  }, [premise, owners])

  if (!premise) return null

  // Determine if paper-ballot acceptance is locked (after endsAt - 48h)
  const isPaperLocked = (() => {
    if (mode !== 'paper_ballot' || !meeting?.voting.endsAt) return false
    const deadline = new Date(meeting.voting.endsAt).getTime() - 48 * 3600 * 1000
    return Date.now() >= deadline
  })()

  // ── Mode: preview_voted_online (green) ───────────────────────────────
  if (mode === 'preview_voted_online') {
    const owner = owners[0]
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        title={
          <div>
            <div>Квартира №{premise.number}</div>
            <div className="text-xs font-normal text-gray-500 mt-0.5">
              проголосовал онлайн {votingMeta?.votedAt ?? '—'}
            </div>
          </div>
        }
        footer={<Button onClick={onClose}>Закрыть</Button>}
      >
        <div className="space-y-3 text-sm text-gray-800">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500">Собственник</div>
              <div>{owner?.fullName ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Доля в праве</div>
              <div>{owner?.ownershipShare ?? '—'}</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Способ голосования</div>
            <div>Онлайн через Госуслуги</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            ⚠ Голос собственника защищён тайной голосования. Подробности по вопросам появятся
            после завершения собрания.
          </div>
        </div>
      </Modal>
    )
  }

  // ── Mode: refused (pink) ─────────────────────────────────────────────
  if (mode === 'refused') {
    const owner = owners[0]
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        title={
          <div>
            <div>Квартира №{premise.number}</div>
            <div className="text-xs font-normal text-gray-500 mt-0.5">
              не участвует в голосовании
            </div>
          </div>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => showComingSoon()}>
              Изменить статус
            </Button>
            <Button onClick={onClose}>Закрыть</Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-gray-800">
          <div>
            <div className="text-xs text-gray-500">Собственник</div>
            <div>{owner?.fullName ?? '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Причина</div>
            <div>{votingMeta?.refusalReason ?? 'нет аккаунта на Госуслугах'}</div>
          </div>
          {meeting?.voting.endsAt && (
            <p className="text-xs text-gray-600 leading-relaxed">
              Если собственник захочет проголосовать — он может передать бумажный бюллетень
              администратору до{' '}
              {formatDateTime(
                new Date(new Date(meeting.voting.endsAt).getTime() - 48 * 3600 * 1000),
              )}
              .
            </p>
          )}
        </div>
      </Modal>
    )
  }

  // ── Mode: paper_ballot OR preview_paper_entered ─────────────────────
  if (mode === 'paper_ballot' || mode === 'preview_paper_entered') {
    const readOnly = mode === 'preview_paper_entered' || isPaperLocked
    const owner = owners[activeTab]
    const ownerForm = ownerFormStates[activeTab]
    const activeErrors = ownerErrors[activeTab] ?? {}
    const allQuestions = meeting
      ? meeting.agenda.flatMap((b) => b.questions.filter((q) => q.isChecked))
      : []
    const fakeKn = `78:23:0000000:${1000 + Number(premise.number.replace(/\D/g, '')) || 1234}`
    const ownershipType =
      owners.length > 1 ? 'Общая совместная собственность' : 'Индивидуальная собственность'

    function updateActiveForm(patch: Partial<OwnerFormState>) {
      setOwnerFormStates((prev) =>
        prev.map((s, i) => (i === activeTab ? { ...s, ...patch } : s)),
      )
    }

    function validateFullName(value: string) {
      setOwnerErrors((prev) =>
        prev.map((s, i) =>
          i === activeTab
            ? { ...s, fullName: value.trim() ? undefined : 'Поле обязательно для заполнения' }
            : s,
        ),
      )
    }

    function validateSnils(value: string) {
      if (!value.trim()) {
        setSnilsError('Поле обязательно для заполнения')
      } else if (!isSnilsValid(value)) {
        setSnilsError('Укажите СНИЛС в формате 000-000-000 00')
      } else {
        setSnilsError(undefined)
      }
    }

    function validatePassport(value: string) {
      if (!isPassportValid(value)) {
        setPassportError('Укажите серию и номер в формате XX XX XXXXXX')
      } else {
        setPassportError(undefined)
      }
    }

    function handleFile(files: FileList) {
      const file = files[0]
      if (!file) return
      if (file.size > 10 * 1024 * 1024) {
        setBallotError('Размер файла превышает 10 МБ')
        return
      }
      const ok = /\.(pdf|jpg|jpeg)$/i.test(file.name)
      if (!ok) {
        setBallotError('Поддерживаются только PDF и JPG')
        return
      }
      setBallotError(undefined)
      setBallotFile(file)
    }

    function hasUnanswered(): boolean {
      return allQuestions.some((q) => !answers[q.code])
    }

    function canSave(): boolean {
      if (readOnly) return false
      if (!ownerForm?.fullName.trim()) return false
      if (!isSnilsValid(snils)) return false
      if (!ballotFile) return false
      if (hasUnanswered()) return false
      return true
    }

    function handleSave() {
      if (!ownerForm?.fullName.trim()) validateFullName(ownerForm?.fullName ?? '')
      validateSnils(snils)
      if (!ballotFile) setBallotError('Загрузите скан бумажной бюллетени')
      const unanswered = hasUnanswered()
      setAnswersError(unanswered)
      if (!canSave() || unanswered) return

      registerPaperBallot({
        premiseId: premise!.id,
        ownerFullName: ownerForm!.fullName,
        ownerSnils: '', // not persisted
        ownerPassport: '', // not persisted
        ownershipDocNumber: ownerForm!.ownershipDocNumber,
        ownershipShare: ownerForm!.ownershipShare,
        scanFile: null, // we don't persist File object
        votedAt: new Date().toISOString(),
        enteredAt: new Date().toISOString(),
        answers,
        comment,
      })
      onClose()
    }

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        title={
          <div>
            <div>Квартира №{premise.number}</div>
            <div className="text-xs font-normal text-gray-500 mt-0.5">
              Подъезд {premise.entrance}, этаж {premise.floor}
            </div>
          </div>
        }
        footer={
          !readOnly ? (
            <Button onClick={handleSave} disabled={!canSave()}>
              Сохранить
            </Button>
          ) : null
        }
      >
        {isPaperLocked && (
          <div className="mb-4 p-4 rounded-lg bg-rose-50 border border-rose-200">
            <div className="font-semibold text-rose-900 mb-1">
              Приём бумажных решений завершён
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              До конца голосования осталось менее 48 часов. Согласно ст. 47.1 ч. 10 ЖК РФ,
              новые бумажные бюллетени больше не принимаются.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Top read-only row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="кадастровый номер">
              <TextInput value={fakeKn} readOnly disabled />
            </FormField>
            <FormField label="тип права">
              <TextInput value={ownershipType} readOnly disabled />
            </FormField>
          </div>

          {/* Tabs */}
          {owners.length > 1 && (
            <div className="flex border-b border-gray-200">
              {owners.map((o, i) => {
                const isActive = i === activeTab
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                      isActive
                        ? 'border-[var(--color-accent-600)] text-[var(--color-accent-700)]'
                        : 'border-transparent text-gray-500 hover:text-gray-700',
                    )}
                  >
                    <span>Собственник {i + 1}</span>
                    {o.state === 'verified' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Owner fields */}
          {ownerForm && owner && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Номер права собственности">
                <TextInput value={ownerForm.ownershipDocNumber} readOnly disabled />
              </FormField>
              <FormField label="Доля в праве">
                <TextInput value={ownerForm.ownershipShare} readOnly disabled />
              </FormField>
              <FormField
                label="Ф.И.О. собственника"
                required
                error={activeErrors.fullName}
                className="col-span-2"
              >
                <TextInput
                  value={ownerForm.fullName}
                  onChange={(e) => updateActiveForm({ fullName: e.target.value })}
                  onBlur={(e) => validateFullName(e.target.value)}
                  error={!!activeErrors.fullName}
                  disabled={readOnly}
                />
              </FormField>
              <FormField
                label="СНИЛС"
                required
                error={snilsError}
                helper="обязательно с 01.03.2025 (ст. 47.1 ЖК РФ + письмо Минстроя 4711-ОГ/04)"
              >
                <TextInput
                  value={snils}
                  onChange={(e) => setSnils(e.target.value)}
                  onBlur={(e) => validateSnils(e.target.value)}
                  error={!!snilsError}
                  placeholder="000-000-000 00"
                  disabled={readOnly}
                />
              </FormField>
              <FormField
                label="Паспорт РФ"
                error={passportError}
                helper="данные не сохраняются после закрытия модалки"
              >
                <TextInput
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  onBlur={(e) => validatePassport(e.target.value)}
                  error={!!passportError}
                  placeholder="XX XX XXXXXX"
                  disabled={readOnly}
                />
              </FormField>
            </div>
          )}

          {/* Answers by question */}
          {allQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900">
                Ответы по вопросам повестки
              </div>
              <div className="space-y-2">
                {allQuestions.map((q) => {
                  const value = answers[q.code]
                  const missing = answersError && !value
                  return (
                    <div
                      key={q.code}
                      className={cn(
                        'p-3 rounded-lg border',
                        missing ? 'border-rose-300 bg-rose-50' : 'border-gray-100 bg-gray-50',
                      )}
                    >
                      <div className="text-sm text-gray-800 mb-1.5">
                        <span className="font-medium">{q.code}.</span> {q.title}
                      </div>
                      <div className="flex gap-4">
                        {(['for', 'abstain', 'against'] as const).map((v) => (
                          <Radio
                            key={v}
                            name={`q-${q.code}`}
                            checked={value === v}
                            onChange={() =>
                              setAnswers((prev) => ({ ...prev, [q.code]: v }))
                            }
                            disabled={readOnly}
                            label={v === 'for' ? 'за' : v === 'abstain' ? 'воздержался' : 'против'}
                          />
                        ))}
                      </div>
                      {missing && (
                        <div className="text-xs text-rose-700 mt-1">
                          Укажите голос собственника по этому вопросу
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ballot upload */}
          <FormField
            label="Бюллетень"
            required
            error={ballotError}
            helper={
              !ballotError
                ? 'обязательно по ст. 47.1 ч. 10 ЖК РФ. PDF или JPG, до 10 МБ'
                : undefined
            }
          >
            {ballotFile ? (
              <FileCard
                name={ballotFile.name}
                sizeBytes={ballotFile.size}
                onRemove={() => setBallotFile(null)}
                badge={{ label: 'распознаны все ответы', tone: 'success' }}
              />
            ) : (
              <FileUploadArea
                label="Загрузите скан бумажной бюллетени"
                accept=".pdf,.jpg,.jpeg"
                onFiles={handleFile}
                error={!!ballotError}
              />
            )}
          </FormField>

          {/* Comment */}
          <FormField label="Комментарий администратора">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={3000}
              showCounter
              disabled={readOnly}
            />
          </FormField>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Дата голосования">
              <TextInput
                defaultValue={new Date().toLocaleDateString('ru-RU')}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Дата внесения в систему">
              <TextInput value={formatDateTime(new Date())} readOnly disabled />
            </FormField>
          </div>
        </div>
      </Modal>
    )
  }

  // ── Mode: preparation (existing module 1 behavior) ──────────────────
  const activeForm = ownerFormStates[activeTab]
  const activeErrors = ownerErrors[activeTab] ?? {}

  function updateActiveForm(patch: Partial<OwnerFormState>) {
    setOwnerFormStates((prev) =>
      prev.map((s, i) => (i === activeTab ? { ...s, ...patch } : s)),
    )
  }

  function validateField(field: keyof OwnerErrors, value: string) {
    let err: string | undefined
    switch (field) {
      case 'fullName':
        if (!value.trim()) err = 'Поле обязательно для заполнения'
        break
      case 'email':
        if (value && !/.+@.+\..+/.test(value))
          err = 'Укажите email в формате name@example.com'
        break
      case 'phone':
        if (value && !/^\+?\d[\d \-()]+$/.test(value))
          err = 'Укажите телефон в формате +7 XXX XXX-XX-XX'
        break
      case 'ownershipShare':
        if (value && !/^\d+\/\d+$|^\d+$/.test(value))
          err = 'Укажите долю в формате 1/2 или 1'
        break
    }
    setOwnerErrors((prev) =>
      prev.map((s, i) => (i === activeTab ? { ...s, [field]: err } : s)),
    )
  }

  const hasCadastralError = !premise.cadastralLinked
  const hasAreaError = premise.status === 'warning' || premise.number === '15'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div>
          <div>Квартира №{premise.number}</div>
          <div className="text-xs font-normal text-gray-500 mt-0.5">
            Подъезд {premise.entrance}, этаж {premise.floor}
          </div>
        </div>
      }
      footer={<Button onClick={onClose}>Сохранить</Button>}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="кадастровый номер"
            error={hasCadastralError ? '❌ Нет кадастрового номера' : undefined}
          >
            <TextInput
              defaultValue={
                hasCadastralError ? '' : `78:23:0000000:${1000 + Number(premise.number) || 1234}`
              }
              placeholder="78:XX:XXXXXXX:XXXX"
              error={hasCadastralError}
            />
          </FormField>
          <FormField
            label="площадь помещения, м²"
            error={hasAreaError ? '❌ Проверьте площадь квартиры' : undefined}
          >
            <TextInput defaultValue={String(premise.area)} error={hasAreaError} />
          </FormField>
        </div>

        <div className="flex border-b border-gray-200">
          {owners.map((o, i) => {
            const isActive = i === activeTab
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-[var(--color-accent-600)] text-[var(--color-accent-700)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                <span>Собственник {i + 1}</span>
                {o.state === 'verified' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            )
          })}
        </div>

        {activeForm && (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ф.И.О." required error={activeErrors.fullName} className="col-span-2">
              <TextInput
                value={activeForm.fullName}
                onChange={(e) => updateActiveForm({ fullName: e.target.value })}
                onBlur={(e) => validateField('fullName', e.target.value)}
                error={!!activeErrors.fullName}
              />
            </FormField>
            <FormField label="Email" error={activeErrors.email}>
              <TextInput
                value={activeForm.email}
                onChange={(e) => updateActiveForm({ email: e.target.value })}
                onBlur={(e) => validateField('email', e.target.value)}
                error={!!activeErrors.email}
              />
            </FormField>
            <FormField label="Телефон" error={activeErrors.phone}>
              <TextInput
                value={activeForm.phone}
                onChange={(e) => updateActiveForm({ phone: e.target.value })}
                onBlur={(e) => validateField('phone', e.target.value)}
                error={!!activeErrors.phone}
              />
            </FormField>
            <FormField label="Площадь в собственности, м²">
              <TextInput
                value={activeForm.ownedArea}
                onChange={(e) => updateActiveForm({ ownedArea: e.target.value })}
              />
            </FormField>
            <FormField label="Доля в праве" error={activeErrors.ownershipShare}>
              <TextInput
                value={activeForm.ownershipShare}
                onChange={(e) => updateActiveForm({ ownershipShare: e.target.value })}
                onBlur={(e) => validateField('ownershipShare', e.target.value)}
                error={!!activeErrors.ownershipShare}
                placeholder="например, 1/2"
              />
            </FormField>
            <FormField label="Номер права собственности" className="col-span-2">
              <TextInput
                value={activeForm.ownershipDocNumber}
                onChange={(e) => updateActiveForm({ ownershipDocNumber: e.target.value })}
              />
            </FormField>
          </div>
        )}

        <FormField label="Комментарий">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={3000}
            showCounter
            placeholder="Например: уточнить данные у собственника после ремонта квартиры — площадь могла измениться."
          />
        </FormField>
      </div>
    </Modal>
  )
}
