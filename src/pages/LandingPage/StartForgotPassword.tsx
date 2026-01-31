import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { passwordForgot } from '../../api/auth'
import { Spinner } from '../../components/Spinner'

export const StartForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const mutation = useMutation({
        mutationFn: passwordForgot,
        onSuccess: () => {
            setIsSuccess(true)
        },
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!email) return
        mutation.mutate(email)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4 text-[var(--page-fg)]">
            <div className="w-full max-w-md space-y-8 rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass)]/50 p-8 shadow-2xl backdrop-blur-xl transition-all">

                <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[#3498db]">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to Login
                </Link>

                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Forgot Password?</h2>
                    <p className="mt-2 text-[var(--text-muted)]">
                        Enter your email address to receive a password reset link.
                    </p>
                </div>

                {isSuccess ? (
                    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <h3 className="mb-2 font-semibold text-green-400">Check your inbox</h3>
                        <p className="text-sm text-[var(--text-subtle)]">
                            If an account exists for <strong>{email}</strong>, we have sent a password reset link to it. Use that link to set a new password.
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-subtle)]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm transition focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10 focus:outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex w-full justify-center rounded-xl bg-[#3498db] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#2980b9] hover:shadow-blue-500/30 disabled:opacity-50"
                        >
                            {mutation.isPending ? <Spinner size="sm" /> : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
