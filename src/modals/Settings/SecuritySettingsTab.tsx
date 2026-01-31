import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ChangeEmailOverlay } from './ChangeEmailOverlay'
import { ChangePasswordOverlay } from './ChangePasswordOverlay'
import { buttonStyles, cardStyles } from './settingsStyles'

export const SecuritySettingsTab = () => {
    const { user } = useAuth()
    const [isEmailOverlayOpen, setIsEmailOverlayOpen] = useState(false)
    const [isPasswordOverlayOpen, setIsPasswordOverlayOpen] = useState(false)

    return (
        <>
            <div className="space-y-4 md:space-y-6">
                <section>
                    <div className="mb-4 md:mb-6">
                        <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Account Security</h2>
                        <p className="text-sm text-[var(--text-muted)]">Manage your account credentials and security preferences.</p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div className={cardStyles.primary}>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-[var(--page-fg)]">Email Address</h3>
                                    <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => setIsEmailOverlayOpen(true)}
                                    className={`w-full md:w-auto ${buttonStyles.secondary}`}
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>

                        <div className={cardStyles.primary}>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-[var(--page-fg)]">Password</h3>
                                    <p className="text-sm text-[var(--text-muted)]">Update your password securely</p>
                                </div>
                                <button
                                    onClick={() => setIsPasswordOverlayOpen(true)}
                                    className={`w-full md:w-auto ${buttonStyles.secondary}`}
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <ChangeEmailOverlay
                open={isEmailOverlayOpen}
                onClose={() => setIsEmailOverlayOpen(false)}
            />

            <ChangePasswordOverlay
                open={isPasswordOverlayOpen}
                onClose={() => setIsPasswordOverlayOpen(false)}
            />
        </>
    )
}
