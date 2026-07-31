import { Link } from 'react-router-dom'
import './NavItem.css'

export default function NavItem({ label, path, icon, isActive, onClick }) {
  return (
    <Link 
      to={path}
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      title={label}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </Link>
  )
}
