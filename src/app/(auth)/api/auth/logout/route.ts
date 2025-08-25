import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    const cookie = await cookies()
    const token = cookie.get('access_token')?.value

    if (!token) {
        return NextResponse.json({ ok: false, error: 'No hay sesión activa' }, { status: 401 })
    }

    cookie.set('access_token', '', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        path: '/', 
        maxAge: 0 
    })

    cookie.set('user_roles', '', { 
        httpOnly: false, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        path: '/', 
        maxAge: 0 
    })

    return NextResponse.json({ ok: true })
}