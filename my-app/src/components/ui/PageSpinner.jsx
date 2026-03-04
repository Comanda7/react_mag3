/** Полноэкранный спиннер для Suspense fallback */
function PageSpinner() {
  return (
    <div className="page-spinner">
      <div className="spinner" />
      <p>Загрузка…</p>
    </div>
  )
}

export default PageSpinner
