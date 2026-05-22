import type { DemoState, Meeting, PaperBallot } from '../types/meeting'
import { createBlock1, createBlock2 } from './demoData'

function withMeetingBase(meeting: Meeting, agenda = [createBlock1(), createBlock2()]): Meeting {
  return {
    ...meeting,
    id: 'demo-meeting-hydrated',
    agenda,
  }
}

function withVoting(meeting: Meeting, percentCast: number, daysLeft: number, paperBallots: PaperBallot[] = []): Meeting {
  const endsAt = new Date(Date.now() + daysLeft * 86400000).toISOString()
  const startsAt = new Date(Date.now() - (60 - daysLeft) * 86400000).toISOString()
  const publishedAt = new Date(Date.now() - (60 - daysLeft + 10) * 86400000).toISOString()
  return {
    ...meeting,
    voting: {
      ...meeting.voting,
      durationDays: 60,
      publishedAt,
      startsAt,
      endsAt,
    },
    voteResults: {
      ...meeting.voteResults,
      votesCast: (percentCast / 100) * meeting.voteResults.totalVotesAvailable,
      paperBallots,
    },
  }
}

export function hydrateDemoState(meeting: Meeting, demoState: DemoState): Meeting {
  switch (demoState) {
    case 'none':
      return meeting
    case 'draft_preparation':
      return { ...meeting, state: 'draft_preparation', subState: 'preparation_house_overview' }
    case 'draft_ready':
      return { ...withMeetingBase(meeting), state: 'draft_ready', subState: 'notification_form' }
    case 'preview_notification':
      return { ...withMeetingBase(meeting), state: 'preview_notification', subState: 'notification_preview' }
    case 'notification_published':
      return { ...withMeetingBase(meeting), state: 'notification_published', subState: null }
    case 'voting_active':
      return withVoting(withMeetingBase(meeting), 21, 14)
    case 'voting_active_low_quorum':
      return withVoting(withMeetingBase(meeting), 24, 7)
    case 'voting_completed':
      return {
        ...withVoting(withMeetingBase(meeting), 74, 0),
        state: 'voting_completed',
        voteResults: {
          ...meeting.voteResults,
          votesCast: 0.74 * meeting.voteResults.totalVotesAvailable,
          quorumReached: true,
          paperBallots: [],
          perQuestion: Object.fromEntries(
            [createBlock1(), createBlock2()].flatMap((b) =>
              b.questions.map((q) => [
                q.code,
                {
                  questionCode: q.code,
                  forPercent: 74.15,
                  abstainPercent: 0,
                  againstPercent: 0,
                  threshold: b.decisionThreshold,
                  decisionMade: true,
                },
              ]),
            ),
          ),
          protocolUrl: 'data:application/pdf;base64,JVBERi0xLjQK', // placeholder PDF blob
        },
      }
    case 'voting_completed_no_quorum':
      return {
        ...withVoting(withMeetingBase(meeting), 41, 0),
        state: 'voting_completed',
        voteResults: {
          ...meeting.voteResults,
          votesCast: 0.41 * meeting.voteResults.totalVotesAvailable,
          quorumReached: false,
          paperBallots: [],
          perQuestion: {},
          protocolUrl: 'data:application/pdf;base64,JVBERi0xLjQK',
        },
      }
    case 'work_info_required':
      return { ...withMeetingBase(meeting), state: 'work_info_required', subState: null }
    case 'archived':
      return { ...withMeetingBase(meeting), state: 'archived', subState: null }
    default:
      return meeting
  }
}
