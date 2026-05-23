import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { AgendaBlock } from '../../types/meeting'
import InfoPopover from '../popover/InfoPopover'
import AgendaQuestionRow from './AgendaQuestionRow'
import Button from '../ui/Button'
import Pill from '../ui/Pill'
import { cn } from '../../lib/cn'

interface AgendaBlockCardProps {
  block: AgendaBlock
  defaultOpen?: boolean
  /** Disable checkboxes for mandatory block 1 */
  disableQuestionToggle?: boolean
  /** Show «Редактировать блок» link under the card */
  showEditLink?: boolean
  onEdit?: () => void
  /** Alerts to render per-question (keyed by question code) */
  questionAlerts?: Record<string, { label: string; tone: 'error' | 'warning' }>
  onToggleQuestion?: (code: string) => void
  /** Render extra trailing slot (e.g., empty «Вопросы ∨» sub-accordion for block 1) */
  trailingSection?: ReactNode
}

function thresholdLabel(block: AgendaBlock): string {
  if (block.decisionThreshold === 'two_thirds_total') {
    return 'Кворум по вопросу — 2/3 от всех голосов в доме'
  }
  if (block.decisionThreshold === 'simple_majority_present') {
    return 'кворум — 50%'
  }
  return 'единогласно'
}

function ThresholdPopover({ block }: { block: AgendaBlock }) {
  if (block.decisionThreshold === 'two_thirds_total') {
    return (
      <InfoPopover>
        <strong>Кворум по вопросу — 2/3 от всех голосов в доме</strong>
        <div className="mt-2 text-xs text-gray-600 leading-relaxed">
          Для решений о капитальном ремонте требуется не менее 2/3 голосов от общего числа всех
          собственников в доме — не от участвующих в собрании.
          <br />
          <br />
          Если в доме 4419,7 м² общей площади, нужно набрать минимум 2946,5 м² голосов «за», чтобы
          решение было принято.
          <br />
          <br />
          Основание: ст. 46 ч. 1 п. 1 ЖК РФ.
        </div>
      </InfoPopover>
    )
  }
  return (
    <InfoPopover>
      <strong>Кворум собрания</strong>
      <div className="mt-2 text-xs text-gray-600 leading-relaxed">
        Общее собрание правомочно принимать решения, если в нём приняли участие собственники,
        обладающие более чем 50% от общего числа голосов всех собственников в доме.
        <br />
        <br />
        Голоса считаются пропорционально доле в праве собственности.
        <br />
        <br />
        Основание: ст. 45 ч. 3 ЖК РФ.
      </div>
    </InfoPopover>
  )
}

export default function AgendaBlockCard({
  block,
  defaultOpen = false,
  disableQuestionToggle,
  showEditLink,
  onEdit,
  questionAlerts,
  onToggleQuestion,
  trailingSection,
}: AgendaBlockCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Chevron = open ? ChevronUp : ChevronDown

  // Split into recommended vs extra
  const recommended = block.questions.filter((q) => q.isRecommended)
  const extra = block.questions.filter((q) => !q.isRecommended)
  const hasAlerts = block.alerts.length > 0 || (questionAlerts && Object.keys(questionAlerts).length > 0)

  return (
    <div className="space-y-3">
      <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-start gap-3 p-5 text-left hover:bg-gray-50"
        >
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: 'var(--color-accent-600)' }}
          >
            {block.number}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-semibold text-gray-900">{block.themeTitle}</span>
              <span className="text-xs text-gray-500">{block.zhkRfReference}</span>
              {hasAlerts && (
                <Pill tone="error">требует доработки</Pill>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">{thresholdLabel(block)}</span>
              <ThresholdPopover block={block} />
            </div>
          </div>
          <Chevron className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
        </button>

        {open && (
          <div className="px-5 pb-5 pt-1 border-t border-gray-100">
            {recommended.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Рекомендуемые вопросы
                </div>
                <div className="divide-y divide-gray-100">
                  {recommended.map((q) => {
                    const alert = questionAlerts?.[q.code]
                    return (
                      <AgendaQuestionRow
                        key={q.code}
                        code={q.code}
                        title={q.title}
                        description={q.description}
                        checked={q.isChecked}
                        disabled={disableQuestionToggle || q.isMandatory}
                        disabledTooltip="обязательно для первого собрания в Системе"
                        badge={
                          alert
                            ? { label: alert.label, tone: alert.tone }
                            : q.isCustom
                              ? { label: 'свой вопрос', tone: 'neutral' }
                              : undefined
                        }
                        onToggle={
                          q.isMandatory || disableQuestionToggle
                            ? undefined
                            : () => onToggleQuestion?.(q.code)
                        }
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {extra.length > 0 && (
              <div className={cn('mt-4', recommended.length > 0 && 'pt-4 border-t border-gray-100')}>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Вопросы</div>
                <div className="divide-y divide-gray-100">
                  {extra.map((q) => {
                    const alert = questionAlerts?.[q.code]
                    return (
                      <AgendaQuestionRow
                        key={q.code}
                        code={q.code || '—'}
                        title={q.title}
                        description={q.description}
                        checked={q.isChecked}
                        disabled={disableQuestionToggle}
                        badge={
                          alert
                            ? { label: alert.label, tone: alert.tone }
                            : q.isCustom
                              ? { label: 'свой вопрос', tone: 'neutral' }
                              : undefined
                        }
                        onToggle={
                          disableQuestionToggle ? undefined : () => onToggleQuestion?.(q.code)
                        }
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {trailingSection && <div className="mt-4">{trailingSection}</div>}
          </div>
        )}
      </div>

      {showEditLink && onEdit && (
        <div className="flex justify-end">
          <Button variant="ghost" size="medium" onClick={onEdit}>
            Редактировать блок
          </Button>
        </div>
      )}
    </div>
  )
}
