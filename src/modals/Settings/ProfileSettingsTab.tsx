import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CurrencySelector } from '../../pages/Dashboard/components/Profile/CurrencySelector'
import { emailChangeInit, emailChangeVerifyCurrent, emailChangeRequestNew, emailChangeConfirm } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/Spinner'

type EmailChangeStep = 'idle' | 'verify-current' | 'enter-new' | 'verify-new'

export const ProfileSettingsTab = () => {
  const { user, setAuth } = useAuth()
  const [step, setStep] = useState<EmailChangeStep>('idle')
  const [otp, setOtp] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [changeToken, setChangeToken] = useState('')

  // Mutations
  const initMutation = useMutation({
    mutationFn: emailChangeInit,
    onSuccess: () => {
      toast.success('OTP sent to current email')
      setStep('verify-current')
      setOtp('')
    },
    onError: () => toast.error('Failed to initiate email change'),
  })

  const verifyCurrentMutation = useMutation({
    mutationFn: emailChangeVerifyCurrent,
    onSuccess: (data) => {
      setChangeToken(data.changeToken)
      setStep('enter-new')
      setOtp('')
    },
    onError: () => toast.error('Invalid OTP'),
  })

  const requestNewMutation = useMutation({
    mutationFn: () => emailChangeRequestNew(changeToken, newEmail),
    onSuccess: () => {
      toast.success('OTP sent to new email')
      setStep('verify-new')
      setOtp('')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to request change'),
  })

  const confirmMutation = useMutation({
    mutationFn: emailChangeConfirm,
    onSuccess: (data) => {
      if (user) {
        // cast data.user to UserProfile if needed, or just rely on shape
        setAuth({ user: data.user })
      }
      toast.success('Email updated successfully')
      setStep('idle')
      setOtp('')
      setNewEmail('')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to confirm email'),
  })

  const handleAction = () => {
    if (step === 'idle') {
      initMutation.mutate()
    } else if (step === 'verify-current') {
      verifyCurrentMutation.mutate(otp)
    } else if (step === 'enter-new') {
      if (!newEmail) return toast.error('Enter a valid email')
      requestNewMutation.mutate()
    } else if (step === 'verify-new') {
      confirmMutation.mutate(otp)
    }
  }

  const isLoading =
    initMutation.isPending ||
    verifyCurrentMutation.isPending ||
    requestNewMutation.isPending ||
    confirmMutation.isPending

  return (
    <div className="space-y-8 overflow-y-auto pr-2">
      <section>
        <h2 className="mb-4 text-base font-semibold text-[var(--page-fg)]">Currency Preferences</h2>
        <CurrencySelector />
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-[var(--page-fg)]">Account Security</h2>

        <div className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)]/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--page-fg)]">Email Address</h3>
              <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
            </div>
            {step === 'idle' && (
              <button
                onClick={() => initMutation.mutate()}
                disabled={isLoading}
                className="rounded-lg bg-[var(--surface-glass-thick)] px-4 py-2 text-sm font-medium text-[var(--text-subtle)] hover:bg-[var(--surface-glass-strong)] hover:text-[var(--page-fg)] disabled:opacity-50"
              >
                {isLoading ? <Spinner size="sm" /> : 'Change Email'}
              </button>
            )}
          </div>

          {step !== 'idle' && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4">
              <div className="rounded-xl bg-[var(--surface-glass-thick)] p-4">
                {step === 'verify-current' && (
                  <>
                    <p className="mb-3 text-sm text-[var(--text-muted)]">To secure your account, please enter the code sent to <strong>{user?.email}</strong>.</p>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="mb-3 w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2 text-sm outline-none focus:border-[#3498db]"
                    />
                  </>
                )}

                {step === 'enter-new' && (
                  <>
                    <p className="mb-3 text-sm text-[var(--text-muted)]">Enter the new email address you would like to use.</p>
                    <input
                      type="email"
                      placeholder="new@email.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="mb-3 w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2 text-sm outline-none focus:border-[#3498db]"
                    />
                  </>
                )}

                {step === 'verify-new' && (
                  <>
                    <p className="mb-3 text-sm text-[var(--text-muted)]">Almost there! Enter the code sent to <strong>{newEmail}</strong>.</p>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="mb-3 w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2 text-sm outline-none focus:border-[#3498db]"
                    />
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAction}
                    disabled={isLoading}
                    className="flex-1 rounded-lg bg-[#3498db] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-[#2980b9] disabled:opacity-50"
                  >
                    {isLoading ? <Spinner size="sm" /> : 'Continue'}
                  </button>
                  <button
                    onClick={() => { setStep('idle'); setOtp(''); setNewEmail('') }}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
