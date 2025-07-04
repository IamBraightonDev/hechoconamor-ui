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
        const [
          categoriasRes,
          coloresRes,
          materialesRes,
          tamaniosRes,
          estadosRes,
        ] = await Promise.all([
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

        // Puedes verificar si están vacíos:
        if (
          categoriasRes.length === 0 ||
          coloresRes.length === 0 ||
          materialesRes.length === 0 ||
          tamaniosRes.length === 0 ||
          estadosRes.length === 0
        ) {
          console.warn('⚠️ Algún catálogo vino vacío', {
            categoriasRes, coloresRes, materialesRes, tamaniosRes, estadosRes
          })
        }

      } catch (error) {
        toast.error('Error al cargar catálogos')
        console.error(error)
      }
    }

    cargarDatos()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !nuevoProducto.name ||
      !nuevoProducto.description ||
      !nuevoProducto.price ||
      !nuevoProducto.categoryId ||
      !nuevoProducto.colorId ||
      !nuevoProducto.materialId ||
      !nuevoProducto.sizeId ||
      !nuevoProducto.statusId
    ) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    const productoFormateado = {
      name: nuevoProducto.name,
      description: nuevoProducto.description,
      price: parseFloat(nuevoProducto.price),
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
        <h2 className="text-2xl font-bold">Agregar Producto</h2>

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

        {/* Select dinámicos */}
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

        {/* Botones */}
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
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
