interface AuthLoadingProps {
    message?: string
}

export function AuthLoading({ message = 'Verificando autenticación...' }: AuthLoadingProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    )
}
