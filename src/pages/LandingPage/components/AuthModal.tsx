import { type FormEvent, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'


import { Modal } from '../../../components/Modal'
import { Spinner } from '../../../components/Spinner'
import { ConfirmationModal } from '../../../components/ConfirmationModal'
import type { AuthMode } from '../../../types'
import { registerInit, registerVerify, registerComplete, passwordForgot, passwordReset } from '../../../api/auth'
import { useAuth } from '../../../hooks/useAuth'
import { useBlockingAsync } from '../../../hooks/useBlockingAsync'
import { useNavigate } from 'react-router-dom'


import { OtpInput } from '../../../components/OtpInput'

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

  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const [registerResendCountdown, setRegisterResendCountdown] = useState<number>(0)

  // Reset Password State
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')


  // Mutations
  const {
    execute: executeInit,
    isLoading: isInitLoading,
    modal: initModal,
  } = useBlockingAsync(registerInit, {
    successMessage: 'Verification code sent!',
    onSuccess: () => {
      setStep('otp')
      // Set resend timestamp in future (e.g., 60s)
      const nextResend = Date.now() + 60000
      localStorage.setItem(`auth_registration_next_resend_${formState.email}`, nextResend.toString())
      setRegisterResendCountdown(60)
    },
  })

  const {
    execute: executeVerify,
    isLoading: isVerifyLoading,
    modal: verifyModal,
  } = useBlockingAsync(
    async ({ email, otp }: { email: string; otp: string }) => registerVerify(email, otp),
    {
      successMessage: 'Email verified!',
      onSuccess: (data) => {
        setRegistrationToken(data.registrationToken)
        setStep('details')
      },
    }
  )

  const {
    execute: executeComplete,
    isLoading: isCompleteLoading,
    modal: completeModal,
  } = useBlockingAsync(
    async ({ token, details }: { token: string; details: { fname: string; lname: string; password: string } }) =>
      registerComplete(token, details),
    {
      successMessage: 'Account created successfully!',
      onSuccess: (data) => {
        setAuth(data)
        navigate('/dashboard')
        resetInternalState() // Ensure clean exit
        onClose()
      },
    }
  )


  // --- Forgot Password Mutation ---
  const {
    execute: executeForgot,
    isLoading: isForgotLoading,
    modal: forgotModal,
  } = useBlockingAsync(passwordForgot, {
    successMessage: 'Reset link sent!',
    onSuccess: () => {
      // Stay on this screen or return to login? Usually stay to let them check email.
      // Or we can switch to login for them to sign in after clicking link
    },
  })

  // --- Reset Password Mutation ---
  const {
    execute: executeReset,
    isLoading: isResetLoading,
    modal: resetModal,
  } = useBlockingAsync(
    async ({ token, password }: { token: string; password: string }) => passwordReset(token, password),
    {
      successMessage: 'Password reset successfully!',
      onSuccess: () => {
        onModeChange('login')
        navigate('/')
        resetInternalState()
      },
    }
  )


  // Reset wizard on close or mode switch
  const resetInternalState = () => {
    setStep('email')
    setOtp('')
    setRegistrationToken('')
    setConfirmPassword('')
    setResetConfirmPassword('')
    setShowExitConfirm(false)
    setRegisterResendCountdown(0)
  }

  const handleModeSwitch = (newMode: AuthMode) => {
    resetInternalState()
    onModeChange(newMode)
  }

  // Reset state when modal closes (with delay for animation)
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        resetInternalState()
      }, 300) // Match the AnimatePresence duration roughly
      return () => clearTimeout(timer)
    } else {
      // On Open or active: check timer if in OTP step
      if (activeMode === 'register' && step === 'otp') {
        const storedTime = localStorage.getItem(`auth_registration_next_resend_${formState.email}`)
        if (storedTime) {
          const expiresAt = parseInt(storedTime, 10)
          const timeLeft = Math.ceil((expiresAt - Date.now()) / 1000)
          if (timeLeft > 0) {
            setRegisterResendCountdown(timeLeft)
          } else {
            setRegisterResendCountdown(0)
          }
        }
      }
    }
  }, [open, activeMode, step, formState.email])

  // Countdown timer effect
  useEffect(() => {
    if (registerResendCountdown > 0) {
      const timer = setInterval(() => {
        setRegisterResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [registerResendCountdown])

  const handleAttemptClose = () => {
    // If in registration mode and progress has been made (OTP or Details step)
    if (activeMode === 'register' && (step === 'otp' || step === 'details')) {
      setShowExitConfirm(true)
    } else {
      onClose()
    }
  }

  const handleConfirmExit = () => {
    setShowExitConfirm(false)
    onClose() // Actually close
    // Optional: Reset step effectively happens on next open due to component unmount or we can force it here
  }

  const handleResendOtp = async () => {
    if (activeMode === 'register' && step === 'otp' && registerResendCountdown === 0) {
      // Re-trigger init
      await executeInit(formState.email)
    }
  }

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (step === 'email') {
      executeInit(formState.email)
    } else if (step === 'otp') {
      executeVerify({ email: formState.email, otp })
    } else if (step === 'details') {
      if (formState.password !== confirmPassword) {
        // Simple alert for mismatched passwords (non-blocking)
        alert("Passwords do not match!")
        return
      }
      executeComplete({
        token: registrationToken,
        details: {
          fname: formState.firstName,
          lname: formState.lastName,
          password: formState.password,
        }
      })
    }
  }

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault()
    executeForgot(formState.email)
  }

  const handleResetSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formState.password !== resetConfirmPassword) {
      // Logic for mismatch if needed, currently just return
      return
    }
    if (resetToken) {
      executeReset({ token: resetToken, password: formState.password })
    }
  }

  const isLoading = parentLoading || isInitLoading || isVerifyLoading || isCompleteLoading || isForgotLoading || isResetLoading

  const isLogin = activeMode === 'login'

  return (
    <AnimatePresence>
      {initModal}
      {verifyModal}
      {completeModal}
      {forgotModal}
      {resetModal}

      <ConfirmationModal
        open={showExitConfirm}
        title="Exit Registration?"
        message="Registration is incomplete. Any progress will be lost if you exit now."
        type="warning"
        confirmText="Exit & Discard"
        cancelText="Stay"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      {open && (
        <Modal
          open={open}
          onClose={handleAttemptClose}
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
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      disabled={isVerifyLoading}
                    />

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setStep('email')}
                        className="text-[var(--text-subtle)] hover:text-[var(--page-fg)] hover:underline"
                      >
                        Change email
                      </button>

                      <button
                        type="button"
                        disabled={registerResendCountdown > 0 || isInitLoading}
                        onClick={handleResendOtp}
                        className={`font-medium ${registerResendCountdown > 0 ? 'text-[var(--text-muted)] cursor-wait' : 'text-[#3498db] hover:underline'}`}
                      >
                        {registerResendCountdown > 0 ? `Resend in ${registerResendCountdown}s` : 'Resend Code'}
                      </button>
                    </div>
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

