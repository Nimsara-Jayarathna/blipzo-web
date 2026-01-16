import { type ReactNode } from 'react'
import { useScrollLock } from '../hooks/useScrollLock'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  headerActions?: ReactNode
  widthClassName?: string
  zIndex?: string
  showCloseButton?: boolean
}

export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  headerActions,
  widthClassName = 'max-w-lg',
  zIndex = 'z-50',
  showCloseButton = true,
}: ModalProps) => {
  useScrollLock(open)

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`fixed inset-0 flex items-center justify-center p-4 sm:p-6 ${zIndex}`}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative w-full overflow-hidden rounded-[24px] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] px-6 pb-6 pt-8 text-[var(--page-fg)] shadow-[0_45px_120px_-50px_rgba(15,35,55,0.6)] backdrop-blur-2xl sm:rounded-[34px] sm:px-10 sm:pb-8 sm:pt-10 ${widthClassName}`}
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={event => event.stopPropagation()}
          >
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute right-6 top-6 flex items-center gap-2">
              {headerActions}
              {showCloseButton ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)] backdrop-blur-md transition hover:border-accent/40 hover:text-[var(--page-fg)]"
                >
                  Close
                </button>
              ) : null}
            </div>
            <div className="flex flex-col gap-5">
              {title ? (
                <div className="pr-4">
                  <h2 className="text-2xl font-semibold text-[var(--page-fg)]">{title}</h2>
                  {subtitle ? <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p> : null}
                </div>
              ) : null}
              <div className="max-h-[65vh] overflow-y-auto pr-2">
                {children}
              </div>
              {footer ? <div className="border-t border-[var(--border-glass)] pt-4">{footer}</div> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
