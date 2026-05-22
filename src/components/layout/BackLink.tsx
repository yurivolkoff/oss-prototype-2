import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface BackLinkProps {
  to?: string
  label?: string
}

export default function BackLink({ to, label = 'Назад' }: BackLinkProps) {
  const navigate = useNavigate()
  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
      style={{ color: 'var(--color-accent-600)' }}
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
