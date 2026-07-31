import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">Midas</span>
        </div>
        <h1>Financial Management</h1>
      </div>
      <div className="header-right">
        <input 
          type="search" 
          placeholder="Search transfers..." 
          className="search-input"
          aria-label="Search"
        />
        <div className="user-menu">
          <button className="user-button" aria-label="User menu">
            <span className="user-avatar">👤</span>
            <span className="user-name">User</span>
          </button>
        </div>
      </div>
    </header>
  )
}
