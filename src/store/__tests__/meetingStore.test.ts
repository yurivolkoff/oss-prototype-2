import { describe, it, expect, beforeEach } from 'vitest'
import { useMeetingStore } from '../meetingStore'
import { createBlock1 } from '../../lib/demoData'

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

describe('meetingStore — agenda actions', () => {
  beforeEach(() => {
    useMeetingStore.getState().reset()
  })

  it('addAgendaBlock appends a block', () => {
    const block = createBlock1()
    useMeetingStore.getState().addAgendaBlock(block)
    expect(useMeetingStore.getState().meeting.agenda).toHaveLength(1)
    expect(useMeetingStore.getState().meeting.agenda[0].id).toBe('block-1')
  })

  it('updateAgendaBlock modifies by id', () => {
    const block = createBlock1()
    useMeetingStore.getState().addAgendaBlock(block)
    useMeetingStore.getState().updateAgendaBlock('block-1', { themeTitle: 'Updated' })
    expect(useMeetingStore.getState().meeting.agenda[0].themeTitle).toBe('Updated')
  })

  it('removeAgendaBlock filters by id', () => {
    useMeetingStore.getState().addAgendaBlock(createBlock1())
    useMeetingStore.getState().removeAgendaBlock('block-1')
    expect(useMeetingStore.getState().meeting.agenda).toHaveLength(0)
  })

  it('setSubState updates subState', () => {
    useMeetingStore.getState().setSubState('agenda_main')
    expect(useMeetingStore.getState().meeting.subState).toBe('agenda_main')
  })
})

describe('meetingStore — voting actions', () => {
  beforeEach(() => useMeetingStore.getState().reset())

  it('publishNotification sets dates and notification_published state', () => {
    useMeetingStore.getState().publishNotification(60)
    const m = useMeetingStore.getState().meeting
    expect(m.state).toBe('notification_published')
    expect(m.voting.durationDays).toBe(60)
    expect(m.voting.publishedAt).toBeTruthy()
    expect(m.voting.startsAt).toBeTruthy()
    expect(m.voting.endsAt).toBeTruthy()
  })
})
