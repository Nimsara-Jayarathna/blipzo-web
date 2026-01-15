import { useState, useEffect } from 'react'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'


import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { OtpInput } from '../../components/OtpInput'
import { useAuth } from '../../hooks/useAuth'
import { emailChangeInit, emailChangeVerifyCurrent, emailChangeRequestNew, emailChangeConfirm } from '../../api/auth'

type EmailChangeStep = 'idle' | 'verify-current' | 'enter-new' | 'verify-new'

interface ChangeEmailModalProps {
    open: boolean
    onClose: () => void
}

export const ChangeEmailModal = ({ open, onClose }: ChangeEmailModalProps) => {
    const { user, setAuth } = useAuth()
    const [step, setStep] = useState<EmailChangeStep>('idle')
    const [otp, setOtp] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [changeToken, setChangeToken] = useState('')



    const {
        execute: initEmailChange,
        isLoading: isInitializing,
        modal: initModal,
    } = useBlockingAsync(emailChangeInit, {
        successMessage: 'Verification code sent!',
        onSuccess: () => {
            setStep('verify-current')
            setOtp('')
        },
        onError: () => onClose(),
    })

    const {
        execute: verifyCurrent,
        isLoading: isVerifyingCurrent,
        modal: verifyCurrentModal,
    } = useBlockingAsync(emailChangeVerifyCurrent, {
        onSuccess: (data) => {
            setChangeToken(data.changeToken)
            setStep('enter-new')
            setOtp('')
        },
    })

    const {
        execute: requestNew,
        isLoading: isRequestingNew,
        modal: requestNewModal,
    } = useBlockingAsync(
        () => emailChangeRequestNew(changeToken, newEmail),
        {
            successMessage: 'Verification code sent!',
            onSuccess: () => {
                setStep('verify-new')
                setOtp('')
            },
        }
    )

    const {
        execute: confirmNew,
        isLoading: isConfirming,
        modal: confirmModal,
    } = useBlockingAsync(emailChangeConfirm, {
        successMessage: 'Email updated successfully!',
        onSuccess: (data) => {
            if (user) {
                setAuth({ user: { ...user, email: data.email } })
            }
            onClose()
        },
    })

    // Reset state when opening
    useEffect(() => {
        if (open) {
            setStep('idle')
            setOtp('')
            setNewEmail('')
            setChangeToken('')
            // Auto-start the process when opened
            initEmailChange()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const handleAction = () => {
        if (step === 'idle') {
            initEmailChange()
        } else if (step === 'verify-current') {
            verifyCurrent(otp)
        } else if (step === 'enter-new') {
            if (!newEmail) return
            requestNew()
        } else if (step === 'verify-new') {
            confirmNew(otp)
        }
    }

    const isLoading =
        isInitializing ||
        isVerifyingCurrent ||
        isRequestingNew ||
        isConfirming

    const getTitle = () => {
        switch (step) {
            case 'idle': return 'Initiating Change...'
            case 'verify-current': return 'Verify Current Email'
            case 'enter-new': return 'New Email Address'
            case 'verify-new': return 'Verify New Email'
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={getTitle()}
            zIndex="z-[60]" // Higher than SettingsModal
            widthClassName="max-w-md"
        >
            <div className="py-2">
                {step === 'idle' && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Spinner size="lg" />
                        <p className="mt-4 text-[var(--text-muted)]">Preparing security verification...</p>
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>
                )}

                {step !== 'idle' && (
                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleAction}
                            disabled={isLoading}
                            className="flex-1 rounded-xl bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2980b9] hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading ? <Spinner size="sm" /> : 'Continue'}
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            {initModal}
            {verifyCurrentModal}
            {requestNewModal}
            {confirmModal}
        </Modal>
    )
}
