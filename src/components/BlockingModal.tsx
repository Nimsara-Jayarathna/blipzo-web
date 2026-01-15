import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTriangleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'

export type BlockingState = 'idle' | 'loading' | 'success' | 'error'

interface BlockingModalProps {
    state: BlockingState
    message?: string
    onClose: () => void
}

export const BlockingModal = ({ state, message, onClose }: BlockingModalProps) => {
    const isOpen = state !== 'idle'

    return (
        <AnimatePresence>
            {isOpen ? (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={state === 'error' ? onClose : undefined}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[24px] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-8 text-center shadow-2xl backdrop-blur-xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center justify-center gap-6">
                            <AnimatePresence mode="wait">
                                {state === 'loading' ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <FontAwesomeIcon icon={faSpinner} className="h-12 w-12 animate-spin text-accent" />
                                        <p className="text-lg font-medium text-[var(--page-fg)]">Processing...</p>
                                    </motion.div>
                                ) : state === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                            <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8" />
                                        </div>
                                        <p className="text-lg font-semibold text-[var(--page-fg)]">{message || 'Success!'}</p>
                                    </motion.div>
                                ) : state === 'error' ? (
                                    <motion.div
                                        key="error"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
                                            <FontAwesomeIcon icon={faTriangleExclamation} className="h-8 w-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-[var(--page-fg)]">Error</h3>
                                            <p className="text-sm text-[var(--text-muted)]">{message || 'Something went wrong'}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-6 py-2 text-sm font-medium text-[var(--page-fg)] transition hover:bg-[var(--surface-hover)]"
                                        >
                                            Close
                                        </button>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    )
}
