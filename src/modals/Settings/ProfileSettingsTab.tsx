import { useState, useEffect } from 'react'


import { useAuth } from '../../hooks/useAuth'
import { updateProfile } from '../../api/user'
import { Spinner } from '../../components/Spinner'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'

export const ProfileSettingsTab = () => {
    const { user, setAuth } = useAuth()
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')

    // Initialize form with current user data
    useEffect(() => {
        if (user) {
            setFname(user.fname || '')
            setLname(user.lname || '')
        }
    }, [user])

    const {
        execute: executeUpdate,
        isLoading: isUpdating,
        modal: blockingModal,
    } = useBlockingAsync(updateProfile, {
        successMessage: 'Profile updated successfully!',
        onSuccess: (data) => {
            if (user) {
                // Update local auth state with new user data
                setAuth({ user: { ...user, ...data.user } })
            }
        },
    })

    const handleSave = () => {
        if (!fname.trim() && !lname.trim()) {
            return
        }
        executeUpdate({ fname, lname })
    }

    return (
        <div className="space-y-6 overflow-y-auto pr-2">
            {blockingModal}
            <section>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Personal Profile</h2>
                    <p className="text-sm text-[var(--text-muted)]">Update your personal information.</p>
                </div>

                <div className="rounded-3xl border border-[var(--border-glass)] bg-gradient-to-br from-[var(--surface-glass)] to-[var(--surface-glass)]/30 p-1">
                    <div className="rounded-[1.4rem] bg-[var(--page-bg)]/40 p-6 backdrop-blur-xl">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-muted)]">First Name</label>
                                <input
                                    type="text"
                                    value={fname}
                                    onChange={(e) => setFname(e.target.value)}
                                    placeholder="Enter first name"
                                    className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--page-fg)] outline-none transition-all focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-muted)]">Last Name</label>
                                <input
                                    type="text"
                                    value={lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    placeholder="Enter last name"
                                    className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--page-fg)] outline-none transition-all focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-[var(--border-glass)] pt-6">
                            <button
                                onClick={handleSave}
                                disabled={isUpdating}
                                className="relative overflow-hidden rounded-xl bg-[#3498db] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2980b9] hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isUpdating && <Spinner size="sm" />}
                                    Save Changes
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
