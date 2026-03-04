import { PRODUCTS, CATEGORY_NAMES } from '../../assets/products'

function AdminCategories() {
  const byCategory = Object.entries(CATEGORY_NAMES).map(([key, label]) => {
    const items = PRODUCTS.filter(p => p.category === key)
    const avgPrice = items.length ? items.reduce((s, p) => s + p.price, 0) / items.length : 0
    const avgRating = items.length ? items.reduce((s, p) => s + p.rating, 0) / items.length : 0
    return { key, label, count: items.length, avgPrice, avgRating }
  })

  return (
    <div>
      <h2>Категории ({byCategory.length})</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Категория</th><th>Товаров</th><th>Средняя цена</th><th>Средний рейтинг</th>
          </tr>
        </thead>
        <tbody>
          {byCategory.map(c => (
            <tr key={c.key}>
              <td>{c.label}</td>
              <td>{c.count}</td>
              <td>{c.avgPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })}</td>
              <td>⭐ {c.avgRating.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="router-info-box" style={{ marginTop: '2rem' }}>
        <strong>Router API:</strong> Страница <code>/admin/categories</code> вложена через
        nested routes в <code>AdminLayout &gt; Outlet</code>.
      </div>
    </div>
  )
}
export default AdminCategories
