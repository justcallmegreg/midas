import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Transfers from './pages/Transfers'
import SettingsAccounts from './pages/SettingsAccounts'
import SettingsSourcesSinks from './pages/SettingsSourcesSinks'
import NotFound from './pages/NotFound'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const pageMap = {
    dashboard: { component: Dashboard, title: 'Dashboard' },
    'my-accounts': { component: Dashboard, title: 'My Accounts' },
    sources: { component: NotFound, title: 'Money Sources' },
    sinks: { component: NotFound, title: 'Money Sinks' },
    categories: { component: NotFound, title: 'Categories' },
    transfers: { component: Transfers, title: 'Transfers' },
    'new-transfer': { component: NotFound, title: 'New Transfer' },
    reclaimable: { component: NotFound, title: 'Reclaimable Transfers' },
    recovery: { component: NotFound, title: 'Recovery Transfers' },
    overview: { component: NotFound, title: 'Overview' },
    spending: { component: NotFound, title: 'Spending' },
    income: { component: NotFound, title: 'Income' },
    history: { component: NotFound, title: 'History' },
    'settings-accounts': { component: SettingsAccounts, title: 'Account Settings' },
    'settings-sources-sinks': { component: SettingsSourcesSinks, title: 'Sources & Sinks' },
    preferences: { component: NotFound, title: 'Preferences' },
    security: { component: NotFound, title: 'Security' },
    'api-keys': { component: NotFound, title: 'API Keys' },
  }

  const currentPageData = pageMap[currentPage] || pageMap.dashboard
  const PageComponent = currentPageData.component

  return (
    <div style={styles.app}>
      <Header title={currentPageData.title} />
      <div style={styles.layout}>
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div style={styles.contentWrapper}>
          <div style={styles.pageContent}>
            <PageComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  layout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  pageContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
}
