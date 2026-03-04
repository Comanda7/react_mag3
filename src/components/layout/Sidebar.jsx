import { CATEGORY_NAMES } from '../../assets/products'

const ALL_CATS = [
  { key: 'all',         label: 'Все товары',              icon: '🏪' },
  { key: 'phones',      label: CATEGORY_NAMES.phones,      icon: '📱' },
  { key: 'laptops',     label: CATEGORY_NAMES.laptops,     icon: '💻' },
  { key: 'accessories', label: CATEGORY_NAMES.accessories, icon: '🎧' },
]

function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Категории</h3>
      <ul className="category-list">
        {ALL_CATS.map(({ key, label, icon }) => (
          <li key={key}>
            <button
              className={`category-btn${active === key ? ' active' : ''}`}
              onClick={() => onSelect(key)}
            >{icon} {label}</button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
export default Sidebar
