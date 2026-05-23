import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import type { AgendaBlock, Meeting } from '../../types/meeting'
import Pill from '../ui/Pill'
import { showComingSoon } from '../toast/toastHelpers'
import { cn } from '../../lib/cn'

interface ResultBlockProps {
  block: AgendaBlock
  meeting: Meeting
  /** Force all-questions-failed look (no_quorum variant) */
  forceNotPassed?: boolean
  defaultOpen?: boolean
}

function VoteIndicator({
  tone,
  label,
  percent,
  totalAvail,
}: {
  tone: 'for' | 'abstain' | 'against'
  label: string
  percent: number
  totalAvail: number
}) {
  const dotClass =
    tone === 'for'
      ? 'bg-emerald-500'
      : tone === 'abstain'
        ? 'bg-amber-400'
        : 'bg-rose-500'

  const absoluteM2 = ((percent / 100) * totalAvail).toFixed(2)
  const totalM2 = totalAvail.toFixed(1)
  const tooltip = `${label}: ${absoluteM2} м² из ${totalM2} м² общей площади = ${percent.toFixed(2)}% от всех голосов в доме`

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-gray-700"
      title={tooltip}
    >
      <span className={cn('w-2.5 h-2.5 rounded-full inline-block', dotClass)} />
      {label} — {percent.toFixed(2)}%
    </span>
  )
}

function QuestionRow({
  code,
  title,
  description,
  forPercent,
  abstainPercent,
  againstPercent,
  decisionMade,
  totalAvail,
}: {
  code: string
  title: string
  description: string
  forPercent: number
  abstainPercent: number
  againstPercent: number
  decisionMade: boolean
  totalAvail: number
}) {
  const [expanded, setExpanded] = useState(false)
  const Chev = expanded ? ChevronUp : ChevronDown

  return (
    <div className="py-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900">{code}</span>
            <span className="text-sm text-gray-900">{title}</span>
          </div>
          {expanded && description && (
            <div className="mt-2 text-xs text-gray-600 leading-relaxed">{description}</div>
          )}
          <div className="mt-2 flex items-center gap-4 flex-wrap">
            <VoteIndicator tone="for" label="за" percent={forPercent} totalAvail={totalAvail} />
            <VoteIndicator
              tone="abstain"
              label="воздержался"
              percent={abstainPercent}
              totalAvail={totalAvail}
            />
            <VoteIndicator
              tone="against"
              label="против"
              percent={againstPercent}
              totalAvail={totalAvail}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {decisionMade ? (
            <Pill tone="success">решение принято</Pill>
          ) : (
            <Pill tone="error">решение не принято</Pill>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Свернуть описание' : 'Развернуть описание'}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Chev className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ResultBlock({
  block,
  meeting,
  forceNotPassed = false,
  defaultOpen = false,
}: ResultBlockProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Chev = open ? ChevronUp : ChevronDown

  const totalAvail = meeting.voteResults.totalVotesAvailable || 1
  const questions = block.questions.filter((q) => q.isChecked)

  const allPassed =
    !forceNotPassed &&
    questions.length > 0 &&
    questions.every(
      (q) => meeting.voteResults.perQuestion[q.code]?.decisionMade === true,
    )

  // Demo file chips — show only when block has materials (in our demo block 2 has cost_estimate)
  const docs: { name: string; size: string }[] = []
  if (block.type === 'capital_repair') {
    docs.push({ name: 'Смета.pdf', size: '1.2 МБ' })
  }

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50"
        aria-expanded={open}
      >
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
          style={{ background: 'var(--color-accent-600)' }}
        >
          {block.number}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-gray-900">{block.themeTitle}</div>
          <div className="text-xs text-gray-500 mt-0.5">{block.zhkRfReference}</div>
        </div>
        {allPassed ? (
          <Pill tone="success">решение принято</Pill>
        ) : (
          <Pill tone="error">решение не принято</Pill>
        )}
        <Chev className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100">
          {forceNotPassed ? (
            <div className="py-3 text-sm text-gray-600">
              Решения по вопросам блока не приняты — собрание не состоялось.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {questions.map((q) => {
                const result = meeting.voteResults.perQuestion[q.code]
                return (
                  <QuestionRow
                    key={q.code}
                    code={q.code}
                    title={q.title}
                    description={q.description}
                    forPercent={result?.forPercent ?? 0}
                    abstainPercent={result?.abstainPercent ?? 0}
                    againstPercent={result?.againstPercent ?? 0}
                    decisionMade={result?.decisionMade ?? false}
                    totalAvail={totalAvail}
                  />
                )
              })}
            </div>
          )}

          {docs.length > 0 && !forceNotPassed && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Документы</div>
              <div className="flex items-center gap-2 flex-wrap">
                {docs.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => showComingSoon()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs text-gray-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    {d.name}
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{d.size}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => showComingSoon()}
                  className="text-xs font-medium hover:underline ml-2"
                  style={{ color: 'var(--color-accent-600)' }}
                >
                  скачать всё ⬇
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
