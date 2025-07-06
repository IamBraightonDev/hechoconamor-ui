// src/pages/productos/ProductosVendedor.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTh, FaList, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import PageTransition from '../../components/PageTransition'

export default function ProductosVendedor() {
  const [productos, setProductos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modoGaleria, setModoGaleria] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [productoNuevo, setProductoNuevo] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    status: 'Disponible'
  })

  // Cargar desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('productosVendedor') || '[]')
    setProductos(data)
  }, [])

  // Guardar en localStorage
  const guardarProductos = (data) => {
    setProductos(data)
    localStorage.setItem('productosVendedor', JSON.stringify(data))
  }

  const handleAgregar = () => {
    const { name, description, price, imageUrl, status } = productoNuevo
    if (!name || !description || !price || !imageUrl || !status) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    const nuevo = {
      ...productoNuevo,
      id: Date.now()
    }

    const nuevos = [...productos, nuevo]
    guardarProductos(nuevos)
    toast.success('Producto agregado')
    setMostrarFormulario(false)
    setProductoNuevo({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      status: 'Disponible'
    })
  }

  const handleEliminar = (id) => {
    const nuevos = productos.filter((p) => p.id !== id)
    guardarProductos(nuevos)
    toast.success('Producto eliminado')
  }

  const productosFiltrados = productos
    .filter((p) =>
  p.name?.toLowerCase().includes(busqueda.toLowerCase())
)

    .filter((p) => (filtro === 'Todos' ? true : p.status === filtro))

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Título y botones */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-pastelLavender">Productos</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setModoGaleria(!modoGaleria)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-600"
            >
              {modoGaleria ? <FaList /> : <FaTh />}
              {modoGaleria ? 'Ver Lista' : 'Ver Galería'}
            </button>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
            >
              <FaPlus /> Agregar
            </button>
          </div>
        </div>

        {/* Filtros */}
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
            <option value="Disponible">Disponible</option>
            <option value="Agotado">Agotado</option>
            <option value="Descontinuado">Descontinuado</option>
          </select>
        </div>

        {/* Vista Galería */}
        {modoGaleria ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosFiltrados.map((prod) => (
              <motion.div
                key={prod.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="h-48 w-full bg-gray-200 overflow-hidden">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{prod.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {prod.description}
                  </p>
                  <p className="text-green-600 font-bold">
                    S/ {parseFloat(prod.price).toFixed(2)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Estado: {prod.status}
                    </span>
                    <button
                      onClick={() => handleEliminar(prod.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Vista Lista
          <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow-md">
            <thead>
              <tr className="bg-pastelBlue text-white">
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Precio</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((prod) => (
                <tr key={prod.id} className="text-center">
                  <td className="py-2 px-4">{prod.name}</td>
                  <td className="py-2 px-4">S/ {parseFloat(prod.price).toFixed(2)}</td>
                  <td className="py-2 px-4">{prod.status}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleEliminar(prod.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Formulario Modal */}
        <AnimatePresence>
          {mostrarFormulario && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h2 className="text-xl font-bold text-gray-700">Agregar Producto</h2>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={productoNuevo.name}
                  onChange={(e) => setProductoNuevo({ ...productoNuevo, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={productoNuevo.description}
                  onChange={(e) => setProductoNuevo({ ...productoNuevo, description: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={productoNuevo.price}
                  onChange={(e) => setProductoNuevo({ ...productoNuevo, price: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="URL de la imagen"
                  value={productoNuevo.imageUrl}
                  onChange={(e) => setProductoNuevo({ ...productoNuevo, imageUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <select
                  value={productoNuevo.status}
                  onChange={(e) => setProductoNuevo({ ...productoNuevo, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Agotado">Agotado</option>
                  <option value="Descontinuado">Descontinuado</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAgregar}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Agregar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
