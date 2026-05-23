import { Printer } from 'lucide-react'
import InfoPopover from '../popover/InfoPopover'
import { showComingSoon } from '../toast/toastHelpers'

interface VotingProgressBarProps {
  percent: number // 0..100
}

export default function VotingProgressBar({ percent }: VotingProgressBarProps) {
  const safe = Math.max(0, Math.min(100, percent))
  const rounded = Math.round(safe)

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold text-gray-900">
        Проголосовало {rounded}% от общего числа голосов
      </div>

      {/* Bar */}
      <div className="relative">
        <div
          className="h-3 w-full rounded-full overflow-hidden"
          style={{
            background:
              'linear-gradient(90deg, rgba(229,231,235,1) 0%, rgba(229,231,235,1) 100%)',
          }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${safe}%`,
              background:
                'linear-gradient(90deg, var(--color-accent-500), var(--color-accent-600))',
            }}
            data-testid="voting-progress-fill"
          />
        </div>

        {/* Thresholds */}
        {[
          { pct: 50, label: 'Кворум собрания', popover: <QuorumMeetingPopover /> },
          { pct: 67, label: 'Кворум 2/3 (капремонт)', popover: <QuorumTwoThirdsPopover /> },
          { pct: 100, label: 'Всеобщее', popover: null },
        ].map((t) => (
          <div
            key={t.pct}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${t.pct}%` }}
          >
            <div className="w-0.5 h-5 bg-gray-500 -mt-1" aria-hidden />
            <div className="mt-1 text-xs text-gray-600 whitespace-nowrap flex items-center gap-1">
              <span className="font-medium">{t.pct}%</span>
              <span className="hidden md:inline">— {t.label}</span>
              {t.popover && <InfoPopover>{t.popover}</InfoPopover>}
            </div>
          </div>
        ))}
      </div>

      {/* Spacing for threshold labels (they're absolute) */}
      <div className="h-8" aria-hidden />

      {/* Print + helper */}
      <div className="flex items-start gap-4 pt-4">
        <button
          type="button"
          onClick={() => showComingSoon()}
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline whitespace-nowrap"
          style={{ color: 'var(--color-accent-600)' }}
        >
          <Printer className="w-4 h-4" />
          Распечатать бюллетени
        </button>
        <p className="text-xs text-gray-600 leading-relaxed flex-1">
          Если собственнику удобнее голосовать на бумаге — распечатайте бланк и передайте лично
          или через ящик. Принятый бумажный бюллетень администратор регистрирует в системе
          вручную.
        </p>
      </div>
    </div>
  )
}

function QuorumMeetingPopover() {
  return (
    <div>
      <div className="font-semibold mb-1">Кворум собрания</div>
      <p className="text-xs leading-relaxed">
        Общее собрание правомочно принимать решения, если проголосовали собственники, обладающие
        более чем 50% от общего числа голосов всех собственников в доме.
      </p>
      <p className="text-xs leading-relaxed mt-2">
        Без кворума собрание считается несостоявшимся, а его решения — недействительными.
      </p>
      <p className="text-xs leading-relaxed mt-2 text-gray-500">Основание: ст. 45 ч. 3 ЖК РФ.</p>
    </div>
  )
}

function QuorumTwoThirdsPopover() {
  return (
    <div>
      <div className="font-semibold mb-1">Кворум по вопросу — 2/3 от всех голосов в доме</div>
      <p className="text-xs leading-relaxed">
        Для решений по капитальному ремонту требуется не менее 2/3 голосов от общего числа всех
        собственников в доме — не от участвующих в собрании.
      </p>
      <p className="text-xs leading-relaxed mt-2">
        Если в доме 4419,7 м² общей площади, нужно набрать минимум 2946,5 м² голосов «за», чтобы
        решение было принято.
      </p>
      <p className="text-xs leading-relaxed mt-2 text-gray-500">Основание: ст. 46 ч. 1 п. 1 ЖК РФ.</p>
    </div>
  )
}
