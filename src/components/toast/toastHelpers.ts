import { toast } from 'sonner'

export function showComingSoon(label?: string) {
  toast(label ?? 'Доступно в продакшене')
}
