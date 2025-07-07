import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { crearPedido } from '../../services/pedido_service/pedidoService'
import {
  crearCliente,
  obtenerClientes
} from '../../services/pedido_service/clienteService'
import { obtenerProductos } from '../../services/productosService'

export default function FormularioPedido({ onPedidoCreado, cerrar }) {
  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  })

  const [productosDisponibles, setProductosDisponibles] = useState([])
  const [detalles, setDetalles] = useState([{ productId: '', cantidad: 1 }])
  const [fechaEntrega, setFechaEntrega] = useState(() => {
    const ahora = new Date()
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset()) // para evitar desfase UTC
    return ahora.toISOString().slice(0, 16) // "yyyy-MM-ddThh:mm"
  })
  const [cargando, setCargando] = useState(false)
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductos()
        setProductosDisponibles(Array.isArray(data) ? data : [])
      } catch (error) {
        toast.error('Error al cargar productos')
        console.error(error)
      }
    }

    cargarProductos()
  }, [])

  const handleClienteChange = (e) => {
    const { name, value } = e.target
    setCliente(prev => ({ ...prev, [name]: value }))
  }

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...detalles]
    nuevosDetalles[index][field] = field === 'cantidad' ? parseInt(value) : value
    setDetalles(nuevosDetalles)
  }

  const agregarDetalle = () => {
    setDetalles([...detalles, { productId: '', cantidad: 1 }])
  }

  const eliminarDetalle = (index) => {
    const nuevos = detalles.filter((_, i) => i !== index)
    setDetalles(nuevos)
  }

  const buscarClienteExistente = async () => {
    const clientes = await obtenerClientes()
    return clientes.find(c => c.email === cliente.email)
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cliente.nombre || !cliente.email) {
      toast.error('Nombre y email del cliente son obligatorios')
      return
    }

    const detallesValidos = detalles.filter(d => d.productId && d.cantidad > 0)
    if (detallesValidos.length === 0) {
      toast.error('Debe agregar al menos un producto válido')
      return
    }

    if (!fechaEntrega) {
      toast.error('Debe seleccionar una fecha de entrega')
      return
    }

    setCargando(true)
    try {
      let clienteAsignado = await buscarClienteExistente()

      if (!clienteAsignado) {
        clienteAsignado = await crearCliente(cliente)
      }

      // Asegurar que la fecha tenga segundos
      const fechaConSegundos = fechaEntrega.includes(':')
        ? fechaEntrega + ':00'
        : fechaEntrega + 'T00:00:00'

      const nuevoPedido = {
        clientId: clienteAsignado.id,
        fecha: fechaEntrega, // ✅ esta es la corrección
        detalles: detallesValidos.map(d => ({
          productId: parseInt(d.productId),
          cantidad: parseInt(d.cantidad)
        }))
      }


      await crearPedido(nuevoPedido)

      toast.success('Pedido registrado exitosamente')
      onPedidoCreado()
      cerrar()

      // Resetear fecha y otros campos si deseas
      setFechaEntrega(() => {
        const ahora = new Date()
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset())
        return ahora.toISOString().slice(0, 16)
      })
    } catch (error) {
      toast.error(error.message || 'Error al registrar pedido')
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
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-pink-300">Registrar Pedido</h2>

        <h3 className="text-lg font-semibold text-gray-700">Datos del Cliente</h3>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={cliente.nombre}
          onChange={handleClienteChange}
          className="w-full p-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-300"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={cliente.email}
          onChange={handleClienteChange}
          className="w-full p-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-300"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={cliente.telefono}
          onChange={handleClienteChange}
          className="w-full p-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={cliente.direccion}
          onChange={handleClienteChange}
          className="w-full p-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <div className="relative">
          <input
            id="fechaEntrega"
            type="datetime-local"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            className={`peer w-full p-2 pt-5 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-300 ${fechaEntrega ? 'text-black' : 'text-gray-400'}`}
            style={{ colorScheme: 'light' }}
            step="60" // solo minutos
            placeholder="Fecha de entrega"
          />
          <label
            htmlFor="fechaEntrega"
            className="absolute left-2 top-1 text-sm text-gray-400 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-pink-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400"
          >
            Fecha de entrega
          </label>
        </div>

        <hr className="my-4 border-gray-300" />

        <h3 className="text-lg font-semibold text-gray-700">Detalles del Pedido</h3>

        {detalles.map((detalle, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 items-center">
            <select
              value={detalle.productId}
              onChange={(e) => handleDetalleChange(index, 'productId', e.target.value)}
              className="w-full sm:w-2/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            >
              <option value="">Seleccionar producto</option>
              {productosDisponibles.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={detalle.cantidad}
              onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
              className="w-full sm:w-1/3 p-2 border rounded-lg"
              required
            />

            {detalles.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarDetalle(index)}
                className="text-red-500 hover:underline text-sm"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={agregarDetalle}
          className="text-pink-500 hover:underline text-sm"
        >
          + Agregar otro producto
        </button>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={cerrar}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando}
            className="px-4 py-2 rounded-lg bg-pink-300 text-gray-700 hover:bg-pink-400 disabled:opacity-50 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
