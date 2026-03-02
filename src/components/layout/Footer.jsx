import { Link, useLocation } from 'react-router-dom'

function Footer() {
  const { pathname } = useLocation()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} TechStore</span>
        <nav className="footer-nav">
          <Link to="/about"    className={pathname === '/about'    ? 'active' : ''}>О нас</Link>
          <Link to="/contacts" className={pathname === '/contacts' ? 'active' : ''}>Контакты</Link>
          <Link to="/admin"    className={pathname.startsWith('/admin') ? 'active' : ''}>Админ</Link>
        </nav>
        {/* useLocation демонстрация */}
        <span className="footer-path">Путь: <code>{pathname}</code></span>
      </div>
    </footer>
  )
}
export default Footer
