# 🔐 Hooks de Autenticación

Este documento explica cómo usar los hooks de autenticación personalizados para proteger páginas en tu aplicación Next.js.

## 📋 Hooks Disponibles

### `useAuth(options)`
Hook principal que proporciona control completo sobre la autenticación.

```tsx
const { loading, isAuth, userRoles, userInfo, hasRole, isAdmin, isUser } = useAuth({
    redirectTo: '/login',        // Dónde redirigir si no está autenticado
    requiredRole: 1,            // Rol requerido (opcional)
    fallbackRoute: '/403'       // Dónde redirigir si no tiene el rol
})
```

### `useRequireAuth(redirectTo)`
Hook simplificado para páginas que solo necesitan verificar autenticación.

```tsx
const { loading, userRoles, isAdmin, isUser } = useRequireAuth('/login')
```

### `useRequireRole(role, redirectTo, fallbackRoute)`
Hook para páginas que requieren un rol específico.

```tsx
const { loading, userRoles } = useRequireRole(2, '/login', '/403')
```

### `useRequireAdmin(redirectTo)`
Hook específico para páginas de administrador (rol 1).

```tsx
const { loading, userRoles } = useRequireAdmin('/login')
```

### `useRequireUser(redirectTo)`
Hook específico para páginas de usuario regular (rol 2).

```tsx
const { loading, userRoles } = useRequireUser('/login')
```

## 🚀 Ejemplos de Uso

### Página General Protegida
```tsx
'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import { AuthLoading } from '@/components/AuthLoading'

export default function ProtectedPage() {
    const { loading, userRoles, isAdmin, isUser } = useRequireAuth('/login')

    if (loading) {
        return <AuthLoading />
    }

    return (
        <div>
            <h1>Página Protegida</h1>
            <p>Roles: {userRoles.join(', ')}</p>
            {isAdmin() && <p>Eres administrador</p>}
            {isUser() && <p>Eres usuario regular</p>}
        </div>
    )
}
```

### Página Solo para Admins
```tsx
'use client'

import { useRequireAdmin } from '@/hooks/useAuth'
import { AuthLoading } from '@/components/AuthLoading'

export default function AdminPage() {
    const { loading } = useRequireAdmin('/login')

    if (loading) {
        return <AuthLoading message="Verificando permisos de administrador..." />
    }

    return (
        <div>
            <h1>Panel de Administración</h1>
            {/* Contenido solo para admins */}
        </div>
    )
}
```

### Página Solo para Usuarios Regulares
```tsx
'use client'

import { useRequireUser } from '@/hooks/useAuth'
import { AuthLoading } from '@/components/AuthLoading'

export default function UserPage() {
    const { loading } = useRequireUser('/login')

    if (loading) {
        return <AuthLoading message="Verificando permisos de usuario..." />
    }

    return (
        <div>
            <h1>Panel de Usuario</h1>
            {/* Contenido solo para usuarios regulares */}
        </div>
    )
}
```

### Página con Rol Personalizado
```tsx
'use client'

import { useRequireRole } from '@/hooks/useAuth'
import { AuthLoading } from '@/components/AuthLoading'

export default function CustomRolePage() {
    const { loading } = useRequireRole(3, '/login', '/403') // Requiere rol 3

    if (loading) {
        return <AuthLoading message="Verificando permisos..." />
    }

    return (
        <div>
            <h1>Página con Rol Personalizado</h1>
            {/* Contenido para rol específico */}
        </div>
    )
}
```

## 🎨 Componente AuthLoading

Componente reutilizable para mostrar estado de carga durante la verificación:

```tsx
import { AuthLoading } from '@/components/AuthLoading'

// Uso básico
<AuthLoading />

// Con mensaje personalizado
<AuthLoading message="Verificando permisos especiales..." />
```

## 🔧 Valores de Retorno

Todos los hooks retornan un objeto con las siguientes propiedades:

- `loading: boolean` - Indica si está verificando la autenticación
- `isAuth: boolean` - Indica si el usuario está autenticado
- `userRoles: number[]` - Array con los roles del usuario
- `userInfo: UserInfo | null` - Información completa del usuario
- `hasRole: (role: number) => boolean` - Función para verificar un rol específico
- `isAdmin: () => boolean` - Función que verifica si es administrador (rol 1)
- `isUser: () => boolean` - Función que verifica si es usuario regular (rol 2)

## 📝 Notas Importantes

1. **Client Component Required**: Todos los hooks requieren que el componente sea un "client component" (`'use client'`)

2. **Loading State**: Siempre verifica el estado `loading` antes de renderizar contenido

3. **Redirección Automática**: Los hooks redirigen automáticamente si no se cumplen los requisitos

4. **LocalStorage**: Los hooks dependen de localStorage, asegúrate de que esté disponible

## 🛡️ Beneficios

- ✅ **Reutilizable**: Un hook para múltiples páginas
- ✅ **Type Safe**: Completamente tipado con TypeScript
- ✅ **Flexible**: Múltiples variantes para diferentes necesidades
- ✅ **Consistente**: Mismo comportamiento en toda la aplicación
- ✅ **Mantenible**: Lógica centralizada y fácil de actualizar
