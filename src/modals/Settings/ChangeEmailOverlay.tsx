import { useState, useEffect, useMemo, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'
import { InternalOverlay } from './InternalOverlay'
import { InlineToast } from './InlineToast'
import { Spinner } from '../../components/Spinner'
import { OtpInput } from '../../components/OtpInput'
import { useAuth } from '../../hooks/useAuth'
import { emailChangeInit, emailChangeVerifyCurrent, emailChangeRequestNew, emailChangeConfirm } from '../../api/auth'

type EmailChangeStep = 'idle' | 'verify-current' | 'enter-new' | 'sending-new' | 'verify-new'

interface ChangeEmailOverlayProps {
    open: boolean
    onClose: () => void
}

export const ChangeEmailOverlay = ({ open, onClose }: ChangeEmailOverlayProps) => {
    const { user, setAuth } = useAuth()
    const [step, setStep] = useState<EmailChangeStep>('idle')
    const [otp, setOtp] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [changeToken, setChangeToken] = useState('')
    const lastSubmittedOtp = useRef('')
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState<'success' | 'error'>('success')

    const initMutation = useMutation({
        mutationFn: emailChangeInit,
        onSuccess: () => {
            setStep('verify-current')
            setOtp('')
        },
        onError: () => {
            setToastType('error')
            setToastMessage('Failed to initiate email change')
            setShowToast(true)
        },
    })

    const verifyCurrentOptions = useMemo(() => ({
        successMessage: 'Current email verified!',
        onSuccess: (data: { changeToken: string }) => {
            setChangeToken(data.changeToken)
            setStep('enter-new')
            setOtp('')
            setToastType('success')
            setToastMessage('Current email verified!')
            setShowToast(true)
        },
        onError: (error: any) => {
            setOtp('')
            lastSubmittedOtp.current = ''
            setToastType('error')
            setToastMessage(error.message || 'Verification failed')
            setShowToast(true)
        }
    }), [])

    const {
        execute: verifyCurrent,
        isLoading: isVerifyingCurrent,
    } = useBlockingAsync(emailChangeVerifyCurrent, verifyCurrentOptions)

    const requestNewOptions = useMemo(() => ({
        successMessage: 'Verification code sent!',
        onSuccess: () => {
            setStep('verify-new')
            setOtp('')
            setToastType('success')
            setToastMessage('Verification code sent!')
            setShowToast(true)
        },
        onError: (error: any) => {
            setStep('enter-new')
            setToastType('error')
            setToastMessage(error.message || 'Failed to send verification code')
            setShowToast(true)
        }
    }), [])

    const {
        execute: requestNew,
        isLoading: isRequestingNew,
    } = useBlockingAsync(
        () => emailChangeRequestNew(changeToken, newEmail),
        requestNewOptions
    )

    const confirmNewOptions = useMemo(() => ({
        successMessage: 'New email address updated!',
        onSuccess: (data: { email: string }) => {
            if (user) {
                setAuth({ user: { ...user, email: data.email } })
            }
            setToastType('success')
            setToastMessage('Email updated successfully!')
            setShowToast(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        },
        onError: (error: any) => {
            setOtp('')
            lastSubmittedOtp.current = ''
            setToastType('error')
            setToastMessage(error.message || 'Failed to update email')
            setShowToast(true)
        }
    }), [user, setAuth, onClose])

    const {
        execute: confirmNew,
        isLoading: isConfirming,
    } = useBlockingAsync(emailChangeConfirm, confirmNewOptions)

    const isGlobalLoading =
        initMutation.isPending ||
        isVerifyingCurrent ||
        isRequestingNew ||
        isConfirming

    // Reset state when opening
    useEffect(() => {
        if (open) {
            setStep('idle')
            setOtp('')
            setNewEmail('')
            setChangeToken('')
            lastSubmittedOtp.current = ''
            setShowToast(false)
            // Auto-start the process when opened
            initMutation.mutate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Auto-submit OTP
    useEffect(() => {
        if (otp.length === 6 && !isGlobalLoading && otp !== lastSubmittedOtp.current) {
            lastSubmittedOtp.current = otp
            if (step === 'verify-current') {
                verifyCurrent(otp)
            } else if (step === 'verify-new') {
                confirmNew(otp)
            }
        }
    }, [otp, step, isGlobalLoading, verifyCurrent, confirmNew])

    // Email validation
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)

    const handleAction = () => {
        if (step === 'idle') {
            initMutation.mutate()
        } else if (step === 'enter-new') {
            if (!isEmailValid) return
            requestNew()
        }
    }

    const getTitle = () => {
        switch (step) {
            case 'idle': return 'Initiating Change...'
            case 'verify-current': return 'Verify Current Email'
            case 'enter-new': return 'New Email Address'
            case 'sending-new': return 'Sending Verification...'
            case 'verify-new': return 'Verify New Email'
        }
    }

    const handleClose = () => {
        setStep('idle')
        setOtp('')
        setNewEmail('')
        setChangeToken('')
        setShowToast(false)
        onClose()
    }

    return (
        <InternalOverlay open={open} onClose={handleClose} title={getTitle()}>
            <div className="space-y-4">
                <InlineToast
                    open={showToast}
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />

                {step === 'idle' && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Spinner size="lg" />
                        <p className="mt-4 text-sm text-[var(--text-muted)]">
                            Preparing security verification...
                        </p>
                    </div>
                )}

                {step === 'verify-current' && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <p className="mb-4 text-sm text-[var(--text-muted)]">
                            To secure your account, please enter the verification code sent to <strong className="text-[var(--page-fg)]">{user?.email}</strong>.
                        </p>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            disabled={isGlobalLoading}
                        />
                    </div>
                )}

                {step === 'enter-new' && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <p className="mb-4 text-sm text-[var(--text-muted)]">Enter the new email address you would like to use.</p>
                        <input
                            type="email"
                            placeholder="new@email.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="mb-4 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--page-fg)] outline-none transition-all focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10"
                            autoFocus
                        />
                    </div>
                )}

                {step === 'verify-new' && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <p className="mb-4 text-sm text-[var(--text-muted)]">
                            Almost there! Enter the code sent to <strong className="text-[var(--page-fg)]">{newEmail}</strong>.
                        </p>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            disabled={isGlobalLoading}
                        />
                    </div>
                )}

                {/* Only show button for non-OTP steps (enter-new) */}
                {step === 'enter-new' && (
                    <div className="pt-2">
                        <button
                            onClick={handleAction}
                            disabled={isGlobalLoading || !isEmailValid}
                            className="w-full rounded-xl bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2980b9] hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            {isGlobalLoading ? <Spinner size="sm" /> : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </InternalOverlay>
    )
}
