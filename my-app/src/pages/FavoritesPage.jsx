import useStore from '../store/useStore'
import useFavorites from '../hooks/useFavorites'
import ProductCard from '../components/ui/ProductCard'
import Breadcrumbs from '../components/ui/Breadcrumbs'

function FavoritesPage() {
  const products      = useStore(s => s.products)
  const { favorites } = useFavorites()
  const favProducts   = products.filter(p => favorites.includes(p.id))

  return (
    <main className="container page-content">
      <Breadcrumbs />
      <h1>❤️ Избранное</h1>
      {favProducts.length === 0 ? (
        <p className="empty-msg">Список избранного пуст. <a href="/">Перейти в каталог</a></p>
      ) : (
        <div className="products-grid">
          {favProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  )
}

export default FavoritesPage
