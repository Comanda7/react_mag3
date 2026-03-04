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
/                     CatalogPage     (useSearchParams — фильтры в URL)
/product/:id          ProductPage     (useParams)
/favorites            FavoritesPage
/cart                 CartPage        (useNavigate с state)
/profile              ProfilePage     (useLocation.state)
/about                AboutPage
/contacts             ContactsPage
/admin                AdminLayout (protected; Outlet для вложенных)
  /admin              AdminDashboard  (index route)
  /admin/products     AdminProducts
  /admin/orders       AdminOrders
  /admin/categories   AdminCategories
*                     NotFoundPage    (404)
— errorElement —      ErrorBoundaryPage (useRouteError)
```

## Структура проекта

```
src/
  router/
    index.jsx          ← ВСЯ конфигурация маршрутов
  pages/
    CatalogPage.jsx    ← useSearchParams
    ProductPage.jsx    ← useParams
    CartPage.jsx       ← useNavigate
    ProfilePage.jsx    ← useLocation
    FavoritesPage.jsx
    AboutPage.jsx
    ContactsPage.jsx
    NotFoundPage.jsx   ← 404 catch-all
    ErrorBoundaryPage.jsx ← useRouteError
    admin/
      AdminLayout.jsx  ← NavLink + Outlet (nested routes)
      AdminDashboard.jsx
      AdminProducts.jsx
      AdminOrders.jsx
      AdminCategories.jsx
  hooks/
    useBreadcrumbs.js  ← useMatches
    useCart.js
    useFavorites.js
  components/
    layout/
      Header.jsx       ← NavLink, useNavigate (поиск)
      Footer.jsx       ← useLocation
      Sidebar.jsx
    ui/
      Breadcrumbs.jsx  ← useBreadcrumbs hook
      PageSpinner.jsx  ← Suspense fallback
      ProductCard.jsx  ← Link to /product/:id
      Button.jsx
      Input.jsx
      Pagination.jsx
  store/useStore.js
  context/NotifyContext.jsx
  assets/products.js
  App.css
  main.jsx
```

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
