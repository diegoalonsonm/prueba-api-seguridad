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
    const router = useRouter()
    const next = useSearchParams().get('next') ?? '/app'

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const passwordHash = await sha256Hex(password)

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, passwordHash })
        })

        console.log('a', {res})

        setLoading(false)

        if(res.ok) {
            const data = await res.json().catch(() => ({}))
            const roles: number[] = Array.isArray(data.roles) ? data.roles : []

            console.log(data)

            if(roles.includes(1)) {
                router.push('/admin')
            } else if(roles.includes(2)) {
                router.push('/user')
            } else {
                router.push('/403')
            }
        } else {
            alert('Login failed')
        }
    }

    return (
        <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-3">
            <input className="border p-2 w-full" placeholder="Correo" value={correo} onChange={e=>setCorreo(e.target.value)} />
            <input className="border p-2 w-full" placeholder="PasswordHash" value={password} onChange={e=>setPassword(e.target.value)} />
            <button disabled={loading} className="bg-black text-white px-4 py-2 w-full">{loading?'...':'Ingresar'}</button>
        </form>
    )
}