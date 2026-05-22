import { describe, it, expect, beforeEach } from 'vitest'
import { useMeetingStore } from '../meetingStore'

describe('meetingStore', () => {
  beforeEach(() => {
    useMeetingStore.getState().reset()
  })

  it('starts in state "none"', () => {
    expect(useMeetingStore.getState().meeting.state).toBe('none')
  })

  it('startMeeting() sets state to draft_preparation', () => {
    useMeetingStore.getState().startMeeting()
    expect(useMeetingStore.getState().meeting.state).toBe('draft_preparation')
  })

  it('setState() updates the state field', () => {
    useMeetingStore.getState().setState('voting_active')
    expect(useMeetingStore.getState().meeting.state).toBe('voting_active')
  })

  it('reset() returns to initial state', () => {
    useMeetingStore.getState().setState('archived')
    useMeetingStore.getState().reset()
    expect(useMeetingStore.getState().meeting.state).toBe('none')
  })
})
