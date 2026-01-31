import { useState } from 'react'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'
import { InternalOverlay } from './InternalOverlay'
import { InlineToast } from './InlineToast'
import { Spinner } from '../../components/Spinner'
import { changePassword } from '../../api/auth'

interface ChangePasswordOverlayProps {
    open: boolean
    onClose: () => void
}

export const ChangePasswordOverlay = ({ open, onClose }: ChangePasswordOverlayProps) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState<'success' | 'error'>('success')

    const {
        execute: executeChange,
        isLoading: isSubmitting,
    } = useBlockingAsync(
        () => changePassword(currentPassword, newPassword),
        {
            successMessage: 'Password updated successfully!',
            onSuccess: () => {
                setToastType('success')
                setToastMessage('Password updated successfully!')
                setShowToast(true)
                setTimeout(() => {
                    onClose()
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                }, 1500)
            },
            onError: (error) => {
                setToastType('error')
                setToastMessage(error.message || 'Failed to update password')
                setShowToast(true)
            }
        }
    )

    const isFormValid =
        currentPassword.length > 0 &&
        newPassword.length >= 6 &&
        newPassword === confirmPassword

    const handleSubmit = () => {
        if (!isFormValid) return
        executeChange()
    }

    const handleClose = () => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowToast(false)
        onClose()
    }

    return (
        <InternalOverlay open={open} onClose={handleClose} title="Change Password">
            <div className="space-y-4">
                <InlineToast
                    open={showToast}
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />

                <div>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--page-fg)] outline-none transition-all focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10"
                    />
                </div>
                <div className="space-y-2">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--page-fg)] outline-none transition-all focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--page-fg)] outline-none transition-all focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10"
                    />
                </div>

                <div className="flex flex-col gap-4 pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isFormValid}
                        className="w-full rounded-xl bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2980b9] hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Spinner size="sm" /> : 'Update Password'}
                    </button>

                    {!isFormValid && (
                        <div className="text-center text-xs text-rose-500/80 font-medium px-4">
                            {!currentPassword ? (
                                "Please enter your current password."
                            ) : newPassword.length < 6 ? (
                                "New password must be at least 6 characters."
                            ) : newPassword !== confirmPassword ? (
                                "Passwords do not match."
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </InternalOverlay>
    )
}
