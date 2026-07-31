export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.left}>
        <span>© 2024 Midas Financial</span>
        <span style={styles.separator}>•</span>
        <span>v0.1.0</span>
      </div>
      <div style={styles.right}>
        <span style={styles.status}>
          <span style={styles.statusDot}></span>
          API Active
        </span>
        <span style={styles.separator}>•</span>
        <a href="#" style={styles.link}>Privacy</a>
        <span style={styles.separator}>•</span>
        <a href="#" style={styles.link}>Terms</a>
        <span style={styles.separator}>•</span>
        <a href="#" style={styles.link}>Help</a>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    height: '60px',
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  separator: {
    color: '#6b7280',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'pulse 2s infinite',
  },
  link: {
    color: '#e5e7eb',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
}
