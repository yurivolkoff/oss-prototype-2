import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useMeetingStore } from './store/meetingStore'
import { parseDemoState } from './lib/demoState'
import { hydrateDemoState } from './lib/hydrateDemoState'
import Dashboard from './pages/Dashboard'
import FoundationDemo from './pages/FoundationDemo'
import MeetingFlow from './pages/MeetingFlow'

function App() {
  useEffect(() => {
    const demoState = parseDemoState(window.location.search)
    if (demoState) {
      useMeetingStore.setState((s) => ({ meeting: hydrateDemoState(s.meeting, demoState) }))
    }
  }, [])

  return (
    <BrowserRouter basename="/oss-prototype-2">
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
