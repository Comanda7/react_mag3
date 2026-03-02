/** Форматирование цены в рублях */
export const formatPrice = (price) =>
  price.toLocaleString('ru-RU') + ' ₽'

/** Pluralize */
export function pluralize(n, forms) {
  const abs = Math.abs(n)
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod100 >= 11 && mod100 <= 19) return `${n} ${forms[2]}`
  if (mod10 === 1)                   return `${n} ${forms[0]}`
  if (mod10 >= 2 && mod10 <= 4)      return `${n} ${forms[1]}`
  return `${n} ${forms[2]}`
}

/** Цвет бейджа статуса заказа */
export function orderStatusColor(status) {
  const map = {
    'Новый':       '#3b82f6',
    'В обработке': '#f59e0b',
    'Подтверждён': '#8b5cf6',
    'Отправлен':   '#06b6d4',
    'Доставлен':   '#10b981',
    'Отменён':     '#ef4444',
  }
  return map[status] ?? '#6b7280'
}

/** Безопасный parseInt для URL-параметров */
export const safeInt = (v, fallback = undefined) => {
  const n = parseInt(v, 10)
  return isNaN(n) ? fallback : n
}
