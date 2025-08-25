import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_ONLY = ['/admin']
const USER_ONLY  = ['/user', '/app']

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

async function verifyJwt(token: string) {
    const secret = new TextEncoder().encode(process.env.JWT_PUBLIC_OR_SECRET)
    return jwtVerify(token, secret)
}

export async function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl

    if(pathname === '/' || 
       pathname.startsWith('/login') || 
       pathname.startsWith('/register') || 
       pathname.startsWith('/403') ||
       pathname.startsWith('/_next') || 
       pathname.startsWith('/api') ||
       pathname.startsWith('/public')) {
        return NextResponse.next()
    }

    const token = req.cookies.get('access_token')?.value

    if(!token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    let roles: number[] = []

    try {
        const {payload} = await verifyJwt(token)

        const raw = (payload as Record<string, unknown>)[ROLE_CLAIM]

        if(Array.isArray(raw)) {
            roles = raw.map((role: unknown) => Number(role)).filter(Number.isFinite)
        } else  if (raw != null) {
            const num = Number(raw)

            if(Number.isFinite(num)) {
                roles = [num]
            }
        }
    } catch {
        const url = new URL('/login', req.url)
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
    }

    if (ADMIN_ONLY.some((p: string) => pathname.startsWith(p)) && !roles.includes(1)) {
        return NextResponse.redirect(new URL('/403', req.url));
    }

    if (USER_ONLY.some((p: string) => pathname.startsWith(p)) && !(roles.includes(1) || roles.includes(2))) {
        return NextResponse.redirect(new URL('/403', req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'], 
}