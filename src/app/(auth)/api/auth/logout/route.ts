import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    const cookie = await cookies()

    cookie.set('access_token', '', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        path: '/', 
        maxAge: 0 
    })

    return NextResponse.json({ ok: true })
}