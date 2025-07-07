const API_URL = 'https://rest-api-hechoconamor.onrender.com/api/v1/orders'

// Obtener todos los pedidos
export async function obtenerPedidos() {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Error al obtener pedidos')
  }
  return await response.json()
}

// Obtener pedido por ID
export async function obtenerPedidoPorId(id) {
  const response = await fetch(`${API_URL}/id/${id}`)
  if (!response.ok) {
    throw new Error('Error al obtener el pedido por ID')
  }
  return await response.json()
}

// Crear nuevo pedido
export const crearPedido = async (pedido) => {
  // Asegurar formato ISO con segundos
  if (pedido.fechaEntrega && pedido.fechaEntrega.length === 16) {
    pedido.fechaEntrega += ':00'
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Detalles del error:', errorData)
    throw new Error(errorData?.error || 'Error al crear pedido')
  }

  return await response.json()
}

// Actualizar estado del pedido
export async function actualizarPedido(id, nuevoEstado) {
  const response = await fetch(`${API_URL}/${id}/status?status=${encodeURIComponent(nuevoEstado)}`, {
    method: 'PUT'
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('Detalles del error:', error)
    throw new Error(error?.error || 'Error al actualizar estado del pedido')
  }

  return await response.json()
}

// Actualizar fecha de entrega
export async function actualizarFechaEntrega(id, fecha) {
  // Asegurar formato con segundos
  if (fecha && fecha.length === 16) {
    fecha += ':00'
  }

  const response = await fetch(`${API_URL}/${id}/date`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fecha }) // clave correcta
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.message || 'Error al actualizar la fecha de entrega')
  }

  return await response.json()
}

// Eliminar pedido
export async function eliminarPedido(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Error al eliminar pedido')
  }

  return true
}
