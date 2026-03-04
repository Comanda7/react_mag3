/**
 * useBreadcrumbs — hook
 * Использует useMatches() (React Router v6.4+) для автоматических хлебных крошек.
 * Каждый роут передаёт { handle: { crumb: 'Название' } } в конфиге роутера.
 *
 * @returns {Array<{ label: string, to: string|null }>}
 */
import { useMatches } from 'react-router-dom'

export default function useBreadcrumbs() {
  const matches = useMatches()

  return matches
    .filter(m => m.handle?.crumb)
    .map((m, i, arr) => ({
      label: typeof m.handle.crumb === 'function' ? m.handle.crumb(m.data) : m.handle.crumb,
      to:    i < arr.length - 1 ? m.pathname : null,   // последний элемент — текущая страница
    }))
}
