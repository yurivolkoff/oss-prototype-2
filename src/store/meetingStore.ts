import { create } from 'zustand'
import type { Meeting, MeetingState } from '../types/meeting'
import { createInitialMeeting } from '../lib/initialState'

interface MeetingStore {
  meeting: Meeting
  startMeeting: () => void
  setState: (state: MeetingState) => void
  reset: () => void
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  meeting: createInitialMeeting(),

  startMeeting: () =>
    set((store) => ({
      meeting: {
        ...store.meeting,
        id: `demo-meeting-${Date.now()}`,
        state: 'draft_preparation',
      },
    })),

  setState: (state) =>
    set((store) => ({ meeting: { ...store.meeting, state } })),

  reset: () => set({ meeting: createInitialMeeting() }),
}))
