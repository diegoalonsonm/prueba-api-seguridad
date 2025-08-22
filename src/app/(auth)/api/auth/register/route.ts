import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()

    const res = await fetch(`${process.env.SEGURIDAD_API_BASE}/Usuario/RegistrarUsuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    console.log('a', {res})

    if(!res.ok){
        const error = await res.text()
        return NextResponse.json({ ok: false, error }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ ok: true, idUsuario: data })
}