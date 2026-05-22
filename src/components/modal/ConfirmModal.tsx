import type { ReactNode } from 'react'
import Modal from './Modal'
import Button from '../ui/Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: ReactNode
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      disableOverlayClose
      footer={
        <>
          <Button variant="secondary" onClick={onClose} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </Modal>
  )
}
