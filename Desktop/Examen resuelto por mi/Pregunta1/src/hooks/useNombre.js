import { useState, useEffect } from 'react'
const useNombre = () => {
  const [items, setItems] = useState([])
  // Trae todos los items del backend
  const fetchItems = async () => {
    const response = await fetch('/api/cart/items')
    const data = await response.json()
    setItems(data.items)
    // Si el backend devuelve el array directo: setItems(data)
  }
  // Se ejecuta una sola vez al cargar
  useEffect(() => {
    fetchItems()
  }, [])
  // Registra un item nuevo y refresca la lista
  const registrarItem = async (itemData) => {
    await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    })
    fetchItems()
  }
  return { items, registrarItem }
}
export default useNombre