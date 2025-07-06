import { FaEdit, FaTrash } from 'react-icons/fa'

export default function VistaGaleriaPedidos({ pedidos, onEditar, onEliminar }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between gap-4"
        >
          <div>
            <h3 className="text-lg font-bold text-pink-300">Pedido #{pedido.id}</h3>
            <p><strong>Cliente:</strong> {pedido.cliente}</p>
            <p><strong>Fecha:</strong> {pedido.fecha}</p>
            <p><strong>Estado:</strong> <span className="capitalize">{pedido.estado}</span></p>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => onEditar?.(pedido.id)}
            >
              <FaEdit />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onEliminar?.(pedido.id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
