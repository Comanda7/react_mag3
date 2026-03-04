import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NotifyProvider } from './context/NotifyContext'
import { AppRouter } from './router/index'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotifyProvider>
      <AppRouter />
    </NotifyProvider>
  </StrictMode>
)
