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
import { crearProducto } from '../../services/productosService'

export default function FormularioProducto({
  nuevoProducto,
  setNuevoProducto,
  onProductoCreado,
  cargando,
  setCargando,
  cerrar,
}) {
  const [categorias, setCategorias] = useState([])
  const [colores, setColores] = useState([])
  const [materiales, setMateriales] = useState([])
  const [tamanios, setTamanios] = useState([])
  const [estados, setEstados] = useState([])

  useEffect(() => {
    const cargarDatos = async () => {
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

    cargarDatos()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const camposObligatorios = [
      'name', 'description', 'price',
      'categoryId', 'colorId', 'materialId', 'sizeId', 'statusId',
    ]

    for (const campo of camposObligatorios) {
      if (!nuevoProducto[campo]) {
        toast.error('Todos los campos son obligatorios')
        return
      }
    }

    // Si imageUrl está vacío, asignar imagen por defecto
    const imagenFinal = nuevoProducto.imageUrl?.trim() || 'https://www.trapp.com.br/wp-content/uploads/2022/12/baixa-3.jpg'

    const productoFormateado = {
      name: nuevoProducto.name,
      description: nuevoProducto.description,
      price: parseFloat(nuevoProducto.price),
      imageUrl: imagenFinal,
      categoryId: parseInt(nuevoProducto.categoryId),
      colorId: parseInt(nuevoProducto.colorId),
      materialId: parseInt(nuevoProducto.materialId),
      sizeId: parseInt(nuevoProducto.sizeId),
      statusId: parseInt(nuevoProducto.statusId),
    }

    setCargando(true)
    try {
      await crearProducto(productoFormateado)
      toast.success('Producto agregado correctamente')
      onProductoCreado()
      cerrar()
    } catch (error) {
      toast.error('Error al agregar producto')
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
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-pink-300 text-2xl font-bold">Agregar Producto</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.name}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, name: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        />

        <textarea
          placeholder="Descripción"
          value={nuevoProducto.description}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, description: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.price}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, price: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          placeholder="URL de la imagen"
          value={nuevoProducto.imageUrl}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, imageUrl: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        />

        <select
          value={nuevoProducto.categoryId}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, categoryId: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={nuevoProducto.colorId}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, colorId: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione color</option>
          {colores.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </select>

        <select
          value={nuevoProducto.materialId}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, materialId: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione material</option>
          {materiales.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.name}
            </option>
          ))}
        </select>

        <select
          value={nuevoProducto.sizeId}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, sizeId: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione tamaño</option>
          {tamanios.map((size) => (
            <option key={size.id} value={size.id}>
              {size.name}
            </option>
          ))}
        </select>

        <select
          value={nuevoProducto.statusId}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, statusId: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seleccione estado</option>
          {estados.map((est) => (
            <option key={est.id} value={est.id}>
              {est.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={cerrar}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando}
            className="px-4 py-2 rounded-lg bg-pink-300 text-white hover:bg-pink-400 disabled:opacity-50"
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
