/**
 * CatalogPage — главная страница каталога.
 *
 * Демонстрация React Router hooks:
 *   useSearchParams → фильтры и поиск хранятся в URL-строке
 *                     /?category=phones&search=iphone&sort=asc&page=2
 *   useNavigate     → программная навигация (не используется напрямую, делегировано setSearchParams)
 *
 * Это значит:
 *   ✅ фильтры сохраняются при обновлении страницы
 *   ✅ можно поделиться ссылкой с уже установленными фильтрами
 *   ✅ кнопка «Назад» в браузере восстанавливает фильтры
 */
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useStore from '../store/useStore'
import Sidebar from '../components/layout/Sidebar'
import ProductCard from '../components/ui/ProductCard'
import Pagination from '../components/ui/Pagination'
import Input from '../components/ui/Input'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { ITEMS_PER_PAGE } from '../assets/products'

function CatalogPage() {
  const products = useStore(s => s.products)

  // ── useSearchParams: все параметры фильтрации живут прямо в URL ──
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category') || 'all'
  const search   = searchParams.get('search')   || ''
  const sort     = searchParams.get('sort')      || ''
  const page     = parseInt(searchParams.get('page') || '1', 10)

  // Хелпер: обновить один параметр, сбросить page на 1
  const setParam = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value); else next.delete(key)
      next.set('page', '1')
      return next
    }, { replace: true })
  }

  const setPage = (p) =>
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })

  // ── Фильтрация + сортировка (memo, не пересчитывается без нужды) ──
  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== 'all') list = list.filter(p => p.category === category)
    if (search.trim())      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'asc')     list.sort((a, b) => a.price - b.price)
    if (sort === 'desc')    list.sort((a, b) => b.price - a.price)
    return list
  }, [products, category, search, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const pageItems  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="page-layout">
      <Sidebar active={category} onSelect={cat => setParam('category', cat === 'all' ? '' : cat)} />

      <main className="catalog-main">
        <Breadcrumbs />

        {/* URL-строка — демонстрация useSearchParams */}
        <div className="url-hint">
          <span>🔗 URL-фильтры:</span>
          <code>{window.location.search || '(без параметров)'}</code>
        </div>

        <div className="catalog-toolbar">
          <Input
            placeholder="🔍 Поиск по названию…"
            value={search}
            onChange={e => setParam('search', e.target.value)}
          />
          <select
            className="select-sort"
            value={sort}
            onChange={e => setParam('sort', e.target.value)}
          >
            <option value="">Без сортировки</option>
            <option value="asc">Цена ↑</option>
            <option value="desc">Цена ↓</option>
          </select>
          {(search || sort || category !== 'all') && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSearchParams({})}
            >✕ Сбросить фильтры</button>
          )}
        </div>

        <p className="results-count">Найдено: <strong>{filtered.length}</strong> товаров</p>

        {pageItems.length === 0 ? (
          <p className="empty-msg">Ничего не найдено 😔</p>
        ) : (
          <div className="products-grid">
            {pageItems.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPage={setPage} />
      </main>
    </div>
  )
}

export default CatalogPage
