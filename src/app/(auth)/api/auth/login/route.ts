import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const { correo, passwordHash} = await request.json()

    const loginRes = await fetch(`${process.env.SEGURIDAD_API_BASE}/Autenticacion/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, passwordHash })
    })

    console.log({loginRes})

    if(!loginRes.ok) {
        const error = await loginRes.text()
        return NextResponse.json({ ok: false, error }, { status: loginRes.status })
    }

    const loginData = await loginRes.json()

    if(!loginData?.accessToken || !loginData?.validacionExitosa) {
        return NextResponse.json({ ok: false, error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = loginData.accessToken

    const cookieStore = await cookies()
    cookieStore.set('access_token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        path: '/', 
        maxAge: 60 * 60 * 2
    })

    return NextResponse.json(loginData)
}