import { create } from 'zustand'
import type { Meeting, MeetingState, MeetingSubState, AgendaBlock } from '../types/meeting'
import { createInitialMeeting } from '../lib/initialState'

interface MeetingStore {
  meeting: Meeting
  // state
  startMeeting: () => void
  setState: (state: MeetingState) => void
  setSubState: (subState: MeetingSubState) => void
  reset: () => void
  // agenda
  addAgendaBlock: (block: AgendaBlock) => void
  updateAgendaBlock: (id: string, update: Partial<AgendaBlock>) => void
  removeAgendaBlock: (id: string) => void
  // notification
  publishNotification: (durationDays: number) => void
  // voting (used by demo-state hydration + paper ballot entry)
  registerPaperBallot: (ballot: import('../types/meeting').PaperBallot) => void
  // completion
  publishWorkInfo: (info: Partial<Meeting['workInfo']>) => void
  archiveMeeting: () => void
}

function addDays(dateIso: string, days: number): string {
  const d = new Date(dateIso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  meeting: createInitialMeeting(),

  startMeeting: () =>
    set((store) => ({
      meeting: {
        ...store.meeting,
        id: `demo-meeting-${Date.now()}`,
        state: 'draft_preparation',
        subState: 'preparation_house_overview',
      },
    })),

  setState: (state) =>
    set((store) => ({ meeting: { ...store.meeting, state } })),

  setSubState: (subState) =>
    set((store) => ({ meeting: { ...store.meeting, subState } })),

  reset: () => set({ meeting: createInitialMeeting() }),

  addAgendaBlock: (block) =>
    set((store) => ({ meeting: { ...store.meeting, agenda: [...store.meeting.agenda, block] } })),

  updateAgendaBlock: (id, update) =>
    set((store) => ({
      meeting: {
        ...store.meeting,
        agenda: store.meeting.agenda.map((b) => (b.id === id ? { ...b, ...update } : b)),
      },
    })),

  removeAgendaBlock: (id) =>
    set((store) => ({
      meeting: { ...store.meeting, agenda: store.meeting.agenda.filter((b) => b.id !== id) },
    })),

  publishNotification: (durationDays) =>
    set((store) => {
      const publishedAt = new Date().toISOString()
      const startsAt = addDays(publishedAt, 10)
      const endsAt = addDays(startsAt, durationDays)
      return {
        meeting: {
          ...store.meeting,
          state: 'notification_published',
          subState: null,
          voting: {
            ...store.meeting.voting,
            durationDays,
            publishedAt,
            startsAt,
            endsAt,
          },
        },
      }
    }),

  registerPaperBallot: (ballot) =>
    set((store) => ({
      meeting: {
        ...store.meeting,
        voteResults: {
          ...store.meeting.voteResults,
          paperBallots: [...store.meeting.voteResults.paperBallots, ballot],
        },
      },
    })),

  publishWorkInfo: (info) =>
    set((store) => ({
      meeting: { ...store.meeting, workInfo: { ...store.meeting.workInfo, ...info } },
    })),

  archiveMeeting: () =>
    set((store) => ({
      meeting: { ...store.meeting, state: 'archived', subState: null },
    })),
}))
