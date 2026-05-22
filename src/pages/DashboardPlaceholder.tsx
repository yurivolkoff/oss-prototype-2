import { Link } from 'react-router-dom'

export default function DashboardPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-2xl bg-white shadow-sm p-8 max-w-md text-center">
        <h1
          className="text-2xl font-semibold mb-3"
          style={{ color: 'var(--color-accent-700)' }}
        >
          ОСС — прототип администратора
        </h1>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary, #4A5568)' }}>
          Phase 1: foundation готов. Модули добавляются в Phase 2.
        </p>
        <Link
          to="/foundation-demo"
          className="inline-block px-4 py-2 rounded-lg text-white"
          style={{ background: 'var(--color-accent-600)' }}
        >
          Открыть foundation demo →
        </Link>
      </div>
    </div>
  )
}
