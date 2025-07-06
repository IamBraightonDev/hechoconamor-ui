import { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useDatos } from '../../context/DataSimuladaContext'

export default function VentasVendedor() {
  const { ventas, agregarVenta, eliminarVenta } = useDatos()

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todas')
  const [ventaAEliminar, setVentaAEliminar] = useState(null)

  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: '',
    producto: '',
    total: '',
    estado: 'Completada',
  })

  const filtradas = ventas.filter((venta) => {
    const coincideBusqueda =
      venta.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.producto.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEstado = filtro === 'Todas' || venta.estado === filtro

    return coincideBusqueda && coincideEstado
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevaVenta({ ...nuevaVenta, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    agregarVenta(nuevaVenta)
    toast.success('Venta registrada correctamente')
    setNuevaVenta({
      cliente: '',
      producto: '',
      total: '',
      estado: 'Completada',
    })
    setMostrarFormulario(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-bold text-brandPrimary">Ventas</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pastelLavender text-gray-800 rounded-lg shadow hover:bg-pastelBlue transition"
        >
          <FaPlus /> Registrar Venta
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por cliente o producto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg shadow"
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-1/4 p-2 border rounded-lg shadow"
        >
          <option value="Todas">Todas</option>
          <option value="Completada">Completada</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtradas.map((venta, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition border-l-4 border-pastelLavender flex flex-col justify-between"
          >
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Cliente:</span> {venta.cliente}</p>
              <p><span className="font-semibold">Producto:</span> {venta.producto}</p>
              <p><span className="font-semibold">Total:</span> S/ {venta.total}</p>
              <p><span className="font-semibold">Fecha:</span> {venta.fecha}</p>
              <p>
                <span className="font-semibold">Estado:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  venta.estado === 'Completada'
                    ? 'bg-green-100 text-green-700'
                    : venta.estado === 'Pendiente'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {venta.estado}
                </span>
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setVentaAEliminar(venta)}
                className="text-red-500 hover:text-red-700"
                title="Eliminar venta"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-brandPrimary">Registrar Venta</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="cliente"
                  value={nuevaVenta.cliente}
                  onChange={handleChange}
                  placeholder="Nombre del cliente"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="producto"
                  value={nuevaVenta.producto}
                  onChange={handleChange}
                  placeholder="Producto vendido"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="total"
                  value={nuevaVenta.total}
                  onChange={handleChange}
                  placeholder="Total de la venta"
                  className="w-full p-2 border rounded"
                  required
                />
                <select
                  name="estado"
                  value={nuevaVenta.estado}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Completada">Completada</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pastelLavender rounded hover:bg-pastelBlue"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ventaAEliminar && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-red-600">¿Eliminar venta?</h2>
              <p className="text-sm text-gray-700">
                ¿Estás seguro de eliminar la venta de{' '}
                <strong>{ventaAEliminar.producto}</strong> para{' '}
                <strong>{ventaAEliminar.cliente}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setVentaAEliminar(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    eliminarVenta(ventaAEliminar.id)
                    toast.success('Venta eliminada correctamente')
                    setVentaAEliminar(null)
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
