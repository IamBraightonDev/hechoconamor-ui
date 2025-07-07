import { FaEdit, FaTrash } from 'react-icons/fa'

// Función para mostrar los estados de forma legible
const formatearEstado = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente'
    case 'EN_PROCESO': return 'En proceso'
    case 'COMPLETADO': return 'Completado'
    case 'CANCELADO': return 'Cancelado'
    default: return 'Desconocido'
  }
}

export default function TablaPedidos({ pedidos, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow text-sm">
        <thead className="bg-pastelPink text-gray-700">
          <tr>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Cliente</th>
            <th className="px-3 py-2 text-left">Teléfono</th>
            <th className="px-3 py-2 text-left">Dirección</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Fecha Entrega</th>
            <th className="px-3 py-2 text-left">Estado</th>
            <th className="px-3 py-2 text-left">Detalles</th>
            <th className="px-3 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr
              key={pedido.id}
              className="border-t border-gray-200 hover:bg-pink-100 transition duration-200 hover:scale-100 hover:shadow-xl"
            >
              <td className="px-3 py-2">{pedido.id}</td>
              <td className="px-3 py-2">{pedido.clientNombre}</td>
              <td className="px-3 py-2">{pedido.clientTelefono || '—'}</td>
              <td className="px-3 py-2">{pedido.clientDireccion || '—'}</td>
              <td className="px-3 py-2">{pedido.clientEmail || '—'}</td>
              <td className="px-3 py-2">
                {pedido.fecha
                  ? new Date(new Date(pedido.fecha).getTime() - new Date().getTimezoneOffset() * 60000)
                      .toLocaleString('es-PE', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })
                  : 'No asignada'}
              </td>
              <td className="px-3 py-2 capitalize">{formatearEstado(pedido.estado)}</td>
              <td className="px-3 py-2">
                {pedido.detalles && pedido.detalles.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {pedido.detalles.map((detalle, idx) => (
                      <li key={idx} className="leading-tight">
                        {detalle.productNombre} - {detalle.cantidad} und
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400 italic">Sin detalles</span>
                )}
              </td>
              <td className="px-3 py-2">
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
