// src/pages/pedidos/PedidosVendedor.jsx
import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'

export default function PedidosVendedor() {
  const [pedidos, setPedidos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [pedidoEditando, setPedidoEditando] = useState(null)
  const [pedidoEliminando, setPedidoEliminando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')

  const [nuevoPedido, setNuevoPedido] = useState({
    cliente: '',
    fecha: '',
    estado: 'Pendiente'
  })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('pedidosVendedor') || '[]')
    setPedidos(data)
  }, [])

  const guardarPedidos = (data) => {
    setPedidos(data)
    localStorage.setItem('pedidosVendedor', JSON.stringify(data))
  }

  const agregarPedido = (pedido) => {
    const nuevo = {
      ...pedido,
      id: Date.now(),
      codigo: 'PD-' + Math.floor(Math.random() * 100000)
    }
    guardarPedidos([...pedidos, nuevo])
  }

  const eliminarPedido = (id) => {
    const nuevos = pedidos.filter(p => p.id !== id)
    guardarPedidos(nuevos)
  }

  const editarPedido = (pedidoEditado) => {
    const nuevos = pedidos.map(p => p.id === pedidoEditado.id ? pedidoEditado : p)
    guardarPedidos(nuevos)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevoPedido({ ...nuevoPedido, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    agregarPedido(nuevoPedido)
    toast.success('Pedido registrado correctamente')
    setMostrarFormulario(false)
    setNuevoPedido({ cliente: '', fecha: '', estado: 'Pendiente' })
  }

  const handleActualizarEstado = () => {
    editarPedido(pedidoEditando)
    toast.success('Estado actualizado')
    setPedidoEditando(null)
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideBusqueda = pedido.cliente.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtro === 'Todos' || pedido.estado === filtro
    return coincideBusqueda && coincideEstado
  })

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'En proceso': return 'bg-blue-100 text-blue-800'
      case 'Entregado': return 'bg-green-100 text-green-800'
      case 'Cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-extrabold text-[#A459D1]">📦 Pedidos</h1>
        <button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2 px-5 py-2 bg-[#FDC5DC] text-gray-800 rounded-xl shadow hover:bg-[#F8A1BF] transition">
          <FaPlus /> Registrar Pedido
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" placeholder="Buscar por cliente" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full sm:w-1/2 p-3 border rounded-xl shadow-sm" />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full sm:w-1/4 p-3 border rounded-xl shadow-sm">
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidosFiltrados.map((pedido) => (
          <div key={pedido.id} className="bg-[#FBFBFB] border border-[#E7D1FF] rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold text-[#A459D1] mb-2">Pedido: {pedido.codigo}</h3>
            <p className="text-gray-700"><strong>Cliente:</strong> {pedido.cliente}</p>
            <p className="text-gray-700"><strong>Fecha:</strong> {pedido.fecha}</p>
            <p className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold shadow ${getBadgeColor(pedido.estado)}`}>{pedido.estado}</p>
            <div className="flex justify-end gap-3 mt-4">
              <button className="text-[#4D4DFF] hover:text-[#2D2DFF]" onClick={() => setPedidoEditando(pedido)}><FaEdit /></button>
              <button className="text-[#FF4D4D] hover:text-[#CC0000]" onClick={() => setPedidoEliminando(pedido)}><FaTrash /></button>
            </div>
          </div>
        ))}
        {pedidosFiltrados.length === 0 && <p className="text-center col-span-full text-gray-500">No hay pedidos disponibles.</p>}
      </div>

      {/* Formulario */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <h2 className="text-2xl font-bold mb-4 text-[#A459D1]">Registrar Pedido</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="cliente" value={nuevoPedido.cliente} onChange={handleChange} placeholder="Nombre del cliente" className="w-full p-3 border rounded" required />
                <input type="date" name="fecha" value={nuevoPedido.fecha} onChange={handleChange} className="w-full p-3 border rounded" required />
                <select name="estado" value={nuevoPedido.estado} onChange={handleChange} className="w-full p-3 border rounded">
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setMostrarFormulario(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-[#A7D3F5] rounded hover:bg-[#91C3EC]">Guardar</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editar estado */}
      <AnimatePresence>
        {pedidoEditando && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <h2 className="text-2xl font-bold mb-4 text-[#A459D1]">Editar Estado</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleActualizarEstado() }} className="space-y-4">
                <select value={pedidoEditando.estado} onChange={(e) => setPedidoEditando({ ...pedidoEditando, estado: e.target.value })} className="w-full p-3 border rounded">
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setPedidoEditando(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-[#B2F2BB] text-gray-800 rounded hover:bg-[#A3EBC0]">Guardar</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmar eliminar */}
      <AnimatePresence>
        {pedidoEliminando && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <h3 className="text-xl font-semibold mb-4 text-red-600">¿Eliminar pedido?</h3>
              <p className="mb-6">Estás a punto de eliminar el pedido de <strong>{pedidoEliminando.cliente}</strong>.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setPedidoEliminando(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                <button onClick={() => { eliminarPedido(pedidoEliminando.id); setPedidoEliminando(null); toast.success('Pedido eliminado') }} className="px-4 py-2 bg-[#F8C8C8] text-gray-800 rounded hover:bg-[#F6AAAA]">Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
