import { useState, useCallback, type ReactNode } from 'react'
import { BlockingModal, type BlockingState } from '../components/BlockingModal'
import type { ApiError } from '../types/errors'

export interface UseBlockingAsyncResult<T, Args extends any[]> {
    execute: (...args: Args) => Promise<T | undefined>
    reset: () => void
    isLoading: boolean
    state: BlockingState
    modal: ReactNode
}

interface BlockingOptions<T> {
    successMessage?: string
    successDuration?: number
    onSuccess?: (data: T) => void
    onError?: (error: ApiError | Error) => void
}

export const useBlockingAsync = <T, Args extends any[]>(
    asyncFn: (...args: Args) => Promise<T>,
    options: BlockingOptions<T> = {}
): UseBlockingAsyncResult<T, Args> => {
    const [state, setState] = useState<BlockingState>('idle')
    const [message, setMessage] = useState<string>('')

    const reset = useCallback(() => {
        setState('idle')
        setMessage('')
    }, [])

    const execute = useCallback(
        async (...args: Args) => {
            setState('loading')
            setMessage('')
            try {
                const result = await asyncFn(...args)
                setState('success')
                setMessage(options.successMessage || 'Operation successful')

                const duration = options.successDuration ?? 1500
                if (duration > 0) {
                    setTimeout(() => {
                        options.onSuccess?.(result)
                        reset()
                    }, duration)
                } else {
                    options.onSuccess?.(result)
                    reset()
                }
                return result
            } catch (error: any) {
                setState('error')
                const errorMessage = error?.message || 'An unexpected error occurred'
                setMessage(errorMessage)
                options.onError?.(error)
                return undefined
            }
        },
        [asyncFn, options, reset],
    )

    const modal = <BlockingModal state={state} message={message} onClose={reset} />

    return {
        execute,
        reset,
        isLoading: state === 'loading',
        state,
        modal,
    }
}
