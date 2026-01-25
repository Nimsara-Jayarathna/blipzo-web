export interface ApiErrorResponse {
    success: boolean
    error: {
        code: string
        message: string
        details?: Record<string, string[]>
    }
}

export interface ApiError {
    code: string
    message: string
    status?: number
    details?: Record<string, string[]>
}

export const isApiError = (error: unknown): error is ApiError => {
    return !!error && typeof error === 'object' && 'code' in error && 'message' in error
}
