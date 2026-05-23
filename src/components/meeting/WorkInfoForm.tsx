import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import InfoBlock from '../ui/InfoBlock'
import InfoPopover from '../popover/InfoPopover'
import FormField from '../form/FormField'
import TextInput from '../form/TextInput'
import Select from '../form/Select'
import FileCard from '../form/FileCard'
import FileUploadArea from '../form/FileUploadArea'
import ConfirmModal from '../modal/ConfirmModal'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDate } from '../../lib/format'
import { showComingSoon } from '../toast/toastHelpers'

interface FakeFile {
  name: string
  sizeBytes: number
}

const DEFAULT_CONTRACT: FakeFile = { name: 'Договор.pdf', sizeBytes: 0.89 * 1024 * 1024 }
const DEFAULT_ACT: FakeFile = { name: 'Акт.pdf', sizeBytes: 0.69 * 1024 * 1024 }

function parseRubInput(s: string): number | null {
  const cleaned = s.replace(/[\s ]/g, '').replace(/₽/g, '').replace(/,/g, '.')
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isFinite(n) && n > 0 ? n : null
}

function formatRub(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export default function WorkInfoForm() {
  const navigate = useNavigate()
  const meeting = useMeetingStore((s) => s.meeting)
  const publishWorkInfo = useMeetingStore((s) => s.publishWorkInfo)
  const archiveMeeting = useMeetingStore((s) => s.archiveMeeting)

  const [workType, setWorkType] = useState('capital_repair_roof')
  const [contractor, setContractor] = useState('ООО «СтройСервис», ИНН 7707083893')
  const [costStr, setCostStr] = useState('3 000 000')
  const [startDate, setStartDate] = useState('2026-09-01')
  const [endDate, setEndDate] = useState('2026-10-30')
  const [contract, setContract] = useState<FakeFile | null>(DEFAULT_CONTRACT)
  const [act, setAct] = useState<FakeFile | null>(DEFAULT_ACT)
  const [extras, setExtras] = useState<FakeFile[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)

  const contractorRef = useRef<HTMLInputElement>(null)
  const costRef = useRef<HTMLInputElement>(null)
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const contractAnchorRef = useRef<HTMLDivElement>(null)
  const actAnchorRef = useRef<HTMLDivElement>(null)

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!contractor.trim()) next.contractor = 'Поле обязательно для заполнения'
    const cost = parseRubInput(costStr)
    if (!costStr.trim()) next.cost = 'Укажите стоимость работ'
    else if (cost === null) next.cost = 'Укажите сумму в рублях, например 3 000 000 ₽'
    if (!startDate) next.startDate = 'Поле обязательно для заполнения'
    if (!endDate) next.endDate = 'Поле обязательно для заполнения'
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      next.endDate = 'Дата окончания не может быть раньше даты начала'
    }
    if (!contract) next.contract = 'Загрузите договор подряда'
    if (!act) next.act = 'Загрузите акт выполненных работ'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      // Scroll to first error
      const order = ['contractor', 'cost', 'startDate', 'endDate', 'contract', 'act']
      const first = order.find((k) => next[k])
      const refMap: Record<string, React.RefObject<HTMLElement | null>> = {
        contractor: contractorRef,
        cost: costRef,
        startDate: startRef,
        endDate: endRef,
        contract: contractAnchorRef,
        act: actAnchorRef,
      }
      if (first && refMap[first]?.current) {
        refMap[first].current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }
    return true
  }

  function handleSubmitClick() {
    if (validate()) setConfirmOpen(true)
  }

  function handleConfirm() {
    publishWorkInfo({
      workType,
      contractor,
      cost: parseRubInput(costStr) ?? 0,
      startDate,
      endDate,
    })
    archiveMeeting()
    setConfirmOpen(false)
    navigate('/')
  }

  const publishedDate = meeting.voting.publishedAt
    ? formatDate(meeting.voting.publishedAt)
    : '—'

  return (
    <div className="space-y-6">
      {/* H2 + lead */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Размещение информации
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Заполните сведения о проведённых работах. После размещения эти данные станут
          доступны в открытой части ГИС ЖКХ.
        </p>
      </div>

      {/* Card — title + link to protocol */}
      <Card className="p-6 space-y-2 border border-gray-100">
        <div className="text-base font-semibold text-gray-900">
          Информация о проведённом капитальном ремонте
        </div>
        <div className="text-xs text-gray-500">
          Заполните сведения о проведённых работах и приложите подтверждающие документы.
        </div>
        <button
          type="button"
          onClick={() => showComingSoon()}
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline mt-1"
          style={{ color: 'var(--color-accent-600)' }}
        >
          <FileText className="w-4 h-4" />
          Протокол № 1 от {publishedDate} г.
        </button>
      </Card>

      {/* InfoBlock — terms + КоАП 13.19.2 */}
      <InfoBlock>
        <p className="leading-relaxed">
          Срок размещения информации — 7 рабочих дней с момента подписания договора подряда
          или акта выполненных работ.
        </p>
        <p className="leading-relaxed mt-2">
          За неразмещение или несвоевременное размещение — административный штраф для
          должностных лиц 5–10 тыс. ₽ по ст. 13.19.2 КоАП РФ. При повторном нарушении —
          дисквалификация до 3 лет.
        </p>
        <div className="mt-2">
          <InfoPopover>
            <div className="font-semibold mb-1">Размещение информации о выполненных работах</div>
            <p className="text-xs leading-relaxed">
              Эта обязанность не связана с собранием напрямую — это требование к раскрытию
              информации в ГИС ЖКХ, установленное 209-ФЗ «О ГИС ЖКХ» и приказом № 74/114/пр.
            </p>
            <p className="text-xs leading-relaxed mt-2">
              Сведения о договоре, исполнителе, стоимости и факте выполнения работ должны
              быть размещены в течение 7 рабочих дней с момента возникновения сведений —
              например, после подписания договора или акта.
            </p>
            <p className="text-xs leading-relaxed mt-2 text-gray-500">
              Контроль и штрафы — задача государственной жилищной инспекции (ГЖИ).
            </p>
          </InfoPopover>
        </div>
      </InfoBlock>

      {/* Form */}
      <Card className="p-6 space-y-5 border border-gray-100">
        <FormField
          label="вид работ"
          required
          helper="Категория из принятых решений собрания."
        >
          <Select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            options={[{ value: 'capital_repair_roof', label: 'Капитальный ремонт кровли' }]}
          />
        </FormField>

        <FormField
          label="исполнитель"
          required
          helper="Полное наименование подрядчика и ИНН — как в договоре."
          error={errors.contractor}
        >
          <TextInput
            ref={contractorRef}
            value={contractor}
            onChange={(e) => setContractor(e.target.value)}
            error={!!errors.contractor}
          />
        </FormField>

        <FormField
          label="стоимость работ"
          required
          helper="Итоговая стоимость работ по договору, в рублях."
          error={errors.cost}
        >
          <div className="relative">
            <TextInput
              ref={costRef}
              value={costStr}
              onChange={(e) => setCostStr(e.target.value)}
              onBlur={() => {
                const n = parseRubInput(costStr)
                if (n !== null) setCostStr(formatRub(n))
              }}
              error={!!errors.cost}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              ₽
            </span>
          </div>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="дата начала работ"
            required
            helper="Фактические или плановые даты по договору."
            error={errors.startDate}
          >
            <TextInput
              ref={startRef}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={!!errors.startDate}
            />
          </FormField>
          <FormField
            label="дата окончания работ"
            required
            helper="Фактические или плановые даты по договору."
            error={errors.endDate}
          >
            <TextInput
              ref={endRef}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={!!errors.endDate}
            />
          </FormField>
        </div>

        {/* Documents section */}
        <div className="pt-2 border-t border-gray-100 space-y-4">
          <div className="text-sm font-medium text-gray-700">Документы</div>

          <div className="space-y-2" ref={contractAnchorRef}>
            <div className="text-sm lowercase text-gray-700">
              договор подряда <span className="text-rose-600">*</span>
            </div>
            {contract ? (
              <FileCard
                name={contract.name}
                sizeBytes={contract.sizeBytes}
                onRemove={() => setContract(null)}
              />
            ) : (
              <FileUploadArea
                onFiles={(files) =>
                  setContract({ name: files[0].name, sizeBytes: files[0].size || 1024 * 100 })
                }
                error={!!errors.contract}
                accept="application/pdf"
              />
            )}
            {errors.contract && (
              <div className="text-xs text-rose-700">{errors.contract}</div>
            )}
          </div>

          <div className="space-y-2" ref={actAnchorRef}>
            <div className="text-sm lowercase text-gray-700">
              акт выполненных работ <span className="text-rose-600">*</span>
            </div>
            {act ? (
              <FileCard
                name={act.name}
                sizeBytes={act.sizeBytes}
                onRemove={() => setAct(null)}
              />
            ) : (
              <FileUploadArea
                onFiles={(files) =>
                  setAct({ name: files[0].name, sizeBytes: files[0].size || 1024 * 100 })
                }
                error={!!errors.act}
                accept="application/pdf"
              />
            )}
            {errors.act && <div className="text-xs text-rose-700">{errors.act}</div>}
          </div>

          <div className="space-y-2">
            <div className="text-sm lowercase text-gray-700">прочие документы (опционально)</div>
            <FileUploadArea
              multiple
              onFiles={(files) => {
                const newOnes: FakeFile[] = Array.from(files).map((f) => ({
                  name: f.name,
                  sizeBytes: f.size || 1024 * 50,
                }))
                setExtras((prev) => [...prev, ...newOnes])
              }}
            />
            {extras.length > 0 && (
              <div className="space-y-2">
                {extras.map((f, idx) => (
                  <FileCard
                    key={`${f.name}-${idx}`}
                    name={f.name}
                    sizeBytes={f.sizeBytes}
                    onRemove={() => setExtras((prev) => prev.filter((_, i) => i !== idx))}
                  />
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500">
              Например: разрешительная документация, фотоотчёт, сертификаты материалов.
            </div>
          </div>
        </div>
      </Card>

      {/* CTA + microcopy */}
      <div className="flex flex-col items-end gap-2">
        <Button variant="primary" onClick={handleSubmitClick}>
          Разместить информацию
        </Button>
        <div className="text-xs text-gray-500 text-right">
          После размещения сведения станут доступны в открытой части ГИС ЖКХ.
        </div>
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Разместить информацию о работах?"
        confirmLabel="Разместить"
        cancelLabel="Отмена"
      >
        <p>
          Сведения о выполненных работах будут опубликованы в открытой части ГИС ЖКХ.
          После размещения они станут видны жителям дома и контролирующим органам.
        </p>
        <p className="mt-2">
          Если в данных есть ошибка — отредактируйте перед размещением. После публикации
          изменить можно только через отдельный запрос в ГЖИ.
        </p>
      </ConfirmModal>
    </div>
  )
}
