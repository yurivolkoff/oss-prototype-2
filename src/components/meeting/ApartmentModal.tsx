import { useEffect, useMemo, useState } from 'react'
import Modal from '../modal/Modal'
import Button from '../ui/Button'
import FormField from '../form/FormField'
import TextInput from '../form/TextInput'
import Textarea from '../form/Textarea'
import { Clock, Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Premise, PremiseOwner } from '../../types/meeting'

interface ApartmentModalProps {
  premise: Premise | null
  isOpen: boolean
  onClose: () => void
}

// For demo apartment №15, override owner 1 with text-diff values.
function getOwners(premise: Premise): PremiseOwner[] {
  if (premise.number === '15') {
    const overridden: PremiseOwner = {
      fullName: 'Иванов Сергей Александрович',
      email: 'ivanov.s@example.ru',
      phone: '+7 921 111-22-33',
      ownedArea: 26.15,
      ownershipShare: '1/2',
      ownershipDocNumber: '78-78-001/001/2020-1234',
      state: 'verified',
    }
    const second: PremiseOwner = {
      fullName: 'Иванова Мария Петровна',
      email: 'ivanova.m@example.ru',
      phone: '+7 921 222-33-44',
      ownedArea: 26.15,
      ownershipShare: '1/2',
      ownershipDocNumber: '78-78-001/002/2020-1235',
      state: 'pending',
    }
    return premise.owners.length > 1
      ? [overridden, second]
      : [overridden, second]
  }
  return premise.owners
}

interface OwnerFormState {
  fullName: string
  email: string
  phone: string
  ownedArea: string
  ownershipShare: string
  ownershipDocNumber: string
}

interface OwnerErrors {
  fullName?: string
  email?: string
  phone?: string
  ownershipShare?: string
}

function ownerToFormState(o: PremiseOwner): OwnerFormState {
  return {
    fullName: o.fullName,
    email: o.email,
    phone: o.phone,
    ownedArea: String(o.ownedArea),
    ownershipShare: o.ownershipShare,
    ownershipDocNumber: o.ownershipDocNumber,
  }
}

export default function ApartmentModal({ premise, isOpen, onClose }: ApartmentModalProps) {
  const owners = useMemo<PremiseOwner[]>(() => (premise ? getOwners(premise) : []), [premise])
  const [activeTab, setActiveTab] = useState(0)
  const [ownerFormStates, setOwnerFormStates] = useState<OwnerFormState[]>([])
  const [ownerErrors, setOwnerErrors] = useState<OwnerErrors[]>([])
  const [comment, setComment] = useState('')

  // Reset state on premise change
  useEffect(() => {
    if (premise) {
      setActiveTab(0)
      setOwnerFormStates(owners.map(ownerToFormState))
      setOwnerErrors(owners.map(() => ({})))
      setComment('')
    }
  }, [premise, owners])

  if (!premise) return null

  const activeForm = ownerFormStates[activeTab]
  const activeErrors = ownerErrors[activeTab] ?? {}

  function updateActiveForm(patch: Partial<OwnerFormState>) {
    setOwnerFormStates((prev) =>
      prev.map((s, i) => (i === activeTab ? { ...s, ...patch } : s)),
    )
  }

  function validateField(field: keyof OwnerErrors, value: string) {
    let err: string | undefined
    switch (field) {
      case 'fullName':
        if (!value.trim()) err = 'Поле обязательно для заполнения'
        break
      case 'email':
        if (value && !/.+@.+\..+/.test(value))
          err = 'Укажите email в формате name@example.com'
        break
      case 'phone':
        if (value && !/^\+?\d[\d \-()]+$/.test(value))
          err = 'Укажите телефон в формате +7 XXX XXX-XX-XX'
        break
      case 'ownershipShare':
        if (value && !/^\d+\/\d+$|^\d+$/.test(value))
          err = 'Укажите долю в формате 1/2 или 1'
        break
    }
    setOwnerErrors((prev) =>
      prev.map((s, i) => (i === activeTab ? { ...s, [field]: err } : s)),
    )
  }

  const hasCadastralError = !premise.cadastralLinked
  const hasAreaError = premise.status === 'warning' || premise.number === '15'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div>
          <div>Квартира №{premise.number}</div>
          <div className="text-xs font-normal text-gray-500 mt-0.5">
            Подъезд {premise.entrance}, этаж {premise.floor}
          </div>
        </div>
      }
      footer={
        <Button onClick={onClose}>Сохранить</Button>
      }
    >
      <div className="space-y-6">
        {/* 2-col: КН + Площадь */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="кадастровый номер"
            error={hasCadastralError ? '❌ Нет кадастрового номера' : undefined}
          >
            <TextInput
              defaultValue={
                hasCadastralError ? '' : `78:23:0000000:${1000 + Number(premise.number) || 1234}`
              }
              placeholder="78:XX:XXXXXXX:XXXX"
              error={hasCadastralError}
            />
          </FormField>
          <FormField
            label="площадь помещения, м²"
            error={hasAreaError ? '❌ Проверьте площадь квартиры' : undefined}
          >
            <TextInput
              defaultValue={String(premise.area)}
              error={hasAreaError}
            />
          </FormField>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200">
          {owners.map((o, i) => {
            const isActive = i === activeTab
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-[var(--color-accent-600)] text-[var(--color-accent-700)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                <span>Собственник {i + 1}</span>
                {o.state === 'verified' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            )
          })}
        </div>

        {/* Owner fields */}
        {activeForm && (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ф.И.О." required error={activeErrors.fullName} className="col-span-2">
              <TextInput
                value={activeForm.fullName}
                onChange={(e) => updateActiveForm({ fullName: e.target.value })}
                onBlur={(e) => validateField('fullName', e.target.value)}
                error={!!activeErrors.fullName}
              />
            </FormField>
            <FormField label="Email" error={activeErrors.email}>
              <TextInput
                value={activeForm.email}
                onChange={(e) => updateActiveForm({ email: e.target.value })}
                onBlur={(e) => validateField('email', e.target.value)}
                error={!!activeErrors.email}
              />
            </FormField>
            <FormField label="Телефон" error={activeErrors.phone}>
              <TextInput
                value={activeForm.phone}
                onChange={(e) => updateActiveForm({ phone: e.target.value })}
                onBlur={(e) => validateField('phone', e.target.value)}
                error={!!activeErrors.phone}
              />
            </FormField>
            <FormField label="Площадь в собственности, м²">
              <TextInput
                value={activeForm.ownedArea}
                onChange={(e) => updateActiveForm({ ownedArea: e.target.value })}
              />
            </FormField>
            <FormField label="Доля в праве" error={activeErrors.ownershipShare}>
              <TextInput
                value={activeForm.ownershipShare}
                onChange={(e) => updateActiveForm({ ownershipShare: e.target.value })}
                onBlur={(e) => validateField('ownershipShare', e.target.value)}
                error={!!activeErrors.ownershipShare}
                placeholder="например, 1/2"
              />
            </FormField>
            <FormField label="Номер права собственности" className="col-span-2">
              <TextInput
                value={activeForm.ownershipDocNumber}
                onChange={(e) => updateActiveForm({ ownershipDocNumber: e.target.value })}
              />
            </FormField>
          </div>
        )}

        {/* Comment */}
        <FormField label="Комментарий">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={3000}
            showCounter
            placeholder="Например: уточнить данные у собственника после ремонта квартиры — площадь могла измениться."
          />
        </FormField>
      </div>
    </Modal>
  )
}
