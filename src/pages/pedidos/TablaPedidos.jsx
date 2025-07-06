import { FaEdit, FaTrash } from 'react-icons/fa'

export default function TablaPedidos({ pedidos, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
        <thead className="bg-pink-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="border-t border-gray-200 hover:bg-pink-50">
              <td className="px-4 py-3">{pedido.id}</td>
              <td className="px-4 py-3">{pedido.cliente}</td>
              <td className="px-4 py-3">{pedido.fecha}</td>
              <td className="px-4 py-3">{pedido.estado}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center items-center gap-3">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
