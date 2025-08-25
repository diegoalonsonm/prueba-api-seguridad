'use client'

import { useRequireUser } from '@/hooks/useAuth'
import { AuthLoading } from '@/components/AuthLoading'

export default function User() {
    const { loading, userRoles } = useRequireUser('/login')

    if (loading) {
        return <AuthLoading message="Verificando permisos de usuario..." />
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Panel de Usuario</h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">👤 Área de Usuario</h2>
                <p><strong>Roles del usuario:</strong> {userRoles.join(', ')}</p>
                <p className="text-sm text-blue-600">Solo usuarios con rol de usuario regular (2) pueden acceder a esta página.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">📋 Mi Perfil</h3>
                    <p className="text-gray-600 mb-4">Gestionar información personal</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Editar Perfil
                    </button>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">📊 Mi Actividad</h3>
                    <p className="text-gray-600 mb-4">Ver historial de actividades</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Ver Actividad
                    </button>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">🔧 Configuración</h3>
                    <p className="text-gray-600 mb-4">Configurar preferencias</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Configurar
                    </button>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">📞 Soporte</h3>
                    <p className="text-gray-600 mb-4">Contactar con soporte</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Contactar
                    </button>
                </div>
            </div>
        </div>
    )
}