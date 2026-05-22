import { toast } from 'sonner'
import { Search, LogOut } from 'lucide-react'

export default function AppHeader() {
  const notReady = () => toast('Доступно в продакшене')

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-[768px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/oss-prototype-2/logos/gosuslugi-dom.svg"
            alt="госуслуги дом"
            className="h-10"
          />
          <div className="w-px h-8 bg-gray-200" />
          <img
            src="/oss-prototype-2/logos/gis-zhkh.svg"
            alt="ГИС ЖКХ"
            className="h-8"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={notReady}
            className="p-2 rounded-lg hover:bg-gray-50"
            aria-label="Поиск"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={notReady}
            className="text-sm font-medium text-gray-800 hover:text-gray-900"
          >
            Елизавета К.
          </button>
          <button
            onClick={notReady}
            className="p-2 rounded-lg hover:bg-gray-50"
            aria-label="Выйти"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}
