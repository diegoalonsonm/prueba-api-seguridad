import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_ONLY = ['admin']
const USER_ONLY = ['/app', '/perfil']

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

async function verifyJWT(token: string){
    // En desarrollo, vamos a decodificar sin verificar para diagnosticar
    if (process.env.NODE_ENV === 'development') {
        try {
            console.log('=== JWT DEBUG (Development Mode) ===')
            const [header, payload] = token.split('.')
            const decodedHeader = JSON.parse(atob(header))
            const decodedPayload = JSON.parse(atob(payload))
            
            console.log('JWT Header:', decodedHeader)
            console.log('JWT Algorithm:', decodedHeader.alg)
            console.log('=== SKIPPING VERIFICATION IN DEV MODE ===')
            
            // Retornar sin verificar en desarrollo
            return { payload: decodedPayload }
        } catch (e) {
            console.error('Failed to decode JWT:', e)
            throw e
        }
    }
    
    // En producción, intentar verificar normalmente
    const secret = new TextEncoder().encode(process.env.JWT_PUBLIC_OR_SECRET!)
    try {
        const result = await jwtVerify(token, secret)
        return result
    } catch (error) {
        console.error('JWT verification failed with provided secret:', error)
        throw error
    }
}

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl

    if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/public') || pathname.startsWith('/_next') || pathname === '/') {
        return NextResponse.next();
    }

    const token = request.cookies.get('access_token')?.value
    
    if(!token) {
        const url = new URL('/login', request.url)
        url.searchParams.set('next', pathname)
        
        return NextResponse.redirect(url)
    }

    let roles: number[] = []

    try {
        const {payload} = await verifyJWT(token)
        
        console.log('=== MIDDLEWARE DEBUG ===')
        console.log('Full JWT Payload:', JSON.stringify(payload, null, 2))
        console.log('Looking for claim:', ROLE_CLAIM)
        console.log('Available claims:', Object.keys(payload))
        
        // Intentar diferentes formas de encontrar el rol
        const raw = payload[ROLE_CLAIM] as string | string[] | number | number[] | undefined
        
        console.log('Raw role value:', raw, 'Type:', typeof raw)
        
        // También buscar otras posibles ubicaciones del rol
        const alternativeClaims = [
            'role',
            'roles', 
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'
        ]
        
        for (const claim of alternativeClaims) {
            if (payload[claim] !== undefined) {
                console.log(`Found role in claim "${claim}":`, payload[claim])
            }
        }

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
        
        console.log('Final extracted roles:', roles)
        console.log('Current pathname:', pathname)
        console.log('=== END DEBUG ===')
    } catch (error) {
        console.error('JWT verification error:', error)
        const url = new URL('/login', request.url)
        url.searchParams.set('next', pathname)
        
        return NextResponse.redirect(url)
    }

    if(ADMIN_ONLY.some(path => pathname.startsWith(path))) {
        if(!roles.includes(1)) return NextResponse.redirect(new URL('/403', request.url))
    }

    if(USER_ONLY.some(path => pathname.startsWith(path))) {
        if(!roles.includes(2) || roles.includes(1)) {
            return NextResponse.redirect(new URL('/403', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api).*)']
}