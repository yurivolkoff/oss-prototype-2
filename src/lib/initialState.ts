import type { Meeting } from '../types/meeting'

export function createInitialMeeting(): Meeting {
  return {
    id: 'demo-meeting-1',
    state: 'none',
    subState: null,
    isFirstInSystem: true,

    house: {
      address: 'г. Санкт-Петербург, ул. Пушкина, д. 1',
      cadastralNumber: '78:23:0000000:1234',
      addressCode: '78000-00-00-001-000-001',
      totalArea: 4419.7,
      apartmentsCount: 120,
      nonResidentialCount: 5,
      floorsCount: 6,
      dataUpdatedAt: '2022-04-09',
      cadastralLinkedCount: 116,
      duplicatesCount: 98,
    },

    premises: [],

    administrator: {
      organizationName: 'ООО «Уют и комфорт»',
      email: 'info@uyut.example',
      phone: '+7 812 123-45-67',
      inn: '7801234567',
    },

    agenda: [],

    voting: {
      durationDays: 60,
      publishedAt: null,
      startsAt: null,
      endsAt: null,
      form: 'electronic_remote',
      paperReceiptPlace: 'г. Санкт-Петербург, ул. Пушкина, д. 1, офис ООО «Уют и комфорт»',
      introductionText: '',
      introductionVideo: null,
      materials: [],
    },

    voteResults: {
      totalVotesAvailable: 4419.7,
      votesCast: 0,
      quorumReached: false,
      paperBallots: [],
      perQuestion: {},
      protocolUrl: null,
    },

    workInfo: {
      workType: null,
      contractor: null,
      cost: null,
      startDate: null,
      endDate: null,
      contract: null,
      act: null,
      additionalDocs: [],
    },
  }
}
