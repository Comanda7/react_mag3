import { createContext, useContext, useState, useCallback } from 'react'

const NotifyContext = createContext(null)

export function NotifyProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }, [])

  return (
    <NotifyContext.Provider value={{ push }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </NotifyContext.Provider>
  )
}

export const useNotify = () => useContext(NotifyContext)
