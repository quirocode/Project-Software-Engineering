const Listado = ({ items, onOpenModal }) => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-slate-700">
        Título del listado
      </h2>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounde
d-md"
        onClick={onOpenModal}>
        + Registrar
      </button>
    </div>
    {items.length === 0 ? (
      <p className="text-gray-400 italic">No hay registros.</p>
    ) : (
      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            {/* Reemplaza estos th con tus campos */}
            <th className="bg-slate-800 text-white px-4 py-3 text-left">ID</th>
            <th className="bg-slate-800 text-white px-4 py-3 text-left">Nombre</th>
            <th className="bg-slate-800 text-white px-4 py-3 text-left">Precio</th>
            <th className="bg-slate-800 text-white px-4 py-3 text-left">Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              {/* Reemplaza estos td con tus campos */}
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">{item.nombre}</td>
              <td className="px-4 py-3">{item.precio}</td>
              <td className="px-4 py-3">{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)
export default Listado