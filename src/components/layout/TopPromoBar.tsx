import { toast } from 'sonner'
import { MapPin, Eye } from 'lucide-react'

export default function TopPromoBar() {
  const notReady = () => toast('Доступно в продакшене')

  return (
    <div className="bg-white border-b border-gray-100 text-xs">
      <div className="max-w-[768px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">Санкт-Петербург</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={notReady}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <Eye className="w-4 h-4" />
            Версия для слабовидящих
          </button>
          <button onClick={notReady} className="text-gray-600 hover:text-gray-900">
            Поддержка
          </button>
          <button onClick={notReady} className="text-gray-600 hover:text-gray-900">
            Вернуться на старый сайт
          </button>
        </div>
      </div>
    </div>
  )
}
