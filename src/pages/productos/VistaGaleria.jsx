import { FaEdit, FaTrash } from 'react-icons/fa'

export default function VistaGaleria({ productos, onEditar, onEliminar }) {
  const imagenFallback = 'https://www.trapp.com.br/wp-content/uploads/2022/12/baixa-3.jpg'

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.isArray(productos) && productos.length > 0 ? (
        productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border"
          >
            <img
              src={producto.imageUrl?.trim() || imagenFallback}
              alt={producto.name || 'Producto'}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = imagenFallback
              }}
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{producto.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {producto.description}
              </p>
              <p className="text-green-700 font-semibold">
                S/ {parseFloat(producto.price).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Estado: {producto.status?.name || producto.status || 'N/A'}
              </p>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => onEditar?.(producto.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => onEliminar?.(producto.id)}
                  className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          No hay productos disponibles.
        </p>
      )}
    </div>
  )
}
