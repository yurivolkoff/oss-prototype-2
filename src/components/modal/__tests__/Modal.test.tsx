import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="X">
        body
      </Modal>,
    )
    expect(screen.queryByText('body')).not.toBeInTheDocument()
  })

  it('renders content when open', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test title">
        body content
      </Modal>,
    )
    expect(screen.getByText('Test title')).toBeInTheDocument()
    expect(screen.getByText('body content')).toBeInTheDocument()
  })

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="X">
        body
      </Modal>,
    )
    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape pressed', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="X">
        body
      </Modal>,
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close-X clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="X">
        body
      </Modal>,
    )
    fireEvent.click(screen.getByLabelText('Закрыть'))
    expect(onClose).toHaveBeenCalled()
  })
})
