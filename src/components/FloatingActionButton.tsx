import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface FloatingActionButtonProps {
  onClick: () => void
  label?: string
}

export const FloatingActionButton = ({ onClick, label = 'Add transaction' }: FloatingActionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-soft transition hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)] sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
      aria-label={label}
    >
      <FontAwesomeIcon icon={faPlus} className="h-5 w-5 transition group-hover:rotate-90" />
    </button>
  )
}
