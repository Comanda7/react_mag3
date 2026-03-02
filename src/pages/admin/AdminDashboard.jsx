import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'
import { formatPrice } from '../../utils/formatters'
import { PRODUCTS } from '../../assets/products'

function AdminDashboard() {
  const orders    = useStore(s => s.orders)
  const cartItems = useStore(s => s.cartItems)

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrder     = orders.length ? totalRevenue / orders.length : 0

  const stats = [
    { label: 'Товаров в каталоге', value: PRODUCTS.length,     icon: '📦', to: '/admin/products'   },
    { label: 'Всего заказов',       value: orders.length,       icon: '🛒', to: '/admin/orders'     },
    { label: 'Выручка',             value: formatPrice(totalRevenue), icon: '💰', to: '/admin/orders' },
    { label: 'Средний чек',         value: formatPrice(avgOrder),     icon: '📈', to: null            },
  ]

  return (
    <div>
      <h2>Дашборд</h2>
      <div className="admin-stats">
        {stats.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            {s.to && <Link to={s.to} className="stat-link">Подробнее →</Link>}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '2rem' }}>Последние заказы</h3>
      {orders.length === 0 ? (
        <p className="empty-text">Заказов пока нет.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Дата</th><th>Сумма</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {orders.slice(-5).reverse().map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{new Date(o.date).toLocaleDateString('ru-RU')}</td>
                <td>{formatPrice(o.total)}</td>
                <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="router-info-box" style={{ marginTop: '2rem' }}>
        <strong>Router API:</strong> AdminDashboard вложена в AdminLayout через <code>&lt;Outlet /&gt;</code>.
        URL: <code>/admin</code> (index route).
      </div>
    </div>
  )
}
export default AdminDashboard
