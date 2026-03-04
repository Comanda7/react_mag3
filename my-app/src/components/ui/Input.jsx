function Input({ label, className = '', ...props }) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input className={`input-field ${className}`} {...props} />
    </div>
  )
}
export default Input
