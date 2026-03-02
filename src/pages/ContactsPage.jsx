import Breadcrumbs from '../components/ui/Breadcrumbs'

function ContactsPage() {
  return (
    <main className="container page-content">
      <Breadcrumbs />
      <h1>📞 Контакты</h1>
      <div className="content-card">
        <div className="contacts-grid">
          <div>
            <h3>Адрес</h3>
            <p>📍 г. Москва, ул. Технологическая, д. 1</p>
            <p>🕐 Пн–Пт: 9:00 – 20:00</p>
            <p>🕑 Суббота: 10:00 – 18:00</p>
          </div>
          <div>
            <h3>Связь</h3>
            <p>📞 +7 (800) 123-45-67</p>
            <p>📧 info@techstore.ru</p>
            <p>💬 Telegram: @techstore</p>
          </div>
        </div>
        <h3 style={{ marginTop: '1.5rem' }}>Написать нам</h3>
        <form className="contact-form" onSubmit={e => { e.preventDefault(); alert('Сообщение отправлено!') }}>
          <input className="input-field" type="text"  placeholder="Ваше имя"  required />
          <input className="input-field" type="email" placeholder="Email"      required />
          <textarea className="input-field" rows={4}  placeholder="Сообщение…" required />
          <button type="submit" className="btn btn-primary">Отправить</button>
        </form>
      </div>
    </main>
  )
}
export default ContactsPage
