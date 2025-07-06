import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

export default function FormularioPedido({ onPedidoCreado, cerrar, cargando, setCargando }) {
  const [pedido, setPedido] = useState({
    cliente: '',
    fecha: '',
    estado: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPedido({ ...pedido, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!pedido.cliente || !pedido.fecha || !pedido.estado) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    setCargando(true)
    try {
      // Aquí deberías llamar a tu servicio de creación, ej: await crearPedido(pedido)
      toast.success('Pedido registrado correctamente')
      onPedidoCreado()
      cerrar()
    } catch (error) {
      toast.error('Error al registrar pedido')
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
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl text-pink-300 font-bold">Registrar Pedido</h2>

        <input
          type="text"
          name="cliente"
          placeholder="Nombre del cliente"
          value={pedido.cliente}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="date"
          name="fecha"
          value={pedido.fecha}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <select
          name="estado"
          value={pedido.estado}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={cerrar}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando}
            className="px-4 py-2 rounded-lg bg-pink-300 text-white hover:bg-pink-500 disabled:opacity-50"
          >
            {cargando ? 'Guardando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
