import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { passwordReset } from '../../api/auth'
import { Spinner } from '../../components/Spinner'

export const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const mutation = useMutation({
        mutationFn: ({ t, p }: { t: string; p: string }) => passwordReset(t, p),
        onSuccess: () => {
            toast.success('Password reset successfully! Please login.')
            navigate('/')
        },
        onError: () => {
            toast.error('Failed to reset password. Link may have expired.')
        },
    })

    useEffect(() => {
        if (!token) {
            toast.error('Invalid password reset link.')
            navigate('/')
        }
    }, [token, navigate])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!token) return

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        mutation.mutate({ t: token, p: password })
    }

    if (!token) return null

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4 text-[var(--page-fg)]">
            <div className="w-full max-w-md space-y-8 rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass)]/50 p-8 shadow-2xl backdrop-blur-xl transition-all">

                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
                    <p className="mt-2 text-[var(--text-muted)]">
                        Create a new password for your account.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-subtle)]">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm transition focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10 focus:outline-none"
                                placeholder="******"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-subtle)]">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm transition focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10 focus:outline-none"
                                placeholder="******"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex w-full justify-center rounded-xl bg-[#3498db] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#2980b9] hover:shadow-blue-500/30 disabled:opacity-50"
                    >
                        {mutation.isPending ? <Spinner size="sm" /> : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
