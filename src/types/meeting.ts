export type MeetingState =
  | 'none'
  | 'draft_preparation'
  | 'draft_ready'
  | 'preview_notification'
  | 'notification_published'
  | 'voting_active'
  | 'voting_completed'
  | 'work_info_required'
  | 'archived';

export type MeetingSubState =
  | null
  | 'preparation_house_overview'
  | 'preparation_premises'
  | 'agenda_main'
  | 'agenda_wizard_type'
  | 'agenda_wizard_theme'
  | 'agenda_wizard_questions'
  | 'notification_form'
  | 'notification_preview';

export type DemoState =
  | MeetingState
  | 'voting_active_low_quorum'
  | 'voting_completed_no_quorum';

export type AgendaCategory =
  | 'organization'
  | 'management'
  | 'utilities'
  | 'capital_repair'
  | 'common_property'
  | 'other';

export type VoteThreshold =
  | 'simple_majority_present'
  | 'two_thirds_total'
  | 'unanimous';

export type DocumentType = 'cost_estimate' | 'contract' | 'report' | 'other';

export type AgendaAlert =
  | 'no_questions_added'
  | 'missing_document'
  | 'needs_clarification';

export type PremiseIssue = 'no_cadastral' | 'wrong_area' | 'duplicate';

export interface PremiseOwner {
  fullName: string;
  email: string;
  phone: string;
  ownedArea: number;
  ownershipShare: string;
  ownershipDocNumber: string;
  state: 'verified' | 'pending';
}

export interface Premise {
  id: string;
  type: 'apartment' | 'non_residential';
  number: string;
  entrance: number;
  floor: number;
  area: number;
  cadastralLinked: boolean;
  status: 'ok' | 'warning' | 'error';
  issues: PremiseIssue[];
  owners: PremiseOwner[];
}

export interface AgendaQuestion {
  code: string;
  title: string;
  description: string;
  isRecommended: boolean;
  isMandatory: boolean;
  isChecked: boolean;
  requiresDocument: DocumentType | null;
  isCustom: boolean;
}

export interface AgendaBlock {
  id: string;
  number: number;
  type: AgendaCategory;
  themeCode: string | null;
  themeTitle: string;
  zhkRfReference: string;
  decisionThreshold: VoteThreshold;
  questions: AgendaQuestion[];
  params: Record<string, unknown>;
  alerts: AgendaAlert[];
}

export interface PaperBallot {
  premiseId: string;
  ownerFullName: string;
  ownerSnils: string;
  ownerPassport: string;
  ownershipDocNumber: string;
  ownershipShare: string;
  scanFile: File | null;
  votedAt: string;
  enteredAt: string;
  answers: Record<string, 'for' | 'against' | 'abstain'>;
  comment: string;
}

export interface QuestionResult {
  questionCode: string;
  forPercent: number;
  abstainPercent: number;
  againstPercent: number;
  threshold: VoteThreshold;
  decisionMade: boolean;
}

export interface Meeting {
  id: string;
  state: MeetingState;
  subState: MeetingSubState;
  isFirstInSystem: true;

  house: {
    address: string;
    cadastralNumber: string;
    addressCode: string;
    totalArea: number;
    apartmentsCount: number;
    nonResidentialCount: number;
    floorsCount: number;
    dataUpdatedAt: string;
    cadastralLinkedCount: number;
    duplicatesCount: number;
  };

  premises: Premise[];

  administrator: {
    organizationName: string;
    email: string;
    phone: string;
    inn: string;
  };

  agenda: AgendaBlock[];

  voting: {
    durationDays: number | null;
    publishedAt: string | null;
    startsAt: string | null;
    endsAt: string | null;
    form: 'electronic_remote';
    paperReceiptPlace: string;
    introductionText: string;
    introductionVideo: File | null;
    materials: File[];
  };

  voteResults: {
    totalVotesAvailable: number;
    votesCast: number;
    quorumReached: boolean;
    paperBallots: PaperBallot[];
    perQuestion: Record<string, QuestionResult>;
    protocolUrl: string | null;
  };

  workInfo: {
    workType: string | null;
    contractor: string | null;
    cost: number | null;
    startDate: string | null;
    endDate: string | null;
    contract: File | null;
    act: File | null;
    additionalDocs: File[];
  };
}
