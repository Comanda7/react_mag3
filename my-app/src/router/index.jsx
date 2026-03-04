/**
 * src/router/index.jsx
 * ─────────────────────────────────────────────────────────────
 * Централизованный конфиг роутера на базе createBrowserRouter (v6.4+).
 *
 * Возможности:
 *  ✅ createBrowserRouter + RouterProvider              — Data Router API
 *  ✅ React.lazy + <Suspense>                           — Code Splitting (lazy loading)
 *  ✅ ProtectedRoute                                    — защита Админки
 *  ✅ handle: { crumb }                                 — данные для хлебных крошек
 *  ✅ <ScrollRestoration />                             — автоскролл при переходе
 *  ✅ errorElement                                      — обработка ошибок маршрутов
 */

import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom'

import Header        from '../components/layout/Header'
import Footer        from '../components/layout/Footer'
import PageSpinner   from '../components/ui/PageSpinner'
import ErrorBoundaryPage from '../pages/ErrorBoundaryPage'
import useStore from '../store/useStore'

// ── Lazy-импорты страниц ────────────────────────────────────
// Каждая страница загружается ТОЛЬКО при первом посещении → меньше первоначальный бандл
const CatalogPage   = lazy(() => import('../pages/CatalogPage'))
const CartPage      = lazy(() => import('../pages/CartPage'))
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'))
const ProfilePage   = lazy(() => import('../pages/ProfilePage'))
const ProductPage   = lazy(() => import('../pages/ProductPage'))
const AboutPage     = lazy(() => import('../pages/AboutPage'))
const ContactsPage  = lazy(() => import('../pages/ContactsPage'))
const NotFoundPage  = lazy(() => import('../pages/NotFoundPage'))

const AdminLayout     = lazy(() => import('../pages/admin/AdminLayout'))
const AdminDashboard  = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminProducts   = lazy(() => import('../pages/admin/AdminProducts'))
const AdminOrders     = lazy(() => import('../pages/admin/AdminOrders'))
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'))

// ── Root Shell — общая обёртка со скроллом ─────────────────
function RootShell() {
  return (
    <>
      <ScrollRestoration />           {/* ← автоматический скролл вверх при переходе */}
      <div className="app-shell">
        <Header />
        <div className="app-body">
          {/* Suspense показывает спиннер, пока lazy-chunk грузится */}
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </div>
    </>
  )
}

// ── ProtectedRoute — только для Админки ────────────────────
function ProtectedRoute({ children }) {
  const user = useStore(s => s.user)
  if (user?.role !== 'admin') return <Navigate to="/" replace state={{ reason: 'auth' }} />
  return children
}

// ── AuthRoute — только для авторизованных ────────────────
function AuthRoute({ children }) {
  const user = useStore(s => s.user)
  if (!user) return <Navigate to="/" replace />
  return children
}

// ── Конфигурация роутера ────────────────────────────────────
const router = createBrowserRouter([
  {
    path:         '/',
    element:      <RootShell />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      // ── Публичные маршруты ───────────────────────────────
      {
        index:   true,
        element: <CatalogPage />,
        handle:  { crumb: 'Каталог' },
      },
      {
        path:    'favorites',
        element: <FavoritesPage />,
        handle:  { crumb: 'Избранное' },
      },
      {
        path:    'cart',
        element: <CartPage />,
        handle:  { crumb: 'Корзина' },
      },
      {
        path:    'profile',
        element: <AuthRoute><ProfilePage /></AuthRoute>,
        handle:  { crumb: 'Личный кабинет' },
      },
      {
        path:    'product/:id',    // ← useParams демонстрация
        element: <ProductPage />,
        handle:  { crumb: 'Товар' },
      },
      {
        path:    'about',
        element: <AboutPage />,
        handle:  { crumb: 'О нас' },
      },
      {
        path:    'contacts',
        element: <ContactsPage />,
        handle:  { crumb: 'Контакты' },
      },

      // ── Защищённый раздел: Администратор ────────────────
      {
        path:    'admin',
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        handle: { crumb: 'Администратор' },
        children: [
          { index:  true,           element: <AdminDashboard  />, handle: { crumb: 'Статистика' }    },
          { path: 'products',       element: <AdminProducts   />, handle: { crumb: 'Товары' }        },
          { path: 'orders',         element: <AdminOrders     />, handle: { crumb: 'Заказы' }        },
          { path: 'categories',     element: <AdminCategories />, handle: { crumb: 'Категории' }     },
        ],
      },

      // ── 404 ─────────────────────────────────────────────
      {
        path:    '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

/**
 * AppRouter — выводит <RouterProvider router={router}>
 * Оборачивается в NotifyProvider в main.jsx
 */
export function AppRouter() {
  return <RouterProvider router={router} />
}

export default router
