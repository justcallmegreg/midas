# Midas Frontend - React Components Guide

This guide provides a complete component structure for building the Midas frontend in React.

## Component Architecture

```
App
├── Header (functional component)
│   ├── Logo
│   ├── Title
│   └── UserMenu
├── MainLayout (layout wrapper)
│   ├── Sidebar (functional component)
│   │   └── NavSection (functional component)
│   │       └── NavItem (functional component)
│   └── ContentWrapper (functional component)
│       └── PageContent (varies by route)
└── Footer (functional component)
```

## Core Components

### 1. Header Component

**File**: `src/components/Header.jsx`

```jsx
import React from 'react';

function Header({ currentUser }) {
  const handleLogout = () => {
    // Handle logout logic
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">M</div>
        <div className="header-title">Midas</div>
      </div>
      <div className="header-right">
        <button className="header-button" title="Notifications">
          🔔
        </button>
        <button className="header-button" title="Settings">
          ⚙️
        </button>
        <div className="user-menu">
          <button className="header-button" title="Profile">
            👤
          </button>
          {/* Dropdown menu for logout, settings, etc. */}
        </div>
      </div>
    </header>
  );
}

export default Header;
```

### 2. Sidebar Component

**File**: `src/components/Sidebar.jsx`

```jsx
import React, { useState } from 'react';
import NavSection from './NavSection';

function Sidebar() {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      title: 'Accounts',
      items: [
        { label: 'Dashboard', icon: '📊', href: '/', id: 'dashboard' },
        { label: 'My Accounts', icon: '💳', href: '/accounts', id: 'accounts' },
        { label: 'Money Sources', icon: '📥', href: '/sources', id: 'sources' },
        { label: 'Money Sinks', icon: '📤', href: '/sinks', id: 'sinks' },
        { label: 'Categories', icon: '🏷️', href: '/categories', id: 'categories' },
      ]
    },
    {
      title: 'Transactions',
      items: [
        { label: 'Transfers', icon: '💸', href: '/transfers', id: 'transfers' },
        { label: 'New Transfer', icon: '➕', href: '/transfers/new', id: 'new-transfer' },
        { label: 'Reclaimable', icon: '🔄', href: '/reclamable', id: 'reclamable' },
        { label: 'Recovery', icon: '✅', href: '/recovery', id: 'recovery' },
      ]
    },
    {
      title: 'Reports',
      items: [
        { label: 'Overview', icon: '📈', href: '/reports/overview', id: 'overview' },
        { label: 'Spending', icon: '💰', href: '/reports/spending', id: 'spending' },
        { label: 'Income', icon: '💵', href: '/reports/income', id: 'income' },
        { label: 'History', icon: '📜', href: '/reports/history', id: 'history' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { label: 'Preferences', icon: '⚙️', href: '/settings', id: 'settings' },
        { label: 'Security', icon: '🔐', href: '/settings/security', id: 'security' },
        { label: 'API Keys', icon: '🔑', href: '/settings/api', id: 'api' },
        { label: 'Logout', icon: '🚪', href: '/logout', id: 'logout' },
      ]
    },
  ];

  return (
    <aside className="sidebar">
      {sections.map((section, idx) => (
        <NavSection 
          key={idx}
          title={section.title}
          items={section.items}
          isLast={idx === sections.length - 1}
        />
      ))}
    </aside>
  );
}

export default Sidebar;
```

### 3. NavSection Component

**File**: `src/components/NavSection.jsx`

```jsx
import React from 'react';
import NavItem from './NavItem';

function NavSection({ title, items, isLast }) {
  return (
    <div className={`sidebar-section ${isLast ? 'sidebar-section-last' : ''}`}>
      <div className="sidebar-title">{title}</div>
      {items.map((item) => (
        <NavItem key={item.id} {...item} />
      ))}
    </div>
  );
}

export default NavSection;
```

### 4. NavItem Component

**File**: `src/components/NavItem.jsx`

```jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function NavItem({ label, icon, href, id }) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link 
      to={href}
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      data-testid={`nav-item-${id}`}
    >
      <span className="sidebar-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default NavItem;
```

### 5. Layout Component

**File**: `src/components/Layout.jsx`

```jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function Layout({ children, currentUser }) {
  return (
    <div id="app">
      <Header currentUser={currentUser} />
      <main>
        <Sidebar />
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
```

### 6. Footer Component

**File**: `src/components/Footer.jsx`

```jsx
import React, { useState, useEffect } from 'react';

function Footer() {
  const [apiStatus, setApiStatus] = useState('OK');

  useEffect(() => {
    // Check API status periodically
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health');
        setApiStatus(response.ok ? 'OK' : 'ERROR');
      } catch (err) {
        setApiStatus('ERROR');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-left">
        <span>&copy; 2024 Midas Financial Management</span>
        <span className="footer-version">Version 1.0.0</span>
      </div>
      <div className="footer-right">
        <span>
          <span className="status-indicator"></span>
          API Status: {apiStatus}
        </span>
        <a className="footer-link" href="/privacy">Privacy</a>
        <a className="footer-link" href="/terms">Terms</a>
        <a className="footer-link" href="/help">Help</a>
      </div>
    </footer>
  );
}

export default Footer;
```

## Page Components

### 7. TransfersList Page

**File**: `src/pages/TransfersList.jsx`

```jsx
import React, { useState, useEffect } from 'react';

function TransfersList() {
  const [transfers, setTransfers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransfers();
  }, [currentPage, filterType]);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/transfers?page=${currentPage}&type=${filterType}`
      );
      const data = await response.json();
      setTransfers(data.transfers);
    } catch (err) {
      console.error('Failed to fetch transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredTransfers = transfers.filter(t =>
    t.id.includes(searchTerm) || 
    t.from.includes(searchTerm) || 
    t.to.includes(searchTerm)
  );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="content-title">Transfers</div>
        <div className="content-actions">
          <button className="btn btn-secondary">📥 Filter</button>
          <button className="btn btn-secondary">📊 Export</button>
          <a href="/transfers/new" className="btn btn-primary">+ New Transfer</a>
        </div>
      </div>

      <div className="content-body">
        {/* Search and Filter */}
        <div className="card" style={{ padding: '12px 16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Types</option>
              <option value="reclamable">Reclamable</option>
              <option value="recovery">Recovery</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransfers.map((transfer) => (
                    <tr key={transfer.id}>
                      <td>{transfer.id}</td>
                      <td>{transfer.from}</td>
                      <td>{transfer.to}</td>
                      <td>{transfer.amount}</td>
                      <td>
                        <span style={getTypeStyle(transfer.type)}>
                          {transfer.type}
                        </span>
                      </td>
                      <td>{new Date(transfer.date).toLocaleDateString()}</td>
                      <td>
                        <span className="status-indicator"></span>
                        {transfer.status}
                      </td>
                      <td>
                        <a href={`/transfers/${transfer.id}`} style={{ color: 'var(--accent-color)' }}>
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <div className="pagination-info">
                  Showing {filteredTransfers.length} of {transfers.length} records
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>
                  <button className="pagination-btn active">
                    {currentPage}
                  </button>
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getTypeStyle(type) {
  const styles = {
    'Reclamable': { background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
    'Recovery': { background: '#d1fae5', color: '#059669', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
    'Standard': { background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
  };
  return styles[type] || styles['Standard'];
}

export default TransfersList;
```

## Routing Setup

**File**: `src/App.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TransfersList from './pages/TransfersList';
import NewTransfer from './pages/NewTransfer';
import Accounts from './pages/Accounts';
import MoneySourcesList from './pages/MoneySourcesList';
import MoneySinksList from './pages/MoneySinksList';
import CategoriesList from './pages/CategoriesList';
import ReportOverview from './pages/ReportOverview';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user session
    const initializeUser = async () => {
      try {
        // Fetch current user from API
        const response = await fetch('/api/user');
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Failed to initialize user:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="login-page">Login required</div>;
  }

  return (
    <Router>
      <Layout currentUser={currentUser}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/sources" element={<MoneySourcesList />} />
          <Route path="/sinks" element={<MoneySinksList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/transfers" element={<TransfersList />} />
          <Route path="/transfers/new" element={<NewTransfer />} />
          <Route path="/reports/overview" element={<ReportOverview />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
```

## Styling

**File**: `src/styles/globals.css`

Copy all CSS from the `layout-template.html` file and place it here. Then import in App.jsx:

```jsx
import './styles/globals.css';
```

## Package Dependencies

**File**: `package.json`

```json
{
  "name": "midas-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.55.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## State Management (Optional)

For larger apps, consider using Redux, Zustand, or Context API:

**File**: `src/context/AppContext.jsx`

```jsx
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{
      user, setUser,
      transfers, setTransfers,
      loading, setLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}
```

## Custom Hooks

**File**: `src/hooks/useTransfers.js`

```jsx
import { useState, useEffect } from 'react';

export function useTransfers(page = 1, filter = 'all') {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/transfers?page=${page}&filter=${filter}`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setTransfers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [page, filter]);

  return { transfers, loading, error };
}
```

## Development Workflow

1. Create components in `src/components/`
2. Create pages in `src/pages/`
3. Create hooks in `src/hooks/`
4. Create context in `src/context/`
5. Import and use in App.jsx routes
6. Style using CSS or CSS Modules

## Testing Example

**File**: `src/components/__tests__/Header.test.jsx`

```jsx
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  it('renders the Midas logo and title', () => {
    render(<Header currentUser={{ name: 'Test User' }} />);
    expect(screen.getByText('Midas')).toBeInTheDocument();
  });

  it('displays user menu buttons', () => {
    render(<Header currentUser={{ name: 'Test User' }} />);
    expect(screen.getByTitle('Notifications')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });
});
```

---

This structure provides a complete, modular, and scalable React frontend for the Midas application.
