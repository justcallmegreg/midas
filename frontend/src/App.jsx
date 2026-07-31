import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transfers from './pages/Transfers'
import Reclaimable from './pages/Reclaimable'
import Recovery from './pages/Recovery'
import Accounts from './pages/Accounts'
import './App.css'

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/reclaimable" element={<Reclaimable />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/accounts" element={<Accounts />} />
        </Routes>
      </Layout>
    </Router>
  )
}
