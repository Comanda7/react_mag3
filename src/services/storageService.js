import { PRODUCTS } from '../assets/products'

const parse = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function initStats() {
  const s = {}
  PRODUCTS.forEach(p => { s[p.id] = { inCart: 0, inFavorites: 0, ordered: 0, purchased: 0 } })
  return s
}

export const getFavorites    = () => parse('favorites',    [])
export const getCart         = () => parse('cart',         [])
export const getOrderHistory = () => parse('orderHistory', [])
export const getProductStats = () => parse('productStats', initStats())
export const getProducts     = () => parse('products',     PRODUCTS)

export const saveFavorites    = v => localStorage.setItem('favorites',    JSON.stringify(v))
export const saveCart         = v => localStorage.setItem('cart',         JSON.stringify(v))
export const saveOrderHistory = v => localStorage.setItem('orderHistory', JSON.stringify(v))
export const saveProductStats = v => localStorage.setItem('productStats', JSON.stringify(v))
export const saveProducts     = v => localStorage.setItem('products',     JSON.stringify(v))

export function toggleFavorite(productId) {
  const favorites = getFavorites()
  const stats = getProductStats()
  const idx = favorites.indexOf(productId)
  if (idx > -1) { favorites.splice(idx, 1); stats[productId].inFavorites = Math.max(0, (stats[productId].inFavorites || 0) - 1) }
  else           { favorites.push(productId); stats[productId].inFavorites = (stats[productId].inFavorites || 0) + 1 }
  saveFavorites(favorites); saveProductStats(stats)
  return favorites
}

export function addToCart(productId) {
  const cart = getCart(); const stats = getProductStats()
  if (!cart.find(i => i.id === productId)) { cart.push({ id: productId, quantity: 1 }); stats[productId].inCart = 1 }
  saveCart(cart); saveProductStats(stats); return cart
}

export function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId)
  const stats = getProductStats(); stats[productId].inCart = 0
  saveCart(cart); saveProductStats(stats); return cart
}

export function updateCartQty(productId, delta) {
  let cart = getCart()
  const item = cart.find(i => i.id === productId)
  if (!item) return cart
  item.quantity += delta
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId)
  saveCart(cart); return cart
}

export function placeOrder(customer = {}) {
  const cart = getCart(); if (!cart.length) return null
  const prods = getProducts(); const stats = getProductStats()
  const order = {
    id: Date.now(), date: new Date().toLocaleString('ru-RU'), status: 'Новый',
    customer,
    items: cart.map(item => {
      const p = prods.find(x => x.id === item.id)
      if (!p) return { id: item.id, name: `Товар #${item.id}`, price: 0, quantity: item.quantity, sum: 0 }
      return { id: item.id, name: p.name, price: p.price, quantity: item.quantity, sum: p.price * item.quantity }
    }),
    total: cart.reduce((s, item) => { const p = prods.find(x => x.id === item.id); return s + (p ? p.price * item.quantity : 0) }, 0),
  }
  const updatedProds = prods.map(p => {
    const ci = cart.find(i => i.id === p.id)
    if (ci) { if (stats[p.id]) stats[p.id].ordered = (stats[p.id].ordered || 0) + ci.quantity; return { ...p, stock: Math.max(0, p.stock - ci.quantity) } }
    return p
  })
  const history = getOrderHistory(); history.unshift(order)
  saveOrderHistory(history); saveProducts(updatedProds); saveProductStats(stats); saveCart([])
  return order
}

export function updateOrderStatus(orderId, status) {
  const history = getOrderHistory(); const stats = getProductStats()
  const order = history.find(o => o.id === orderId); if (!order) return history
  const prev = order.status; order.status = status
  const finalStatuses = ['Подтверждён', 'Отправлен', 'Доставлен']
  if (finalStatuses.includes(status) && !finalStatuses.includes(prev)) {
    order.items.forEach(item => { stats[item.id].purchased = (stats[item.id].purchased || 0) + item.quantity })
    saveProductStats(stats)
  }
  saveOrderHistory(history); return history
}

export function updateProductStock(productId, newStock) {
  const prods = getProducts().map(p => p.id === productId ? { ...p, stock: newStock } : p)
  saveProducts(prods); return prods
}
