/**
 * Хлебные крошки — компонент.
 * Читает данные из хука useBreadcrumbs который использует useMatches.
 */
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
          {c.to ? (
            <Link to={c.to} className="bc-link">{c.label}</Link>
          ) : (
            <span className="bc-current">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
