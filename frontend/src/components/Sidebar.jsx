import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavSection from './NavSection'
import NavItem from './NavItem'
import './Sidebar.css'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navigationSections = [
    {
      title: 'ACCOUNTS',
      items: [
        { label: 'Dashboard', path: '/', icon: '📊' },
        { label: 'My Accounts', path: '/accounts', icon: '💳' },
        { label: 'Money Sources', path: '/sources', icon: '📥' },
        { label: 'Money Sinks', path: '/sinks', icon: '📤' },
        { label: 'Categories', path: '/categories', icon: '🏷️' },
      ]
    },
    {
      title: 'TRANSACTIONS',
      items: [
        { label: 'Transfers', path: '/transfers', icon: '💸' },
        { label: 'New Transfer', path: '/transfers/new', icon: '➕' },
        { label: 'Reclaimable', path: '/reclaimable', icon: '🔄' },
        { label: 'Recovery', path: '/recovery', icon: '✅' },
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Overview', path: '/reports', icon: '📈' },
        { label: 'Spending', path: '/reports/spending', icon: '💰' },
        { label: 'Income', path: '/reports/income', icon: '💵' },
        { label: 'History', path: '/reports/history', icon: '📜' },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Preferences', path: '/settings', icon: '⚙️' },
        { label: 'Security', path: '/settings/security', icon: '🔐' },
        { label: 'API Keys', path: '/settings/api', icon: '🔑' },
        { label: 'Logout', path: '/logout', icon: '🚪' },
      ]
    }
  ]

  return (
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {navigationSections.map((section) => (
            <NavSection key={section.title} title={section.title}>
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  label={item.label}
                  path={item.path}
                  icon={item.icon}
                  isActive={location.pathname === item.path}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </NavSection>
          ))}
        </nav>
      </aside>
    </>
  )
}
