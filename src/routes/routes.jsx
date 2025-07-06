import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout'
import Dashboard from '../pages/dashboard/index'
import DashboardVendedor from '../pages/dashboard/DashboardVendedor'
import DashboardRoleBased from '../pages/dashboard/DashboardRoleBased'
import Productos from '../pages/productos/index'
import ProductosVendedor from '../pages/productos/ProductosVendedor'
import EditarProducto from '../pages/productos/EditarProducto'
import Ventas from '../pages/ventas/index'
import VentasVendedor from '../pages/ventas/VentasVendedor'
import Insumos from '../pages/insumos/index'
import Produccion from '../pages/produccion/index'
import Pedidos from '../pages/pedidos/index'
import PedidosVendedor from '../pages/pedidos/PedidosVendedor'
import Usuarios from '../pages/usuarios/index'
import Reportes from '../pages/reportes/index'
import ReporteDetalle from '../pages/reportes/ReporteDetalle'
import ReporteGeneral from '../pages/reportes/ReporteGeneral'
import ReporteVentas from '../pages/reportes/ReporteVentas'
import ReporteProduccion from '../pages/reportes/ReporteProduccion'
import ReportePedidos from '../pages/reportes/ReportePedidos'
import ReporteInventario from '../pages/reportes/ReporteInventario'
import ReportesVendedor from '../pages/reportes/ReportesVendedor'
import Login from '../pages/login/index'
import RutaProtegida from './RutaProtegida'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <RutaProtegida rolesPermitidos={['administrador', 'vendedor']}>
            <DashboardRoleBased />
          </RutaProtegida>
        )
      },
      // Administrador
      {
        path: 'productos',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <Productos />
          </RutaProtegida>
        )
      },
      {
        path: 'productos/editar/:id',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <EditarProducto />
          </RutaProtegida>
        )
      },
      {
        path: 'ventas',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <Ventas />
          </RutaProtegida>
        )
      },
      {
        path: 'produccion',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <Produccion />
          </RutaProtegida>
        )
      },
      {
        path: 'insumos',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <Insumos />
          </RutaProtegida>
        )
      },
      {
        path: 'pedidos',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <Pedidos />
          </RutaProtegida>
        )
      },
      {
        path: 'usuarios',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <Usuarios />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <Reportes />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes/general',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <ReporteGeneral />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes/ventas',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <ReporteVentas />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes/produccion',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <ReporteProduccion />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes/pedidos',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <ReportePedidos />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes/inventario',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <ReporteInventario />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes/:tipo',
        element: (
          <RutaProtegida rolesPermitidos={['administrador']}>
            <ReporteDetalle />
          </RutaProtegida>
        )
      },

      // RUTAS DE VENDEDOR - CON COMPONENTES EXCLUSIVOS
      {
        path: 'productos-vendedor',
        element: (
          <RutaProtegida rolesPermitidos={['vendedor']}>
            <ProductosVendedor />
          </RutaProtegida>
        )
      },
      {
        path: 'ventas-vendedor',
        element: (
          <RutaProtegida rolesPermitidos={['vendedor']}>
            <VentasVendedor />
          </RutaProtegida>
        )
      },
      {
        path: 'pedidos-vendedor',
        element: (
          <RutaProtegida rolesPermitidos={['vendedor']}>
            <PedidosVendedor />
          </RutaProtegida>
        )
      },
      {
        path: 'reportes-vendedor',
        element: (
          <RutaProtegida rolesPermitidos={['vendedor']}>
            <ReportesVendedor />
          </RutaProtegida>
        )
      }
    ]
  }
])
