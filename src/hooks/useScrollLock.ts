import { useEffect, useRef } from 'react'

// Global counter for all active modals
let lockCount = 0

export const useScrollLock = (isOpen: boolean) => {
    // Track if this specific instance has acquired a lock
    const locked = useRef(false)

    useEffect(() => {
        if (isOpen) {
            lockCount++
            locked.current = true
            document.body.style.overflow = 'hidden'
        } else if (locked.current) {
            // If it WAS open (locked) and now closed
            lockCount--
            locked.current = false
            if (lockCount <= 0) {
                document.body.style.overflow = ''
            }
        }

        return () => {
            // Cleanup on unmount if we hold a lock
            if (locked.current) {
                lockCount--
                locked.current = false
                if (lockCount <= 0) {
                    document.body.style.overflow = ''
                }
            }
        }
    }, [isOpen])
}
