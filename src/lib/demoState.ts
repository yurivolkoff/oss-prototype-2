import type { DemoState } from '../types/meeting'

const VALID: ReadonlyArray<DemoState> = [
  'none',
  'draft_preparation',
  'draft_ready',
  'preview_notification',
  'notification_published',
  'voting_active',
  'voting_completed',
  'work_info_required',
  'archived',
  'voting_active_low_quorum',
  'voting_completed_no_quorum',
]

export function parseDemoState(search: string): DemoState | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const value = params.get('demo-state')
  if (!value) return null
  return (VALID as ReadonlyArray<string>).includes(value) ? (value as DemoState) : null
}
