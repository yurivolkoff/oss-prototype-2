import BackLink from '../layout/BackLink'
import Card from '../ui/Card'
import Button from '../ui/Button'
import KeyValueRow from '../ui/KeyValueRow'
import InfoBlock from '../ui/InfoBlock'
import Accordion from '../ui/Accordion'
import Pill from '../ui/Pill'
import InfoPopover from '../popover/InfoPopover'
import ReadOnlyBanner from './ReadOnlyBanner'
import { Check, ExternalLink, Download } from 'lucide-react'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'

interface PreparationOverviewProps {
  onContinue: () => void
  readOnly?: boolean
}

function formatDate(iso: string): string {
  // 2022-04-09 → 09.04.2022
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export default function PreparationOverview({ onContinue, readOnly = false }: PreparationOverviewProps) {
  const house = useMeetingStore((s) => s.meeting.house)

  return (
    <div className="space-y-6">
      {readOnly && <ReadOnlyBanner />}
      <BackLink to="/" />

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Подготовка данных по дому 1/2
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
          Перед началом собрания проверьте, что данные о доме в ГИС ЖКХ актуальны. Если
          найдёте ошибку — отправьте обращение в Росреестр до публикации уведомления о
          собрании.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Общая информация о доме</h2>
          <div className="text-sm text-gray-600 mt-1">{house.address}</div>
        </div>

        {/* Status row: area matches */}
        <div className="flex items-center gap-3 py-2 border-y border-gray-100">
          <Pill tone="success">
            <Check className="w-3 h-3 mr-1" />
            ок
          </Pill>
          <span className="text-sm text-gray-800">Площадь помещений совпадает с реестром</span>
          <InfoPopover>
            <strong>Источник данных</strong>
            <div className="mt-1 text-xs text-gray-600 leading-relaxed">
              Площадь жилых и нежилых помещений в ГИС ЖКХ совпадает с данными Росреестра.
              Это важно для корректного расчёта голосов: каждый собственник голосует
              пропорционально своей доле от общей площади.
            </div>
          </InfoPopover>
        </div>

        {/* KV rows */}
        <div className="space-y-1">
          <KeyValueRow
            label="Площадь помещений дома по данным эл. паспорта"
            value={`${house.totalArea} м²`}
          />
          <KeyValueRow
            label="Площадь помещений дома по данным Росреестра"
            value={`${house.totalArea} м²`}
          />
          <div className="text-xs text-gray-400 mt-1">
            данные обновлены {formatDate(house.dataUpdatedAt)}
          </div>
        </div>

        {/* Code KV */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500 mb-1">Кадастровый номер дома</div>
            <div className="font-mono text-sm text-gray-800">{house.cadastralNumber}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500 mb-1">Идентификационный код адреса</div>
            <div className="font-mono text-sm text-gray-800">{house.addressCode}</div>
          </div>
        </div>

        {/* Documents accordion */}
        <Accordion title="Документы">
          <div className="divide-y divide-gray-100">
            <DocRow
              name="Технический паспорт МКД.pdf"
              date="12.05.2018"
              actionType="download"
            />
            <DocRow
              name="Постановление №1234.pdf"
              date="03.11.2020"
              actionType="link"
            />
          </div>
        </Accordion>
      </Card>

      <InfoBlock>
        <strong>Нашли ошибку?</strong>
        <div className="mt-1 text-xs">
          Площадь, кадастровый номер или адрес расходятся с реальностью? Это исправляет
          Росреестр на основании вашего обращения. После публикации повестки оспорить ошибку
          сложнее, поэтому проверьте данные сейчас.{' '}
          <button
            onClick={() => showComingSoon()}
            className="font-medium text-[var(--color-accent-700)] hover:text-[var(--color-accent-800)] underline"
          >
            Направить обращение в Росреестр
          </button>
        </div>
      </InfoBlock>

      {!readOnly && (
        <div className="flex justify-center pt-2">
          <Button onClick={onContinue}>Верно, далее</Button>
        </div>
      )}
    </div>
  )
}

function DocRow({
  name,
  date,
  actionType,
}: {
  name: string
  date: string
  actionType: 'download' | 'link'
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <div className="flex-1 min-w-0 truncate text-gray-800">{name}</div>
      <div className="text-gray-500 whitespace-nowrap">{date}</div>
      <button
        onClick={() => showComingSoon()}
        className="inline-flex items-center gap-1 text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)] text-xs font-medium"
      >
        {actionType === 'download' ? (
          <>
            <Download className="w-4 h-4" /> скачать
          </>
        ) : (
          <>
            <ExternalLink className="w-4 h-4" /> ссылка
          </>
        )}
      </button>
    </div>
  )
}
