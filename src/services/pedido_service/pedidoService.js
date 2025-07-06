const API_URL = 'https://rest-api-hechoconamor.onrender.com/api/v1/orders'

export const obtenerPedidos = async () => {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Error al obtener pedidos')
  return await res.json()
}

export const crearPedido = async (pedido) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pedido),
  })
  if (!res.ok) throw new Error('Error al crear pedido')
  return await res.json()
}

export const obtenerPedidoPorId = async (id) => {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error('Error al obtener el pedido')
  return await res.json()
}

export const actualizarPedido = async (id, pedido) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pedido),
  })
  if (!res.ok) throw new Error('Error al actualizar pedido')
  return await res.json()
}

export const eliminarPedido = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error al eliminar pedido')
}
