export default function Sidebar({ currentPage, onPageChange }) {
  const menuSections = [
    {
      title: 'ACCOUNTS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'my-accounts', label: 'My Accounts', icon: '💳' },
        { id: 'sources', label: 'Money Sources', icon: '📥' },
        { id: 'sinks', label: 'Money Sinks', icon: '📤' },
        { id: 'categories', label: 'Categories', icon: '🏷️' },
      ],
    },
    {
      title: 'TRANSACTIONS',
      items: [
        { id: 'transfers', label: 'Transfers', icon: '💸' },
        { id: 'new-transfer', label: 'New Transfer', icon: '➕' },
        { id: 'reclaimable', label: 'Reclaimable', icon: '🔄' },
        { id: 'recovery', label: 'Recovery', icon: '✅' },
      ],
    },
    {
      title: 'REPORTS',
      items: [
        { id: 'overview', label: 'Overview', icon: '📈' },
        { id: 'spending', label: 'Spending', icon: '💰' },
        { id: 'income', label: 'Income', icon: '💵' },
        { id: 'history', label: 'History', icon: '📜' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'settings-accounts', label: 'Accounts', icon: '💳' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'security', label: 'Security', icon: '🔐' },
        { id: 'api-keys', label: 'API Keys', icon: '🔑' },
      ],
    },
  ]

  return (
    <nav style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoBox}>M</div>
        <span style={styles.logoText}>Midas</span>
      </div>

      {menuSections.map((section) => (
        <div key={section.title} style={styles.section}>
          <div style={styles.sectionTitle}>{section.title}</div>
          {section.items.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.menuItem,
                ...(currentPage === item.id ? styles.menuItemActive : {}),
              }}
              onClick={() => onPageChange(item.id)}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span style={styles.label}>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  )
}

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    padding: '16px',
    overflow: 'hidden',
    overflowY: 'auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    padding: '0 8px',
  },
  logoBox: {
    width: '36px',
    height: '36px',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '18px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a365d',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '8px 0',
    marginBottom: '8px',
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#1f2937',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    borderLeft: '3px solid transparent',
  },
  menuItemActive: {
    backgroundColor: '#f0f4ff',
    borderLeftColor: '#3b82f6',
    color: '#3b82f6',
    fontWeight: '500',
  },
  icon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  label: {
    flex: 1,
  },
}
