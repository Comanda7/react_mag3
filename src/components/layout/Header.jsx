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
    { to: '/',          end: true, label: '&#1050;&#1072;&#1090;&#1072;&#1083;&#1086;&#1075;'   },
    { to: '/profile',              label: '&#1050;&#1072;&#1073;&#1080;&#1085;&#1077;&#1090;'   },
    { to: '/about',                label: '&#1054; &#1085;&#1072;&#1089;'     },
    { to: '/contacts',             label: '&#1050;&#1086;&#1085;&#1090;&#1072;&#1082;&#1090;&#1099;'  },
  ]

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="logo">&#128722; TechStore</Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            className="header-search-input"
            placeholder="&#1055;&#1086;&#1080;&#1089;&#1082; &#1090;&#1086;&#1074;&#1072;&#1088;&#1086;&#1074;&#8230;"
            value={searchVal}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-ghost btn-sm">&#128269;</button>
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
          <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link--admin${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
            &#9881;&#65039;
          </NavLink>
        </nav>

        <div className="header-actions">
          <NavLink to="/favorites" className={({ isActive }) => `icon-btn${isActive ? ' icon-btn--active' : ''}`} title="&#1048;&#1079;&#1073;&#1088;&#1072;&#1085;&#1085;&#1086;&#1077;">
            <span className="icon-btn-emoji">{favCount > 0 ? '&#10084;&#65039;' : '&#129293;'}</span>
            {favCount > 0 && <span className="icon-badge">{favCount}</span>}
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `icon-btn${isActive ? ' icon-btn--active' : ''}`} title="&#1050;&#1086;&#1088;&#1079;&#1080;&#1085;&#1072;">
            <span className="icon-btn-emoji">&#128722;</span>
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </NavLink>

          {/* &#1040;&#1074;&#1090;&#1086;&#1088;&#1080;&#1079;&#1072;&#1094;&#1080;&#1103; */}
          {user ? (
            <div className="auth-user-wrap">
              <span className="auth-user-name">&#128100; {user.name}</span>
              <button className="btn btn-ghost btn-sm auth-logout-btn" onClick={logout}>&#1042;&#1099;&#1081;&#1090;&#1080;</button>
            </div>
          ) : (
            <button className="btn btn-outline btn-sm auth-open-btn" onClick={() => setAuthOpen(true)}>
              &#128274; &#1042;&#1086;&#1081;&#1090;&#1080;
            </button>
          )}
        </div>

        <button className="burger" onClick={() => setMenuOpen(o => !o)} aria-label="&#1052;&#1077;&#1085;&#1102;">
          {menuOpen ? '&#10005;' : '&#9776;'}
        </button>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}

export default Header
