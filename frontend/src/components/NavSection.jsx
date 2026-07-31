import './NavSection.css'

export default function NavSection({ title, children }) {
  return (
    <div className="nav-section">
      <h3 className="nav-section-title">{title}</h3>
      <div className="nav-items">
        {children}
      </div>
    </div>
  )
}
