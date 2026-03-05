# react_mag3 — React Router v6 Showcase

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)
[![Zustand](https://img.shields.io/badge/Zustand-4-orange)](https://zustand-demo.pmnd.rs)
[![React Router](https://img.shields.io/badge/React_Router_DOM-6.4+-ca4245?logo=react-router)](https://reactrouter.com)

> Полноценный интернет-магазин на **React 18 + Vite + React Router DOM 6.4+ + Zustand**.  
> Цель проекта — продемонстрировать **все ключевые API React Router v6** (createBrowserRouter, useSearchParams, useParams, useNavigate, useLocation, useMatches, useRouteError, ProtectedRoute, lazy loading).
>
> **GitHub:** https://github.com/Comanda7/react_mag3

## Стек

| Технология | Версия |
|---|---|
| React | 18.3.1 |
| Vite | 5.4.2 |
| React Router DOM | 6.26.2 |
| Zustand | 4.5.5 |

## Запуск

```bash
cd Inter_mag3/my-app
npm install
npm run dev       # http://localhost:5174
npm run build
```

---

## React Router APIs — полный список

### `createBrowserRouter` + `RouterProvider`
**Файл**: `src/router/index.jsx`  
Использует Data Router API (v6.4+) вместо компонентного `<BrowserRouter>`.
Централизованная конфигурация маршрутов с поддержкой `handle`, `errorElement`, `loader`, `lazy`.

```jsx
const router = createBrowserRouter([
  { path: '/', element: <RootShell />, children: [ ... ] }
])
export function AppRouter() {
  return <RouterProvider router={router} />
}
```

### `React.lazy` + `Suspense` — code splitting
**Файл**: `src/router/index.jsx`  
Все страницы загружаются лениво. До загрузки показывается `<PageSpinner />`.

```jsx
const CatalogPage = lazy(() => import('../pages/CatalogPage'))
<Suspense fallback={<PageSpinner />}>
  <CatalogPage />
</Suspense>
```

### `<Outlet />` — вложенные маршруты
**Файлы**: `src/components/layout/RootShell` (внутри router/index.jsx), `src/pages/admin/AdminLayout.jsx`  
Точка рендеринга дочерних маршрутов:
- `/` → RootShell → Header + Footer + **Outlet** (страницы каталога)
- `/admin` → AdminLayout → сайдбар + **Outlet** (дашборд/товары/заказы/категории)

### `<NavLink />` — активные ссылки
**Файлы**: `Header.jsx`, `AdminLayout.jsx`  
Автоматически добавляет класс `active` для текущего маршрута.

```jsx
<NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
  Избранное
</NavLink>
```

### `<ScrollRestoration />` — scroll в начало
**Файл**: `src/router/index.jsx`  
Автоматически восстанавливает позицию прокрутки при переходах.

```jsx
// В RootShell:
<ScrollRestoration />
```

### `useSearchParams` — фильтры в URL
**Файл**: `src/pages/CatalogPage.jsx`  
Все фильтры каталога хранятся в строке запроса. URL шарятся, история браузера сохраняет состояние.

```
/?category=phones&search=iphone&sort=asc&page=2
```

```jsx
const [searchParams, setSearchParams] = useSearchParams()
const category = searchParams.get('category') || ''
```

### `useParams` — динамические параметры
**Файл**: `src/pages/ProductPage.jsx`  
Страница товара: `/product/:id`

```jsx
const { id } = useParams()
const product = PRODUCTS.find(p => p.id === Number(id))
```

### `useNavigate` — программная навигация
**Файлы**: `Header.jsx`, `CartPage.jsx`, `ProductPage.jsx`

```jsx
// Форма поиска в хедере:
navigate(`/?search=${q}`)

// После оформления заказа:
navigate('/profile', { state: { fromOrder: order.id } })

// Кнопка "Назад":
navigate(-1)
```

### `useLocation` + `location.state` — передача данных
**Файл**: `src/pages/ProfilePage.jsx`  
Получает ID заказа, переданный из CartPage после оформления.

```jsx
const { state } = useLocation()
if (state?.fromOrder) // показать баннер успеха
```

**Файл**: `Footer.jsx`  
Показывает текущий путь.

```jsx
const { pathname } = useLocation()
```

### `useMatches` — handle.crumb для хлебных крошек
**Файл**: `src/hooks/useBreadcrumbs.js`, `src/components/ui/Breadcrumbs.jsx`  
Каждый маршрут имеет `handle: { crumb: 'Название' }`. `useMatches` возвращает все совпавшие маршруты и их `handle`.

```jsx
// В router/index.jsx:
{ path: '/favorites', handle: { crumb: 'Избранное' }, ... }

// useBreadcrumbs.js:
const matches = useMatches()
return matches.filter(m => m.handle?.crumb).map(...)
```

### `useRouteError` — обработка ошибок
**Файл**: `src/pages/ErrorBoundaryPage.jsx`  
Используется как `errorElement` в корневом маршруте.

```jsx
const error = useRouteError()
return <div>Ошибка: {error?.message}</div>
```

### `ProtectedRoute` — защита маршрутов
**Файл**: `src/router/index.jsx`  
Редирект на `/` если не авторизован как admin.

```jsx
function ProtectedRoute({ children }) {
  if (!isAdmin()) return <Navigate to="/" replace />
  return children
}
```

**Чтобы открыть админку**: В консоли браузера:
```js
localStorage.setItem('isAdmin', 'true'); location.reload()
```

### `Navigate` — декларативный редирект
**Файл**: `src/pages/admin/AdminLayout.jsx`  
Немедленно перенаправляет неавторизованного пользователя.

### Маршруты 404 — `path="*"`
**Файл**: `src/pages/NotFoundPage.jsx`  
Catch-all маршрут, срабатывающий для любого несуществующего пути.

---

## Структура маршрутов

```
├── /                     CatalogPage          ← useSearchParams — фильтры в URL
├── /product/:id          ProductPage          ← useParams
├── /favorites            FavoritesPage
├── /cart                 CartPage             ← useNavigate с state
├── /profile              ProfilePage          ← useLocation.state
├── /about                AboutPage
├── /contacts             ContactsPage
├── /admin                AdminLayout          ← protected; Outlet для вложенных
│   ├── /admin            AdminDashboard       ← index route
│   ├── /admin/products   AdminProducts
│   ├── /admin/orders     AdminOrders
│   └── /admin/categories AdminCategories
├── *                     NotFoundPage         ← 404 catch-all
└── errorElement          ErrorBoundaryPage    ← useRouteError
```

## Структура проекта

```
src/
│
├── router/
│   └── index.jsx              ← ВСЯ конфигурация маршрутов
│
├── pages/
│   ├── CatalogPage.jsx        ← useSearchParams
│   ├── ProductPage.jsx        ← useParams
│   ├── CartPage.jsx           ← useNavigate
│   ├── ProfilePage.jsx        ← useLocation
│   ├── FavoritesPage.jsx
│   ├── AboutPage.jsx
│   ├── ContactsPage.jsx
│   ├── NotFoundPage.jsx       ← 404 catch-all
│   ├── ErrorBoundaryPage.jsx  ← useRouteError
│   └── admin/
│       ├── AdminLayout.jsx    ← NavLink + Outlet (nested routes)
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminOrders.jsx
│       └── AdminCategories.jsx
│
├── hooks/
│   ├── useBreadcrumbs.js      ← useMatches
│   ├── useCart.js
│   └── useFavorites.js
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx         ← NavLink, useNavigate (поиск)
│   │   ├── Footer.jsx         ← useLocation
│   │   └── Sidebar.jsx
│   └── ui/
│       ├── Breadcrumbs.jsx    ← useBreadcrumbs hook
│       ├── PageSpinner.jsx    ← Suspense fallback
│       ├── ProductCard.jsx    ← Link to /product/:id
│       ├── Button.jsx
│       ├── Input.jsx
│       └── Pagination.jsx
│
├── store/
│   └── useStore.js
├── context/
│   └── NotifyContext.jsx
├── assets/
│   └── products.js
├── App.css
└── main.jsx
```

---

## 📖 Описание файлов

> Кликайте на имя файла, чтобы увидеть его описание и код ↓

<details>
<summary><a name="router-index"></a><b>⚡ router/index.jsx</b> — вся конфигурация маршрутов</summary>

---

Центральный файл роутера. Использует Data Router API (`createBrowserRouter` + `RouterProvider`). Все страницы загружаются лениво через `React.lazy`. Содержит `RootShell`, `ProtectedRoute`, `ScrollRestoration` и полный список маршрутов с `handle.crumb`.

```jsx
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter, RouterProvider,
  Navigate, Outlet, ScrollRestoration,
} from 'react-router-dom'
import PageSpinner from '../components/ui/PageSpinner'

// Lazy-импорты — каждая страница грузится только при первом посещении
const CatalogPage   = lazy(() => import('../pages/CatalogPage'))
const CartPage      = lazy(() => import('../pages/CartPage'))
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'))
const ProfilePage   = lazy(() => import('../pages/ProfilePage'))
const ProductPage   = lazy(() => import('../pages/ProductPage'))
const AdminLayout   = lazy(() => import('../pages/admin/AdminLayout'))
// ... остальные страницы

// Root Shell — общая обёртка: Header + Outlet + Footer
function RootShell() {
  return (
    <>
      <ScrollRestoration />
      <div className="app-shell">
        <Header />
        <div className="app-body">
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </div>
    </>
  )
}

// ProtectedRoute — защита Админки
function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') !== 'false'
  if (!isAdmin) return <Navigate to="/" replace state={{ reason: 'auth' }} />
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootShell />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true,       element: <CatalogPage />,   handle: { crumb: 'Каталог' } },
      { path: 'product/:id', element: <ProductPage />, handle: { crumb: 'Товар' } },
      { path: 'cart',      element: <CartPage />,      handle: { crumb: 'Корзина' } },
      { path: 'favorites', element: <FavoritesPage />, handle: { crumb: 'Избранное' } },
      { path: 'profile',   element: <ProfilePage />,   handle: { crumb: 'Кабинет' } },
      {
        path: 'admin',
        element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
        children: [
          { index: true,          element: <AdminDashboard /> },
          { path: 'products',     element: <AdminProducts /> },
          { path: 'orders',       element: <AdminOrders /> },
          { path: 'categories',   element: <AdminCategories /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
```

---
</details>

<details>
<summary><a name="catalogpage"></a><b>🛍️ CatalogPage.jsx</b> — каталог + useSearchParams</summary>

---

Главная страница. Все фильтры (категория, поиск, сортировка, страница) живут прямо в URL через `useSearchParams`. URL можно скопировать — фильтры сохранятся.

```jsx
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useStore from '../store/useStore'

function CatalogPage() {
  const products = useStore(s => s.products)

  // Все параметры фильтрации — прямо в URL
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

  // Фильтрация + сортировка через useMemo
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
  // ...render
}
```

> URL при использовании: `/?category=phones&search=iphone&sort=asc&page=2`

---
</details>

<details>
<summary><a name="productpage"></a><b>📦 ProductPage.jsx</b> — страница товара + useParams</summary>

---

Страница `/product/:id`. Использует `useParams` для получения ID, `useNavigate` для кнопки «Назад» и перехода. Показывает похожие товары той же категории.

```jsx
import { useParams, useNavigate, Link } from 'react-router-dom'
import useStore from '../store/useStore'

function ProductPage() {
  const { id }   = useParams()       // ← извлекаем :id из URL
  const navigate = useNavigate()
  const products = useStore(s => s.products)

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <main className="container page-content">
        <h1>Товар не найден</h1>
        <p>Товар с ID <code>{id}</code> не существует.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Назад</button>
      </main>
    )
  }

  // Похожие товары той же категории (кроме текущего)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="container page-content">
      <Breadcrumbs />
      <button onClick={() => navigate(-1)}>← Назад</button>
      <h1>{product.image} {product.name}</h1>
      <p>{formatPrice(product.price)}</p>
      {/* ... кнопки корзины/избранного, похожие товары */}
    </main>
  )
}
```

---
</details>

<details>
<summary><a name="cartpage"></a><b>🛒 CartPage.jsx</b> — корзина + useNavigate</summary>

---

Страница корзины. После оформления заказа использует `useNavigate` с `state` для передачи ID заказа на страницу профиля.

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCart from '../hooks/useCart'
import CheckoutModal from '../components/ui/CheckoutModal'

function CartPage() {
  const navigate = useNavigate()
  const { cart, products, cartTotal, removeFromCart, updateCartQty, handleCheckout } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  const onConfirm = (fields) => {
    const order = handleCheckout(fields)
    setShowCheckout(false)
    // Передаём ID заказа через location.state → ProfilePage его подхватит
    navigate('/profile', order ? { state: { fromOrder: order.id } } : {})
  }

  return (
    <>
      {showCheckout && (
        <CheckoutModal total={cartTotal} onConfirm={onConfirm} onClose={() => setShowCheckout(false)} />
      )}
      <main className="container page-content">
        {/* ...таблица товаров с +/- и кнопкой оформления */}
      </main>
    </>
  )
}
```

---
</details>

<details>
<summary><a name="profilepage"></a><b>👤 ProfilePage.jsx</b> — личный кабинет + useLocation</summary>

---

Личный кабинет. Получает ID оформленного заказа через `useLocation().state.fromOrder` и отображает баннер успеха. Показывает статистику, историю заказов, избранное и текущую корзину.

```jsx
import { useLocation } from 'react-router-dom'
import useStore from '../store/useStore'

function ProfilePage() {
  const { state } = useLocation()
  const recentOrderId = state?.fromOrder  // ← передаётся из CartPage после оформления

  const orders   = useStore(s => s.orders)
  const products = useStore(s => s.products)
  const favorites = useStore(s => s.favorites)
  const cart     = useStore(s => s.cart)

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0)

  return (
    <main className="container page-content">
      {recentOrderId && (
        <div className="order-success-banner">
          ✅ Заказ <strong>#{recentOrderId}</strong> успешно оформлен!
        </div>
      )}
      {/* stat cards, история заказов, избранное, корзина */}
    </main>
  )
}
```

---
</details>

<details>
<summary><a name="header-jsx"></a><b>🏠 Header.jsx</b> — шапка + NavLink + useNavigate</summary>

---

Шапка приложения. `NavLink` автоматически добавляет класс `active`. `useNavigate` используется для перенаправления при поиске. Содержит бургер-меню, счётчики корзины/избранного, кнопку входа/выхода.

```jsx
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'

function Header() {
  const navigate  = useNavigate()
  const [searchVal, setSearch] = useState('')
  const favCount  = useStore(s => s.favorites.length)
  const cartCount = useStore(s => s.cart.reduce((sum, i) => sum + i.quantity, 0))

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) navigate(`/?search=${encodeURIComponent(searchVal.trim())}`)
  }

  return (
    <header className="header">
      <Link to="/" className="logo">🛒 TechStore</Link>

      <form className="header-search" onSubmit={handleSearch}>
        <input placeholder="Поиск товаров…" value={searchVal} onChange={e => setSearch(e.target.value)} />
        <button type="submit">🔍</button>
      </form>

      <nav>
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Каталог</NavLink>
        <NavLink to="/profile"  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Кабинет</NavLink>
      </nav>

      <NavLink to="/favorites" className={({ isActive }) => `icon-btn${isActive ? ' icon-btn--active' : ''}`}>
        🤍 {favCount > 0 && <span className="badge">{favCount}</span>}
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => `icon-btn${isActive ? ' icon-btn--active' : ''}`}>
        🛒 {cartCount > 0 && <span className="badge">{cartCount}</span>}
      </NavLink>
    </header>
  )
}
```

---
</details>

<details>
<summary><a name="adminlayout-jsx"></a><b>⚙️ AdminLayout.jsx</b> — обёртка админки + NavLink + Outlet</summary>

---

Обёртка всех admin-страниц. Проверяет права через `localStorage.getItem('isAdmin')`, при отказе — `<Navigate to="/" />`. Навигация через `NavLink`. Дочерние маршруты рендерятся в `<Outlet />`.

```jsx
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

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">⚙️ Админ</div>
        <nav className="admin-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => 'admin-link' + (isActive ? ' admin-link--active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-outline admin-logout"
          onClick={() => { localStorage.setItem('isAdmin', 'false'); navigate('/') }}>
          Выйти
        </button>
      </aside>
      <div className="admin-content">
        <Outlet />   {/* ← сюда рендерятся дочерние маршруты /admin/* */}
      </div>
    </div>
  )
}
```

> Чтобы открыть админку в браузере: `localStorage.setItem('isAdmin', 'true'); location.reload()`

---
</details>

<details>
<summary><a name="breadcrumbs-jsx"></a><b>🧭 Breadcrumbs.jsx + useBreadcrumbs.js</b> — хлебные крошки + useMatches</summary>

---

`useBreadcrumbs.js` использует `useMatches()` (React Router v6.4+). Каждый маршрут в конфиге передаёт `handle: { crumb: 'Название' }`. Хук собирает все совпавшие маршруты и строит цепочку крошек.

```js
// useBreadcrumbs.js
import { useMatches } from 'react-router-dom'

export default function useBreadcrumbs() {
  const matches = useMatches()
  return matches
    .filter(m => m.handle?.crumb)
    .map((m, i, arr) => ({
      label: typeof m.handle.crumb === 'function' ? m.handle.crumb(m.data) : m.handle.crumb,
      to:    i < arr.length - 1 ? m.pathname : null,  // последняя крошка — текущая страница
    }))
}
```

```jsx
// Breadcrumbs.jsx — компонент отображения
import { Link } from 'react-router-dom'
import useBreadcrumbs from '../../hooks/useBreadcrumbs'

function Breadcrumbs() {
  const crumbs = useBreadcrumbs()
  if (crumbs.length <= 1) return null

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <span>🏠</span>
      {crumbs.map((c, i) => (
        <span key={i} className="bc-item">
          <span className="bc-sep">/</span>
          {c.to ? <Link to={c.to} className="bc-link">{c.label}</Link>
                : <span className="bc-current">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}
```

---
</details>

<details>
<summary><a name="errorboundarypage"></a><b>💥 ErrorBoundaryPage.jsx</b> — обработка ошибок + useRouteError</summary>

---

Отображается как `errorElement` корневого маршрута. Использует `useRouteError()` для получения деталей ошибки.

```jsx
import { useRouteError, useNavigate, Link } from 'react-router-dom'

function ErrorBoundaryPage() {
  const error    = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="container page-content">
      <div className="not-found-emoji">💥</div>
      <h1>Произошла ошибка</h1>
      <p>{error?.statusText || error?.message || 'Неизвестная ошибка'}</p>
      <div className="not-found-actions">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Назад</button>
        <Link to="/" className="btn btn-secondary">🏠 На главную</Link>
      </div>
    </div>
  )
}
```

---
</details>

<details>
<summary><a name="notfoundpage"></a><b>🔍 NotFoundPage.jsx</b> — страница 404 + path="*"</summary>

---

Catch-all маршрут `path="*"`. Показывает текущий путь через `useLocation`, кнопку «Назад» через `useNavigate(-1)` и учебный блок с объяснением как работает 404 в React Router v6.

```jsx
import { useNavigate, Link, useLocation } from 'react-router-dom'

function NotFoundPage() {
  const navigate    = useNavigate()
  const { pathname } = useLocation()

  return (
    <main className="container page-content">
      <div className="not-found-emoji">🔍</div>
      <h1>404 — Страница не найдена</h1>
      <p>Маршрут <code>{pathname}</code> не существует.</p>
      <div className="not-found-actions">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Назад</button>
        <Link to="/" className="btn btn-secondary">🏠 На главную</Link>
      </div>
      <div className="router-info-box">
        <h3>Как работает 404 в React Router v6</h3>
        <ul>
          <li>Маршрут <code>path="*"</code> — «поймать всё» — указан последним в конфиге роутера.</li>
          <li><code>useLocation().pathname</code> → текущий путь: <code>{pathname}</code></li>
          <li><code>useNavigate()(-1)</code> → кнопка «Назад» программно.</li>
        </ul>
      </div>
    </main>
  )
}
```

---
</details>

<details>
<summary><a name="usestore-js"></a><b>🗄️ useStore.js</b> — Zustand единый стор</summary>

---

Центральное хранилище состояния на Zustand. Содержит `products`, `cart`, `favorites`, `orders`, `user`. Все мутации делегируются в `storageService` и синхронизируются с `localStorage`.

```js
import { create } from 'zustand'
import {
  getFavorites, getCart, getOrderHistory, getProducts,
  toggleFavorite as svcToggleFav, addToCart as svcAdd,
  removeFromCart as svcRemove, updateCartQty as svcQty,
  placeOrder as svcOrder,
} from '../services/storageService'

const useStore = create((set, get) => ({
  products:  getProducts(),
  favorites: getFavorites(),
  cart:      getCart(),
  orders:    getOrderHistory(),
  user:      JSON.parse(localStorage.getItem('auth_user') || 'null'),

  // Авторизация
  login(email, password)          { /* ... */ },
  logout()                        { localStorage.removeItem('auth_user'); set({ user: null }) },
  register(name, email, password) { /* ... */ },

  // Корзина
  addToCart(id)           { set({ cart: svcAdd(id) }) },
  removeFromCart(id)      { set({ cart: svcRemove(id) }) },
  updateCartQty(id, delta){ set({ cart: svcQty(id, delta) }) },

  // Избранное
  toggleFavorite(id)      { set({ favorites: svcToggleFav(id) }) },

  // Заказы
  placeOrder(fields)      { const order = svcOrder(fields); if (order) set({ cart: getCart(), orders: getOrderHistory() }) },
}))
```

---
</details>

---

## Как залить проект на GitHub

### 1. Первая загрузка (новый репозиторий)

```bash
# 1. Перейти в папку проекта
cd path/to/Inter_mag3/my-app

# 2. Инициализировать git-репозиторий
git init

# 3. Добавить все файлы в индекс
git add .

# 4. Сделать первый коммит
git commit -m "first commit"

# 5. Переименовать ветку в main
git branch -M main

# 6. Привязать удалённый репозиторий (создать его заранее на github.com)
git remote add origin https://github.com/вашЛогин/react_mag3.git

# 7. Отправить на GitHub
git push -u origin main
```

### 2. Последующие обновления (после изменений в коде)

```bash
# Посмотреть изменённые файлы
git status

# Добавить все изменения
git add .

# Сделать коммит с описанием изменений
git commit -m "feat: описание что добавлено"

# Отправить на GitHub
git push
```

### 3. Полезные команды

```bash
git log --oneline        # история коммитов
git diff                 # что изменилось (до git add)
git diff --staged        # что изменилось (после git add)
git remote -v            # проверить привязанный репозиторий
git branch               # список веток
git pull                 # получить изменения с GitHub
```

### 4. Соглашение по коммит-сообщениям

```
feat: добавить новый компонент
fix: исправить баг в корзине
style: обновить стили хедера
refactor: переработать логику фильтрации
docs: обновить README
```

> **Репозиторий:** https://github.com/Comanda7/react_mag3

---

## Лицензия

MIT  используйте свободно в учебных целях.

---

## Как выглядит репозиторий на GitHub и как этого добились

После выполнения всех команд выше репозиторий на GitHub выглядит так:

```
RishatRita77 / react_mag3                              Public

docs: add GitHub deployment guide to README   95ba0f6  1 minute ago

src/                    first commit           11 minutes ago
.gitignore              first commit           11 minutes ago
README.md               docs: add GitHub...    1 minute ago
index.html              first commit           11 minutes ago
package-lock.json       first commit           11 minutes ago
package.json            first commit           11 minutes ago
vite.config.js          first commit           11 minutes ago
```

### Что означает каждая строка

| Элемент | Что это |
|---------|---------|
| `RishatRita77 / react_mag3` | Имя пользователя / название репозитория |
| `Public` | Репозиторий открытый (виден всем) |
| `95ba0f6` | Хэш последнего коммита (короткий SHA) |
| `1 minute ago` | Когда был сделан последний коммит |
| `first commit` | Сообщение коммита, которым файл был добавлен |
| `docs: add GitHub...` | Сообщение второго коммита (обновление README) |

### Почему видно два коммита

```
first commit                          git commit -m "first commit"
docs: add GitHub deployment guide     git commit -m "docs: add GitHub..."
```

Были сделаны **два коммита**:
1. `git commit -m "first commit"`  загрузил все файлы проекта сразу
2. `git commit -m "docs: add GitHub deployment guide to README"`  добавил инструкцию в README.md

Именно поэтому у разных файлов разные подписи:
- `src/`, `index.html`, `package.json` и др.  помечены `first commit`
- `README.md`  помечен `docs: add GitHub deployment guide to README`

### Как повторить это с нуля

```bash
# Шаг 1  инициализация и первый коммит со ВСЕМИ файлами
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ВашЛогин/react_mag3.git
git push -u origin main

# Шаг 2  изменили только README.md, делаем второй коммит
git add README.md
git commit -m "docs: add GitHub deployment guide to README"
git push
```

> Каждый `git commit` создаёт **снимок** (snapshot) состояния файлов.
> На GitHub в списке файлов отображается **последний коммит, который затронул этот файл**.
