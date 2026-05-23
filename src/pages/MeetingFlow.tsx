import { useMeetingStore } from '../store/meetingStore'
import AppLayout from '../components/layout/AppLayout'
import Stepper, { STEPPER_LABELS, type StepStatus } from '../components/stepper/Stepper'
import PreparationOverview from '../components/meeting/PreparationOverview'
import PreparationPremises from '../components/meeting/PreparationPremises'
import AgendaMain from '../components/meeting/AgendaMain'
import AgendaWizardType from '../components/meeting/AgendaWizardType'
import AgendaWizardTheme from '../components/meeting/AgendaWizardTheme'
import AgendaWizardQuestions from '../components/meeting/AgendaWizardQuestions'
import NotificationForm from '../components/meeting/NotificationForm'
import NotificationPreview from '../components/meeting/NotificationPreview'
import VotingActive from '../components/meeting/VotingActive'
import VotingCompleted from '../components/meeting/VotingCompleted'
import WorkInfoForm from '../components/meeting/WorkInfoForm'
import type { Meeting, MeetingSubState } from '../types/meeting'

/**
 * Numeric "stage index" associated with each MeetingState.
 * Stage indices align with the 6-step Stepper (0..5).
 */
function stateStageIndex(state: Meeting['state']): number {
  const stateOrder: Record<string, number> = {
    none: -1,
    draft_preparation: 0,
    draft_ready: 2,
    preview_notification: 2,
    notification_published: 3,
    voting_active: 3,
    voting_completed: 4,
    work_info_required: 5,
    archived: 5,
  }
  return stateOrder[state] ?? 0
}

/**
 * Read-only is in effect for a given stage when the meeting has progressed past it.
 * Used by stages 1-4 (PreparationOverview, PreparationPremises, AgendaMain, NotificationForm)
 * so that landing on those screens via Stepper click or deep URL shows historical, non-editable data.
 *
 * Spec: 05-completion.md § Read-only режим шагов 1–4 после завершения.
 */
export function isReadOnlyForStage(stage: number, meeting: Meeting): boolean {
  return stateStageIndex(meeting.state) > stage
}

export default function MeetingFlow() {
  const meeting = useMeetingStore((s) => s.meeting)
  const setSubState = useMeetingStore((s) => s.setSubState)

  // Mapping from stepper step index → subState to navigate to in read-only mode
  const stepToSubState: Record<number, MeetingSubState> = {
    0: 'preparation_house_overview',
    1: 'agenda_main',
    2: 'notification_form',
  }

  function navigateToStep(stepIdx: number) {
    const target = stepToSubState[stepIdx]
    if (!target) return
    setSubState(target)
  }

  function stepperSteps(): { label: string; status: StepStatus; onClick?: () => void }[] {
    const isAgendaPhase =
      meeting.subState === 'agenda_main' ||
      meeting.subState === 'agenda_wizard_type' ||
      meeting.subState === 'agenda_wizard_theme' ||
      meeting.subState === 'agenda_wizard_questions'

    let activeIdx = stateStageIndex(meeting.state)

    // Promote stepper to step 2 when in agenda subState (step 1 marked completed)
    if (meeting.state === 'draft_preparation' && (isAgendaPhase || meeting.step1Completed)) {
      activeIdx = 1
    }

    return STEPPER_LABELS.map((label, i) => {
      const status: StepStatus = i < activeIdx ? 'completed' : i === activeIdx ? 'active' : 'pending'
      // Completed steps that map to a sub-state are clickable (read-only navigation).
      const onClick =
        status === 'completed' && stepToSubState[i] !== undefined
          ? () => navigateToStep(i)
          : undefined
      return { label, status, onClick }
    })
  }

  function renderBody() {
    const ro0 = isReadOnlyForStage(0, meeting)
    const ro1 = isReadOnlyForStage(1, meeting)
    const ro2 = isReadOnlyForStage(2, meeting)

    if (meeting.subState === 'preparation_house_overview') {
      return (
        <PreparationOverview
          onContinue={() => setSubState('preparation_premises')}
          readOnly={ro0}
        />
      )
    }
    if (meeting.subState === 'preparation_premises') {
      return <PreparationPremises readOnly={ro0} />
    }
    if (meeting.subState === 'agenda_main') {
      return <AgendaMain readOnly={ro1} />
    }
    if (meeting.state === 'draft_preparation' && meeting.subState === 'agenda_wizard_type') {
      return <AgendaWizardType />
    }
    if (meeting.state === 'draft_preparation' && meeting.subState === 'agenda_wizard_theme') {
      return <AgendaWizardTheme />
    }
    if (meeting.state === 'draft_preparation' && meeting.subState === 'agenda_wizard_questions') {
      return <AgendaWizardQuestions />
    }
    if (meeting.subState === 'notification_form') {
      return <NotificationForm readOnly={ro2} />
    }
    if (meeting.subState === 'notification_preview') {
      return <NotificationPreview />
    }
    if (meeting.state === 'voting_active') {
      return <VotingActive />
    }
    if (meeting.state === 'voting_completed') {
      return <VotingCompleted />
    }
    if (meeting.state === 'work_info_required') {
      return <WorkInfoForm />
    }
    return (
      <PlaceholderForFutureTask
        name={`state=${meeting.state} subState=${String(meeting.subState)} (модуль не реализован)`}
      />
    )
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Stepper steps={stepperSteps()} />
      </div>
      {renderBody()}
    </AppLayout>
  )
}

function PlaceholderForFutureTask({ name }: { name: string }) {
  return (
    <div className="text-sm text-gray-500 p-6 rounded-xl bg-gray-50 border border-gray-100">
      Screen {name} — будет реализован в следующем модуле.
    </div>
  )
}
