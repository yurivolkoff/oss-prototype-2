import { useState } from 'react'
import Modal from '../modal/Modal'
import Button from '../ui/Button'
import FormField from '../form/FormField'
import TextInput from '../form/TextInput'
import Textarea from '../form/Textarea'
import WarningBanner from '../ui/WarningBanner'
import type { AgendaQuestion } from '../../types/meeting'

interface CustomQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  /** Next code to assign to the new question, e.g. "2.7". */
  nextCode: string
  onAdd: (q: AgendaQuestion) => void
}

const BANNED_WORDS = ['разное', 'иное', 'прочее']

function validateTitle(t: string): string | null {
  const trimmed = t.trim()
  if (trimmed.length === 0) return 'Поле обязательно для заполнения'
  if (trimmed.length < 80)
    return `Краткая формулировка должна быть от 80 символов (сейчас ${trimmed.length})`
  if (trimmed.length > 200)
    return `Краткая формулировка должна быть до 200 символов (сейчас ${trimmed.length})`
  const lower = trimmed.toLowerCase()
  for (const w of BANNED_WORDS) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(lower)) {
      return 'Формулировки «разное», «иное», «прочее» запрещены ст. 45 ч. 5 ЖК РФ — переформулируйте конкретнее'
    }
  }
  return null
}

export default function CustomQuestionModal({
  isOpen,
  onClose,
  nextCode,
  onAdd,
}: CustomQuestionModalProps) {
  const [title, setTitle] = useState('')
  const [forText, setForText] = useState('')
  const [againstText, setAgainstText] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [forError, setForError] = useState<string | null>(null)

  function handleSubmit() {
    const tErr = validateTitle(title)
    const fErr = forText.trim().length === 0 ? 'Поле обязательно для заполнения' : null
    setTitleError(tErr)
    setForError(fErr)
    if (tErr || fErr) return

    const description = againstText.trim()
      ? `«За»: ${forText.trim()}\n\n«Против»: ${againstText.trim()}`
      : `«За»: ${forText.trim()}`

    onAdd({
      code: nextCode,
      title: title.trim(),
      description,
      isRecommended: false,
      isMandatory: false,
      isChecked: true,
      requiresDocument: null,
      isCustom: true,
    })

    setTitle('')
    setForText('')
    setAgainstText('')
    setTitleError(null)
    setForError(null)
    onClose()
  }

  function handleClose() {
    setTitleError(null)
    setForError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Свой вопрос для повестки"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} autoFocus>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Добавить в повестку
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Заполните шаблон формулировки. Это снизит риск оспаривания решения.
        </p>

        <FormField
          label="Краткая формулировка вопроса"
          required
          helper="80–200 символов, без слов «разное», «иное», «прочее»"
          error={titleError ?? undefined}
        >
          <TextInput
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (titleError) setTitleError(null)
            }}
            error={!!titleError}
            placeholder="например: Заключение договора со строительным контролем"
          />
        </FormField>

        <FormField
          label="Полная формулировка проекта решения «за»"
          required
          helper="что произойдёт, если большинство проголосует «за»; укажите предмет, объект, условия"
          error={forError ?? undefined}
        >
          <Textarea
            value={forText}
            onChange={(e) => {
              setForText(e.target.value)
              if (forError) setForError(null)
            }}
            error={!!forError}
            rows={4}
          />
        </FormField>

        <FormField
          label="Полная формулировка проекта решения «против»"
          helper="опционально, по умолчанию — «оставить текущий порядок без изменений»"
        >
          <Textarea
            value={againstText}
            onChange={(e) => setAgainstText(e.target.value)}
            rows={4}
          />
        </FormField>

        <WarningBanner title="Произвольные формулировки на ответственности администратора">
          Если вопрос подпадает под одну из категорий справочника — рекомендуем выбрать его оттуда.
          Это даст автоматическую проверку формальностей и снизит риск возврата протокола ГЖИ.
        </WarningBanner>
      </div>
    </Modal>
  )
}
