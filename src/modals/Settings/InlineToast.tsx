import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

interface InlineToastProps {
    open: boolean
    message: string
    type: 'success' | 'error'
    onClose: () => void
    duration?: number
}

export const InlineToast = ({ open, message, type, onClose, duration = 3000 }: InlineToastProps) => {
    useEffect(() => {
        if (open && duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [open, duration, onClose])

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className={`mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 ${type === 'success'
                            ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <FontAwesomeIcon
                        icon={type === 'success' ? faCheckCircle : faExclamationCircle}
                        className="text-lg"
                    />
                    <p className="flex-1 text-sm font-medium">{message}</p>
                    <button
                        onClick={onClose}
                        className="text-xs font-medium opacity-60 transition hover:opacity-100"
                    >
                        Dismiss
                    </button>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}
