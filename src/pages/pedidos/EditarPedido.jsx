import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  obtenerPedidoPorId,
  actualizarPedido,
  actualizarFechaEntrega
} from '../../services/pedido_service/pedidoService'

export default function EditarPedido({ idPedido, onClose, onPedidoActualizado }) {
  const [estado, setEstado] = useState('')
  const [fecha, setFecha] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const data = await obtenerPedidoPorId(idPedido)
        setEstado(data.estado || '')

        if (data.fecha) {
          const fechaLocal = new Date(data.fecha)
          fechaLocal.setMinutes(fechaLocal.getMinutes() - fechaLocal.getTimezoneOffset())
          setFecha(fechaLocal.toISOString().slice(0, 16)) // yyyy-MM-ddTHH:mm
        }
      } catch (error) {
        toast.error('Error al cargar pedido')
        console.error(error)
      }
    }

    if (idPedido) cargarPedido()
  }, [idPedido])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!estado) {
      toast.error('Debe seleccionar un estado')
      return
    }

    setCargando(true)
    try {
      // Actualizar estado
      await actualizarPedido(idPedido, estado)

      // Actualizar fecha si fue proporcionada
      if (fecha) {
        // Quita la Z y los milisegundos para que sea compatible con LocalDateTime
        const localDate = new Date(fecha)
        localDate.setSeconds(0, 0)
        const fechaSinZona = localDate.toISOString().split('.')[0] // "2025-07-06T20:36:00"
        await actualizarFechaEntrega(idPedido, fechaSinZona)
      }

      toast.success('Pedido actualizado correctamente')
      onPedidoActualizado()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Error al actualizar pedido')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-pink-300">Editar Pedido</h2>

        <label className="block text-sm font-medium text-gray-700">Estado del Pedido</label>
        <select
          name="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Seleccione estado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>

        <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full p-2 border rounded-lg"
          step="60" // solo minutos, sin segundos
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando}
            className="px-4 py-2 rounded-lg bg-pink-300 text-gray-700 hover:bg-pink-400 disabled:opacity-50 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {cargando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
