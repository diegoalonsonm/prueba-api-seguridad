'use client'

import { useRequireAdmin } from '@/hooks/useAuth'
import { AuthLoading } from '@/components/AuthLoading'

export default function Admin() {
    const { loading, userRoles } = useRequireAdmin('/login')

    if (loading) {
        return <AuthLoading message="Verificando permisos de administrador..." />
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Panel de Administración</h1>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">🔐 Área Restringida</h2>
                <p><strong>Roles del usuario:</strong> {userRoles.join(', ')}</p>
                <p className="text-sm text-red-600">Solo usuarios con rol de administrador (1) pueden acceder a esta página.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">👥 Gestión de Usuarios</h3>
                    <p className="text-gray-600 mb-4">Administrar usuarios del sistema</p>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        Ver Usuarios
                    </button>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">⚙️ Configuración</h3>
                    <p className="text-gray-600 mb-4">Configuración del sistema</p>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        Configurar
                    </button>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">📊 Reportes</h3>
                    <p className="text-gray-600 mb-4">Ver reportes del sistema</p>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        Ver Reportes
                    </button>
                </div>
            </div>
        </div>
    )
}