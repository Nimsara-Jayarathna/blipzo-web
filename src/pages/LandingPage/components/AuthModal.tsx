import { type FormEvent, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '../../../components/Modal'
import { Spinner } from '../../../components/Spinner'
import type { AuthMode } from '../../../types'
import { registerInit, registerVerify, registerComplete } from '../../../api/auth'
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
}: AuthModalProps) => {
  const activeMode: AuthMode = mode ?? 'login'
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  // Registration State
  const [step, setStep] = useState<RegisterStep>('email')
  const [otp, setOtp] = useState('')
  const [registrationToken, setRegistrationToken] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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

  // Reset wizard on close or mode switch
  const handleModeSwitch = (newMode: AuthMode) => {
    setStep('email')
    setOtp('')
    setRegistrationToken('')
    setConfirmPassword('')
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

  const isLoading = parentLoading || initMutation.isPending || verifyMutation.isPending || completeMutation.isPending

  const isLogin = activeMode === 'login'

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          title={
            isLogin
              ? 'Welcome back'
              : step === 'email'
                ? 'Create Account'
                : step === 'otp'
                  ? 'Verify Email'
                  : 'Complete Profile'
          }
        >
          <form onSubmit={isLogin ? parentSubmit : handleRegisterSubmit} className="space-y-5 p-2">

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

            {/* Registration Wizard */}
            {!isLogin && (
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
              ) : isLogin ? (
                'Sign In'
              ) : step === 'email' ? (
                'Continue'
              ) : step === 'otp' ? (
                'Verify'
              ) : (
                'Complete Registration'
              )}
            </button>

            <div className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
              {isLogin ? 'New to Blipzo?' : 'Already onboard?'}{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch(isLogin ? 'register' : 'login')}
                className="text-[#3498db] underline underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  )
}

