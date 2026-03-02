/**
 * @typedef {'phones' | 'laptops' | 'accessories'} ProductCategory
 *
 * @typedef {Object} Product
 * @property {number}          id
 * @property {string}          name
 * @property {ProductCategory} category
 * @property {number}          price
 * @property {string}          image
 * @property {number}          stock
 *
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {number} quantity
 *
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {number} sum
 *
 * @typedef {'Новый'|'В обработке'|'Подтверждён'|'Отправлен'|'Доставлен'|'Отменён'} OrderStatus
 *
 * @typedef {Object} Order
 * @property {number}      id
 * @property {string}      date
 * @property {OrderItem[]} items
 * @property {number}      total
 * @property {OrderStatus} status
 *
 * @typedef {Object} ProductStat
 * @property {number} inCart
 * @property {number} inFavorites
 * @property {number} ordered
 * @property {number} purchased
 *
 * @typedef {Record<number, ProductStat>} ProductStats
 *
 * @typedef {Object} BreadcrumbItem
 * @property {string}       label
 * @property {string|null}  to    — null = текущая страница (не ссылка)
 */
export {}
