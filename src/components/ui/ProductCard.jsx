import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_NAMES } from '../../assets/products'
import { formatPrice } from '../../utils/formatters'
import useFavorites from '../../hooks/useFavorites'
import useCart from '../../hooks/useCart'
import ProductModal from './ProductModal'

/** @param {{ product: import('../../types').Product }} props */
function ProductCard({ product }) {
  const { isFavorite, handleToggle } = useFavorites()
  const { isInCart,   handleAdd }    = useCart()
  const [showModal, setShowModal]    = useState(false)

  const fav        = isFavorite(product.id)
  const inCart     = isInCart(product.id)
  const outOfStock = product.stock === 0
  const lowStock   = product.stock > 0 && product.stock < 10

  return (
    <>
    {showModal && <ProductModal product={product} onClose={() => setShowModal(false)} />}
    <div className={`product-card${outOfStock ? ' out-of-stock' : ''}`}>
      {/* Клик по картинке → модальное окно быстрого просмотра */}
      <button
        className="product-image-btn"
        onClick={() => setShowModal(true)}
        title="Быстрый просмотр"
        aria-label={`Быстрый просмотр: ${product.name}`}
      >
        <div className="product-image">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="product-img" />
            : <span className="product-emoji">{product.image}</span>
          }
        </div>
        <span className="product-image-hint">🔍 Быстрый просмотр</span>
      </button>
      <div className="product-category">{CATEGORY_NAMES[product.category]}</div>
      <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
      <div className="product-price">{formatPrice(product.price)}</div>
      <div className={`product-stock${lowStock ? ' low-stock' : ''}`}>
        {outOfStock ? '❌ Нет в наличии' : `📦 На складе: ${product.stock} шт.`}
      </div>
      <div className="product-actions">
        <button
          className={`btn btn-icon btn-favorite${fav ? ' active' : ''}`}
          onClick={() => handleToggle(product.id)}
          title={fav ? 'Удалить из избранного' : 'Добавить в избранное'}
        >{fav ? '❤️' : '🤍'}</button>
        <button
          className={`btn btn-icon btn-cart${inCart ? ' active' : ''}`}
          onClick={() => handleAdd(product.id)}
          disabled={outOfStock}
          title={outOfStock ? 'Нет в наличии' : inCart ? 'Удалить из корзины' : 'Добавить в корзину'}
        >🛒</button>
      </div>
    </div>
    </>
  )
}

export default ProductCard
