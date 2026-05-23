import { useEffect, useRef, useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import AgendaBlockCard from './AgendaBlockCard'
import IncompleteAgendaModal from './IncompleteAgendaModal'
import ReadOnlyBanner from './ReadOnlyBanner'
import { useMeetingStore } from '../../store/meetingStore'
import { createBlock1 } from '../../lib/demoData'
import { showComingSoon } from '../toast/toastHelpers'

interface AgendaMainProps {
  readOnly?: boolean
}

export default function AgendaMain({ readOnly = false }: AgendaMainProps = {}) {
  const meeting = useMeetingStore((s) => s.meeting)
  const addAgendaBlock = useMeetingStore((s) => s.addAgendaBlock)
  const setSubState = useMeetingStore((s) => s.setSubState)
  const setState = useMeetingStore((s) => s.setState)
  const [showIncompleteModal, setShowIncompleteModal] = useState(false)
  const block1AddedRef = useRef(false)

  // Auto-create block 1 on first enter (guarded against StrictMode double-invoke).
  // Skipped in read-only mode: history view should not mutate the store.
  useEffect(() => {
    if (readOnly) return
    if (block1AddedRef.current) return
    const exists = useMeetingStore.getState().meeting.agenda.some((b) => b.id === 'block-1')
    if (!exists) {
      addAgendaBlock(createBlock1())
    }
    block1AddedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasBlock2Plus = meeting.agenda.length >= 2
  const hasAlerts = meeting.agenda.some((b) => b.alerts.length > 0)

  function handleContinue() {
    if (hasAlerts) {
      setShowIncompleteModal(true)
      return
    }
    setState('draft_ready')
    setSubState('notification_form')
  }

  function handleAddBlock() {
    setSubState('agenda_wizard_type')
  }

  function handleEditBlock(blockId: string) {
    if (blockId === 'block-1') {
      showComingSoon('Редактирование блока 1 ограничено в этом MVP')
      return
    }
    setSubState('agenda_wizard_questions')
  }

  return (
    <div className="space-y-6">
      {readOnly && <ReadOnlyBanner />}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
            Повестка собрания
          </h1>
          <button
            type="button"
            onClick={() => showComingSoon()}
            className="mt-2 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-accent-600)' }}
          >
            Как формируется повестка &gt;
          </button>
        </div>
        {!readOnly && <Button onClick={handleAddBlock}>Добавить блок вопрос</Button>}
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {meeting.agenda.map((block, idx) => (
            <AgendaBlockCard
              key={block.id}
              block={block}
              defaultOpen={idx === meeting.agenda.length - 1}
              disableQuestionToggle={readOnly || block.id === 'block-1'}
              showEditLink={!readOnly}
              onEdit={readOnly ? undefined : () => handleEditBlock(block.id)}
            />
          ))}

          {!readOnly && (
            <div className="flex justify-center pt-4">
              {hasBlock2Plus ? (
                <Button onClick={handleContinue}>Продолжить</Button>
              ) : (
                <Button disabled>Сохранить</Button>
              )}
            </div>
          )}
        </div>
      </Card>

      <IncompleteAgendaModal
        isOpen={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
        onConfirm={() => {
          setShowIncompleteModal(false)
          setState('draft_ready')
          setSubState('notification_form')
        }}
      />
    </div>
  )
}
