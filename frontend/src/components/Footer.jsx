import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-status">
          <span className="status-dot"></span>
          System Status: Operational
        </span>
      </div>
      <div className="footer-right">
        <span className="footer-version">v0.1.0</span>
        <span className="footer-separator">•</span>
        <a href="#" className="footer-link">Documentation</a>
        <span className="footer-separator">•</span>
        <span className="footer-copyright">© {currentYear} Midas</span>
      </div>
    </footer>
  )
}
