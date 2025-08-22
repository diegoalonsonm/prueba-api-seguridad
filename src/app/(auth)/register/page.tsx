'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

async function sha256Hex(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const bytes = new Uint8Array(hashBuffer)

    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function RegisterPage() {
    const router = useRouter()
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setServerError(null)

        if(!nombre || !correo || !password) {
            setServerError('Por favor, complete todos los campos requeridos')
            return 
        }

        if(password !== confirm) {
            setServerError('Las contraseñas no coinciden')
            return
        }

        setLoading(true)

        try {
            const passwordHash = await sha256Hex(password)

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    passwordHash,
                    correo
                })
            })

            if(!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.message || 'Error al registrar.');
            }

            setSuccessMsg('¡Usuario registrado correctamente!');
        
            setTimeout(() => router.push('/login'), 900);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setServerError(err.message || 'Error inesperado al registrar.');
            } else {
                setServerError('Error inesperado al registrar.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Crear cuenta</h1>
      <p className="text-sm text-gray-600 mb-6">
        Completá el formulario para crear tu cuenta.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-4" aria-describedby="form-help">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium">Nombre de usuario<span aria-hidden="true" className="text-red-600"> *</span></label>
          <input
            id="nombre"
            name="nombre"
            required
            autoComplete="username"
            className="mt-1 w-full rounded border px-3 py-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium">Correo<span aria-hidden="true" className="text-red-600"> *</span></label>
          <input
            id="correo"
            name="correo"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded border px-3 py-2"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Contraseña<span aria-hidden="true" className="text-red-600"> *</span></label>
          <input
            id="password"
            name="new-password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-help"
          />
          <p id="password-help" className="mt-1 text-xs text-gray-500">
            Mínimo 8 caracteres.
          </p>
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium">Confirmar contraseña<span aria-hidden="true" className="text-red-600"> *</span></label>
          <input
            id="confirm"
            name="confirm-password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded border px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {serverError && (
          <div role="alert" className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {serverError}
          </div>
        )}
        {successMsg && (
          <div role="status" className="rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>

        <p id="form-help" className="sr-only">
          Todos los campos marcados con asterisco son obligatorios.
        </p>
      </form>
    </main>
  )
}