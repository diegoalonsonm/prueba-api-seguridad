import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const {nombre, correo, passwordHash} = await request.json()

    const loginRes = await fetch(`${process.env.SEGURIDAD_API_BASE}/Autenticacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, passwordHash })
    })

    if(!loginRes.ok) {
        const error = await loginRes.text()
        return NextResponse.json({ ok: false, error }, { status: loginRes.status })
    }

    const loginData = await loginRes.json()

    if(!loginData?.accessToken || !loginData?.validacionExitosa) {
        return NextResponse.json({ ok: false, error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = loginData.accessToken

    const userRes = await fetch(`${process.env.SEGURIDAD_API_BASE}/Usuario/ObtenerUsuario`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo })
    })

    if(!userRes.ok) {
        const cookieStore = await cookies()
        cookieStore.set('access_token', token, {
            httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 2
        })

        return NextResponse.json({ ok: true, roles: []})
    }

    const userData = await userRes.json()
    const roles: string[] = Array.isArray(userData?.perfiles) ? userData.perfiles : []

    const cookieStore = await cookies()
    cookieStore.set('access_token', token, {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 2
    })

    cookieStore.set('roles', JSON.stringify(roles), {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 2
    })

    return NextResponse.json({ ok: true, roles })
}