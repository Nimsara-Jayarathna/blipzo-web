export const buttonStyles = {
  primary:
    'rounded-xl bg-accent px-6 py-3 md:py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#2F89C9] hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'rounded-xl bg-[var(--surface-glass-thick)] px-6 py-3 md:py-2.5 text-sm font-medium text-[var(--page-fg)] border border-[var(--border-glass)] transition-all hover:bg-[var(--surface-glass-strong)] hover:border-[var(--border-glass-strong)] active:scale-95',
  success:
    'rounded-xl bg-[#27ae60] px-6 py-3 md:py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-[#229954] hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95',
  danger:
    'rounded-xl bg-[#e74c3c] px-6 py-3 md:py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-[#c0392b] hover:shadow-red-500/30 hover:scale-[1.02] active:scale-95',
} as const

export const cardStyles = {
  primary:
    'rounded-xl md:rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)]/50 p-4 md:p-6 transition-all hover:border-[var(--border-glass-strong)]',
} as const

export const inputStyles = {
  primary:
    'w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 md:py-2.5 text-sm text-[var(--page-fg)] outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10',
} as const

export const tabStyles = {
  active:
    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-[var(--surface-glass-thick)] text-[var(--accent)] shadow-sm',
  inactive:
    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-[var(--text-muted)] hover:text-[var(--page-fg)]',
} as const
