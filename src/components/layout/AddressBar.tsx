import { useMeetingStore } from '../../store/meetingStore'
import { toast } from 'sonner'

export default function AddressBar() {
  const address = useMeetingStore((s) => s.meeting.house.address)
  const notReady = () => toast('Доступно в продакшене')

  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-[768px] mx-auto px-4 py-3 flex items-center justify-between gap-4 text-sm">
        <span className="text-gray-800">{address}</span>
        <button
          onClick={notReady}
          className="font-medium hover:underline"
          style={{ color: 'var(--color-accent-600)' }}
        >
          Подробнее о доме →
        </button>
      </div>
    </div>
  )
}
