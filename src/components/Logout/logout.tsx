'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)

        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' })
            
            localStorage.removeItem('user_roles')
            localStorage.removeItem('user_info')
            
            if (res.ok) {
                router.push('/login')
            } else {
                console.error('Error en logout, pero redirigiendo de todos modos')
                router.push('/login')
            }
        } catch (error) {
            console.error('Error en logout:', error)
            localStorage.removeItem('user_roles')
            localStorage.removeItem('user_info')
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

    return (
    <button onClick={handleLogout} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50" disabled={loading}>
      {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  )
}