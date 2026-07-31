export default function Header({ title }) {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.userMenu}>
        <button style={styles.menuButton} title="Notifications">🔔</button>
        <button style={styles.menuButton} title="Settings">⚙️</button>
        <button style={styles.menuButton} title="Profile">👤</button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    height: '60px',
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  userMenu: {
    display: 'flex',
    gap: '16px',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'transform 0.2s',
  },
}
