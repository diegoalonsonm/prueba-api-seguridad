'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUserRoles, getUserInfo, type UserInfo } from '@/utils/auth'

interface UseAuthOptions {
    redirectTo?: string
    requiredRole?: number
    fallbackRoute?: string
}

interface UseAuthReturn {
    loading: boolean
    isAuth: boolean
    userRoles: number[]
    userInfo: UserInfo | null
    hasRole: (role: number) => boolean
    isAdmin: () => boolean
    isUser: () => boolean
}

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
    const {
        redirectTo = '/login',
        requiredRole,
        fallbackRoute = '/403'
    } = options

    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const [userRoles, setUserRoles] = useState<number[]>([])
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            // Verificar si está autenticado
            const authenticated = isAuthenticated()
            
            if (!authenticated) {
                console.log('❌ Usuario no autenticado, redirigiendo a:', redirectTo)
                const currentPath = window.location.pathname
                const redirectUrl = redirectTo.includes('?') 
                    ? `${redirectTo}&next=${encodeURIComponent(currentPath)}`
                    : `${redirectTo}?next=${encodeURIComponent(currentPath)}`
                router.push(redirectUrl)
                return
            }

            const roles = getUserRoles()
            const info = getUserInfo()

            // Verificar rol requerido si se especifica
            if (requiredRole && !roles.includes(requiredRole)) {
                console.log(`❌ Usuario no tiene el rol requerido: ${requiredRole}. Roles actuales:`, roles)
                router.push(fallbackRoute)
                return
            }

            console.log('✅ Usuario autenticado:', { roles, info })
            setIsAuth(true)
            setUserRoles(roles)
            setUserInfo(info)
            setLoading(false)
        }

        // Pequeño delay para asegurar que localStorage esté disponible
        const timer = setTimeout(checkAuth, 100)
        
        return () => clearTimeout(timer)
    }, [router, redirectTo, requiredRole, fallbackRoute])

    const hasRole = (role: number): boolean => {
        return userRoles.includes(role)
    }

    const isAdmin = (): boolean => {
        return userRoles.includes(1)
    }

    const isUser = (): boolean => {
        return userRoles.includes(2)
    }

    return {
        loading,
        isAuth,
        userRoles,
        userInfo,
        hasRole,
        isAdmin,
        isUser
    }
}

/**
 * Hook simplificado para páginas que solo necesitan verificar autenticación
 */
export function useRequireAuth(redirectTo: string = '/login') {
    return useAuth({ redirectTo })
}

/**
 * Hook para páginas que requieren rol específico
 */
export function useRequireRole(role: number, redirectTo: string = '/login', fallbackRoute: string = '/403') {
    return useAuth({ redirectTo, requiredRole: role, fallbackRoute })
}

/**
 * Hook para páginas de admin (requiere rol 1)
 */
export function useRequireAdmin(redirectTo: string = '/login') {
    return useAuth({ redirectTo, requiredRole: 1, fallbackRoute: '/403' })
}

/**
 * Hook para páginas de usuario regular (requiere rol 2)
 */
export function useRequireUser(redirectTo: string = '/login') {
    return useAuth({ redirectTo, requiredRole: 2, fallbackRoute: '/403' })
}
