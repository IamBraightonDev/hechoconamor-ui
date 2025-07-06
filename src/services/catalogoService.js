const API_URL = 'https://rest-api-hechoconamor.onrender.com/api/v1/product'

export async function obtenerCategorias() {
  const res = await fetch(`${API_URL}/categories`)
  if (!res.ok) throw new Error('Error al obtener categorías')
  return await res.json()
}

export async function obtenerColores() {
  const res = await fetch(`${API_URL}/colors`)
  if (!res.ok) throw new Error('Error al obtener colores')
  return await res.json()
}

export async function obtenerMateriales() {
  const res = await fetch(`${API_URL}/materials`)
  if (!res.ok) throw new Error('Error al obtener materiales')
  return await res.json()
}

export async function obtenerTamanios() {
  const res = await fetch(`${API_URL}/size`)
  if (!res.ok) throw new Error('Error al obtener tamaños')
  return await res.json()
}

export async function obtenerEstados() {
  const res = await fetch(`${API_URL}/status`)
  if (!res.ok) throw new Error('Error al obtener estados')
  return await res.json()
}
