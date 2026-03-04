import Breadcrumbs from '../components/ui/Breadcrumbs'

function AboutPage() {
  return (
    <main className="container page-content">
      <Breadcrumbs />
      <h1>📋 О нас</h1>
      <div className="content-card">
        <h2>TechStore — ваш надёжный магазин электроники</h2>
        <p>Широкий выбор смартфонов, ноутбуков и аксессуаров ведущих мировых производителей. Все товары сертифицированы.</p>
        <h3>Наши преимущества:</h3>
        <ul>
          <li>✅ Более 60 товаров в каталоге</li>
          <li>✅ Гарантия на всю продукцию</li>
          <li>✅ Быстрая доставка</li>
          <li>✅ Удобная система заказов</li>
        </ul>
        <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
          <div className="stat-card"><span className="stat-value">60+</span><span className="stat-label">Товаров</span></div>
          <div className="stat-card"><span className="stat-value">3</span><span className="stat-label">Категории</span></div>
          <div className="stat-card"><span className="stat-value">5★</span><span className="stat-label">Рейтинг</span></div>
        </div>
      </div>
    </main>
  )
}
export default AboutPage
