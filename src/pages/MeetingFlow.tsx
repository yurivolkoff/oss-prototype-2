import { useMeetingStore } from '../store/meetingStore'

export default function MeetingFlow() {
  const meeting = useMeetingStore((s) => s.meeting)
  return (
    <div className="p-6">
      <p className="text-sm text-gray-600">MeetingFlow stub. state: <code>{meeting.state}</code>, subState: <code>{String(meeting.subState)}</code></p>
    </div>
  )
}
