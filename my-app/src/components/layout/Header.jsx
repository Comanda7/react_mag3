import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import AuthModal from '../ui/AuthModal'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearch]  = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const navigate    = useNavigate()
  const favCount    = useStore(s => s.favorites.length)
  const cartCount   = useStore(s => s.cart.reduce((sum, i) => sum + i.quantity, 0))
  const user        = useStore(s => s.user)
  const logout      = useStore(s => s.logout)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) navigate(`/?search=${encodeURIComponent(searchVal.trim())}`)
    setMenuOpen(false)
  }

  const links = [
    { to: '/',          end: true, label: 'Каталог'  },
    { to: '/profile',              label: 'Кабинет'  },
    { to: '/about',                label: 'О нас'    },
    { to: '/contacts',             label: 'Контакты' },
  ]

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="logo">🛒 TechStore</Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            className="header-search-input"
            placeholder="Поиск товаров…"
            value={searchVal}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-ghost btn-sm">🔍</button>
        </form>

        <nav className={`nav${menuOpen ? ' nav-open' : ''}`}>
          {links.map(({ to, end, label }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link--admin${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
            ⚙️
          </NavLink>
          )}
        </nav>

        <div className="header-actions">
          <NavLink to="/favorites" className={({ isActive }) => `icon-btn${isActive ? ' icon-btn--active' : ''}`} title="Избранное">
            <span className="icon-btn-emoji">{favCount > 0 ? '❤️' : '🤍'}</span>
            {favCount > 0 && <span className="icon-badge">{favCount}</span>}
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `icon-btn${isActive ? ' icon-btn--active' : ''}`} title="Корзина">
            <span className="icon-btn-emoji">🛒</span>
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </NavLink>

          {user ? (
            <div className="auth-user-wrap">
              <span className="auth-user-name">{user.role === 'admin' ? '👑' : '👤'} {user.name}</span>
              <button className="btn btn-ghost btn-sm auth-logout-btn" onClick={logout}>Выйти</button>
            </div>
          ) : (
            <button className="btn btn-outline btn-sm auth-open-btn" onClick={() => setAuthOpen(true)}>
              🔒 Войти
            </button>
          )}
        </div>

        <button className="burger" onClick={() => setMenuOpen(o => !o)} aria-label="Меню">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}

export default Header