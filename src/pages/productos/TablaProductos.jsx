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
            <th className="text-left px-4 py-3">Imagen</th>
            <th className="text-left px-4 py-3">ID</th>
            <th className="text-left px-4 py-3">Nombre</th>
            <th className="text-left px-4 py-3">Precio</th>
            <th className="text-left px-4 py-3">Stock</th>
            <th className="text-left px-4 py-3">Categoría</th>
            <th className="text-left px-4 py-3">Color</th>
            <th className="text-left px-4 py-3">Material</th>
            <th className="text-left px-4 py-3">Tamaño</th>
            <th className="text-left px-4 py-3">Estado</th>
            <th className="text-center px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((prod) => (
            <tr key={prod.id} className="border-b hover:bg-pink-100 transition">
              <td className="px-4 py-3">
                <img
                  src={prod.imageUrl || imagenFallback}
                  alt={prod.name}
                  className="w-12 h-12 object-cover rounded shadow"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = imagenFallback
                  }}
                />
              </td>
              <td className="px-4 py-3">{prod.id}</td>
              <td className="px-4 py-3">{prod.name}</td>
              <td className="px-4 py-3">S/ {prod.price}</td>
              <td className="px-4 py-3">{prod.stock ?? '0'}</td>
              <td className="px-4 py-3">{prod.category || 'Sin categoría'}</td>
              <td className="px-4 py-3">{prod.color || 'Sin color'}</td>
              <td className="px-4 py-3">{prod.material || 'Sin material'}</td>
              <td className="px-4 py-3">{prod.size || 'Sin tamaño'}</td>
              <td className="px-4 py-3">{prod.status || 'Sin estado'}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-3 h-full">
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
