import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
  className?: string
}

const sizeClasses: Record<Required<SpinnerProps>['size'], string> = {
  sm: 'text-sm',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export const Spinner = ({ size = 'sm', centered = false, className = '' }: SpinnerProps) => {
  const spinner = (
    <FontAwesomeIcon
      icon={faSpinner}
      className={`animate-spin text-accent ${sizeClasses[size]} ${className}`}
    />
  )

  if (centered) {
    return (
      <div className="flex items-center justify-center py-12">
        {spinner}
      </div>
    )
  }

  return spinner
}
