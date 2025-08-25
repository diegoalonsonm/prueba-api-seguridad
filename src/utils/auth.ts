export interface UserInfo {
    roles: number[]
    loginTime: string
    validacionExitosa: boolean
}

export function getUserRoles(): number[] {
    if (typeof window === 'undefined') return [] 
    
    try {
        const roles = localStorage.getItem('user_roles')
        return roles ? JSON.parse(roles) : []
    } catch {
        return []
    }
}

export function getUserInfo(): UserInfo | null {
    if (typeof window === 'undefined') return null 
    
    try {
        const userInfo = localStorage.getItem('user_info')
        return userInfo ? JSON.parse(userInfo) : null
    } catch {
        return null
    }
}

export function hasRole(role: number): boolean {
    const roles = getUserRoles()
    return roles.includes(role)
}

export function isAdmin(): boolean {
    return hasRole(1)
}

export function isUser(): boolean {
    return hasRole(2)
}

export function isAuthenticated(): boolean {
    const roles = getUserRoles()
    return roles.length > 0
}

export function clearUserData(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('user_roles')
    localStorage.removeItem('user_info')
}