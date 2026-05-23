import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useMeetingStore } from './store/meetingStore'
import { parseDemoState } from './lib/demoState'
import { hydrateDemoState } from './lib/hydrateDemoState'
import Dashboard from './pages/Dashboard'
import FoundationDemo from './pages/FoundationDemo'
import MeetingFlow from './pages/MeetingFlow'

import { useLocation } from 'react-router-dom'

function DemoStateHydrator() {
  const location = useLocation()
  useEffect(() => {
    const demoState = parseDemoState(location.search)
    if (demoState) {
      useMeetingStore.setState((s) => ({ meeting: hydrateDemoState(s.meeting, demoState) }))
    }
  }, [location.search])
  return null
}

function App() {
  return (
    <BrowserRouter basename="/oss-prototype-2">
      <DemoStateHydrator />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/foundation-demo" element={<FoundationDemo />} />
        <Route path="/oss/:meetingId" element={<MeetingFlow />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  )
}

export default App
