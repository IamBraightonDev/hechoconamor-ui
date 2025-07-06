// src/pages/dashboard/DashboardRoleBased.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Dashboard from "./index";
import DashboardVendedor from "./DashboardVendedor";


export default function DashboardRoleBased() {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/login" />

  if (usuario.rol === 'vendedor') {
    return <DashboardVendedor />
  }

  return <Dashboard />
}
