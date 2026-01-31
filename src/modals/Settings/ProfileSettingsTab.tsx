import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { updateProfile } from '../../api/user'
import { Spinner } from '../../components/Spinner'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'
import { buttonStyles, cardStyles, inputStyles } from './settingsStyles'

export const ProfileSettingsTab = () => {
    const { user, setAuth } = useAuth()
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [initialFname, setInitialFname] = useState('')
    const [initialLname, setInitialLname] = useState('')

    // Initialize form with current user data
    useEffect(() => {
        if (user) {
            setFname(user.fname || '')
            setLname(user.lname || '')
            setInitialFname(user.fname || '')
            setInitialLname(user.lname || '')
        }
    }, [user])

    const isDirty = fname !== initialFname || lname !== initialLname
    const isValid = fname.trim().length > 0 && lname.trim().length > 0 && fname.length <= 10 && lname.length <= 10

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
                // Update initial values to new saved values
                setInitialFname(data.user.fname || '')
                setInitialLname(data.user.lname || '')
            }
        },
    })

    const handleSave = () => {
        if (!isValid || !isDirty) {
            return
        }
        executeUpdate({ fname, lname })
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {blockingModal}
            <section>
                <div className="mb-4 hidden md:block md:mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--page-fg)]">Personal Profile</h2>
                    <p className="text-sm text-[var(--text-muted)]">Update your personal information.</p>
                </div>

                <div className={cardStyles.primary}>
                    <div className="space-y-4 md:space-y-6">
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-muted)]">First Name</label>
                                <input
                                    type="text"
                                    value={fname}
                                    onChange={(e) => setFname(e.target.value)}
                                    placeholder="Enter first name"
                                    maxLength={10}
                                    className={inputStyles.primary}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-muted)]">Last Name</label>
                                <input
                                    type="text"
                                    value={lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    placeholder="Enter last name"
                                    maxLength={10}
                                    className={inputStyles.primary}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-[var(--border-glass)] pt-4 md:pt-6">
                            <button
                                onClick={handleSave}
                                disabled={!isDirty || !isValid || isUpdating}
                                className={`w-full md:w-auto ${buttonStyles.primary} disabled:hover:scale-100`}
                            >
                                <span className="flex items-center justify-center gap-2">
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
