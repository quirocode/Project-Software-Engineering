import { useState } from 'react'
import Cabecera      from '../components/Cabecera'
import Listado       from '../components/Listado'
import ModalRegistro from '../components/ModalRegistro'
import useNombre     from '../hooks/useNombre'

const CarritoPage = () => {
  const [showModal, setShowModal] = useState(false)
  const { items, registrarItem } = useNombre()
  const handleRegistrar = async (itemData) => {
    await registrarItem(itemData)
    setShowModal(false)
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecera title='Título de la página' />
      <Listado
items={items}
onOpenModal={() => setShowModal(true)}
/>
<ModalRegistro
visible={showModal}
onClose={() => setShowModal(false)}
onRegistrar={handleRegistrar}
/>
</div>
)
}
export default CarritoPage