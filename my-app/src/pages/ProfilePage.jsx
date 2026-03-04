import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useStore from '../store/useStore'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { formatPrice, orderStatusColor } from '../utils/formatters'

function ProfilePage() {
  const { state } = useLocation()
  const recentOrderId = state?.fromOrder

  const orders   = useStore(s => s.orders)
  const products = useStore(s => s.products)
  const favorites= useStore(s => s.favorites)
  const cart     = useStore(s => s.cart)
  const [openOrder, setOpenOrder] = useState(recentOrderId ?? null)

  const favProducts  = products.filter(p => favorites.includes(p.id))
  const cartProducts = cart.map(i => ({ ...i, product: products.find(x => x.id === i.id) })).filter(i => i.product)
  const totalSpent   = orders.reduce((s, o) => s + (o.total || 0), 0)
  const cartTotal    = cartProducts.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <main className="container page-content">
      <Breadcrumbs />

      {/* Hero banner */}
      <div className="profile-hero">
        <div className="profile-avatar">&#128100;</div>
        <div className="profile-hero-info">
          <h1 className="profile-name">&#1051;&#1080;&#1095;&#1085;&#1099;&#1081; &#1082;&#1072;&#1073;&#1080;&#1085;&#1077;&#1090;</h1>
          <p className="profile-meta">&#1044;&#1086;&#1073;&#1088;&#1086; &#1087;&#1086;&#1078;&#1072;&#1083;&#1086;&#1074;&#1072;&#1090;&#1100; &#1074; TechStore!</p>
        </div>
        <div className="profile-hero-badge">
          <span className="profile-role-badge">&#1055;&#1086;&#1082;&#1091;&#1087;&#1072;&#1090;&#1077;&#1083;&#1100;</span>
        </div>
      </div>

      {recentOrderId && (
        <div className="order-success-banner">
          &#9989; &#1047;&#1072;&#1082;&#1072;&#1079; <strong>#{recentOrderId}</strong> &#1091;&#1089;&#1087;&#1077;&#1096;&#1085;&#1086; &#1086;&#1092;&#1086;&#1088;&#1084;&#1083;&#1077;&#1085;!
        </div>
      )}

      {/* Stat cards */}
      <div className="profile-stats">
        <div className="pstat-card pstat-purple">
          <span className="pstat-icon">&#128230;</span>
          <span className="pstat-value">{orders.length}</span>
          <span className="pstat-label">&#1047;&#1072;&#1082;&#1072;&#1079;&#1086;&#1074;</span>
        </div>
        <div className="pstat-card pstat-pink">
          <span className="pstat-icon">&#10084;&#65039;</span>
          <span className="pstat-value">{favProducts.length}</span>
          <span className="pstat-label">&#1048;&#1079;&#1073;&#1088;&#1072;&#1085;&#1085;&#1086;&#1077;</span>
        </div>
        <div className="pstat-card pstat-blue">
          <span className="pstat-icon">&#128722;</span>
          <span className="pstat-value">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          <span className="pstat-label">&#1042; &#1082;&#1086;&#1088;&#1079;&#1080;&#1085;&#1077;</span>
        </div>
        <div className="pstat-card pstat-green">
          <span className="pstat-icon">&#128176;</span>
          <span className="pstat-value">{orders.length ? formatPrice(totalSpent) : '\u2014'}</span>
          <span className="pstat-label">&#1055;&#1086;&#1090;&#1088;&#1072;&#1095;&#1077;&#1085;&#1086;</span>
        </div>
      </div>

      {/* Orders */}
      <section className="profile-section">
        <div className="section-header">
          <h2 className="section-title">&#128230; &#1048;&#1089;&#1090;&#1086;&#1088;&#1080;&#1103; &#1079;&#1072;&#1082;&#1072;&#1079;&#1086;&#1074;</h2>
          <span className="section-count">{orders.length}</span>
        </div>

        {orders.length === 0 ? (
          <div className="profile-empty">
            <span className="profile-empty-icon">&#128237;</span>
            <p>&#1047;&#1072;&#1082;&#1072;&#1079;&#1086;&#1074; &#1087;&#1086;&#1082;&#1072; &#1085;&#1077;&#1090;. &#1057;&#1072;&#1084;&#1086;&#1077; &#1074;&#1088;&#1077;&#1084;&#1103; &#1095;&#1090;&#1086;-&#1085;&#1080;&#1073;&#1091;&#1076;&#1100; &#1082;&#1091;&#1087;&#1080;&#1090;&#1100;!</p>
          </div>
        ) : (
          <div className="order-cards">
            {orders.map(o => (
              <div key={o.id} className={`order-card${openOrder === o.id ? ' order-card--open' : ''}${recentOrderId === o.id ? ' order-card--recent' : ''}`}>
                <button
                  className="order-card-header"
                  onClick={() => setOpenOrder(openOrder === o.id ? null : o.id)}
                >
                  <div className="order-card-id">#{String(o.id).slice(-6)}</div>
                  <div className="order-card-date">{o.date}</div>
                  <span className="status-badge" style={{ background: orderStatusColor(o.status) }}>{o.status}</span>
                  <div className="order-card-total">{formatPrice(o.total)}</div>
                  <span className="order-card-chevron">{openOrder === o.id ? '&#9650;' : '&#9660;'}</span>
                </button>

                {openOrder === o.id && (
                  <div className="order-card-body">
                    <table className="order-items-table">
                      <thead>
                        <tr><th>&#1058;&#1086;&#1074;&#1072;&#1088;</th><th>&#1062;&#1077;&#1085;&#1072;</th><th>&#1050;&#1086;&#1083;.</th><th>&#1057;&#1091;&#1084;&#1084;&#1072;</th></tr>
                      </thead>
                      <tbody>
                        {o.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{formatPrice(item.price)}</td>
                            <td>{item.quantity}</td>
                            <td className="order-item-sum">{formatPrice(item.sum)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="order-foot-label">&#1048;&#1090;&#1086;&#1075;&#1086;</td>
                          <td className="order-foot-total">{formatPrice(o.total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    {o.customer?.name && (
                      <div className="order-customer">
                        <span>&#128100; {o.customer.name}</span>
                        <span>&#128222; {o.customer.phone}</span>
                        <span>&#128205; {o.customer.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Favourites */}
      <section className="profile-section">
        <div className="section-header">
          <h2 className="section-title">&#10084;&#65039; &#1048;&#1079;&#1073;&#1088;&#1072;&#1085;&#1085;&#1086;&#1077;</h2>
          <span className="section-count">{favProducts.length}</span>
        </div>
        {favProducts.length === 0 ? (
          <div className="profile-empty">
            <span className="profile-empty-icon">&#129293;</span>
            <p>&#1044;&#1086;&#1073;&#1072;&#1074;&#1100;&#1090;&#1077; &#1090;&#1086;&#1074;&#1072;&#1088;&#1099; &#1074; &#1080;&#1079;&#1073;&#1088;&#1072;&#1085;&#1085;&#1086;&#1077; &#1080; &#1086;&#1085;&#1080; &#1087;&#1086;&#1103;&#1074;&#1103;&#1090;&#1089;&#1103; &#1079;&#1076;&#1077;&#1089;&#1100;.</p>
          </div>
        ) : (
          <div className="fav-grid">
            {favProducts.map(p => (
              <div key={p.id} className="fav-card">
                <div className="fav-card-img">{p.image}</div>
                <div className="fav-card-info">
                  <div className="fav-card-name">{p.name}</div>
                  <div className="fav-card-price">{formatPrice(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart preview */}
      <section className="profile-section">
        <div className="section-header">
          <h2 className="section-title">&#128722; &#1058;&#1077;&#1082;&#1091;&#1097;&#1072;&#1103; &#1082;&#1086;&#1088;&#1079;&#1080;&#1085;&#1072;</h2>
          <span className="section-count">{cartProducts.length}</span>
        </div>
        {cartProducts.length === 0 ? (
          <div className="profile-empty">
            <span className="profile-empty-icon">&#128722;</span>
            <p>&#1050;&#1086;&#1088;&#1079;&#1080;&#1085;&#1072; &#1087;&#1091;&#1089;&#1090;&#1072;.</p>
          </div>
        ) : (
          <div className="cart-preview">
            {cartProducts.map(i => (
              <div key={i.id} className="cart-preview-item">
                <span className="cart-preview-img">{i.product.image}</span>
                <span className="cart-preview-name">{i.product.name}</span>
                <span className="cart-preview-qty">&#215; {i.quantity}</span>
                <span className="cart-preview-sum">{formatPrice(i.product.price * i.quantity)}</span>
              </div>
            ))}
            <div className="cart-preview-footer">
              <span>&#1048;&#1090;&#1086;&#1075;&#1086; &#1074; &#1082;&#1086;&#1088;&#1079;&#1080;&#1085;&#1077;:</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
          </div>
        )}
      </section>

    </main>
  )
}

export default ProfilePage