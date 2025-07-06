import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  obtenerCategorias,
  obtenerColores,
  obtenerMateriales,
  obtenerTamanios,
  obtenerEstados,
} from '../../services/catalogoService'
import {
  obtenerProductoPorId,
  actualizarProducto,
} from '../../services/productosService'

export default function EditarProducto({ idProducto, onClose, onProductoActualizado }) {
  const [producto, setProducto] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [colores, setColores] = useState([])
  const [materiales, setMateriales] = useState([])
  const [tamanios, setTamanios] = useState([])
  const [estados, setEstados] = useState([])
  const [cargando, setCargando] = useState(false)

  // 1. Cargar catálogos primero
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [categoriasRes, coloresRes, materialesRes, tamaniosRes, estadosRes] =
          await Promise.all([
            obtenerCategorias(),
            obtenerColores(),
            obtenerMateriales(),
            obtenerTamanios(),
            obtenerEstados(),
          ])
        setCategorias(categoriasRes)
        setColores(coloresRes)
        setMateriales(materialesRes)
        setTamanios(tamaniosRes)
        setEstados(estadosRes)
      } catch (error) {
        toast.error('Error al cargar catálogos')
        console.error(error)
      }
    }
    cargarCatalogos()
  }, [])

  // 2. Cargar producto después de que los catálogos estén listos
  useEffect(() => {
    if (!idProducto || categorias.length === 0) return

    const cargarProducto = async () => {
      try {
        const prodData = await obtenerProductoPorId(idProducto)

        setProducto({
          ...prodData,
          categoryId: String(prodData.categoryId ?? ''),
          colorId: String(prodData.colorId ?? ''),
          materialId: String(prodData.materialId ?? ''),
          sizeId: String(prodData.sizeId ?? ''),
          statusId: String(prodData.statusId ?? ''),
        })
      } catch (error) {
        toast.error('Error al cargar producto')
        console.error(error)
      }
    }

    cargarProducto()
  }, [idProducto, categorias.length]) // esperar a que se carguen los catálogos

  const handleChange = (e) => {
    const { name, value } = e.target
    setProducto((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const camposObligatorios = [
      'name', 'description', 'price',
      'categoryId', 'colorId', 'materialId', 'sizeId', 'statusId',
    ]

    for (const campo of camposObligatorios) {
      if (!producto[campo]) {
        toast.error('Todos los campos son obligatorios')
        return
      }
    }

    const imagenFinal = producto.imageUrl?.trim() || 'https://www.trapp.com.br/wp-content/uploads/2022/12/baixa-3.jpg'

    const productoFormateado = {
      ...producto,
      price: parseFloat(producto.price),
      imageUrl: imagenFinal,
      categoryId: parseInt(producto.categoryId),
      colorId: parseInt(producto.colorId),
      materialId: parseInt(producto.materialId),
      sizeId: parseInt(producto.sizeId),
      statusId: parseInt(producto.statusId),
    }

    setCargando(true)
    try {
      await actualizarProducto(idProducto, productoFormateado)
      toast.success('Producto actualizado correctamente')
      onProductoActualizado()
      onClose()
    } catch (error) {
      toast.error('Error al actualizar producto')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  if (!producto) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl text-pink-300 font-bold">Editar Producto</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={producto.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={producto.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={producto.price}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="URL de la imagen"
          value={producto.imageUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <select
          name="categoryId"
          value={producto.categoryId}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="colorId"
          value={producto.colorId}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione color</option>
          {colores.map((color) => (
            <option key={color.id} value={String(color.id)}>
              {color.name}
            </option>
          ))}
        </select>

        <select
          name="materialId"
          value={producto.materialId}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione material</option>
          {materiales.map((mat) => (
            <option key={mat.id} value={String(mat.id)}>
              {mat.name}
            </option>
          ))}
        </select>

        <select
          name="sizeId"
          value={producto.sizeId}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione tamaño</option>
          {tamanios.map((size) => (
            <option key={size.id} value={String(size.id)}>
              {size.name}
            </option>
          ))}
        </select>

        <select
          name="statusId"
          value={producto.statusId}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione estado</option>
          {estados.map((est) => (
            <option key={est.id} value={String(est.id)}>
              {est.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando}
            className="px-4 py-2 rounded-lg bg-pink-300 text-gray-700 hover:bg-pink-400 disabled:opacity-50"
          >
            {cargando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
