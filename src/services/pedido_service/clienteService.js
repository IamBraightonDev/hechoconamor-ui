// src/services/cliente_service/clienteService.js

const API_URL = 'https://rest-api-hechoconamor.onrender.com/api/v1/clients'

// Crear cliente
export async function crearCliente(cliente) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear cliente')
  }

  return await response.json()
}

// Obtener todos los clientes
export async function obtenerClientes() {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Error al obtener clientes')
  }
  return await response.json()
}

// Obtener cliente por ID
export async function obtenerClientePorId(id) {
  const response = await fetch(`${API_URL}/id/${id}`)
  if (!response.ok) {
    throw new Error('Error al obtener cliente')
  }
  return await response.json()
}

// Actualizar cliente
export async function actualizarCliente(id, cliente) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar cliente')
  }

  return await response.json()
}

// Eliminar cliente
export async function eliminarCliente(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Error al eliminar cliente')
  }
}

// Buscar cliente con coincidencia exacta en los 4 campos o crearlo si no existe
export async function buscarOCrearCliente(cliente) {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('No se pudo obtener la lista de clientes')
  }

  const clientes = await response.json()

  const existente = clientes.find(c =>
    c.nombre === cliente.nombre &&
    c.email === cliente.email &&
    c.telefono === cliente.telefono &&
    c.direccion === cliente.direccion
  )

  if (existente) {
    return existente // Reutiliza el cliente existente
  }

  // Si alguno de los campos no coincide, crea uno nuevo
  const crear = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  })

  if (!crear.ok) {
    const error = await crear.json()
    throw new Error(error.message || 'Error al crear cliente')
  }

  return await crear.json()
}
