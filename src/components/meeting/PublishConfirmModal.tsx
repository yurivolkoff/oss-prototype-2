import ConfirmModal from '../modal/ConfirmModal'
import { useMeetingStore } from '../../store/meetingStore'
import { formatDate } from '../../lib/format'

interface PublishConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function PublishConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: PublishConfirmModalProps) {
  const meeting = useMeetingStore((s) => s.meeting)
  const durationDays = meeting.voting.durationDays ?? 60

  const today = new Date()
  const startsAt = addDays(today, 10)
  const endsAt = addDays(startsAt, durationDays)

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Опубликовать уведомление?"
      confirmLabel="Опубликовать"
      cancelLabel="Отмена"
    >
      <p>
        Голосование начнётся <strong>{formatDate(startsAt)}</strong> и завершится{' '}
        <strong>{formatDate(endsAt)}</strong>.
      </p>
      <p className="mt-2">
        После публикации повестка и условия собрания не редактируются.
      </p>
      <p className="mt-2">
        Уведомление автоматически отправится собственникам через личный кабинет Госуслуг.
      </p>
    </ConfirmModal>
  )
}
