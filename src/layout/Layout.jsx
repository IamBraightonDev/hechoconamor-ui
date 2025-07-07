import Sidebar from '../components/Sidebar'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Layout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-patelCream overflow-y-auto">
        {/* Encabezado superior */}
        <div className="flex justify-between items-center px-6 py-4 border-b shadow bg-white">
          <div className="text-sm text-gray-600">
            Rol: <span className="font-semibold capitalize">{usuario.rol}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Contenido de cada página */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 flex-1"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
