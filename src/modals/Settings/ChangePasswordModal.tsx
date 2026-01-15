import { useState } from 'react'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'


import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { changePassword } from '../../api/auth'

interface ChangePasswordModalProps {
    open: boolean
    onClose: () => void
}

export const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const {
        execute: executeChange,
        isLoading: isSubmitting,
        modal: blockingModal,
    } = useBlockingAsync(
        () => changePassword(currentPassword, newPassword),
        {
            successMessage: 'Password updated successfully!',
            onSuccess: () => {
                onClose()
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            },
        }
    )

    const handleSubmit = () => {
        if (newPassword.length < 6) return
        if (newPassword !== confirmPassword) return
        executeChange()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Change Password"
            zIndex="z-[60]"
            widthClassName="max-w-md"
        >
            <div className="space-y-4 py-2">
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

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl bg-[#3498db] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2980b9] hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isSubmitting ? <Spinner size="sm" /> : 'Update Password'}
                    </button>

                </div>
            </div>
            {blockingModal}
        </Modal>
    )
}
