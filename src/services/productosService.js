// src/services/productosService.js

const API_URL = 'https://rest-api-hechoconamor.onrender.com/api/v1/products'

export const obtenerProductos = async () => {
  try {
    const res = await fetch(API_URL)

    if (res.status === 404) {
      // Respuesta esperada cuando no hay productos
      console.warn('La API respondió 404 porque no hay productos.')
      return [] // devolvemos un array vacío
    }

    if (!res.ok) {
      const mensaje = await res.text()
      throw new Error(`Error ${res.status}: ${mensaje}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error en obtenerProductos:', error.message)
    throw new Error('Error al obtener productos')
  }
}

export async function obtenerProductoPorId(id) {
  const res = await fetch(`${API_URL}/id/${id}`)
  if (!res.ok) throw new Error('Error al obtener producto')
  return res.json()
}

export async function crearProducto(producto) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  })
  if (!res.ok) throw new Error('Error al crear producto')
  return res.json()
}

export async function actualizarProducto(id, producto) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  })
  if (!res.ok) throw new Error('Error al actualizar producto')
  return res.json()
}

export async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error al eliminar producto')
}
