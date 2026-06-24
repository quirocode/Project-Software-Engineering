import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CarritoPage from './pages/CarritoPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarritoPage/>
  </StrictMode>,
)
