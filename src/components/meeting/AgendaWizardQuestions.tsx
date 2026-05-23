import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import StepPills from '../stepper/StepPills'
import InfoPopover from '../popover/InfoPopover'
import FormField from '../form/FormField'
import TextInput from '../form/TextInput'
import Select from '../form/Select'
import FileUploadArea from '../form/FileUploadArea'
import FileCard from '../form/FileCard'
import ConfirmModal from '../modal/ConfirmModal'
import CustomQuestionModal from './CustomQuestionModal'
import AgendaQuestionRow from './AgendaQuestionRow'
import { useMeetingStore } from '../../store/meetingStore'
import { createBlock2 } from '../../lib/demoData'
import type { AgendaQuestion } from '../../types/meeting'
import { cn } from '../../lib/cn'

interface RowState {
  checked: Record<string, boolean>
  workDeadline: string
  workBudget: string
  contractor: string
  fundingSource: string
  fundingOther: string
  estimateFile: { name: string; sizeBytes: number } | null
  contractFile: { name: string; sizeBytes: number } | null
  otherFiles: { name: string; sizeBytes: number }[]
  customQuestions: AgendaQuestion[]
  estimateError: boolean
  fundingError: boolean
}

const RECOMMENDED_QUESTIONS = [
  {
    code: '2.1',
    title: 'Утверждение перечня услуг и работ по капитальному ремонту кровли',
    applies: '2.1, 2.2, 2.3',
  },
  {
    code: '2.2',
    title: 'Определение источника и порядка финансирования капитального ремонта кровли',
    applies: '2.1, 2.2',
  },
  {
    code: '2.3',
    title: 'Утверждение сметы на проведение капитального ремонта кровли',
    applies: '2.3',
  },
  {
    code: '2.4',
    title: 'Утверждение состава комиссии от собственников при приёмке результатов',
    applies: null,
  },
  {
    code: '2.5',
    title: 'Выбор подрядчика для проведения работ',
    applies: '2.5',
  },
]

const EXTRA_QUESTIONS = [
  {
    code: '2.6',
    title: 'Утверждение возможности изменения стоимости работ',
    defaultChecked: true,
  },
  {
    code: '',
    title: 'Заключение договора с организацией, осуществляющей строительный контроль',
    defaultChecked: false,
    dimmed: true,
  },
]

const FUNDING_OPTIONS = [
  { value: 'regional_operator_fund', label: 'Фонд регионального оператора' },
  { value: 'special_account', label: 'Специальный счёт дома' },
  { value: 'other', label: 'Иные средства (с пояснением)' },
]

const DEMO_ESTIMATE_FILE = { name: 'Смета на капитальный ремонт кровли.pdf', sizeBytes: 471859 }

export default function AgendaWizardQuestions() {
  const setSubState = useMeetingStore((s) => s.setSubState)
  const addAgendaBlock = useMeetingStore((s) => s.addAgendaBlock)
  const removeAgendaBlock = useMeetingStore((s) => s.removeAgendaBlock)
  const agenda = useMeetingStore((s) => s.meeting.agenda)

  const initialChecked = useMemo(() => {
    const c: Record<string, boolean> = {}
    for (const q of RECOMMENDED_QUESTIONS) c[q.code] = true
    c['2.6'] = true
    return c
  }, [])

  const [state, setState] = useState<RowState>({
    checked: initialChecked,
    workDeadline: '2026-12-31',
    workBudget: '3 000 000 ₽',
    contractor: 'ООО «СтройСервис», ИНН 7707083893',
    fundingSource: 'regional_operator_fund',
    fundingOther: '',
    estimateFile: DEMO_ESTIMATE_FILE,
    contractFile: null,
    otherFiles: [],
    customQuestions: [],
    estimateError: false,
    fundingError: false,
  })

  const [showCustomModal, setShowCustomModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  function toggleQuestion(code: string) {
    if (!code) return
    setState((s) => ({ ...s, checked: { ...s.checked, [code]: !s.checked[code] } }))
  }

  function handleSave() {
    const fundingMissing = !state.fundingSource
    const estimateMissing = state.checked['2.3'] && !state.estimateFile
    if (fundingMissing || estimateMissing) {
      setState((s) => ({ ...s, fundingError: fundingMissing, estimateError: !!estimateMissing }))
      return
    }
    // Build the block. Start from createBlock2 template + overlay form values.
    const block = createBlock2()
    block.questions = block.questions.map((q) => ({
      ...q,
      isChecked: state.checked[q.code] ?? q.isChecked,
    }))
    // Add 2.6 + extras if checked
    if (state.checked['2.6']) {
      block.questions.push({
        code: '2.6',
        title: 'Утверждение возможности изменения стоимости работ',
        description: `Утвердить возможность изменения стоимости работ в пределах ±10% от утверждённого бюджета ${state.workBudget} в случае выявления дополнительных работ при производстве. Подрядчик — ${state.contractor}.`,
        isRecommended: false,
        isMandatory: false,
        isChecked: true,
        requiresDocument: null,
        isCustom: false,
      })
    }
    // Append custom questions
    for (const cq of state.customQuestions) {
      block.questions.push(cq)
    }
    block.params = {
      workDeadline: state.workDeadline,
      workBudget: state.workBudget,
      contractorName: state.contractor,
      fundingSource: state.fundingSource,
    }
    // If there's already a block-2 (e.g., user came back from edit), remove it first
    const existing = agenda.find((b) => b.id === 'block-2')
    if (existing) {
      removeAgendaBlock('block-2')
    }
    addAgendaBlock(block)
    setSubState('agenda_main')
  }

  function handleAddCustomQuestion(q: AgendaQuestion) {
    setState((s) => ({ ...s, customQuestions: [...s.customQuestions, q] }))
  }

  function handleReset() {
    setState({
      checked: initialChecked,
      workDeadline: '2026-12-31',
      workBudget: '',
      contractor: '',
      fundingSource: '',
      fundingOther: '',
      estimateFile: null,
      contractFile: null,
      otherFiles: [],
      customQuestions: [],
      estimateError: false,
      fundingError: false,
    })
    setShowResetModal(false)
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setSubState('agenda_wizard_theme')}
        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        style={{ color: 'var(--color-accent-600)' }}
      >
        ← Назад
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Капитальный ремонт
        </h1>
        <StepPills count={3} activeIndex={2} completedThrough={1} />
      </div>

      <p className="text-sm text-gray-700">Выберите вопросы и заполните параметры</p>

      <Card className="p-6">
        {/* Block header */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: 'var(--color-accent-600)' }}
          >
            2
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-semibold text-gray-900">
                Капитальный ремонт кровли
              </span>
              <span className="text-xs text-gray-500">п. 1 ч. 2 ст. 44 ЖК РФ + ст. 189 ч. 5–5.2</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">
                Кворум по вопросу — 2/3 от всех голосов в доме
              </span>
              <InfoPopover>
                <strong>Кворум по вопросу — 2/3 от всех голосов в доме</strong>
                <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Для решений о капитальном ремонте требуется не менее 2/3 голосов от общего числа
                  всех собственников в доме — не от участвующих в собрании.
                  <br />
                  <br />
                  Основание: ст. 46 ч. 1 п. 1 ЖК РФ.
                </div>
              </InfoPopover>
            </div>
          </div>
        </div>

        {/* Recommended questions */}
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
            Рекомендуемые вопросы
          </div>
          <div className="divide-y divide-gray-100">
            {RECOMMENDED_QUESTIONS.map((q) => (
              <AgendaQuestionRow
                key={q.code}
                code={q.code}
                title={q.title}
                description={`Применяется к вопросам: ${q.applies ?? '—'}`}
                checked={!!state.checked[q.code]}
                onToggle={() => toggleQuestion(q.code)}
              />
            ))}
          </div>
        </div>

        {/* Extra questions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Вопросы</div>
          <div className="divide-y divide-gray-100">
            {EXTRA_QUESTIONS.map((q, i) => (
              <AgendaQuestionRow
                key={q.code || `extra-${i}`}
                code={q.code || '—'}
                title={q.title}
                checked={q.code ? !!state.checked[q.code] : false}
                disabled={!q.code}
                dimmed={q.dimmed}
                onToggle={q.code ? () => toggleQuestion(q.code) : undefined}
              />
            ))}
            {state.customQuestions.map((q) => (
              <AgendaQuestionRow
                key={q.code}
                code={q.code}
                title={q.title}
                description={q.description}
                checked={q.isChecked}
                badge={{ label: 'свой вопрос', tone: 'neutral' }}
                onToggle={() => {
                  setState((s) => ({
                    ...s,
                    customQuestions: s.customQuestions.map((cq) =>
                      cq.code === q.code ? { ...cq, isChecked: !cq.isChecked } : cq,
                    ),
                  }))
                }}
              />
            ))}
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="w-3 h-3" />
              Не нашёл вопрос
            </button>
          </div>
        </div>

        {/* Parameters */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">Параметры</div>
          <div className="space-y-4">
            <FormField
              label="срок работ"
              helper="применяется к вопросам: 2.1, 2.2, 2.3"
            >
              <TextInput
                type="date"
                value={state.workDeadline}
                onChange={(e) => setState((s) => ({ ...s, workDeadline: e.target.value }))}
              />
            </FormField>
            <FormField
              label="бюджет работ"
              helper="применяется к вопросам: 2.1, 2.2"
            >
              <TextInput
                value={state.workBudget}
                onChange={(e) => setState((s) => ({ ...s, workBudget: e.target.value }))}
                placeholder="3 000 000 ₽"
              />
            </FormField>
            <FormField
              label="наименование подрядчика"
              helper="применяется к вопросам: 2.1, 2.2, 2.4, 2.5, 2.6"
            >
              <TextInput
                value={state.contractor}
                onChange={(e) => setState((s) => ({ ...s, contractor: e.target.value }))}
                placeholder="добавьте название и ИНН"
              />
            </FormField>
            <FormField
              label="источник финансирования"
              required
              helper="применяется к вопросу: 2.2"
              error={state.fundingError ? 'Поле обязательно для заполнения' : undefined}
            >
              <Select
                value={state.fundingSource}
                placeholder="выберите источник"
                error={state.fundingError}
                options={FUNDING_OPTIONS}
                onChange={(e) =>
                  setState((s) => ({ ...s, fundingSource: e.target.value, fundingError: false }))
                }
              />
              {state.fundingSource === 'other' && (
                <div className="mt-2">
                  <TextInput
                    value={state.fundingOther}
                    onChange={(e) => setState((s) => ({ ...s, fundingOther: e.target.value }))}
                    placeholder="пояснение источника"
                  />
                </div>
              )}
            </FormField>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">Документы</div>
          <div className="space-y-5">
            <div>
              <div className="text-sm font-medium text-gray-800 mb-1">
                Смета на проведение работ <span className="text-rose-600">*</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">обязательно для вопроса 2.3</div>
              {state.estimateFile ? (
                <FileCard
                  name={state.estimateFile.name}
                  sizeBytes={state.estimateFile.sizeBytes}
                  onRemove={() => setState((s) => ({ ...s, estimateFile: null }))}
                />
              ) : (
                <FileUploadArea
                  label="Загрузить смету"
                  error={state.estimateError}
                  onFiles={(files) => {
                    const f = files[0]
                    setState((s) => ({
                      ...s,
                      estimateFile: { name: f.name, sizeBytes: f.size },
                      estimateError: false,
                    }))
                  }}
                />
              )}
              {state.estimateError && (
                <div className="text-xs text-rose-700 mt-2">
                  Загрузите смету для вопроса 2.3 или снимите отметку с этого вопроса
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800 mb-1">
                Договор подряда (опционально)
              </div>
              <div className="text-xs text-gray-500 mb-2">приложение к вопросу 2.5</div>
              {state.contractFile ? (
                <FileCard
                  name={state.contractFile.name}
                  sizeBytes={state.contractFile.sizeBytes}
                  onRemove={() => setState((s) => ({ ...s, contractFile: null }))}
                />
              ) : (
                <FileUploadArea
                  label="Загрузить договор"
                  onFiles={(files) => {
                    const f = files[0]
                    setState((s) => ({
                      ...s,
                      contractFile: { name: f.name, sizeBytes: f.size },
                    }))
                  }}
                />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Прочие документы (опционально)
              </div>
              {state.otherFiles.length > 0 && (
                <div className="space-y-2 mb-2">
                  {state.otherFiles.map((f, i) => (
                    <FileCard
                      key={i}
                      name={f.name}
                      sizeBytes={f.sizeBytes}
                      onRemove={() =>
                        setState((s) => ({
                          ...s,
                          otherFiles: s.otherFiles.filter((_, j) => j !== i),
                        }))
                      }
                    />
                  ))}
                </div>
              )}
              <FileUploadArea
                label="Загрузить документ"
                multiple
                onFiles={(files) => {
                  const added = Array.from(files).map((f) => ({
                    name: f.name,
                    sizeBytes: f.size,
                  }))
                  setState((s) => ({ ...s, otherFiles: [...s.otherFiles, ...added] }))
                }}
              />
            </div>
          </div>
        </div>

        <div className={cn('flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100')}>
          <Button variant="secondary" onClick={() => setShowResetModal(true)}>
            Сбросить
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </Card>

      <CustomQuestionModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        nextCode={`2.${7 + state.customQuestions.length}`}
        onAdd={handleAddCustomQuestion}
      />

      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        title="Сбросить все параметры и снять выбор вопросов?"
        confirmLabel="Сбросить"
        cancelLabel="Отмена"
      >
        Будут очищены все параметры (срок, бюджет, подрядчик, источник финансирования), загруженные
        документы и сняты отметки с дополнительных вопросов. Это действие нельзя отменить.
      </ConfirmModal>
    </div>
  )
}

