interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
  className?: string
}

const sizeStyles: Record<Required<SpinnerProps>['size'], string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}

export const Spinner = ({ size = 'sm', centered = false, className = '' }: SpinnerProps) => {
  const spinner = (
    <span
      className={`${sizeStyles[size]} inline-flex animate-spin rounded-full border-[var(--border-glass)] border-t-accent ${className}`}
      aria-hidden="true"
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
