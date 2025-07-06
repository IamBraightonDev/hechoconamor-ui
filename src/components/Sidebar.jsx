import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaChartBar,
  FaTools,
  FaUsers,
  FaShoppingCart
} from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Sidebar() {
  const location = useLocation()
  const { usuario } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [mostrarTextoLogo, setMostrarTextoLogo] = useState(false)


  const adminNavItems = [
    { name: 'Dashboard', path: '/', icon: <FaHome /> },
    { name: 'Productos', path: '/productos', icon: <FaBoxOpen /> },
    { name: 'Pedidos', path: '/pedidos', icon: <FaClipboardList /> },
    { name: 'Ventas', path: '/ventas', icon: <FaShoppingCart /> },
    { name: 'Insumos', path: '/insumos', icon: <FaTools /> },
    { name: 'Producción', path: '/produccion', icon: <FaChartBar /> },
    { name: 'Reportes', path: '/reportes', icon: <FaChartBar /> },
    { name: 'Usuarios', path: '/usuarios', icon: <FaUsers /> },
  ]

const vendedorNavItems = [
  { name: 'Dashboard', path: '/', icon: <FaHome /> },
  { name: 'Productos', path: '/productos-vendedor', icon: <FaBoxOpen /> },
  { name: 'Pedidos', path: '/pedidos-vendedor', icon: <FaClipboardList /> },
  { name: 'Ventas', path: '/ventas-vendedor', icon: <FaShoppingCart /> },
  { name: 'Reportes', path: '/reportes-vendedor', icon: <FaChartBar /> },
]


  const navItemsToRender =
    usuario?.rol === 'administrador'
      ? adminNavItems
      : usuario?.rol === 'vendedor'
      ? vendedorNavItems
      : []

  return (
<motion.div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => {
    setIsHovered(false)
    setMostrarTextoLogo(false) // Oculta el texto inmediatamente al colapsar
  }}
  animate={{ width: isHovered ? 240 : 80 }}
  transition={{ duration: 0.15 }}
  onAnimationComplete={() => {
    if (isHovered) setMostrarTextoLogo(true)
  }}
  className="h-screen bg-gradient-to-b from-pastelPink to-pastelLavender shadow-lg flex flex-col overflow-hidden"
>


      {/* Logo y texto */}
<div className="flex items-center gap-2 p-4">
  <img
    src="https://i.imgur.com/VTQsnCI.png"
    alt="Logo"
    className="w-10 h-10 rounded-full shadow-md"
  />
  {mostrarTextoLogo && (
    <h1 className="text-lg font-bold text-gray-800 transition-opacity duration-200">
      Hecho con Amor
    </h1>
  )}
</div>


      {/* Navegación */}
      <nav className="flex-1 px-2 space-y-1 mt-2">
        {navItemsToRender.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 p-3 rounded-lg font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-white text-pastelPink shadow-md'
                : 'text-gray-700 hover:bg-pastelBlue hover:text-gray-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isHovered && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {isHovered && (
        <p className="text-center text-xs text-gray-600 mb-4 mt-auto px-2">
          © {new Date().getFullYear()} Hecho con Amor
        </p>
      )}
    </motion.div>
  )
}
