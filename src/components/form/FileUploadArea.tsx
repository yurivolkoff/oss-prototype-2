import { useRef, type ChangeEvent, type DragEvent } from 'react'
import { Paperclip } from 'lucide-react'
import { cn } from '../../lib/cn'

interface FileUploadAreaProps {
  label?: string
  accept?: string
  multiple?: boolean
  onFiles: (files: FileList) => void
  error?: boolean
}

export default function FileUploadArea({
  label = 'Выбрать файл',
  accept,
  multiple,
  onFiles,
  error,
}: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files)
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
        error ? 'border-rose-400 bg-rose-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50',
      )}
    >
      <Paperclip className="w-6 h-6 mx-auto text-gray-400 mb-2" />
      <button
        type="button"
        className="text-sm font-medium hover:underline"
        style={{ color: 'var(--color-accent-600)' }}
      >
        {label} 📎
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </div>
  )
}
