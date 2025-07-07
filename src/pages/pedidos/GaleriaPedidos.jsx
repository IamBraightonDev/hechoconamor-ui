import { useState } from 'react'
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

// Función para mostrar los estados de forma legible
const formatearEstado = (estado) => {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente'
    case 'EN_PROCESO':
      return 'En proceso'
    case 'COMPLETADO':
      return 'Completado'
    case 'CANCELADO':
      return 'Cancelado'
    default:
      return 'Desconocido'
  }
}

export default function VistaGaleriaPedidos({ pedidos, onEditar, onEliminar }) {
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)

  const cerrarModal = () => setPedidoSeleccionado(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pedidos.map((pedido) => (
          <motion.div
            key={pedido.id}
            className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between gap-4 cursor-pointer transform transition duration-300 hover:scale-110 hover:shadow-2xl"
            onClick={() => setPedidoSeleccionado(pedido)}
            layout
          >
            <div>
              <h3 className="text-lg font-bold text-pink-300">Pedido #{pedido.id}</h3>
              <p><strong>Cliente:</strong> {pedido.clientNombre}</p>
              <p>
                <strong>Fecha de entrega:</strong>{' '}
                {pedido.fecha
                  ? new Date(new Date(pedido.fecha).getTime() - new Date().getTimezoneOffset() * 60000)
                    .toLocaleString('es-PE', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })
                  : 'No asignada'}
              </p>
              <p>
                <strong>Estado:</strong>{' '}
                <span className="capitalize">{formatearEstado(pedido.estado)}</span>
              </p>
            </div>

            <div
              className="flex justify-end gap-3 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
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
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {pedidoSeleccionado && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarModal}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={cerrarModal}
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-bold text-pink-400 mb-4">
                Detalles del Pedido #{pedidoSeleccionado.id}
              </h2>

              <p className="mt-3">
                <strong>Cliente:</strong> {pedidoSeleccionado.clientNombre}</p>
              <p className="mt-3">
                <strong>Teléfono:</strong> {pedidoSeleccionado.clientTelefono || 'No disponible'}</p>
              <p className="mt-3">
                <strong>Dirección:</strong> {pedidoSeleccionado.clientDireccion || 'No disponible'}</p>
              <p className="mt-3">
                <strong>Email:</strong> {pedidoSeleccionado.clientEmail || 'No disponible'}</p>

              <p className="mt-3">
                <strong>Fecha de entrega:</strong>{' '}
                {pedidoSeleccionado.fecha
                  ? new Date(new Date(pedidoSeleccionado.fecha).getTime() - new Date().getTimezoneOffset() * 60000)
                    .toLocaleString('es-PE', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })
                  : 'No asignada'}
              </p>

              <p className="mt-3">
                <strong>Estado:</strong> {formatearEstado(pedidoSeleccionado.estado)}</p>

              <div className="mt-3">
                <strong>Detalles:</strong>
                {pedidoSeleccionado.detalles?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {pedidoSeleccionado.detalles.map((d, i) => (
                      <li key={i}>
                        {d.productNombre} - {d.cantidad} unidad(es)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay detalles disponibles.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
