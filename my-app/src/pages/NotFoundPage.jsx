/**
 * NotFoundPage — страница 404.
 * Маршрут: path="*" в конце конфига роутера.
 * Демонстрирует useNavigate и Link для возврата.
 */
import { useNavigate, Link, useLocation } from 'react-router-dom'

function NotFoundPage() {
  const navigate    = useNavigate()
  const { pathname } = useLocation()

  return (
    <main className="container page-content not-found-page">
      <div className="not-found-emoji">🔍</div>
      <h1>404 — Страница не найдена</h1>
      <p className="empty-msg">
        Маршрут <code>{pathname}</code> не существует.
      </p>
      <div className="not-found-actions">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <Link to="/" className="btn btn-secondary">
          🏠 На главную
        </Link>
      </div>

      <div className="router-info-box">
        <h3>Как работает 404 в React Router v6</h3>
        <ul>
          <li>Маршрут <code>path="*"</code> — «поймать всё» — указан последним в конфиге роутера.</li>
          <li><code>useLocation().pathname</code> → даёт текущий путь: <code>{pathname}</code></li>
          <li><code>useNavigate()(-1)</code> → кнопка «Назад» в браузере программно.</li>
        </ul>
      </div>
    </main>
  )
}

export default NotFoundPage
