import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import HouseInfoCard from '../components/meeting/HouseInfoCard'
import PreparationAccordion from '../components/meeting/PreparationAccordion'
import ConductAccordion from '../components/meeting/ConductAccordion'
import HistoryTable from '../components/meeting/HistoryTable'
import { useMeetingStore } from '../store/meetingStore'
import { showComingSoon } from '../components/toast/toastHelpers'

export default function Dashboard() {
  const navigate = useNavigate()
  const startMeeting = useMeetingStore((s) => s.startMeeting)
  const meeting = useMeetingStore((s) => s.meeting)

  function handleStart() {
    startMeeting()
    // The new meeting id will be set synchronously inside the store action.
    // We compute the next id via the store snapshot.
    const id = useMeetingStore.getState().meeting.id
    navigate(`/oss/${id}`)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero card */}
        <Card variant="accent" className="p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-2xl font-semibold leading-tight mb-3">
                Общее собрание собственников
              </h1>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                Запустите электронное собрание собственников вашего дома — проведите
                голосование по решениям, важным для вашего МКД. Уведомления автоматически
                придут собственникам через Госуслуги.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="!bg-white !border-white !text-[var(--color-accent-700)] hover:!bg-white/90"
                  onClick={handleStart}
                >
                  Начать собрание
                </Button>
                <Button
                  variant="ghost"
                  className="!text-white hover:!bg-white/10"
                  onClick={() => showComingSoon()}
                >
                  Подробнее о собрании
                </Button>
              </div>
            </div>
            <div className="hidden md:block flex-shrink-0 w-24 h-24 rounded-2xl bg-white/15" aria-hidden />
          </div>
        </Card>

        <HouseInfoCard
          totalArea={meeting.house.totalArea}
          apartmentsCount={meeting.house.apartmentsCount}
          nonResidentialCount={meeting.house.nonResidentialCount}
          floorsCount={meeting.house.floorsCount}
        />

        <PreparationAccordion />
        <ConductAccordion />
        <HistoryTable />
      </div>
    </AppLayout>
  )
}
