import { create } from 'zustand'
import {
  getFavorites, getCart, getOrderHistory, getProducts, getProductStats,
  toggleFavorite as svcToggleFav, addToCart as svcAdd, removeFromCart as svcRemove,
  updateCartQty as svcQty, placeOrder as svcOrder, updateOrderStatus as svcStatus,
  updateProductStock as svcStock, updateProductImage as svcImage,
} from '../services/storageService'

const useStore = create((set, get) => ({
  products:  getProducts(),
  favorites: getFavorites(),
  cart:      getCart(),
  orders:    getOrderHistory(),
  stats:     getProductStats(),
  user:      JSON.parse(localStorage.getItem('auth_user') || 'null'),

  // ── Авторизация ──────────────────────────────────────────
  login(email, password) {
    const users = JSON.parse(localStorage.getItem('auth_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 email \u0438\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c'
    localStorage.setItem('auth_user', JSON.stringify(found))
    set({ user: found })
    return null
  },
  logout() {
    localStorage.removeItem('auth_user')
    set({ user: null })
  },
  register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('auth_users') || '[]')
    if (users.find(u => u.email === email))
      return '\u042d\u0442\u043e\u0442 email \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d'
    const newUser = { id: Date.now(), name, email, password }
    users.push(newUser)
    localStorage.setItem('auth_users', JSON.stringify(users))
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    set({ user: newUser })
    return null
  },

  toggleFavorite(id) { set({ favorites: svcToggleFav(id), stats: getProductStats() }) },

  addToCart(id)      { set({ cart: svcAdd(id),    stats: getProductStats() }) },
  removeFromCart(id) { set({ cart: svcRemove(id), stats: getProductStats() }) },
  updateCartQty(id, delta) { set({ cart: svcQty(id, delta) }) },

  placeOrder(fields) {
    const order = svcOrder(fields)
    if (order) set({ cart: getCart(), orders: getOrderHistory(), products: getProducts(), stats: getProductStats() })
    return order
  },

  updateOrderStatus(id, status) { set({ orders: svcStatus(id, status), stats: getProductStats() }) },
  updateProductStock(id, stock) { set({ products: svcStock(id, stock) }) },
  updateProductImage(id, imageUrl) { set({ products: svcImage(id, imageUrl) }) },

  cartCount:  () => get().cart.reduce((s, i) => s + i.quantity, 0),
  cartTotal:  () => get().cart.reduce((sum, item) => {
    const p = get().products.find(x => x.id === item.id)
    return sum + (p ? p.price * item.quantity : 0)
  }, 0),
}))

export default useStore
