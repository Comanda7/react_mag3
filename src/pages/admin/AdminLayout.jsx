import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'

const isAdmin = () => localStorage.getItem('isAdmin') !== 'false'

const links = [
  { to: '/admin',            label: '📊 Дашборд',   end: true },
  { to: '/admin/products',   label: '📦 Товары'              },
  { to: '/admin/orders',     label: '🛒 Заказы'              },
  { to: '/admin/categories', label: '🏷️ Категории'          },
]

function AdminLayout() {
  const navigate = useNavigate()

  if (!isAdmin()) return <Navigate to="/" replace />

  function logout() {
    localStorage.setItem('isAdmin', 'false')
    navigate('/')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">⚙️ Админ</div>
        <nav className="admin-nav">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'admin-link' + (isActive ? ' admin-link--active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-outline admin-logout" onClick={logout}>Выйти</button>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
export default AdminLayout
