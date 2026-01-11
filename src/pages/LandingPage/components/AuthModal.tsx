import { type FormEvent, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '../../../components/Modal'
import { Spinner } from '../../../components/Spinner'
import type { AuthMode } from '../../../types'
import { registerInit, registerVerify, registerComplete, passwordForgot, passwordReset } from '../../../api/auth'
import { useAuth } from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface AuthModalProps {
  open: boolean
  mode: AuthMode | null
  isLoading: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void // Legacy prop, used for login
  onModeChange: (mode: AuthMode) => void
  formState: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
  onFieldChange: (field: 'firstName' | 'lastName' | 'email' | 'password', value: string) => void
  resetToken?: string
}

type RegisterStep = 'email' | 'otp' | 'details'

export const AuthModal = ({
  open,
  mode,
  isLoading: parentLoading,
  onClose,
  onSubmit: parentSubmit,
  onModeChange,
  formState,
  onFieldChange,
  resetToken,
}: AuthModalProps & { resetToken?: string }) => {
  const activeMode: AuthMode = mode ?? 'login'
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  // Registration State
  const [step, setStep] = useState<RegisterStep>('email')
  const [otp, setOtp] = useState('')
  const [registrationToken, setRegistrationToken] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Reset Password State
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')


  // Mutations
  const initMutation = useMutation({
    mutationFn: registerInit,
    onSuccess: (data: any) => {
      // Assuming success means we can move to OTP
      toast.success(data.message || 'OTP sent to your email')
      setStep('otp')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to send OTP'),
  })

  const verifyMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => registerVerify(email, otp),
    onSuccess: (data) => {
      setRegistrationToken(data.registrationToken)
      setStep('details')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Invalid OTP'),
  })

  const completeMutation = useMutation({
    mutationFn: (details: any) => registerComplete(registrationToken, details),
    onSuccess: (data) => {
      setAuth(data)
      navigate('/dashboard')
      onClose()
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Registration failed'),
  })

  // --- Forgot Password Mutation ---
  const forgotPasswordMutation = useMutation({
    mutationFn: passwordForgot,
    onSuccess: (data: any) => {
      if (data?.message === 'User not found') {
        toast.error('This email is not registered with us.')
      } else {
        toast.success('Check your inbox for the reset link.')
      }
    },
    onError: (err: any) => {
      if (err.response?.data?.message === 'User not found') {
        toast.error('This email is not registered with us.')
      } else {
        toast.error('Failed to process request')
      }
    },
  })

  // --- Reset Password Mutation ---
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => passwordReset(token, password),
    onSuccess: () => {
      toast.success('Password reset successfully. Please log in.')
      onModeChange('login')
      navigate('/')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to reset password'),
  })


  // Reset wizard on close or mode switch
  const handleModeSwitch = (newMode: AuthMode) => {
    setStep('email')
    setOtp('')
    setRegistrationToken('')
    setConfirmPassword('')
    setResetConfirmPassword('')
    onModeChange(newMode)
  }

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (step === 'email') {
      initMutation.mutate(formState.email)
    } else if (step === 'otp') {
      verifyMutation.mutate({ email: formState.email, otp })
    } else if (step === 'details') {
      if (formState.password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      completeMutation.mutate({
        fname: formState.firstName,
        lname: formState.lastName,
        password: formState.password,
      })
    }
  }

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault()
    forgotPasswordMutation.mutate(formState.email)
  }

  const handleResetSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formState.password !== resetConfirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (resetToken) {
      resetPasswordMutation.mutate({ token: resetToken, password: formState.password })
    }
  }

  const isLoading = parentLoading || initMutation.isPending || verifyMutation.isPending || completeMutation.isPending

  const isLogin = activeMode === 'login'

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          title={
            activeMode === 'login'
              ? 'Welcome back'
              : activeMode === 'forgot-password'
                ? 'Reset Password'
                : activeMode === 'reset-password'
                  ? 'New Password'
                  : step === 'email'
                    ? 'Create Account'
                    : step === 'otp'
                      ? 'Verify Email'
                      : 'Complete Profile'
          }
        >
          <form
            onSubmit={
              isLogin
                ? parentSubmit
                : activeMode === 'forgot-password'
                  ? handleForgotSubmit
                  : activeMode === 'reset-password'
                    ? handleResetSubmit
                    : handleRegisterSubmit
            }
            className="space-y-5 p-2"
          >

            {/* Login Form */}
            {isLogin && (
              <>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                  value={formState.email}
                  onChange={event => onFieldChange('email', event.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                  value={formState.password}
                  onChange={event => onFieldChange('password', event.target.value)}
                />
                <div className="flex justify-end">
                  <button type="button" onClick={() => { onClose(); navigate('/forgot-password') }} className="text-xs text-[var(--text-muted)] hover:text-[#3498db]">
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Forgot Password Form */}
            {activeMode === 'forgot-password' && (
              <>
                <p className="text-center text-sm text-[var(--text-muted)]">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                  value={formState.email}
                  onChange={event => onFieldChange('email', event.target.value)}
                />
              </>
            )}

            {/* Reset Password Form */}
            {activeMode === 'reset-password' && (
              <>
                <p className="text-center text-sm text-[var(--text-muted)]">
                  Please enter your new password below.
                </p>
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                  value={formState.password}
                  onChange={event => onFieldChange('password', event.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                  value={resetConfirmPassword}
                  onChange={event => setResetConfirmPassword(event.target.value)}
                />
              </>
            )}

            {/* Registration Wizard */}
            {activeMode === 'register' && (
              <>
                {step === 'email' && (
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                    value={formState.email}
                    onChange={event => onFieldChange('email', event.target.value)}
                  />
                )}

                {step === 'otp' && (
                  <div>
                    <p className="mb-4 text-center text-sm text-[var(--text-muted)]">
                      Enter the code sent to <strong>{formState.email}</strong>
                    </p>
                    <input
                      type="text"
                      placeholder="6-digit Code"
                      required
                      maxLength={6}
                      className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-center text-lg tracking-[0.5em] text-[var(--page-fg)] placeholder:tracking-normal placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                      value={otp}
                      onChange={event => setOtp(event.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                )}

                {step === 'details' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="First Name"
                        required
                        className="rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                        value={formState.firstName}
                        onChange={event => onFieldChange('firstName', event.target.value)}
                      />
                      <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="Last Name"
                        required
                        className="rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                        value={formState.lastName}
                        onChange={event => onFieldChange('lastName', event.target.value)}
                      />
                    </div>
                    <input
                      type="password"
                      name="new-password"
                      autoComplete="new-password"
                      placeholder="Create Password"
                      required
                      className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                      value={formState.password}
                      onChange={event => onFieldChange('password', event.target.value)}
                    />
                    <input
                      type="password"
                      name="confirm-password"
                      autoComplete="new-password"
                      placeholder="Confirm Password"
                      required
                      className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                      value={confirmPassword}
                      onChange={event => setConfirmPassword(event.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            <button
              disabled={isLoading}
              className="mt-2 h-14 w-full rounded-full bg-[#3498db] text-base font-bold text-white shadow-[0_15px_30px_-10px_rgba(52,152,219,0.5)] transition hover:bg-[#2F89C9] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : activeMode === 'login' ? (
                'Sign In'
              ) : activeMode === 'register' ? (
                step === 'email' ? 'Continue' : step === 'otp' ? 'Verify' : 'Complete Registration'
              ) : activeMode === 'forgot-password' ? (
                'Send Reset Link'
              ) : (
                'Reset Password'
              )}
            </button>

            <div className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
              {activeMode === 'login' && (
                <>
                  <p>
                    New to Blipzo?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('register')}
                      className="text-[#3498db] underline underline-offset-4"
                    >
                      Sign up
                    </button>
                  </p>
                  <p className="mt-3">
                    Did you forget your password?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot-password')}
                      className="text-[#3498db] underline underline-offset-4"
                    >
                      Recover it
                    </button>
                  </p>
                </>
              )}
              {activeMode === 'register' && (
                <>
                  Already onboard?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="text-[#3498db] underline underline-offset-4"
                  >
                    Log in
                  </button>
                </>
              )}
              {(activeMode === 'forgot-password' || activeMode === 'reset-password') && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="text-[#3498db] underline underline-offset-4"
                >
                  Back to Login
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  )
}

