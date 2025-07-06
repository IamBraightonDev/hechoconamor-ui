import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaPlus, FaTh, FaList, FaTrash } from 'react-icons/fa'
import TablaProductos from './TablaProductos'
import VistaGaleria from './VistaGaleria'
import FormularioProducto from './FormularioProducto'
import ModalConfirmacion from './ModalConfirmacion'
import EditarProducto from './EditarProducto'
import {
  obtenerProductos,
  eliminarProducto,
} from '../../services/productosService'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [idAEditar, setIdAEditar] = useState(null)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [idAEliminar, setIdAEliminar] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [cargando, setCargando] = useState(false)
  const [modoGaleria, setModoGaleria] = useState(true)
  const [nuevoProducto, setNuevoProducto] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    colorId: '',
    materialId: '',
    sizeId: '',
    statusId: '',
  })

  const imagenFallback = 'https://www.trapp.com.br/wp-content/uploads/2022/12/baixa-3.jpg'

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos()
      setProductos(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('Error al cargar productos')
      console.error(error)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleEliminar = async () => {
    if (!idAEliminar) return
    setCargando(true)
    try {
      await eliminarProducto(idAEliminar)
      toast.success('Producto eliminado correctamente')
      setProductos(productos.filter((p) => p.id !== idAEliminar))
      setMostrarConfirmacion(false)
    } catch (error) {
      toast.error('Error al eliminar producto')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  const productosFiltrados = productos
    .filter((p) =>
      p.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.category?.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((p) => {
      if (filtro === 'Todos') return true
      return p.status?.name === filtro || p.status === filtro
    })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-pastelPink">Productos</h1>
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
          placeholder="Buscar productos..."
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
          <option value="Activo">Activo</option>
          <option value="No activo">No activo</option>
          <option value="Descontinuado">Descontinuado</option>
        </select>
      </div>

      {cargando ? (
        <p className="text-gray-500 text-center py-8">Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay productos para mostrar.</p>
      ) : modoGaleria ? (
        <VistaGaleria
          productos={productosFiltrados}
          onEditar={(id) => setIdAEditar(id)}
          onEliminar={(id) => {
            setIdAEliminar(id)
            setMostrarConfirmacion(true)
          }}
        />
      ) : (
        <TablaProductos
          productos={productos}
          busqueda={busqueda}
          filtro={filtro}
          onEditar={(id) => setIdAEditar(id)}
          onEliminar={(id) => {
            setIdAEliminar(id)
            setMostrarConfirmacion(true)
          }}
        />
      )}

      <AnimatePresence>
        {mostrarFormulario && (
          <FormularioProducto
            nuevoProducto={nuevoProducto}
            setNuevoProducto={setNuevoProducto}
            onProductoCreado={cargarProductos}
            cargando={cargando}
            setCargando={setCargando}
            cerrar={() => {
              setMostrarFormulario(false)
              setNuevoProducto({
                name: '',
                description: '',
                price: '',
                imageUrl: '',
                categoryId: '',
                colorId: '',
                materialId: '',
                sizeId: '',
                statusId: '',
              })
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {idAEditar && (
          <EditarProducto
            idProducto={idAEditar}
            onClose={() => setIdAEditar(null)}
            onProductoActualizado={() => {
              cargarProductos()
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
