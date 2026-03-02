import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'
import { CATEGORY_NAMES } from '../../assets/products'
import { formatPrice } from '../../utils/formatters'

function AdminProducts() {
  const products           = useStore(s => s.products)
  const updateProductStock = useStore(s => s.updateProductStock)
  const updateProductImage = useStore(s => s.updateProductImage)

  const [filter,   setFilter]   = useState('')
  const [category, setCategory] = useState('')
  const [urlId,    setUrlId]    = useState(null)
  const [urlVal,   setUrlVal]   = useState('')
  const fileRefs = useRef({})

  const visible = products.filter(p =>
    (!filter   || p.name.toLowerCase().includes(filter.toLowerCase())) &&
    (!category || p.category === category)
  )

  const handleFileChange = (id, e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => updateProductImage(id, ev.target.result)
    reader.readAsDataURL(file)
  }

  const saveUrl = (id) => {
    const val = urlVal.trim()
    if (val) updateProductImage(id, val)
    setUrlId(null); setUrlVal('')
  }

  return (
    <div>
      <h2>Товары ({products.length})</h2>
      <p className="admin-hint">
        Загрузите изображение из файла (любое расширение) или укажите путь вида /images/product-1.jpg.
        Файлы размещайте в папке public/images/ проекта.
      </p>
      <div className="admin-filters">
        <input className="input-field" placeholder="Поиск товара" value={filter} onChange={e => setFilter(e.target.value)} />
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
            <th>#</th><th>Картинка</th><th>Название</th><th>Категория</th><th>Цена</th><th>Рейтинг</th><th>Остаток</th><th>Детали</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>

              <td className="td-image">
                <div className="admin-img-wrap">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className="admin-thumb" />
                    : <span className="admin-thumb-emoji">{p.image}</span>
                  }
                  <div className="admin-img-actions">
                    <input
                      type="file" accept="image/*"
                      style={{ display: 'none' }}
                      ref={el => (fileRefs.current[p.id] = el)}
                      onChange={e => handleFileChange(p.id, e)}
                    />
                    <button className="btn btn-sm btn-secondary" title="Загрузить файл" onClick={() => fileRefs.current[p.id]?.click()}></button>
                    {urlId === p.id ? (
                      <>
                        <input
                          className="input-field input-inline"
                          placeholder="/images/product.jpg"
                          value={urlVal}
                          onChange={e => setUrlVal(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveUrl(p.id); if (e.key === 'Escape') { setUrlId(null); setUrlVal('') } }}
                          autoFocus style={{ width: '140px' }}
                        />
                        <button className="btn btn-sm btn-primary" onClick={() => saveUrl(p.id)}></button>
                        <button className="btn btn-sm btn-ghost" onClick={() => { setUrlId(null); setUrlVal('') }}></button>
                      </>
                    ) : (
                      <button className="btn btn-sm btn-ghost" title="Ввести URL" onClick={() => { setUrlId(p.id); setUrlVal(p.imageUrl || '') }}></button>
                    )}
                    {p.imageUrl && (
                      <button className="btn btn-sm btn-danger" title="Удалить изображение" onClick={() => updateProductImage(p.id, null)}></button>
                    )}
                  </div>
                </div>
              </td>

              <td>{p.name}</td>
              <td>{CATEGORY_NAMES[p.category] || p.category}</td>
              <td>{formatPrice(p.price)}</td>
              <td> {p.rating}</td>
              <td>
                <div className="stock-control">
                  <button className="btn btn-sm" onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}></button>
                  <span className={p.stock === 0 ? 'stock-zero' : ''}>{p.stock}</span>
                  <button className="btn btn-sm" onClick={() => updateProductStock(p.id, p.stock + 1)}>+</button>
                </div>
              </td>
              <td>
                <Link to={`/product/${p.id}`} className="btn btn-sm btn-outline"></Link>
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