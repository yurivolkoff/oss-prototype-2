import { Mail, Phone, ArrowRight, Check } from 'lucide-react'
import Accordion from '../ui/Accordion'
import Pill from '../ui/Pill'
import { useMeetingStore } from '../../store/meetingStore'
import { showComingSoon } from '../toast/toastHelpers'

export default function PreparationAccordion() {
  const admin = useMeetingStore((s) => s.meeting.administrator)
  const house = useMeetingStore((s) => s.meeting.house)

  return (
    <Accordion number={1} title="Подготовка к общему собранию" defaultOpen>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        Перед запуском собрания проверьте, готов ли дом к электронному голосованию.
        Запустить собрание может администратор — представитель УК, ТСЖ или собственник,
        получивший статус администратора.
      </p>

      {/* Sub-block: Administrator */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 mb-3">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Администратор электронного собрания
        </div>
        <div className="text-sm text-gray-800 font-medium">{admin.organizationName}</div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-700">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-gray-400" /> {admin.email}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-gray-400" /> {admin.phone}
          </span>
        </div>
        <button
          onClick={() => showComingSoon()}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)]"
        >
          Подробнее об администраторе ОСС <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-block: Data readiness */}
      <div className="rounded-xl border border-gray-200 p-4 mb-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-sm font-medium text-gray-900">Готовность данных по дому</div>
          <Pill tone="success">готово</Pill>
        </div>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Кадастровые номера связаны с помещениями</span>
            <span className="ml-auto text-gray-500">
              {house.cadastralLinkedCount} из {house.apartmentsCount}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Задублированные помещения</span>
            <span className="ml-auto text-gray-500">{house.duplicatesCount}</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Документы по дому загружены</span>
            <span className="ml-auto text-gray-500">2 из 2</span>
          </li>
        </ul>
      </div>

      {/* Sub-block: Digital potential */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-sm font-medium text-gray-900">Цифровой потенциал</div>
          <Pill tone="info">низкий</Pill>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <PotentialMetric
            value="274 из 350"
            label="собственников зарегистрированы в Госуслугах"
          />
          <PotentialMetric
            value="98 из 380"
            label="собственников установили мобильное приложение"
          />
          <PotentialMetric
            value="23 из 120"
            label="квартир настроили уведомления о собраниях"
          />
        </div>
      </div>
    </Accordion>
  )
}

function PotentialMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1 leading-snug">{label}</div>
      <button
        onClick={() => showComingSoon()}
        className="mt-2 text-xs font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)]"
      >
        Подробнее →
      </button>
    </div>
  )
}
