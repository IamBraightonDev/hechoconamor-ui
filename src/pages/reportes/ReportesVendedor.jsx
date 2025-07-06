// src/pages/reportes/ReportesVendedor.jsx
import { motion } from 'framer-motion'
import PageTransition from '../../components/PageTransition'

export default function ReportesVendedor() {
  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold text-brandPrimary">📊 Tus Reportes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-pastelBlue/20 border border-pastelBlue rounded-xl p-4">
            <h2 className="text-lg font-semibold text-pastelBlue mb-1">Reporte de Ventas</h2>
            <p className="text-gray-700">Total del mes: <strong>S/ 185</strong></p>
          </div>
          <div className="bg-pastelPink/20 border border-pastelPink rounded-xl p-4">
            <h2 className="text-lg font-semibold text-pastelPink mb-1">Reporte de Pedidos</h2>
            <p className="text-gray-700">Pedidos completados: <strong>8</strong></p>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  )
}
