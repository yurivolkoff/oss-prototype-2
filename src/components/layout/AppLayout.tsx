import type { ReactNode } from 'react'
import TopPromoBar from './TopPromoBar'
import AppHeader from './AppHeader'
import AddressBar from './AddressBar'
import Footer from './Footer'

interface AppLayoutProps {
  children: ReactNode
  /** If false, address bar (with house address) hidden. Default true. */
  showAddressBar?: boolean
}

export default function AppLayout({ children, showAddressBar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopPromoBar />
      <AppHeader />
      {showAddressBar && <AddressBar />}
      <main className="flex-1 max-w-[768px] w-full mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
