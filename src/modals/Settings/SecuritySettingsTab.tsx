import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ChangeEmailModal } from './ChangeEmailModal'
import { ChangePasswordModal } from './ChangePasswordModal'

export const SecuritySettingsTab = () => {
    const { user } = useAuth()
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    return (
        <div className="space-y-5 pr-0 sm:space-y-6 sm:pr-2">
            <section>
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Account Security</h2>
                    <p className="text-sm text-[var(--text-muted)]">Manage your account credentials and security preferences.</p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    {/* Email Change Section */}
                    <div className="border-b border-[var(--border-glass)] pb-4 sm:border-0 sm:pb-0">
                        <div className="sm:group sm:relative sm:overflow-hidden sm:rounded-3xl sm:border sm:border-[var(--border-glass)] sm:bg-gradient-to-br sm:from-[var(--surface-glass)] sm:to-[var(--surface-glass)]/30 sm:p-1 sm:transition-all sm:hover:border-[var(--border-glass-strong)] sm:hover:shadow-lg sm:hover:shadow-black/5">
                            <div className="flex flex-col gap-3 sm:relative sm:rounded-[1.4rem] sm:bg-[var(--page-bg)]/40 sm:p-6 sm:backdrop-blur-xl">
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-[var(--page-fg)]">Email Address</h3>
                                    <p className="text-sm text-[var(--text-muted)] sm:group-hover:text-[var(--text-subtle)] sm:transition-colors">
                                        {user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsEmailModalOpen(true)}
                                    className="relative w-full overflow-hidden rounded-xl bg-[var(--surface-glass-thick)] px-6 py-3 text-sm font-medium text-[var(--page-fg)] shadow-sm ring-1 ring-inset ring-[var(--border-glass)] transition-all hover:bg-[var(--surface-glass-strong)] hover:shadow-md hover:ring-[var(--border-glass-strong)] active:scale-95 sm:w-auto sm:self-start sm:py-2.5"
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="border-b border-[var(--border-glass)] pb-4 sm:border-0 sm:pb-0">
                        <div className="sm:group sm:relative sm:overflow-hidden sm:rounded-3xl sm:border sm:border-[var(--border-glass)] sm:bg-gradient-to-br sm:from-[var(--surface-glass)] sm:to-[var(--surface-glass)]/30 sm:p-1 sm:transition-all sm:hover:border-[var(--border-glass-strong)] sm:hover:shadow-lg sm:hover:shadow-black/5">
                            <div className="flex flex-col gap-3 sm:relative sm:rounded-[1.4rem] sm:bg-[var(--page-bg)]/40 sm:p-6 sm:backdrop-blur-xl">
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-[var(--page-fg)]">Password</h3>
                                    <p className="text-sm text-[var(--text-muted)] sm:group-hover:text-[var(--text-subtle)] sm:transition-colors">
                                        Update your password securely
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="relative w-full overflow-hidden rounded-xl bg-[var(--surface-glass-thick)] px-6 py-3 text-sm font-medium text-[var(--page-fg)] shadow-sm ring-1 ring-inset ring-[var(--border-glass)] transition-all hover:bg-[var(--surface-glass-strong)] hover:shadow-md hover:ring-[var(--border-glass-strong)] active:scale-95 sm:w-auto sm:self-start sm:py-2.5"
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
