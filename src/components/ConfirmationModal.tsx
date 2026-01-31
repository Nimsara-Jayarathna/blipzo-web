import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

interface ConfirmationModalProps {
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmationModal = ({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    onConfirm,
    onCancel,
}: ConfirmationModalProps) => {
    return (
        <AnimatePresence>
            {open ? (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[24px] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-6 shadow-2xl backdrop-blur-xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${type === 'danger' || type === 'warning'
                                        ? 'bg-red-500/10 text-red-500'
                                        : 'bg-blue-500/10 text-blue-500'
                                        }`}
                                >
                                    <FontAwesomeIcon
                                        icon={type === 'info' ? faInfoCircle : faTriangleExclamation}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--page-fg)]">{title}</h3>
                            </div>

                            <div className="px-1">
                                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{message}</p>
                            </div>

                            <div className="mt-6 flex w-full items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--page-fg)]"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    className={`rounded-full px-5 py-2 text-sm font-bold text-white shadow-lg transition active:scale-95 ${type === 'danger' || type === 'warning'
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                        : 'bg-[#3498db] hover:bg-[#2F89C9] shadow-[#3498db]/20'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    )
}
