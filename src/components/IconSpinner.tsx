import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface IconSpinnerProps {
    className?: string
}

export const IconSpinner = ({ className = '' }: IconSpinnerProps) => {
    return <FontAwesomeIcon icon={faSpinner} className={`animate-spin ${className}`} />
}
