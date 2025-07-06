import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaPlus, FaTh, FaList } from 'react-icons/fa'

import VistaGaleriaPedidos from './GaleriaPedidos'
import TablaPedidos from './TablaPedidos'
import FormularioPedido from './FormularioPedido'
import ModalConfirmacion from '../productos/ModalConfirmacion'
import EditarPedido from './EditarPedido'

import {
  obtenerPedidos,
  eliminarPedido
} from '../../services/pedido_service/pedidoService'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [idAEditar, setIdAEditar] = useState(null)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [idAEliminar, setIdAEliminar] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [modoGaleria, setModoGaleria] = useState(true)
  const [cargando, setCargando] = useState(false)

  const cargarPedidos = async () => {
    try {
      const data = await obtenerPedidos()
      setPedidos(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('Error al cargar pedidos')
      console.error(error)
    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  const handleEliminar = async () => {
    if (!idAEliminar) return
    setCargando(true)
    try {
      await eliminarPedido(idAEliminar)
      toast.success('Pedido eliminado correctamente')
      setPedidos(pedidos.filter((p) => p.id !== idAEliminar))
      setMostrarConfirmacion(false)
    } catch (error) {
      toast.error('Error al eliminar pedido')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  const pedidosFiltrados = pedidos
    .filter((p) =>
      p.cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.estado?.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((p) => {
      if (filtro === 'Todos') return true
      return p.estado === filtro
    })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-pink-300">📦 Pedidos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setModoGaleria(!modoGaleria)}
            className="bg-pastelPink text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-300"
          >
            {modoGaleria ? <FaList /> : <FaTh />}
          </button>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-pastelPink text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-300"
          >
            <FaPlus /> Agregar
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar pedidos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg"
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Procesado">Procesado</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {cargando ? (
        <p className="text-gray-500 text-center py-8">Cargando pedidos...</p>
      ) : pedidosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay pedidos para mostrar.</p>
      ) : modoGaleria ? (
        <VistaGaleriaPedidos
          pedidos={pedidosFiltrados}
          onEditar={(id) => setIdAEditar(id)}
          onEliminar={(id) => {
            setIdAEliminar(id)
            setMostrarConfirmacion(true)
          }}
        />
      ) : (
        <TablaPedidos
          pedidos={pedidosFiltrados}
          onEditar={(id) => setIdAEditar(id)}
          onEliminar={(id) => {
            setIdAEliminar(id)
            setMostrarConfirmacion(true)
          }}
        />
      )}

      <AnimatePresence>
        {mostrarFormulario && (
          <FormularioPedido
            onPedidoCreado={cargarPedidos}
            cerrar={() => setMostrarFormulario(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {idAEditar && (
          <EditarPedido
            idPedido={idAEditar}
            onClose={() => setIdAEditar(null)}
            onPedidoActualizado={() => {
              cargarPedidos()
              setIdAEditar(null)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mostrarConfirmacion && (
          <ModalConfirmacion
            onCancelar={() => setMostrarConfirmacion(false)}
            onEliminar={handleEliminar}
            cargando={cargando}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
