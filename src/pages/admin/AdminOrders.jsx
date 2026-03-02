import useStore from '../../store/useStore'
import { formatPrice } from '../../utils/formatters'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function AdminOrders() {
  const orders            = useStore(s => s.orders)
  const updateOrderStatus = useStore(s => s.updateOrderStatus)

  const total = orders.reduce((sum, o) => sum + o.total, 0)

  if (orders.length === 0) return (
    <div>
      <h2>Заказы</h2>
      <p className="empty-text">Заказов пока нет. Оформите заказ в магазине.</p>
    </div>
  )

  return (
    <div>
      <h2>Заказы ({orders.length})</h2>
      <p style={{ marginBottom: '1rem' }}>Общая выручка: <strong>{formatPrice(total)}</strong></p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th><th>Дата</th><th>Товаров</th><th>Сумма</th><th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {[...orders].reverse().map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.date).toLocaleDateString('ru-RU')}</td>
              <td>{o.items?.length ?? 0}</td>
              <td>{formatPrice(o.total)}</td>
              <td>
                <select
                  className="input-field input-field--sm"
                  value={o.status}
                  onChange={e => updateOrderStatus(o.id, e.target.value)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default AdminOrders
