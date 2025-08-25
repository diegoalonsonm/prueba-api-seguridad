'use client'

import Link from 'next/link'
import { useRequireAuth } from '@/hooks/useAuth'
import { AuthLoading } from '@/components/AuthLoading'

export default function AppPage() {
    const { loading, userRoles, isAdmin, isUser } = useRequireAuth('/login')

    if (loading) {
        return <AuthLoading />
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Bienvenido a la Aplicación</h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">Información del Usuario</h2>
                <p><strong>Roles:</strong> {userRoles.join(', ')}</p>
                <p><strong>Tipo de usuario:</strong> {
                    isAdmin() ? 'Administrador' :
                    isUser() ? 'Usuario Regular' :
                    'Sin rol específico'
                }</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Acceso General</h3>
                    <p className="text-gray-600 mb-4">
                        Esta página está disponible para todos los usuarios autenticados.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        <li>Ver información básica</li>
                        <li>Acceso a funciones generales</li>
                        <li>Configuración de perfil</li>
                    </ul>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Enlaces Rápidos</h3>
                    <div className="space-y-2">
                        {isAdmin() && (
                            <Link 
                                href="/admin" 
                                className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-center"
                            >
                                🔧 Panel de Administración
                            </Link>
                        )}
                        {isUser() && (
                            <Link 
                                href="/user" 
                                className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-center"
                            >
                                👤 Panel de Usuario
                            </Link>
                        )}
                        <Link 
                            href="/" 
                            className="block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-center"
                        >
                            🏠 Página de Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
