import Modal from '../modal/Modal'
import Button from '../ui/Button'
import { useMeetingStore } from '../../store/meetingStore'
import type { AgendaAlert, AgendaBlock } from '../../types/meeting'

interface IncompleteAgendaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const ALERT_LABEL: Record<AgendaAlert, string> = {
  no_questions_added: 'в блок не добавлены вопросы',
  missing_document: 'не загружен обязательный документ',
  needs_clarification: 'нужны уточнения параметров',
}

function describeAlert(block: AgendaBlock, alert: AgendaAlert): string {
  const blockLabel = `Блок ${block.number} «${block.themeTitle}»`
  switch (alert) {
    case 'missing_document':
      return `${blockLabel}, вопрос 2.3: не загружена смета.`
    case 'needs_clarification':
      return `${blockLabel}, вопрос 2.4: не указан состав комиссии от собственников.`
    case 'no_questions_added':
      return `${blockLabel}: ${ALERT_LABEL.no_questions_added}.`
    default:
      return `${blockLabel}: ${ALERT_LABEL[alert]}.`
  }
}

export default function IncompleteAgendaModal({
  isOpen,
  onClose,
  onConfirm,
}: IncompleteAgendaModalProps) {
  const agenda = useMeetingStore((s) => s.meeting.agenda)
  const issues: string[] = []
  for (const block of agenda) {
    for (const alert of block.alerts) {
      issues.push(describeAlert(block, alert))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Повестка содержит вопросы, которые требуют доработки"
      disableOverlayClose
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} autoFocus>
            Вернуться и исправить
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Продолжить с предупреждениями
          </Button>
        </>
      }
    >
      <div className="text-sm text-gray-700 leading-relaxed space-y-3">
        {issues.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p>В повестке есть незавершённые блоки.</p>
        )}
        <p className="text-gray-600 text-xs leading-relaxed">
          При публикации с этими проблемами решения могут быть оспорены в суде по ст. 181.4 ГК РФ
          (нечёткие формулировки) и ст. 46 ч. 3 ЖК РФ (отсутствие приложений).
        </p>
      </div>
    </Modal>
  )
}
