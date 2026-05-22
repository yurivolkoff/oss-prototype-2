import type { PremiseIssue } from '../../types/meeting'
import Select from '../form/Select'
import { cn } from '../../lib/cn'

export interface PremiseFilterState {
  type: 'all' | 'apartment' | 'non_residential'
  floor: 'all' | string
  entrance: 'all' | string
  issues: PremiseIssue[]
}

export const defaultFilterState: PremiseFilterState = {
  type: 'all',
  floor: 'all',
  entrance: 'all',
  issues: [],
}

interface PremiseFiltersProps {
  state: PremiseFilterState
  onChange: (state: PremiseFilterState) => void
  floorOptions?: string[]
  entranceOptions?: string[]
}

const ISSUE_CHIPS: { value: PremiseIssue; label: string }[] = [
  { value: 'no_cadastral', label: 'кадастровый номер' },
  { value: 'wrong_area', label: 'площадь помещения' },
  { value: 'duplicate', label: 'дубль' },
]

export default function PremiseFilters({
  state,
  onChange,
  floorOptions = ['1', '2', '3', '4', '5', '6'],
  entranceOptions = ['1', '2', '3', '4', '5', '6'],
}: PremiseFiltersProps) {
  function toggleIssue(issue: PremiseIssue) {
    const next = state.issues.includes(issue)
      ? state.issues.filter((i) => i !== issue)
      : [...state.issues, issue]
    onChange({ ...state, issues: next })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Тип помещения</div>
          <Select
            value={state.type}
            onChange={(e) => onChange({ ...state, type: e.target.value as PremiseFilterState['type'] })}
            options={[
              { value: 'all', label: 'все' },
              { value: 'apartment', label: 'жилые' },
              { value: 'non_residential', label: 'нежилые' },
            ]}
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Этаж</div>
          <Select
            value={state.floor}
            onChange={(e) => onChange({ ...state, floor: e.target.value })}
            options={[
              { value: 'all', label: 'все' },
              ...floorOptions.map((f) => ({ value: f, label: f })),
            ]}
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Подъезд</div>
          <Select
            value={state.entrance}
            onChange={(e) => onChange({ ...state, entrance: e.target.value })}
            options={[
              { value: 'all', label: 'все' },
              ...entranceOptions.map((e) => ({ value: e, label: e })),
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">Проблема с данными:</span>
        {ISSUE_CHIPS.map((chip) => {
          const active = state.issues.includes(chip.value)
          return (
            <button
              key={chip.value}
              type="button"
              data-testid={`chip-${chip.value}`}
              onClick={() => toggleIssue(chip.value)}
              className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                active
                  ? 'bg-[var(--color-accent-600)] border-[var(--color-accent-600)] text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
              )}
            >
              {chip.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function applyFilters<T extends { type: string; floor: number; entrance: number; issues: PremiseIssue[] }>(
  list: T[],
  filters: PremiseFilterState,
): T[] {
  return list.filter((p) => {
    if (filters.type !== 'all' && p.type !== filters.type) return false
    if (filters.floor !== 'all' && String(p.floor) !== filters.floor) return false
    if (filters.entrance !== 'all' && String(p.entrance) !== filters.entrance) return false
    if (filters.issues.length > 0) {
      const matches = filters.issues.some((i) => p.issues.includes(i))
      if (!matches) return false
    }
    return true
  })
}
