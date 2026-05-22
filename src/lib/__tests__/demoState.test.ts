import { describe, it, expect } from 'vitest'
import { parseDemoState } from '../demoState'

describe('parseDemoState', () => {
  it('returns null for missing param', () => {
    expect(parseDemoState('')).toBeNull()
    expect(parseDemoState('?')).toBeNull()
    expect(parseDemoState('?other=value')).toBeNull()
  })

  it('returns null for unsupported values', () => {
    expect(parseDemoState('?demo-state=invalid')).toBeNull()
  })

  it('parses base MeetingState values', () => {
    expect(parseDemoState('?demo-state=none')).toBe('none')
    expect(parseDemoState('?demo-state=voting_active')).toBe('voting_active')
    expect(parseDemoState('?demo-state=archived')).toBe('archived')
  })

  it('parses demo variants', () => {
    expect(parseDemoState('?demo-state=voting_active_low_quorum')).toBe(
      'voting_active_low_quorum',
    )
    expect(parseDemoState('?demo-state=voting_completed_no_quorum')).toBe(
      'voting_completed_no_quorum',
    )
  })
})
