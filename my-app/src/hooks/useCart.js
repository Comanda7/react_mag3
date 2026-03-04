import useStore from '../store/useStore'
import { useNotify } from '../context/NotifyContext'

export default function useCart() {
  const notify        = useNotify()
  const cart          = useStore(s => s.cart)
  const products      = useStore(s => s.products)
  const addToCart     = useStore(s => s.addToCart)
  const removeFromCart= useStore(s => s.removeFromCart)
  const updateCartQty = useStore(s => s.updateCartQty)
  const placeOrder    = useStore(s => s.placeOrder)
  const cartCount     = useStore(s => s.cartCount)
  const cartTotal     = useStore(s => s.cartTotal)

  const handleAdd = (productId) => {
    const inCart = cart.some(i => i.id === productId)
    if (inCart) { removeFromCart(productId); notify?.push('Удалено из корзины', 'info') }
    else        { addToCart(productId);      notify?.push('Добавлено в корзину ✅') }
  }

  const handleCheckout = (fields) => {
    const order = placeOrder(fields)
    if (order) notify?.push(`Заказ #${order.id} оформлен! 🎉`)
    return order
  }

  return {
    cart, products,
    cartCount: cartCount(),
    cartTotal: cartTotal(),
    isInCart:  (id) => cart.some(i => i.id === id),
    handleAdd, handleCheckout, removeFromCart, updateCartQty,
  }
}
