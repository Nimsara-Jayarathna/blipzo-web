import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ChangeEmailModal } from './ChangeEmailModal'
import { ChangePasswordModal } from './ChangePasswordModal'

export const SecuritySettingsTab = () => {
    const { user } = useAuth()
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    return (
        <div className="space-y-6 overflow-y-auto pr-2">
            <section>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Account Security</h2>
                    <p className="text-sm text-[var(--text-muted)]">Manage your account credentials and security preferences.</p>
                </div>

                <div className="grid gap-6">
                    {/* Email Change Section */}
                    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-gradient-to-br from-[var(--surface-glass)] to-[var(--surface-glass)]/30 p-1 transition-all hover:border-[var(--border-glass-strong)] hover:shadow-lg hover:shadow-black/5">
                        <div className="relative rounded-[1.4rem] bg-[var(--page-bg)]/40 p-6 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-[var(--page-fg)]">Email Address</h3>
                                    <p className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-subtle)] transition-colors">
                                        {user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsEmailModalOpen(true)}
                                    className="relative overflow-hidden rounded-xl bg-[var(--surface-glass-thick)] px-6 py-2.5 text-sm font-medium text-[var(--page-fg)] shadow-sm ring-1 ring-inset ring-[var(--border-glass)] transition-all hover:bg-[var(--surface-glass-strong)] hover:shadow-md hover:ring-[var(--border-glass-strong)] active:scale-95"
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-gradient-to-br from-[var(--surface-glass)] to-[var(--surface-glass)]/30 p-1 transition-all hover:border-[var(--border-glass-strong)] hover:shadow-lg hover:shadow-black/5">
                        <div className="relative rounded-[1.4rem] bg-[var(--page-bg)]/40 p-6 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-[var(--page-fg)]">Password</h3>
                                    <p className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-subtle)] transition-colors">
                                        Update your password securely
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="relative overflow-hidden rounded-xl bg-[var(--surface-glass-thick)] px-6 py-2.5 text-sm font-medium text-[var(--page-fg)] shadow-sm ring-1 ring-inset ring-[var(--border-glass)] transition-all hover:bg-[var(--surface-glass-strong)] hover:shadow-md hover:ring-[var(--border-glass-strong)] active:scale-95"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ChangeEmailModal
                open={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
            />

            <ChangePasswordModal
                open={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    )
}
