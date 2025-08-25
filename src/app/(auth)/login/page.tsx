'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

async function sha256Hex(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const bytes = new Uint8Array(hashBuffer)

    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function LoginPage() {
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const next = useSearchParams().get('next') ?? '/app'

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('') // Limpiar errores previos

        try {
            const passwordHash = await sha256Hex(password)

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, passwordHash })
            })

            if(res.ok) {
                const data = await res.json()
                const roles: number[] = Array.isArray(data.roles) ? data.roles : []

                console.log('Login successful:', { data, roles })

                // Redirigir basado en roles o usar la URL 'next' si está disponible
                if(roles.includes(1)) {
                    router.push(next.startsWith('/admin') ? next : '/admin')
                } else if(roles.includes(2)) {
                    router.push(next.startsWith('/user') || next.startsWith('/app') ? next : '/user')
                } else {
                    console.warn('Usuario sin roles válidos')
                    router.push('/403')
                }
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Error de conexión' }))
                setError(errorData.error || 'Credenciales inválidas')
            }
        } catch (err) {
            console.error('Error en login:', err)
            setError('Error de conexión. Por favor, intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-sm mx-auto space-y-4">
            <form onSubmit={onSubmit} className="space-y-3">
                <input 
                    className="border p-2 w-full" 
                    placeholder="Correo" 
                    type="email"
                    value={correo} 
                    onChange={e=>setCorreo(e.target.value)}
                    required 
                />
                <input 
                    className="border p-2 w-full" 
                    placeholder="Contraseña" 
                    type="password"
                    value={password} 
                    onChange={e=>setPassword(e.target.value)}
                    required 
                />
                <button 
                    disabled={loading} 
                    className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
        </div>
    )
}