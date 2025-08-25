import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

function extractRolesFromJWT(token: string): number[] {
    try {
        const [, payload] = token.split('.')
        const decodedPayload = JSON.parse(atob(payload))
        
        console.log('Extracting roles from JWT payload:', decodedPayload)
        
        let raw = decodedPayload[ROLE_CLAIM] as string | string[] | number | number[] | undefined
        
        if (raw === undefined) {
            const alternativeClaims = [
                'role',
                'roles', 
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role',
                'https://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ]
            
            for (const claim of alternativeClaims) {
                if (decodedPayload[claim] !== undefined) {
                    console.log(`Found role in claim "${claim}":`, decodedPayload[claim])
                    raw = decodedPayload[claim] as string | string[] | number | number[] | undefined
                    break
                }
            }
        }

        let roles: number[] = []

        if (Array.isArray(raw)) {
            roles = raw.map((role: string | number) => {
                const roleNum = typeof role === 'string' ? parseInt(role, 10) : Number(role)
                return Number.isFinite(roleNum) ? roleNum : 0
            }).filter(role => role > 0)
        } else if (raw != null) {
            const roleNum = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw)
            
            if (Number.isFinite(roleNum) && roleNum > 0) {
                roles = [roleNum]
            }
        }
        
        console.log('Extracted roles from JWT:', roles)
        return roles
    } catch (error) {
        console.error('Error extracting roles from JWT:', error)
        return []
    }
}

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

    const roles = extractRolesFromJWT(token)

    const cookieStore = await cookies()
    cookieStore.set('access_token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        path: '/', 
        maxAge: 60 * 60 * 2
    })

    return NextResponse.json({ 
        ...loginData,
        roles 
    })
}