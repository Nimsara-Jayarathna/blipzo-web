import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface InternalOverlayProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export const InternalOverlay = ({ open, onClose, title, children }: InternalOverlayProps) => {
    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="absolute inset-0 z-30 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {/* Backdrop - dims the content but keeps header/nav visible */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Overlay Content */}
                    <motion.div
                        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-6 shadow-2xl backdrop-blur-xl"
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 10, opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-[var(--page-fg)]">{title}</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)] transition hover:border-accent/40 hover:text-[var(--page-fg)]"
                            >
                                Cancel
                            </button>
                        </div>

                        {/* Content */}
                        <div>{children}</div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}
