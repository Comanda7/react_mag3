import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, CATEGORY_NAMES } from '../../assets/products'
import { formatPrice } from '../../utils/formatters'

function AdminProducts() {
  const [stocks, setStocks]   = useState(() => Object.fromEntries(PRODUCTS.map(p => [p.id, p.stock ?? 10])))
  const [filter, setFilter]   = useState('')
  const [category, setCategory] = useState('')

  const visible = PRODUCTS.filter(p =>
    (!filter   || p.name.toLowerCase().includes(filter.toLowerCase())) &&
    (!category || p.category === category)
  )

  function changeStock(id, delta) {
    setStocks(s => ({ ...s, [id]: Math.max(0, (s[id] || 0) + delta) }))
  }

  return (
    <div>
      <h2>Товары ({PRODUCTS.length})</h2>
      <div className="admin-filters">
        <input
          className="input-field"
          placeholder="Поиск товара…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Все категории</option>
          {Object.entries(CATEGORY_NAMES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th><th>Название</th><th>Категория</th><th>Цена</th><th>Рейтинг</th><th>Остаток</th><th>Детали</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{CATEGORY_NAMES[p.category] || p.category}</td>
              <td>{formatPrice(p.price)}</td>
              <td>⭐ {p.rating}</td>
              <td>
                <div className="stock-control">
                  <button className="btn btn-sm" onClick={() => changeStock(p.id, -1)}>−</button>
                  <span className={stocks[p.id] === 0 ? 'stock-zero' : ''}>{stocks[p.id]}</span>
                  <button className="btn btn-sm" onClick={() => changeStock(p.id, +1)}>+</button>
                </div>
              </td>
              <td>
                <Link to={`/product/${p.id}`} className="btn btn-sm btn-outline">👁</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length === 0 && <p className="empty-text">Ничего не найдено.</p>}
    </div>
  )
}
export default AdminProducts
