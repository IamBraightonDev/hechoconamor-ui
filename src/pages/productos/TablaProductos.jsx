import { FaEdit, FaTrash } from 'react-icons/fa'

export default function TablaProductos({
  productos,
  busqueda,
  filtro,
  onEditar,
  onEliminar
}) {
  const productosFiltrados = Array.isArray(productos)
    ? productos.filter((prod) => {
        const coincideBusqueda =
          prod.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
          prod.category?.toLowerCase().includes(busqueda.toLowerCase())

        const coincideEstado = filtro === 'Todos' || prod.status === filtro

        return coincideBusqueda && coincideEstado
      })
    : []

  const imagenFallback = 'https://www.trapp.com.br/wp-content/uploads/2022/12/baixa-3.jpg'

  return (
    <div className="overflow-x-auto shadow rounded-xl">
      <table className="min-w-full bg-white text-sm rounded-xl">
        <thead className="bg-pastelPink text-gray-700">
          <tr>
            <th className="px-3 py-2 text-left">Imagen</th>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Nombre</th>
            <th className="px-3 py-2 text-left">Precio</th>
            <th className="px-3 py-2 text-left">Stock</th>
            <th className="px-3 py-2 text-left">Categoría</th>
            <th className="px-3 py-2 text-left">Color</th>
            <th className="px-3 py-2 text-left">Material</th>
            <th className="px-3 py-2 text-left">Tamaño</th>
            <th className="px-3 py-2 text-left">Estado</th>
            <th className="px-3 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((prod) => (
            <tr
              key={prod.id}
              className="border-t border-gray-200 hover:bg-pink-100 transition duration-200 hover:scale-100 hover:shadow-2xl"
            >
              <td className="px-3 py-2">
                <img
                  src={prod.imageUrl || imagenFallback}
                  alt={prod.name}
                  className="w-10 h-10 object-cover rounded shadow"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = imagenFallback
                  }}
                />
              </td>
              <td className="px-3 py-2">{prod.id}</td>
              <td className="px-3 py-2">{prod.name}</td>
              <td className="px-3 py-2">S/ {prod.price}</td>
              <td className="px-3 py-2">{prod.stock ?? '0'}</td>
              <td className="px-3 py-2">{prod.category || '—'}</td>
              <td className="px-3 py-2">{prod.color || '—'}</td>
              <td className="px-3 py-2">{prod.material || '—'}</td>
              <td className="px-3 py-2">{prod.size || '—'}</td>
              <td className="px-3 py-2">{prod.status || '—'}</td>
              <td className="px-3 py-2 text-center">
                <div className="flex justify-center items-center gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => onEditar?.(prod.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onEliminar?.(prod.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {productosFiltrados.length === 0 && (
            <tr>
              <td colSpan="11" className="text-center py-6 text-gray-500">
                No se encontraron productos que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
