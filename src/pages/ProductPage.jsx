/**
 * ProductPage — страница конкретного товара.
 *
 * Демонстрация React Router hooks:
 *   useParams   → извлекаем { id } из URL /product/:id
 *   useNavigate → кнопки «Назад» и программный переход
 *   Link        → ссылка «Похожие товары» той же категории
 */
import { useParams, useNavigate, Link } from 'react-router-dom'
import useStore from '../store/useStore'
import useCart from '../hooks/useCart'
import useFavorites from '../hooks/useFavorites'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { CATEGORY_NAMES } from '../assets/products'
import { formatPrice } from '../utils/formatters'

function ProductPage() {
  // ── useParams: получаем :id из URL ───────────────────────
  const { id }     = useParams()
  const navigate   = useNavigate()
  const products   = useStore(s => s.products)

  const product = products.find(p => p.id === Number(id))

  const { isInCart, handleAdd }   = useCart()
  const { isFavorite, handleToggle } = useFavorites()

  // Если товар не найден — показываем 404-подобное сообщение и кнопку назад
  if (!product) {
    return (
      <main className="container page-content">
        <h1>Товар не найден</h1>
        <p className="empty-msg">Товар с ID <code>{id}</code> не существует.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Назад</button>
      </main>
    )
  }

  const outOfStock = product.stock === 0
  const lowStock   = product.stock > 0 && product.stock < 10
  const inCart     = isInCart(product.id)
  const fav        = isFavorite(product.id)

  // Похожие товары той же категории (кроме текущего)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="container page-content">
      <Breadcrumbs />

      {/* Кнопка назад — useNavigate(-1) */}
      <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="product-detail">
        <div className="product-detail-image">{product.image}</div>

        <div className="product-detail-info">
          <span className="product-category">{CATEGORY_NAMES[product.category]}</span>
          <h1>{product.name}</h1>
          <div className="product-detail-price">{formatPrice(product.price)}</div>
          <div className={`product-stock${lowStock ? ' low-stock' : ''}`}>
            {outOfStock ? '❌ Нет в наличии' : `📦 На складе: ${product.stock} шт.`}
          </div>

          <div className="product-detail-actions">
            <button
              className={`btn btn-primary${inCart ? ' in-cart' : ''}`}
              onClick={() => handleAdd(product.id)}
              disabled={outOfStock}
            >
              {inCart ? '✓ В корзине' : '🛒 В корзину'}
            </button>
            <button
              className={`btn btn-icon btn-favorite${fav ? ' active' : ''}`}
              onClick={() => handleToggle(product.id)}
              title={fav ? 'Удалить из избранного' : 'В избранное'}
            >
              {fav ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Демонстрация useParams: выводим параметр напрямую */}
          <p className="param-hint">
            Параметр из URL: <code>id = {id}</code> (использован <code>useParams()</code>)
          </p>
        </div>
      </div>

      {/* Похожие товары — демонстрация Link с динамическими путями */}
      {related.length > 0 && (
        <section className="related-section">
          <h2>Похожие товары</h2>
          <div className="related-grid">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="related-card">
                <span className="related-img">{p.image}</span>
                <span className="related-name">{p.name}</span>
                <span className="related-price">{formatPrice(p.price)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductPage
