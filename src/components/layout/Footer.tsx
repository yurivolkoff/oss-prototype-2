import { toast } from 'sonner'

const links = ['Об операторе ГИС ЖКХ', 'Техническая поддержка', 'Вернуться на старый сайт', 'Пройти онлайн-опрос']
const partnerLogos = [
  { src: '/oss-prototype-2/logos/partner-minstroy.svg', alt: 'Минстрой России' },
  { src: '/oss-prototype-2/logos/partner-mincifry.svg', alt: 'Минцифры России' },
  { src: '/oss-prototype-2/logos/partner-gosuslugi.png', alt: 'Госуслуги' },
  { src: '/oss-prototype-2/logos/partner-ois.svg', alt: 'ОИС' },
]

export default function Footer() {
  const notReady = () => toast('Доступно в продакшене')

  return (
    <footer className="bg-white border-t border-gray-100 mt-8">
      <div className="max-w-[768px] mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-6">
          <ul className="space-y-2 text-sm">
            {links.map((label) => (
              <li key={label}>
                <button
                  onClick={notReady}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-end gap-4">
            {partnerLogos.map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-6" />
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
          © 2026 Государственная информационная система ЖКХ
        </div>
      </div>
    </footer>
  )
}
