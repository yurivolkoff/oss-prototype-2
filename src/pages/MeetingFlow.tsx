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

export default function MeetingFlow() {
  const meeting = useMeetingStore((s) => s.meeting)
  const setSubState = useMeetingStore((s) => s.setSubState)

  function stepperSteps(): { label: string; status: StepStatus }[] {
    const isAgendaPhase =
      meeting.subState === 'agenda_main' ||
      meeting.subState === 'agenda_wizard_type' ||
      meeting.subState === 'agenda_wizard_theme' ||
      meeting.subState === 'agenda_wizard_questions'

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
    let activeIdx = stateOrder[meeting.state] ?? 0

    // Promote stepper to step 2 when in agenda subState (step 1 marked completed)
    if (meeting.state === 'draft_preparation' && (isAgendaPhase || meeting.step1Completed)) {
      activeIdx = 1
    }

    return STEPPER_LABELS.map((label, i) => ({
      label,
      status: i < activeIdx ? 'completed' : i === activeIdx ? 'active' : 'pending',
    }))
  }

  function renderBody() {
    if (meeting.state === 'draft_preparation' && meeting.subState === 'preparation_house_overview') {
      return <PreparationOverview onContinue={() => setSubState('preparation_premises')} />
    }
    if (meeting.state === 'draft_preparation' && meeting.subState === 'preparation_premises') {
      return <PreparationPremises />
    }
    if (meeting.state === 'draft_preparation' && meeting.subState === 'agenda_main') {
      return <AgendaMain />
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
      return <NotificationForm />
    }
    if (meeting.subState === 'notification_preview') {
      return <NotificationPreview />
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
