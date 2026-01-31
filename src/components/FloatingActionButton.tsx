import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

interface FloatingActionButtonProps {
  onClick: () => void
  label?: string
  className?: string
  icon?: IconProp
}

export const FloatingActionButton = ({ onClick, label = 'Add transaction', className = '', icon = faPlus }: FloatingActionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_16px_32px_rgba(14,116,144,0.45)] ring-1 ring-white/10 transition hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)] sm:bottom-8 sm:right-8 sm:h-16 sm:w-16 ${className}`}
      aria-label={label}
    >
      <FontAwesomeIcon icon={icon} className="h-5 w-5 transition group-hover:rotate-90" />
    </button>
  )
}
