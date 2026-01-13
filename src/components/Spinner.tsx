interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles: Record<Required<SpinnerProps>['size'], string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}

export const Spinner = ({ size = 'sm' }: SpinnerProps) => (
  <span
    className={`${sizeStyles[size]} inline-flex animate-spin rounded-full border-[var(--border-glass)] border-t-accent`}
    aria-hidden="true"
  />
)
