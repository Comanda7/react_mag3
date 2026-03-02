import { create } from 'zustand'
import {
  getFavorites, getCart, getOrderHistory, getProducts, getProductStats,
  toggleFavorite as svcToggleFav, addToCart as svcAdd, removeFromCart as svcRemove,
  updateCartQty as svcQty, placeOrder as svcOrder, updateOrderStatus as svcStatus,
  updateProductStock as svcStock,
} from '../services/storageService'

const useStore = create((set, get) => ({
  products:  getProducts(),
  favorites: getFavorites(),
  cart:      getCart(),
  orders:    getOrderHistory(),
  stats:     getProductStats(),

  toggleFavorite(id) { set({ favorites: svcToggleFav(id), stats: getProductStats() }) },

  addToCart(id)      { set({ cart: svcAdd(id),    stats: getProductStats() }) },
  removeFromCart(id) { set({ cart: svcRemove(id), stats: getProductStats() }) },
  updateCartQty(id, delta) { set({ cart: svcQty(id, delta) }) },

  placeOrder() {
    const order = svcOrder()
    if (order) set({ cart: getCart(), orders: getOrderHistory(), products: getProducts(), stats: getProductStats() })
    return order
  },

  updateOrderStatus(id, status) { set({ orders: svcStatus(id, status), stats: getProductStats() }) },
  updateProductStock(id, stock) { set({ products: svcStock(id, stock) }) },

  cartCount:  () => get().cart.reduce((s, i) => s + i.quantity, 0),
  cartTotal:  () => get().cart.reduce((sum, item) => {
    const p = get().products.find(x => x.id === item.id)
    return sum + (p ? p.price * item.quantity : 0)
  }, 0),
}))

export default useStore
