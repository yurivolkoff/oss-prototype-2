import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import DashboardPlaceholder from './pages/DashboardPlaceholder'
import FoundationDemo from './pages/FoundationDemo'

function App() {
  return (
    <BrowserRouter basename="/oss-prototype-2">
      <Routes>
        <Route path="/" element={<DashboardPlaceholder />} />
        <Route path="/foundation-demo" element={<FoundationDemo />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  )
}

export default App
