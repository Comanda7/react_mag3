function Pagination({ currentPage, totalPages, onPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="pagination">
      <button disabled={currentPage === 1}          onClick={() => onPage(1)}>«</button>
      <button disabled={currentPage === 1}          onClick={() => onPage(currentPage - 1)}>‹</button>
      <button className="active">{currentPage} / {totalPages}</button>
      <button disabled={currentPage === totalPages} onClick={() => onPage(currentPage + 1)}>›</button>
      <button disabled={currentPage === totalPages} onClick={() => onPage(totalPages)}>»</button>
    </div>
  )
}
export default Pagination
