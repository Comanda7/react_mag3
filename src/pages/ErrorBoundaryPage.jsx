/**
 * ErrorBoundaryPage — показывается при ошибке маршрута (errorElement).
 * Использует useRouteError() из React Router v6.4+.
 */
import { useRouteError, useNavigate, Link } from 'react-router-dom'

function ErrorBoundaryPage() {
  const error    = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="container page-content not-found-page">
      <div className="not-found-emoji">💥</div>
      <h1>Произошла ошибка</h1>
      <p className="empty-msg">{error?.statusText || error?.message || 'Неизвестная ошибка'}</p>
      <div className="not-found-actions">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Назад</button>
        <Link to="/" className="btn btn-secondary">🏠 На главную</Link>
      </div>
    </div>
  )
}

export default ErrorBoundaryPage
