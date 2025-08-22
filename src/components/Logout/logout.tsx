'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)

        await fetch('/api/auth/logout', { method: 'POST' })

        router.push('/login')
    }

    return (
    <button onClick={handleLogout} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50" disabled={loading}>
      {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  )
}