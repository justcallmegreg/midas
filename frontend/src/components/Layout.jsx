import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="layout-main">
        <Sidebar />
        <main className="layout-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
