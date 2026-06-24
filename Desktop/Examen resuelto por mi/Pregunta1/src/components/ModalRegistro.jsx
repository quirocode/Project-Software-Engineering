import { useState } from 'react'
// Props: visible, onClose, onRegistrar
const ModalRegistro = ({ visible, onClose, onRegistrar }) => {
    // Reemplaza estos useState con los campos de tu objeto
    const [nombre, setNombre] = useState('')
    const [precio, setPrecio] = useState(0)
    const [stock, setStock] = useState(0)
    // const [campo3, setCampo3] = useState(0)  // para números
    if (!visible) return null
    const handleSubmit = (e) => {
        e.preventDefault()
        onRegistrar({ nombre, precio, stock })  // reemplaza con tus campos
        setNombre(''); setPrecio(0); setStock(0)
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        >
            <div className="bg-white p-8 rounded-xl min-w-[360px] shadow-2xl">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                    Registrar
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* nn Repite este bloque por cada campo nn */}
                    <div className="mb-4 flex flex-col gap-1">
                        <label className="font-bold text-sm text-gray-500">Nombre</label>
                        <input className="border border-gray-300 rounded-md px-3 py-2"
                            type="text" value={nombre} required
                            onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div className="mb-4 flex flex-col gap-1">
                        <label className="font-bold text-sm text-gray-500">Precio:</label>
                        <input className="border border-gray-300 rounded-md px-3 py-2"
                            type="number" value={precio} required
                            onChange={(e) => setPrecio(e.target.value)} />
                    </div>
                    <div className="mb-4 flex flex-col gap-1">
                        <label className="font-bold text-sm text-gray-500">Stock:</label>
                        <input className="border border-gray-300 rounded-md px-3 py-2"
                            type="number" value={stock} required
                            onChange={(e) => setStock(e.target.value)} />
                    </div>
                    {/* Para campos numéricos usa type='number' y Number(e.target.value) */}
                    {/* <div className="mb-4 flex flex-col gap-1">        */}
                    {/*   <label className="font-bold text-sm">Campo3:</label>  */}
                    {/*   <input type="number" min={0}                    */}
                    {/*     value={campo3}                                */}
                    {/*     onChange={(e) => setCampo3(Number(e.target.value))} /> */}
                    {/* </div>                                             */}
                    <div className="flex gap-3 mt-6">
                        <button type='submit'
                            className='flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md'>
                            Registrar
                        </button>
                        <button type='button' onClick={onClose}
                            className='flex-1 py-2 bg-red-500 hover:bg-red-600 text-white roundedmd'>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ModalRegistro
