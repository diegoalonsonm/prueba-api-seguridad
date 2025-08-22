export const role = { Admin: 1, User: 2 } as const
export type RoledId = typeof role[keyof typeof role]

export function hasRole(roles: number[] | undefined, role: RoledId) {
    return Array.isArray(roles) && roles.includes(role)
}

export function isAdmin(roles: number[]) {
    return hasRole(roles, role.Admin)
}

export function isUser(roles: number[]) {
    return hasRole(roles, role.User) || isAdmin(roles)
}